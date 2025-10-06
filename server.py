from flask import Flask, request, jsonify
from flask_cors import CORS
from gradio_client import Client
import json, traceback

app = Flask(__name__)
CORS(app)

SPACE_ID = "robersonruidias/MyModelsNasaChall"
client = Client(SPACE_ID)

# --- Endpoints de predict que realmente existen ---
PREDICT_APIS = ["/predict"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        payload = request.get_json(force=True)
        model_label = payload.get("model_label")
        data_obj = payload.get("data")

        if not model_label or data_obj is None:
            return jsonify({"error": "Faltan campos 'model_label' o 'data'"}), 400

        text_arg = json.dumps(data_obj)

        last_exc = None
        for api in PREDICT_APIS:
            try:
                print(f"🔎 Probando predict en {api} ...")
                res = client.predict(model_label, text_arg, api_name=api)
                print(f"✅ Predict funcionó en {api}")
                return jsonify(res)
            except Exception as e:
                print(f"⚠️ Falló {api}: {e}")
                last_exc = e

        # Si ninguna API funciona
        raise last_exc

    except Exception as e:
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500


if __name__ == "__main__":
    print("🚀 Servidor local en http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)
