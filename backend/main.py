from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.lease_routes import lease_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(lease_bp)


@app.route("/")
def home():
    return {"message": "Ownexa Lease Generator API Running"}


@app.route("/generated_pdfs/<filename>")
def download_pdf(filename):
    return send_from_directory("../generated_pdfs", filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)