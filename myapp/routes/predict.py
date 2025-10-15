from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Any
import pickle
import os

router = APIRouter()


class PredictRequest(BaseModel):
    # Accept a generic list of features (adjust types to your model)
    features: List[float]


class PredictResponse(BaseModel):
    prediction: Any


MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'model1.pkl')


def load_model(path=MODEL_PATH):
    # Cache the model in the module to avoid reloading on every request
    if hasattr(load_model, 'model'):
        return load_model.model
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found at {path}")
    with open(path, 'rb') as f:
        model = pickle.load(f)
    load_model.model = model
    return model


@router.post('/predict', response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        model = load_model()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model: {e}")

    # Depending on your model API (sklearn, xgboost, torch), adapt this
    try:
        # most scikit-learn models expect 2D array-like input
        features = [req.features]
        pred = model.predict(features)
        # if predict returns array-like
        result = pred[0] if hasattr(pred, '__len__') else pred
        return PredictResponse(prediction=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
