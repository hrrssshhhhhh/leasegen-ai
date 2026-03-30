from flask import Blueprint, request, jsonify
from services.lease_engine import generate_lease
from services.pdf_generator import generate_pdf

lease_bp = Blueprint("lease_bp", __name__)

@lease_bp.route("/api/leases/generate", methods=["POST"])
def generate_lease_route():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        lease_text = generate_lease(data)
        pdf_path = generate_pdf(lease_text)

        return jsonify({
            "lease": lease_text,
            "pdf": pdf_path
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500