"""
app.py — FastAPI server for the skin cancer detection model.
Exposes /predict endpoint that accepts an image and returns prediction + Grad-CAM heatmap.
Runs on http://localhost:5000
"""

import os
import sys
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
tf.get_logger().setLevel('ERROR')

# Global model reference
model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model on startup."""
    global model
    model_path = os.path.join(os.path.dirname(__file__), "saved_model", "skin_model.h5")
    
    if not os.path.exists(model_path):
        logger.info("No saved model found. Creating demo model...")
        from demo_model import save_demo_model
        save_demo_model()
    
    logger.info(f"Loading model from {model_path}...")
    model = tf.keras.models.load_model(model_path)
    logger.info("Model loaded successfully!")
    logger.info(f"Model input shape: {model.input_shape}")
    logger.info(f"Model output shape: {model.output_shape}")
    
    yield
    
    logger.info("Shutting down model service...")

# Create FastAPI app
app = FastAPI(
    title="Skin Cancer Detection API",
    description="AI-powered skin lesion classifier optimized for Indian skin tones",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "service": "Skin Cancer Detection Model API"
    }


@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    """
    Predict skin lesion classification from uploaded image.
    
    Accepts: Image file (JPEG, PNG)
    Returns: JSON with prediction, confidence, risk_level, heatmap (base64), all_predictions
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: JPEG, PNG, WebP"
        )
    
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        logger.info(f"Processing image: {file.filename} ({len(image_bytes)} bytes)")
        
        # Run prediction pipeline
        from model_utils import predict
        result = predict(model, image_bytes)
        
        logger.info(f"Prediction: {result['prediction']} ({result['confidence']:.2%})")
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )
