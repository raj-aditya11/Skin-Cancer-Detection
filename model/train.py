"""
train.py — Full training pipeline for the skin cancer classifier.
Uses ISIC dataset with transfer learning (MobileNetV2).

Usage:
    python train.py --data_dir /path/to/isic/dataset --epochs 30 --batch_size 32

Expected dataset structure:
    data_dir/
    ├── actinic_keratosis/
    ├── basal_cell_carcinoma/
    ├── benign_keratosis/
    ├── dermatofibroma/
    ├── melanocytic_nevus/
    ├── melanoma/
    └── vascular_lesion/
"""

import os
import argparse
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import (
    ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard
)
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
from datetime import datetime

# Class names
CLASS_NAMES = [
    "actinic_keratosis",
    "basal_cell_carcinoma", 
    "benign_keratosis",
    "dermatofibroma",
    "melanocytic_nevus",
    "melanoma",
    "vascular_lesion"
]

def create_data_generators(data_dir, batch_size=32, validation_split=0.2):
    """
    Create training and validation data generators with augmentation.
    Augmentation is tuned for skin lesion images on darker skin tones.
    """
    # Training data generator with augmentation
    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        rotation_range=30,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.1,
        zoom_range=0.15,
        horizontal_flip=True,
        vertical_flip=True,
        brightness_range=[0.8, 1.2],  # Brightness jitter for skin tone variation
        channel_shift_range=20.0,      # Color jitter for diverse skin tones
        fill_mode="nearest",
        validation_split=validation_split
    )
    
    # Validation data generator (no augmentation)
    val_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        validation_split=validation_split
    )
    
    train_gen = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode="categorical",
        subset="training",
        shuffle=True,
        classes=CLASS_NAMES
    )
    
    val_gen = val_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=batch_size,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
        classes=CLASS_NAMES
    )
    
    return train_gen, val_gen


def build_model(num_classes=7, fine_tune_layers=50):
    """
    Build MobileNetV2 model with custom classification head.
    Fine-tunes the last `fine_tune_layers` layers of the base model.
    """
    base_model = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Freeze all layers initially
    base_model.trainable = True
    
    # Unfreeze the last N layers for fine-tuning
    for layer in base_model.layers[:-fine_tune_layers]:
        layer.trainable = False
    
    # Custom head
    x = base_model.output
    x = GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = Dense(256, activation="relu", name="dense_256")(x)
    x = Dropout(0.5, name="dropout_05")(x)
    output = Dense(num_classes, activation="softmax", name="predictions")(x)
    
    model = Model(inputs=base_model.input, outputs=output)
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    return model


def train(data_dir, epochs=30, batch_size=32, fine_tune_layers=50):
    """Run the full training pipeline."""
    print("=" * 60)
    print("SKIN CANCER DETECTION MODEL — TRAINING PIPELINE")
    print("=" * 60)
    
    # Create data generators
    print("\n[1/5] Loading dataset...")
    train_gen, val_gen = create_data_generators(data_dir, batch_size)
    print(f"  Training samples: {train_gen.samples}")
    print(f"  Validation samples: {val_gen.samples}")
    print(f"  Classes: {list(train_gen.class_indices.keys())}")
    
    # Build model
    print("\n[2/5] Building model...")
    model = build_model(num_classes=7, fine_tune_layers=fine_tune_layers)
    trainable_params = sum([tf.keras.backend.count_params(w) for w in model.trainable_weights])
    total_params = sum([tf.keras.backend.count_params(w) for w in model.weights])
    print(f"  Total parameters: {total_params:,}")
    print(f"  Trainable parameters: {trainable_params:,}")
    
    # Setup callbacks
    save_dir = os.path.join(os.path.dirname(__file__), "saved_model")
    os.makedirs(save_dir, exist_ok=True)
    
    callbacks = [
        ModelCheckpoint(
            os.path.join(save_dir, "skin_model.h5"),
            monitor="val_accuracy",
            save_best_only=True,
            mode="max",
            verbose=1
        ),
        EarlyStopping(
            monitor="val_loss",
            patience=7,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        ),
    ]
    
    # Train
    print(f"\n[3/5] Training for {epochs} epochs...")
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=epochs,
        callbacks=callbacks,
        verbose=1
    )
    
    # Evaluate
    print("\n[4/5] Evaluating model...")
    val_gen.reset()
    y_pred = model.predict(val_gen, verbose=1)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_true = val_gen.classes
    
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred_classes, target_names=CLASS_NAMES))
    
    # Save training history plot
    print("\n[5/5] Saving training plots...")
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    axes[0].plot(history.history['accuracy'], label='Train')
    axes[0].plot(history.history['val_accuracy'], label='Validation')
    axes[0].set_title('Model Accuracy')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Accuracy')
    axes[0].legend()
    
    axes[1].plot(history.history['loss'], label='Train')
    axes[1].plot(history.history['val_loss'], label='Validation')
    axes[1].set_title('Model Loss')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Loss')
    axes[1].legend()
    
    plt.tight_layout()
    plt.savefig(os.path.join(save_dir, "training_history.png"), dpi=150)
    print(f"  Training plots saved to {save_dir}/training_history.png")
    
    print("\n" + "=" * 60)
    print("TRAINING COMPLETE!")
    print(f"Best model saved to: {save_dir}/skin_model.h5")
    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train skin cancer detection model")
    parser.add_argument("--data_dir", type=str, required=True, help="Path to ISIC dataset directory")
    parser.add_argument("--epochs", type=int, default=30, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size")
    parser.add_argument("--fine_tune_layers", type=int, default=50, help="Number of base model layers to fine-tune")
    
    args = parser.parse_args()
    train(args.data_dir, args.epochs, args.batch_size, args.fine_tune_layers)
