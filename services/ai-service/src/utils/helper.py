def analyze_metrics(data):
    cpu = data.get("cpu")
    memory = data.get("memory")

    if cpu > 80:
        return {
            "status": "High Load",
            "action": "Scale Up Pods 🚀"
        }

    if memory > 80:
        return {
            "status": "High Memory",
            "action": "Restart Service 🔁"
        }

    return {
        "status": "Normal",
        "action": "No Action Needed ✅"
    }