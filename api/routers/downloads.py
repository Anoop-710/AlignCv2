from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/download/{filename}")
def download_output(filename: str):
    file_path = os.path.join("outputs", filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="text/plain", filename=filename)
    return {"error": "File not found"}
