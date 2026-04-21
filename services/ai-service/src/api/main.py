from fastapi import FastAPI
from src.inference.predict import predict

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Service Running 🚀"}

# ✅ POST API
@app.post("/predict")
def get_prediction(data: dict):
    return predict(data)