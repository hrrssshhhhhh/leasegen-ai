import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "leases.db")

# Create DB and table
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # leases table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        landlord TEXT,
        tenant TEXT,
        address TEXT,
        rent TEXT,
        lease_text TEXT,
        pdf_file TEXT
    )
    """)

    # ✅ users table (ADD THIS)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    conn.commit()
    conn.close()


# Return DB connection
def get_connection():
    return sqlite3.connect(DB_PATH)