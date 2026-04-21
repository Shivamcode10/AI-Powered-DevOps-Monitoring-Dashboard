import numpy as np
from sklearn.linear_model import LinearRegression
import joblib
import os

# bookings → revenue (linear relation)
X = np.array([[1], [2], [3], [4], [5], [6], [7]])
y = np.array([2000, 4000, 6000, 8000, 10000, 12000, 14000])

model = LinearRegression()
model.fit(X, y)

os.makedirs("data", exist_ok=True)
joblib.dump(model, "data/revenue_model.pkl")

print("✅ Model trained and saved")