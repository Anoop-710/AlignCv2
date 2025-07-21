from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import os

from utils.file_operations import save_uploaded_file
from services.text_extraction_service import extract_text_from_file
from services.match_service import check_mismatch_and_threshold 

router = APIRouter(
    prefix="/files",
    tags=["Files"]
)

@router.post("/upload/")
async def upload_resume_and_jd(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...)
):
    """
    Endpoint to upload a resume and job description.
    Saves the files, extracts text, performs a match, and returns results.
    
    Args:
        resume (UploadFile): The user's resume file.
        job_description (UploadFile): The job description file.
        
    Returns:
        JSONResponse: Match percentage, warnings, and suggestions.
    """
    
    uploaded_file_paths = [] # To keep track of saved file paths for cleanup
    extracted_texts = {
        "resume_text": "",
        "jd_text": ""
    }
    
    # Initialize results
    match_results = {
        "match_percentage": 0.0,
        "warnings": [],
        "suggestions": []
    }

    try:
        # 1. Save Resume File
        resume_path = await save_uploaded_file(resume)
        uploaded_file_paths.append(resume_path)

        # 2. Extract Text from Resume
        extracted_texts["resume_text"] = extract_text_from_file(resume_path, resume.filename)

        # 3. Save Job Description File
        jd_path = await save_uploaded_file(job_description)
        uploaded_file_paths.append(jd_path)

        # 4. Extract Text from Job Description
        extracted_texts["jd_text"] = extract_text_from_file(jd_path, job_description.filename)

        # 5. Perform Matching and Mismatch Checks (UPDATED STEP!)
        match_results = check_mismatch_and_threshold(
            extracted_texts["resume_text"],
            extracted_texts["jd_text"]
        )
        
        return JSONResponse(
            status_code=200,
            content={
                "message": "Files processed and matched successfully!",
                "match_percentage": match_results["match_percentage"],
                "warnings": match_results["warnings"] if match_results["warnings"] else ["No significant warnings."],
                "suggestions": match_results["suggestions"],
                "extracted_text_debug": extracted_texts 
            }
        )

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"An unexpected error occurred during processing: {e}") 
        raise HTTPException(status_code=500, detail=f"Processing failed due to an internal error: {e}")
    finally:
        for path in uploaded_file_paths:
            if os.path.exists(path):
                os.remove(path)