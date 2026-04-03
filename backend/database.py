import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "leases.db")

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
        pdf_file TEXT,
        ai_clauses TEXT
    )
    """)

    # users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    # Migration — add ai_clauses column if it doesn't exist yet
    try:
        cursor.execute("ALTER TABLE leases ADD COLUMN ai_clauses TEXT")
    except:
        pass  # column already exists, that's fine

    # ONE commit and ONE close at the very end
    conn.commit()
    conn.close()


def get_connection():
    return sqlite3.connect(DB_PATH)