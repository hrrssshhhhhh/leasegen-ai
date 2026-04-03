import os
import json

from flask import request, jsonify
from functools import wraps
import jwt

from groq import Groq

SECRET_KEY = "super_secret_key_123"


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
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated


def load_laws_context():
    laws_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "laws"
    )
    context = ""
    if not os.path.exists(laws_dir):
        return ""
    for filename in sorted(os.listdir(laws_dir)):
        if filename.endswith(".txt") or filename.endswith(".md"):
            filepath = os.path.join(laws_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read().strip()
                context += f"\n\n=== {filename} ===\n{content}"
    return context.strip()


def get_groq_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not set")
    return Groq(api_key=api_key)


# ─────────────────────────────────────────────
# ROUTE 1 — Clause Enhancement
# ─────────────────────────────────────────────
def enhance_clause():
    try:
        data = request.json
        clause = data.get("clause", "").strip()
        if not clause:
            return jsonify({"error": "No clause provided"}), 400

        laws_context = load_laws_context()
        system_prompt = (
            "You are a professional real estate attorney specializing in residential lease agreements. "
            "Rewrite lease clauses to be legally sound, clear, unambiguous, and enforceable. "
            "Return ONLY the improved clause text. No explanations, no preamble. "
            "Just the rewritten clause ready to paste into a lease."
        )
        user_prompt = f'Improve this lease clause:\n\n"{clause}"'
        if laws_context:
            user_prompt += f"\n\nUse these rental law references where relevant:\n{laws_context}"

        client = get_groq_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=500,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        enhanced = response.choices[0].message.content.strip()
        return jsonify({"enhanced_clause": enhanced})

    except Exception as e:
        return jsonify({"error": f"AI error: {str(e)}"}), 500


# ─────────────────────────────────────────────
# ROUTE 2 — Suggest Clause Title
# POST /ai/suggest-title
# Body: { "clause": "..." }
# ─────────────────────────────────────────────
def suggest_title():
    try:
        data = request.json
        clause = data.get("clause", "").strip()
        if not clause:
            return jsonify({"error": "No clause provided"}), 400

        client = get_groq_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=20,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a legal document assistant. Given a lease clause, "
                        "respond with ONLY a short 2-4 word section title in ALL CAPS. "
                        "Nothing else. No punctuation, no explanation. Examples: "
                        "RENT PAYMENT POLICY, PET DEPOSIT TERMS, LATE FEE POLICY"
                    )
                },
                {
                    "role": "user",
                    "content": f"Suggest a section title for this clause:\n\n{clause}"
                }
            ]
        )
        title = response.choices[0].message.content.strip().upper()
        # Clean up any punctuation or extra characters
        title = title.replace('"', '').replace("'", '').replace('.', '').strip()
        return jsonify({"title": title})

    except Exception as e:
        return jsonify({"error": f"AI error: {str(e)}"}), 500


# ─────────────────────────────────────────────
# ROUTE 3 — Lease Analysis
# ─────────────────────────────────────────────
def analyze_lease():
    try:
        data = request.json
        lease_text = data.get("lease_text", "").strip()
        if not lease_text:
            return jsonify({"error": "No lease text provided"}), 400

        laws_context = load_laws_context()
        system_prompt = (
            "You are a professional real estate attorney reviewing residential lease agreements. "
            "Analyze the lease and return a JSON object with exactly this structure:\n"
            '{"score": <1-10>, "summary": "<2 sentence assessment>", '
            '"issues": ["..."], "strengths": ["..."], "suggestions": ["..."]}\n'
            "Return ONLY valid JSON. No markdown, no explanation, no code blocks."
        )
        user_prompt = f"Analyze this lease agreement:\n\n{lease_text}"
        if laws_context:
            user_prompt += f"\n\nReference these rental laws:\n{laws_context}"

        client = get_groq_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=800,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        result = json.loads(response.choices[0].message.content.strip())
        return jsonify(result)

    except json.JSONDecodeError:
        return jsonify({"error": "AI returned invalid response, try again"}), 500
    except Exception as e:
        return jsonify({"error": f"AI error: {str(e)}"}), 500


# ─────────────────────────────────────────────
# ROUTE 4 — Chat Assistant
# ─────────────────────────────────────────────
def chat_assistant():
    try:
        data = request.json
        user_message = data.get("message", "").strip()
        history = data.get("history", [])
        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        laws_context = load_laws_context()
        system_prompt = (
            "You are LeaseGen AI — a friendly assistant specializing in residential rental law and lease agreements. "
            "You help landlords understand their rights, lease clauses, and tenant situations. "
            "Keep responses concise and practical. Use simple language, not legal jargon. "
            "If unsure about something jurisdiction-specific, say so and recommend a local attorney."
        )
        if laws_context:
            system_prompt += f"\n\nYou have access to these rental law references:\n{laws_context}"

        messages = [{"role": "system", "content": system_prompt}]
        for msg in history[-10:]:
            if msg.get("role") in ["user", "assistant"] and msg.get("content"):
                messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": user_message})

        client = get_groq_client()
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=600,
            messages=messages
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": f"AI error: {str(e)}"}), 500