🤖 AI Resume Analyzer & Optimizer
A web application that helps users optimize their resumes against job descriptions using AI, aiming to improve ATS compatibility and increase interview chances.

✨ Key Features
✅ Resume vs. JD Analysis: Get a similarity score and keyword analysis to identify gaps in your resume.

✅ AI-Powered Optimization: Leverage the Google Gemini API to automatically rewrite and enhance your resume text.

🔒 Automated PII Masking: A crucial privacy feature that automatically masks sensitive user data (names, emails, locations) before sending it to the AI service, ensuring user privacy is protected.

📄 Client-Side File Download: Download the final optimized resume directly from your browser.

🚀 Local Setup

Prerequisites

Git
Python 3.9+
Node.js & npm

1. Clone the Repository
   git clone <your-repository-url>
   cd <your-repository-folder>

2. Backend Setup (/api)

# Navigate to the backend directory

cd api

# Create and activate a Python virtual environment

python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

# Install dependencies

pip install -r requirements.txt

# Download the NLP model for PII masking

python -m spacy download en_core_web_sm

# Create a .env file in the /api directory and add your API key

echo 'GEMINI_API_KEY="your_google_gemini_api_key_here"' > .env

3. Frontend Setup (/frontend)

# Navigate to the frontend directory

cd ../frontend

# Install dependencies

npm install

4. Running the Application
   Run the backend and frontend in separate terminals.

Terminal 1: Start Backend

# In the /api directory with venv active

uvicorn main:app --reload

Terminal 2: Start Frontend

# In the /frontend directory

npm run dev
