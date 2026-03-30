import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "lease_template.txt")
CLAUSE_DIR = os.path.join(BASE_DIR, "clauses")
LAW_DIR = os.path.join(BASE_DIR, "laws")


def load_template():
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        return f.read()


def load_clauses():
    clauses = {}

    for file in os.listdir(CLAUSE_DIR):
        if file.endswith(".txt"):
            key = file.replace(".txt", "")
            path = os.path.join(CLAUSE_DIR, file)

            with open(path, "r", encoding="utf-8") as f:
                clauses[key] = f.read()

    return clauses


def load_state_law(state):
    state_file = f"{state.lower()}_laws.txt"
    path = os.path.join(LAW_DIR, state_file)

    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    return ""


def generate_lease(data):

    template = load_template()
    clauses = load_clauses()
    law = load_state_law(data.get("state", "florida"))

    lease = template

    # replace user variables
    lease = lease.replace("{{landlord}}", str(data.get("landlord") or ""))
    lease = lease.replace("{{tenant}}", str(data.get("tenant") or ""))
    lease = lease.replace("{{property_address}}", str(data.get("address") or ""))
    lease = lease.replace("{{rent}}", str(data.get("rent") or ""))
    lease = lease.replace("{{deposit}}", str(data.get("deposit") or ""))
    lease = lease.replace("{{state}}", str(data.get("state") or ""))

    # insert clauses
    for key, value in clauses.items():
        placeholder = "{{" + key + "}}"
        lease = lease.replace(placeholder, value)

    lease += "\n\nSTATE LAW REFERENCES:\n"
    lease += law

    return lease