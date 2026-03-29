"""
model_utils.py — Image preprocessing, prediction, and Grad-CAM heatmap generation.
Optimized preprocessing pipeline for Indian skin tones (Fitzpatrick IV-VI).
"""

import io
import base64
import numpy as np
import cv2
from PIL import Image
import tensorflow as tf

# Class labels matching the model output
CLASS_NAMES = [
    "actinic_keratosis",
    "basal_cell_carcinoma",
    "benign_keratosis",
    "dermatofibroma",
    "melanocytic_nevus",
    "melanoma",
    "vascular_lesion"
]

# Human-readable labels
CLASS_DISPLAY_NAMES = {
    "actinic_keratosis": "Actinic Keratosis",
    "basal_cell_carcinoma": "Basal Cell Carcinoma",
    "benign_keratosis": "Benign Keratosis",
    "dermatofibroma": "Dermatofibroma",
    "melanocytic_nevus": "Melanocytic Nevus",
    "melanoma": "Melanoma",
    "vascular_lesion": "Vascular Lesion"
}

# Risk levels based on prediction class
RISK_LEVELS = {
    "actinic_keratosis": "Medium",
    "basal_cell_carcinoma": "High",
    "benign_keratosis": "Low",
    "dermatofibroma": "Low",
    "melanocytic_nevus": "Low",
    "melanoma": "High",
    "vascular_lesion": "Low"
}


def preprocess_image(image_bytes, target_size=(224, 224)):
    """
    Preprocess image for model prediction.
    Includes color normalization optimized for darker skin tones (Fitzpatrick IV-VI).
    
    Steps:
    1. Load and resize to 224x224
    2. Convert to LAB color space for luminance normalization
    3. Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    4. Convert back to RGB and normalize to [0, 1]
    """
    # Load image from bytes
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size, Image.LANCZOS)
    img_array = np.array(img)
    
    # Convert to LAB color space for better handling of skin tones
    lab_image = cv2.cvtColor(img_array, cv2.COLOR_RGB2LAB)
    
    # Apply CLAHE to the L channel (luminance) to enhance contrast on darker skin
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    lab_image[:, :, 0] = clahe.apply(lab_image[:, :, 0])
    
    # Convert back to RGB
    enhanced = cv2.cvtColor(lab_image, cv2.COLOR_LAB2RGB)
    
    # Normalize to [0, 1] range
    processed = enhanced.astype(np.float32) / 255.0
    
    # Add batch dimension
    return np.expand_dims(processed, axis=0)


def generate_gradcam(model, img_array, class_index, layer_name=None):
    """
    Generate Grad-CAM heatmap for model explainability.
    
    Args:
        model: Trained Keras model
        img_array: Preprocessed image array (1, 224, 224, 3)
        class_index: Index of the predicted class
        layer_name: Name of the target conv layer (defaults to last conv layer)
    
    Returns:
        Heatmap as a numpy array (224, 224) with values in [0, 1]
    """
    if layer_name is None:
        # Find the last convolutional layer in the model
        for layer in reversed(model.layers):
            if isinstance(layer, tf.keras.layers.Conv2D):
                layer_name = layer.name
                break
            # Also check inside nested models (like the MobileNetV2 base)
            if hasattr(layer, 'layers'):
                for sub_layer in reversed(layer.layers):
                    if isinstance(sub_layer, tf.keras.layers.Conv2D):
                        layer_name = layer.name + "/" + sub_layer.name
                        # Build a proper reference
                        layer_name = sub_layer.name
                        break
                if layer_name:
                    break
    
    # For MobileNetV2, use the output of the base model's last conv block
    # The last conv layer in MobileNetV2 is 'Conv_1' in the base model
    try:
        # Try to get the layer from the full model
        target_layer = model.get_layer("Conv_1")
    except ValueError:
        try:
            # Try nested model approach
            base_model = model.layers[0] if hasattr(model.layers[0], 'layers') else model
            target_layer = None
            for layer in reversed(base_model.layers):
                if 'conv' in layer.name.lower() or 'Conv' in layer.name:
                    target_layer = layer
                    break
            if target_layer is None:
                # Fallback: return a uniform heatmap
                return np.ones((224, 224), dtype=np.float32) * 0.5
        except Exception:
            return np.ones((224, 224), dtype=np.float32) * 0.5

    # Create gradient model
    grad_model = tf.keras.Model(
        inputs=model.input,
        outputs=[target_layer.output, model.output]
    )
    
    # Compute gradients
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, class_index]
    
    grads = tape.gradient(loss, conv_outputs)
    
    if grads is None:
        return np.ones((224, 224), dtype=np.float32) * 0.5
    
    # Global average pooling of gradients
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    
    # Weight the conv outputs by the pooled gradients
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    
    # ReLU and normalize
    heatmap = tf.nn.relu(heatmap)
    heatmap = heatmap / (tf.reduce_max(heatmap) + 1e-8)
    heatmap = heatmap.numpy()
    
    # Resize to input image size
    heatmap = cv2.resize(heatmap, (224, 224))
    
    return heatmap


def create_heatmap_overlay(original_image_bytes, heatmap, alpha=0.4):
    """
    Overlay Grad-CAM heatmap on the original image.
    
    Returns:
        Base64-encoded PNG image string
    """
    # Load original image
    img = Image.open(io.BytesIO(original_image_bytes)).convert("RGB")
    img = img.resize((224, 224), Image.LANCZOS)
    img_array = np.array(img)
    
    # Create colored heatmap (jet colormap)
    heatmap_uint8 = np.uint8(255 * heatmap)
    heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
    
    # Overlay heatmap on original image
    overlay = np.uint8(img_array * (1 - alpha) + heatmap_colored * alpha)
    
    # Convert to base64
    overlay_img = Image.fromarray(overlay)
    buffer = io.BytesIO()
    overlay_img.save(buffer, format="PNG")
    buffer.seek(0)
    base64_str = base64.b64encode(buffer.read()).decode("utf-8")
    
    return base64_str


def predict(model, image_bytes):
    """
    Run full prediction pipeline on an image.
    
    Returns:
        dict with prediction, confidence, risk_level, heatmap, and all_predictions
    """
    # Preprocess image
    processed = preprocess_image(image_bytes)
    
    # Get model predictions
    predictions = model.predict(processed, verbose=0)
    pred_probs = predictions[0]
    
    # Get top prediction
    top_idx = int(np.argmax(pred_probs))
    top_class = CLASS_NAMES[top_idx]
    top_confidence = float(pred_probs[top_idx])
    
    # Generate Grad-CAM
    heatmap = generate_gradcam(model, processed, top_idx)
    heatmap_base64 = create_heatmap_overlay(image_bytes, heatmap)
    
    # Build all predictions list (sorted by confidence)
    all_preds = []
    for i, class_name in enumerate(CLASS_NAMES):
        all_preds.append({
            "class": CLASS_DISPLAY_NAMES[class_name],
            "confidence": round(float(pred_probs[i]), 4)
        })
    all_preds.sort(key=lambda x: x["confidence"], reverse=True)
    
    return {
        "prediction": CLASS_DISPLAY_NAMES[top_class],
        "prediction_key": top_class,
        "confidence": round(top_confidence, 4),
        "risk_level": RISK_LEVELS[top_class],
        "heatmap": heatmap_base64,
        "all_predictions": all_preds
    }
