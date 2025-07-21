
import os
import shutil
from fastapi import UploadFile


UPLOAD_DIR = "uploaded_files"

def ensure_upload_dir_exists():
    """Ensures the UPLOAD_DIR exists."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_uploaded_file(file: UploadFile) -> str:
    """
    Saves an uploaded file to the UPLOAD_DIR.

    Args:
        file (UploadFile): The uploaded file object from FastAPI.

    Returns:
        str: The full path to the saved file.
    """
    ensure_upload_dir_exists() 
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            # Use await file.read() for smaller files, or shutil.copyfileobj for larger ones
            # For simplicity and robustness with potentially large files, copyfileobj is often preferred.
            shutil.copyfileobj(file.file, buffer)
        return file_path
    except Exception as e:
        # Clean up if saving fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise e # Re-raise the exception after cleanup