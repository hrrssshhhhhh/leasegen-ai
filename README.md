# 🏠 LeaseGen 

> An AI-powered full-stack application to generate, manage, and download residential lease agreements — built with React and Flask.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react)
![Flask](https://img.shields.io/badge/backend-Flask-000000?logo=flask)
![SQLite](https://img.shields.io/badge/database-SQLite-003B57?logo=sqlite)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📌 Overview

**LeaseGen** is a full-stack web application that helps landlords and property managers generate professional residential lease agreements, manage them from a central dashboard, and download them as PDFs — all secured with JWT authentication.

Every user has a completely private workspace — leases created by one user are never visible or accessible to any other user.

AI-powered features (clause suggestions, smart auto-fill, lease analysis) are actively being planned for the next phase of development.

---

## 📸 Screenshots

### 🔐 Sign In
![Sign In](docs/screenshots/sign-in.png)

### 📝 Sign Up
![Sign Up](docs/screenshots/sign-up.png)

### 🗂️ Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### 📄 Create Lease
![Lease Page](docs/screenshots/lease-page.png)

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login and signup for protected access
- 🔒 **Private User Workspaces** — Each user can only see and manage their own leases; no cross-user data access
- 📄 **Lease Generation** — Generate complete, ready-to-sign lease agreements with a live preview
- 🗂️ **Lease Management Dashboard** — View, search, filter, edit, duplicate, and delete your leases
- 📥 **PDF Download** — Export any lease as a clean, printable PDF instantly
- 📋 **Clause Library** — Predefined and customizable legal clauses for lease agreements
- ⚖️ **Laws Reference** — Built-in reference layer for applicable rental laws
- 🤖 **AI Features** *(Coming Soon)* — Smart clause suggestions, lease analysis, and intelligent auto-fill powered by AI

---

## 🔒 Privacy & Data Isolation

LeaseGen enforces strict per-user data isolation:

- All lease records are tied to the authenticated user's account via JWT
- API endpoints validate the token on every request and only return data belonging to that user
- There is no admin view or shared lease pool — your leases are yours alone
- Attempting to access another user's lease returns a `403 Forbidden` response

---

## 🗂️ Project Structure

```
leasegen/
├── backend/                  # Flask API — routes, models, auth, PDF generation
├── frontend/                 # React app — Dashboard, Lease page, Login, Signup
├── clauses/                  # Reusable legal clause definitions
├── laws/                     # Rental law references used during lease generation
├── templates/                # Lease document templates
├── docs/
│   └── screenshots/          # App screenshots for README
└── .gitignore
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, CSS |
| Backend | Python, Flask |
| Database | SQLite |
| Auth | JWT (JSON Web Tokens) |
| PDF Generation | Flask-based PDF rendering |
| AI *(Planned)* | OpenAI / Anthropic API |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- pip

---

### Backend Setup (Flask)

```bash
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Fill in your JWT secret and any other config in .env

# Start the Flask server
flask run
```

The API will be running at `http://localhost:5000`.

---

### Frontend Setup (React)

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will be running at `http://localhost:3000`.

---

## 📖 Usage Examples

### Sign Up & Log In

1. Open the app and go to the **Sign Up** page
2. Create an account with your email and password — no credit card required
3. Log in — your session is secured with a JWT token
4. All data you create is private to your account only

### Generate a Lease

1. From the **Dashboard**, click **+ Create Lease**
2. Fill in party details (Landlord & Tenant), property address, financials, and lease term
3. Watch the **Live Preview** update in real time as you type
4. Click **✦ Generate Lease PDF** to download, or **✓ Save Lease** to store it

### Manage Leases

1. Your **Dashboard** shows only your leases — total count and total rent at a glance
2. Search by tenant name or address, filter by rent range, and sort by newest
3. Use **View PDF**, **Edit**, **Duplicate**, or **Delete** actions on any lease card

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/leasegen-ai.git
   cd leasegen-ai
   ```
3. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**, test them, and commit:
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. **Push** your branch and open a **Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Contribution Guidelines

- Keep PRs focused — one feature or fix per PR
- Follow existing code style: PEP8 for Python, consistent formatting for JavaScript
- Write clear, descriptive commit messages
- If adding a new feature, update this README accordingly
- For major changes, open an issue first to discuss

### Good First Issues

Looking to contribute but not sure where to start? Check the [Issues](https://github.com/hrrssshhhhhh/LeaseGen/issues) tab for open tasks. Areas we'd love help with:

- UI/UX improvements on the Dashboard and Lease page
- Additional clause templates
- Test coverage (backend unit tests, frontend component tests)
- AI feature research and prototyping

---

## 🛣️ Roadmap

- [x] JWT Authentication (Login / Signup)
- [x] Lease Generation with live preview
- [x] Lease Management Dashboard
- [x] PDF Download
- [x] Per-user data isolation (private workspaces)
- [ ] AI-powered clause suggestions
- [ ] Smart auto-fill from property data
- [ ] Lease risk analysis
- [ ] Email notifications for lease renewals
- [ ] Multi-user / team support

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Made with ❤️ by [hrrssshhhhhh](https://github.com/hrrssshhhhhh)
