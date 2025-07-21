from docx import Document
import PyPDF2
import os

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts text from a PDF file.

    Args:
        pdf_path (str): The full path to the PDF file.

    Returns:
        str: The extracted text, or an empty string if an error occurs.
    """
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text() + "\n" 
    except Exception as e:
        print(f"Error extracting text from PDF {pdf_path}: {e}")
        
    return text

def extract_text_from_docx(docx_path: str) -> str:
    """
    Extracts text from a DOCX file.

    Args:
        docx_path (str): The full path to the DOCX file.

    Returns:
        str: The extracted text, or an empty string if an error occurs.
    """
    text = ""
    try:
        document = Document(docx_path)
        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        print(f"Error extracting text from DOCX {docx_path}: {e}")
       
    return text

def get_file_extension(filename: str) -> str:
    """
    Gets the file extension from a filename.
    """
    return os.path.splitext(filename)[1].lower()

def extract_text_from_file(file_path: str, filename: str) -> str:
    """
    Extracts text from a file based on its extension.
    Supports .pdf and .docx.

    Args:
        file_path (str): The full path to the file.
        filename (str): The original filename (used to determine extension).

    Returns:
        str: The extracted text.
    
    Raises:
        ValueError: If the file type is not supported.
    """
    ext = get_file_extension(filename)
    if ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif ext == '.docx':
        return extract_text_from_docx(file_path)
    elif ext == '.txt': 
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        raise ValueError(f"Unsupported file type: {ext}")