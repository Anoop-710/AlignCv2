import logging

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse, FileResponse
import shutil
import os
from dotenv import load_dotenv
import uuid
from services import match_service
from google import genai
from google.genai import types
from fastapi.middleware.cors import CORSMiddleware
import nltk.data
from services import privacy_service

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GOOGLE_API_KEY not found in environment variables. AI optimization will be unavailable.")
    GEMINI_API_KEY = None


# Get the absolute path to the directory where the app is running (api/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Construct the path to your nltk_data folder relative to BASE_DIR
NLTK_DATA_DIR = os.path.join(BASE_DIR, "nltk_data")

# This makes sure NLTK knows where to find the downloaded resources
nltk.data.path.append(NLTK_DATA_DIR)
print(f"NLTK data paths: {nltk.data.path}") # For debugging


app = FastAPI(
    title="Resume-JD Matcher & Optimizer",
    description="Match resumes with job descriptions and get AI-powered optimization.",
    version="1.0.0",
)

origins = [
    "http://localhost",
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "https://align-cv-five.vercel.app"
]


origins = list(set(origins)) 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


async def read_file_content(upload_file: UploadFile) -> str:
    temp_path = f"temp_{uuid.uuid4()}_{upload_file.filename}"
    try:
      
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)

        # Attempt to read content with utf-8, fall back if necessary
        try:
            with open(temp_path, "r", encoding="utf-8") as f:
                content = f.read()
            return content
        except UnicodeDecodeError:
            print(f"DEBUG: UnicodeDecodeError for {upload_file.filename}. Trying latin-1...")
            # Fallback for common encoding issues (e.g., some older .doc files converted to text)
            with open(temp_path, "r", encoding="latin-1") as f:
                content = f.read()
            return content
        except Exception as e:
            print(f"ERROR: Failed to read file {upload_file.filename} content: {e}")
            raise HTTPException(status_code=400, detail=f"Could not read content from {upload_file.filename}: {e}")

    except Exception as e:
        print(f"ERROR: File processing failed for {upload_file.filename}: {e}")
        raise HTTPException(status_code=400, detail=f"File processing failed for {upload_file.filename}: {e}")
    finally:
        # Ensure temporary file is removed
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Resume-JD Matcher API. Go to /docs for API documentation."}

@app.post("/analyze/")
async def analyze_resume_jd(
    resume_file: UploadFile = File(...), 
    jd_file: UploadFile = File(...),
    min_match_percentage: float = Form(0.40)
):
    """
    Analyzes the resume against the job description and provides a match score and suggestions.
    Does NOT perform AI optimization.
    """
    resume_content = await read_file_content(resume_file)
    jd_content = await read_file_content(jd_file)

    if not resume_content or not jd_content:
        raise HTTPException(status_code=400, detail="Could not read content from both files.")

    match_result = match_service.check_mismatch_and_threshold(
        resume_content, 
        jd_content, 
        min_match_percentage=min_match_percentage
    )

    return JSONResponse(content={
        "message": "Files analyzed successfully!",
        **match_result,
        "extracted_text_debug": {
            "resume_text": resume_content,
            "jd_text": jd_content
        }
    })

@app.post("/optimize/")
async def optimize_resume(
    resume_file: UploadFile = File(...), 
    jd_file: UploadFile = File(...),
    required_match_for_optimization: float = Form(0.40)
):
    """
    Optimizes the resume against the job description using AI.
    Requires a minimum match score from the initial analysis.
    Returns the optimized resume text and a download link.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=503, detail="AI optimization service is not configured (API Key missing).")

    resume_content = await read_file_content(resume_file)
    jd_content = await read_file_content(jd_file)

    if not resume_content or not jd_content:
        raise HTTPException(status_code=400, detail="Could not read content from both files.")

    analysis_result = match_service.check_mismatch_and_threshold(
        resume_content, 
        jd_content, 
        min_match_percentage=0.0
    )
    current_match_percentage = analysis_result["match_percentage"]

    if current_match_percentage < required_match_for_optimization * 100:
        raise HTTPException(
            status_code=403, 
            detail=f"Original match percentage ({current_match_percentage:.2f}%) is below the required {required_match_for_optimization*100:.2f}% for optimization. Please improve your resume first."
        )

    # --- START OF NEW PII MASKING LOGIC ---
    print("INFO: Masking PII from resume content before sending to AI...")
    masked_resume_content, pii_map = privacy_service.mask_text(resume_content)
    # If the map is empty, it means nothing was masked. This is fine.
    # --- END OF NEW PII MASKING LOGIC ---

    # Analyze the ORIGINAL resume for an accurate score
    analysis_result = match_service.check_mismatch_and_threshold(
        resume_content, 
        jd_content,
        min_match_percentage=0.0 
    )

    current_match_percentage = analysis_result["match_percentage"]

    if current_match_percentage < required_match_for_optimization * 100:
        raise HTTPException(
            status_code=403,
            detail=f"Original match percentage ({current_match_percentage:.2f}%) is below the required {required_match_for_optimization*100:.2f}% for optimization. Resume does not meet the job description requirements."
        )
    

    logging.info("Calling external AI service for optimization with masked content.")
    # For clarity, let's log the first 200 chars of the masked content
    logging.info(f"Masked content preview: {masked_resume_content[:200]}...")

    # Call AI optimization with the MASKED content
    optimization_response = await match_service.optimize_resume_with_ai(
        masked_resume_content, # ### IMPORTANT: Pass the masked version ###
        jd_content,
        GEMINI_API_KEY
    )

    if optimization_response["status"] == "error":
        raise HTTPException(
            status_code=500,
            detail=f"AI optimization failed: {optimization_response['message']}"
        )

    # --- START OF NEW PII UNMASKING LOGIC ---
    optimized_masked_text = optimization_response["optimized_text"]
    
    logging.info("Received response from AI. Starting PII unmasking process.")
    final_optimized_text = privacy_service.unmask_text(optimized_masked_text, pii_map)
    logging.info("Unmasking complete. Preparing final response.")
    
    final_optimized_text = privacy_service.unmask_text(optimized_masked_text, pii_map)
    # --- END OF NEW PII UNMASKING LOGIC ---

    return JSONResponse(content={
        "message": "Resume optimized successfully.",
        "optimization_status": "success",
        "original_match_percentage": current_match_percentage,
        "optimized_resume_text": final_optimized_text, # ### Use the final, unmasked text ###
    })