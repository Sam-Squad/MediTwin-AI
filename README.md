# MediTwin AI — Your Personal AI Healthcare Companion

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18_(Vite)-61DAFB.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini 2.5](https://img.shields.io/badge/AI-Gemini_2.5_Flash-4285F4.svg)](https://ai.google.dev/)

MediTwin AI is a production-grade AI-powered healthcare companion built to help individuals understand their medical reports, track prescriptions, manage daily medicine schedules, prepare for doctor visits, and maintain an emergency health QR profile.

> **Medical Disclaimer**: MediTwin AI is designed strictly for informational and educational purposes. It does not provide medical diagnoses, treatment advice, or replace qualified healthcare professionals.

---

## 🌟 Key Features

1. **Medical PDF Upload & Lab Report Analysis**: Extract text and lab values from Blood reports, CBC, MRI/CT text summaries, highlighting abnormal values with simple explanations.
2. **RAG Medical Chatbot**: Contextual QA backed by uploaded lab reports, prescriptions, medical images, and prior chat history.
3. **Prescription Parsing & OCR**: Extract medicine names, dosage, schedule, side effects, and warnings with interactive verification.
4. **Smart Medicine Reminders**: Automatic schedule builder (Morning, Afternoon, Night) with adherence tracking and browser notifications.
5. **Health Summary & Dynamic Health Score**: Calculates overall health wellness score based on lab trends, compliance, and active symptoms.
6. **Medical Image Analysis (Vision AI)**: Simple explanatory insights for Chest X-Rays, Scans, and Ultrasounds.
7. **Chat History**: Full conversational search, filter, export, and continuation.
8. **Doctor Visit Copilot**: One-click generation of printable PDF "Doctor Visit Sheets" summarizing recent labs, symptoms, questions, and active medicines.
9. **Health Timeline**: Chronological event stream of all health activities.
10. **AI Wellness Coach**: Daily water, walking, and sleep targets.
11. **Emergency Profile Card**: Instant QR Code generator containing blood group, allergies, emergency contacts, and vital medical conditions.
12. **Admin Dashboard**: Real-time analytics on user count, file uploads, AI usage, error logs, and user feedback.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, TanStack React Query, React Hook Form, Zod.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2, Motor (MongoDB Async), PyMuPDF (fitz), Google GenAI SDK (Gemini 2.5 Flash/Pro), Passlib & Bcrypt, PyJWT, ReportLab.
- **Database**: MongoDB Atlas / local MongoDB with automatic JSON-backed async fallback.

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app/main.py
```
Backend runs at `http://localhost:8000`. OpenAPI docs at `http://localhost:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🔒 Safety & Disclaimers

All AI interactions prominently feature a standardized safety disclaimer reminding users to consult licensed medical professionals for diagnosis or treatment decisions.
Contributed by <Mansi>.
Updated by Third Team Member
Updated by third team member.