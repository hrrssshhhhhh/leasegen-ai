import os
import jwt
import datetime

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from werkzeug.security import generate_password_hash, check_password_hash

from pdf_generator import generate_pdf
from database import init_db, get_connection

from functools import wraps


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

SECRET_KEY = "super_secret_key_123" 

# 🔐 ADD THIS HERE
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data["user_id"]
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated

# Initialize DB
init_db()

# Folder to serve PDFs
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PDF_FOLDER = os.path.join(os.path.dirname(BASE_DIR), "generated_pdfs")



# ================= AUTH: SIGNUP =================
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email").strip()
    password = data.get("password").strip()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    from werkzeug.security import generate_password_hash

    hashed_password = generate_password_hash(password)

    cursor.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        (email, hashed_password)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "User created"})

# ================= AUTH: LOGIN =================

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email").strip()
    password = data.get("password").strip()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, password FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 401

    user_id, hashed_password = user

    if not check_password_hash(hashed_password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user_id": user_id
    })

# 🔥 Generate PDF
@app.route("/generate-pdf", methods=["POST"])
def generate_pdf_route():
    data = request.json
    lease_text = data.get("lease")

    filename = generate_pdf(lease_text)

    return jsonify({"pdf": filename})


# 🔥 Save lease
@app.route("/save-lease", methods=["POST"])
def save_lease():
    try:
        data = request.json
        print("🔥 Incoming data:", data)

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO leases (user_id,landlord, tenant, address, rent, lease_text, pdf_file)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("user_id"),
            data.get("landlord"),
            data.get("tenant"),
            data.get("address"),
            data.get("rent"),
            data.get("lease_text"),
            data.get("pdf_file")
        ))

        conn.commit()
        conn.close()

        print("✅ SAVED SUCCESSFULLY")

        return jsonify({"message": "Lease saved successfully"})

    except Exception as e:
        print("❌ REAL ERROR:", str(e))   # THIS IS KEY
        return jsonify({"error": str(e)}), 500

# 🔥 Update Lease
@app.route('/update-lease/<int:lease_id>', methods=['PUT'])
def update_lease(lease_id):
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE leases SET
            landlord = ?,
            tenant = ?,
            address = ?,
            rent = ?,
            lease_text = ?,
            pdf_file = ?
        WHERE id = ?
    """, (
        data.get("landlord"),
        data.get("tenant"),
        data.get("address"),
        data.get("rent"),
        data.get("lease_text"),
        data.get("pdf_file"),
        lease_id
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Lease updated successfully"})
    
# 🔥 Get all leases
@app.route("/lease/<int:id>", methods=["GET"])
def get_single_lease(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM leases WHERE id = ?", (id,))
    row = cursor.fetchone()

    conn.close()

    if row:
        return jsonify({
            "id": row[0],
            "user_id": row[1],
            "landlord": row[2],
            "tenant": row[3],
            "address": row[4],
            "rent": row[5],
            "lease_text": row[6],
            "pdf_file": row[7]
        })

    return jsonify({"error": "Lease not found"}), 404

@app.route("/leases", methods=["GET"])
@token_required
def get_leases():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM leases WHERE user_id=?", (request.user_id,))
    rows = cursor.fetchall()

    leases = []
    for row in rows:
        leases.append({
            "id": row[0],
            "user_id": row[1],
            "landlord": row[2],
            "tenant": row[3],
            "address": row[4],
            "rent": row[5],
            "lease_text": row[6],
            "pdf_file": row[7]
        })

    conn.close()
    return jsonify(leases)


# 🔥 Serve PDFs
@app.route("/generated_pdfs/<filename>")
def serve_pdf(filename):
    print("🔥 FILE REQUESTED:", filename)
    print("🔥 SERVING FROM:", PDF_FOLDER)
    return send_from_directory(PDF_FOLDER, filename)

# 🔥 Delete Lease
@app.route("/delete-lease/<int:lease_id>", methods=["DELETE"])
@token_required
def delete_lease(lease_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT pdf_file FROM leases WHERE id = ?", (lease_id,))
    row = cursor.fetchone()

    if row and row[0]:   # ✅ IMPORTANT FIX
        pdf_file = row[0]

        pdf_path = os.path.join(PDF_FOLDER, pdf_file)

        if os.path.exists(pdf_path):
            os.remove(pdf_path)

    # always delete DB row
    cursor.execute("DELETE FROM leases WHERE id = ?", (lease_id,))
    
    conn.commit()
    conn.close()

    return jsonify({"message": "Lease deleted successfully"})

# 🔥 Duplicate Lease
@app.route("/duplicate-lease/<int:lease_id>", methods=["POST"])
def duplicate_lease(lease_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM leases WHERE id = ?", (lease_id,))
    row = cursor.fetchone()

    if not row:
        return jsonify({"error": "Lease not found"}), 404

    cursor.execute("""
        INSERT INTO leases (user_id, landlord, tenant, address, rent, lease_text, pdf_file)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        row[1],  # ✅ FIXED user_id
        row[2],  # landlord
        row[3],  # tenant
        row[4],  # address
        row[5],  # rent
        row[6],  # lease_text
        row[7],  # pdf_file
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Lease duplicated"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)