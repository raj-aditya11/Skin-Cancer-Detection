"""
demo_model.py — Creates a demo MobileNetV2-based model for testing.
This model uses pre-trained ImageNet weights with a custom classification head.
It won't give accurate skin lesion predictions until trained on the ISIC dataset,
but it allows the full application pipeline to function immediately.
"""

import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model

# 7-class skin lesion classification
CLASS_NAMES = [
    "actinic_keratosis",
    "basal_cell_carcinoma",
    "benign_keratosis",
    "dermatofibroma",
    "melanocytic_nevus",
    "melanoma",
    "vascular_lesion"
]

def create_model(num_classes=7, input_shape=(224, 224, 3)):
    """Build a MobileNetV2-based classification model."""
    # Load MobileNetV2 with ImageNet weights (feature extractor)
    base_model = MobileNetV2(
        weights="imagenet",
        include_top=False,
        input_shape=input_shape
    )
    # Freeze the base model layers
    base_model.trainable = False

    # Custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = Dense(256, activation="relu", name="dense_256")(x)
    x = Dropout(0.5, name="dropout_05")(x)
    output = Dense(num_classes, activation="softmax", name="predictions")(x)

    model = Model(inputs=base_model.input, outputs=output, name="skin_lesion_classifier")
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

def save_demo_model():
    """Create and save the demo model."""
    save_dir = os.path.join(os.path.dirname(__file__), "saved_model")
    os.makedirs(save_dir, exist_ok=True)
    model_path = os.path.join(save_dir, "skin_model.h5")

    if os.path.exists(model_path):
        print(f"[INFO] Model already exists at {model_path}")
        return model_path

    print("[INFO] Creating demo MobileNetV2 model...")
    model = create_model()
    model.save(model_path)
    print(f"[INFO] Demo model saved to {model_path}")
    print(f"[INFO] Model summary:")
    model.summary()
    return model_path

if __name__ == "__main__":
    save_demo_model()
