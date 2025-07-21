AI Resume Analyzer and Optimizer

This web application helps users optimize their resumes against job descriptions using AI. The goal is to improve a resume's compatibility with Applicant Tracking Systems (ATS) and highlight key qualifications, ultimately increasing the user's chances of landing an interview.

Key Features

Resume vs. Job Description Analysis: Upload a resume and a job description to get a similarity score and a detailed keyword analysis, highlighting skills and terms present in the job description but missing from the resume.

AI-Powered Optimization: Leverages the Google Gemini API to automatically rewrite and enhance the resume text, aligning it more closely with the target job description.

Automated PII Masking: A crucial privacy feature that automatically identifies and masks Personally Identifiable Information (PII) like names, emails, and phone numbers before sending the resume to the external AI service. The original data is seamlessly restored afterward, ensuring user privacy is protected.

Client-Side File Download: Optimized resumes can be downloaded directly from the browser, avoiding the need for server-side file storage.

Tech Stack

Category Technology
Frontend Next.js, React, Tailwind CSS, Framer Motion, Lucide React
Backend Python, FastAPI, NLTK
AI & NLP Google Gemini API, Sentence-Transformers (all-MiniLM-L6-v2), Presidio
Deployment Vercel (Frontend), Render (Backend)

Project Architecture

The application follows a modern, decoupled architecture:

Frontend (Next.js): A static, server-rendered frontend hosted on Vercel provides a fast and responsive user interface.

Backend (FastAPI): A high-performance Python backend hosted on Render handles all core logic, including text extraction, similarity analysis, and AI interaction.

Privacy-First AI Interaction: When a user requests optimization, the backend first uses Presidio to mask all PII. Only this sanitized, anonymous text is sent to the Google Gemini API. The AI-optimized text is then returned, unmasked, and sent back to the user.

Local Setup and Installation

Follow these steps to run the project locally for development.

Prerequisites
Git

Python 3.9+

Node.js and npm (or yarn)

1. Clone the Repository
   bash
   git clone <your-repository-url>
   cd <your-repository-folder>
2. Backend Setup (API)
   The backend server runs on FastAPI.

# Navigate to the backend directory

cd api

# Create and activate a Python virtual environment

python -m venv venv
source venv/bin/activate # On Windows, use `venv\Scripts\activate`

# Install required Python packages

pip install -r requirements.txt

# --- CRITICAL STEP FOR PII MASKING ---

# Download the spaCy language model required by Presidio

python -m spacy download en_core_web_md

# Create an environment variables file

# In the `api` directory, create a new file named `.env`

# and add your Google Gemini API key to it:

# .env

GEMINI_API_KEY="your_google_gemini_api_key_here" 3. Frontend Setup (Client)
The frontend is built with Next.js.

# Navigate to the frontend directory from the root folder

cd frontend

# Install required npm packages

npm install 4. Running the Application
For development, you should run the backend and frontend servers in separate terminals.

Terminal 1: Run the Backend Server

# Make sure you are in the `api` directory and your virtual environment is active

uvicorn main:app --reload

# Make sure you are in the `frontend` directory

npm run dev
