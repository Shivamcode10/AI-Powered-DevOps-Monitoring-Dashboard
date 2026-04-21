import joblib

# 🔥 Load model once
model = joblib.load("data/revenue_model.pkl")

def predict(data: dict):
    try:
        total_revenue = data.get("totalRevenue", 0)
        total_bookings = data.get("totalBookings", 0)

        # ✅ Model expects 1 feature (booking count)
        prediction = model.predict([[total_bookings]])

        avg_booking_value = (
            total_revenue / total_bookings if total_bookings > 0 else 0
        )

        return {
            "predicted_revenue": float(prediction[0]),
            "insight": "Prediction based on booking count",
            "input_summary": {
                "totalRevenue": total_revenue,
                "totalBookings": total_bookings,
                "avgBookingValue": avg_booking_value
            }
        }

    except Exception as e:
        return {"error": str(e)}