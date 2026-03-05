from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Cognitive Load Prediction API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
scaler = joblib.load('models/scaler.joblib')
rf_model = joblib.load('models/rf_model.joblib')
mlp_model = joblib.load('models/mlp_model.joblib')

class StudentInteraction(BaseModel):
    problem_difficulty: int # 0, 1, 2
    time_taken: float
    attempts: int
    hints_used: int
    pause_duration: float
    typing_speed: float
    mouse_movement: float

@app.post("/predict")
async def predict(data: StudentInteraction):
    features = np.array([[
        data.problem_difficulty,
        data.time_taken,
        data.attempts,
        data.hints_used,
        data.pause_duration,
        data.typing_speed,
        data.mouse_movement
    ]])
    
    features_scaled = scaler.transform(features)
    
    # Get probabilities from both models
    rf_probs = rf_model.predict_proba(features_scaled)[0]
    mlp_probs = mlp_model.predict_proba(features_scaled)[0]
    
    # Ensemble: Average the probabilities
    ensemble_probs = (rf_probs + mlp_probs) / 2
    final_pred_idx = int(np.argmax(ensemble_probs))
    confidence = float(np.max(ensemble_probs))
    
    load_levels = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}
    
    # Reason generation (simple heuristic for demo)
    reasons = []
    if data.time_taken > 150: reasons.append("Long solving time")
    if data.attempts > 3: reasons.append("Multiple attempts")
    if data.hints_used > 2: reasons.append("Frequent hint usage")
    if data.pause_duration > 30: reasons.append("Significant hesitation (long pauses)")
    
    if not reasons:
        reasons = ["Consistent behavioral patterns"]

    return {
        "prediction": load_levels[final_pred_idx],
        "rf_pred": load_levels[int(np.argmax(rf_probs))],
        "nn_pred": load_levels[int(np.argmax(mlp_probs))],
        "confidence": confidence,
        "reasons": reasons
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
