import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
from sentence_transformers import SentenceTransformer
from google import genai
import textwrap
import os
from google.genai import types


# --- SentenceTransformer Model Loading ---
# Define the path to your locally stored model.

MODEL_FOLDER_NAME = "all-MiniLM-L6-v2-local"

MODEL_LOCAL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models", MODEL_FOLDER_NAME)

sentence_model = None
try:
    # Use local_files_only=True to force loading from the local path ONLY.
    # This will prevent any network calls to Hugging Face Hub during loading.
    sentence_model = SentenceTransformer(MODEL_LOCAL_PATH, local_files_only=True)
    print(f"SentenceTransformer model loaded successfully from local path: {MODEL_LOCAL_PATH}")
except Exception as e:
    # If loading from local path fails with local_files_only=True, it's a critical error.
    # The application should not try to download from Hugging Face Hub in this production-focused setup.
    print(f"CRITICAL ERROR: Failed to load SentenceTransformer model from local path ({MODEL_LOCAL_PATH}).")
    print(f"This indicates an issue with the local model files or path configuration. Error: {e}")
    print("Semantic similarity functionality will be UNAVAILABLE.")
    # Set sentence_model to None to clearly indicate failure
    sentence_model = None


def preprocess_text(text: str, remove_stopwords: bool = True) -> list[str]:
    """
    Cleans and tokenizes text.
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    word_tokens = word_tokenize(text)
    filtered_words = [word for word in word_tokens if len(word) > 1]
    if remove_stopwords:
        stop_words = set(stopwords.words('english'))
        filtered_words = [word for word in filtered_words if word not in stop_words]
    return filtered_words

def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """
    Calculates semantic similarity between two texts using SentenceTransformer embeddings.
    """
    if sentence_model is None:
        print("Semantic similarity model not loaded. Falling back to 0.0.")
        return 0.0
    if not text1 or not text2:
        return 0.0
    embeddings = sentence_model.encode([text1, text2])
    semantic_sim = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return float(semantic_sim)

def calculate_tfidf_similarity(text1_tokens: list[str], text2_tokens: list[str]) -> float:
    """
    Calculates TF-IDF based cosine similarity between two sets of tokens.
    """
    if not text1_tokens or not text2_tokens:
        return 0.0
    str_text1 = " ".join(text1_tokens)
    str_text2 = " ".join(text2_tokens)
    corpus = [str_text1, str_text2]
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    tfidf_matrix = vectorizer.fit_transform(corpus)
    cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return float(cosine_sim)

def extract_experience(text: str) -> int:
    """
    Extracts years of experience from text.
    """
    matches = re.findall(r'(\d+)\s*(?:year|yr)s?\s*(?:of)?\s*(?:experience|exp|yoes?)', text, re.IGNORECASE)
    if matches:
        return max(int(m) for m in matches)
    matches = re.findall(r'(\d+)\s*\+?\s*(?:plus)?\s*(?:year|yr)s?', text, re.IGNORECASE)
    if matches:
        return max(int(m) for m in matches)
    matches = re.findall(r'(\d+)\s*(?:y|yr)\b', text, re.IGNORECASE)
    if matches:
        return max(int(m) for m in matches)
    return 0

def extract_job_title_keywords(text: str) -> list[str]:
    """
    Extracts common job title keywords from text.
    """
    keywords = []
    text_lower = text.lower()
    if "software engineer" in text_lower: keywords.append("software engineer")
    if "engineer" in text_lower: keywords.append("engineer")
    if "engineering manager" in text_lower: keywords.append("engineering manager")
    if "embedded engineer" in text_lower: keywords.append("embedded engineer")
    if "data scientist" in text_lower: keywords.append("data scientist")
    if "developer" in text_lower: keywords.append("developer")
    if "architect" in text_lower: keywords.append("architect")
    if "lead" in text_lower: keywords.append("lead")
    if "senior" in text_lower: keywords.append("senior")
    if "junior" in text_lower: keywords.append("junior")
    return list(set(keywords))

def get_keyword_suggestions(resume_text: str, jd_text: str, top_n: int = 5) -> list[str]:
    """
    Generates keyword suggestions based on TF-IDF difference between JD and resume.
    """
    jd_tokens_for_tfidf = preprocess_text(jd_text, remove_stopwords=False)
    resume_tokens_for_checking = preprocess_text(resume_text, remove_stopwords=False)

    if not jd_tokens_for_tfidf:
        return []

    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    jd_tfidf_matrix = vectorizer.fit_transform([" ".join(jd_tokens_for_tfidf)])

    feature_names = vectorizer.get_feature_names_out()
    jd_tfidf_scores = jd_tfidf_matrix.toarray()[0]
    jd_word_scores = dict(zip(feature_names, jd_tfidf_scores))

    suggestions = []
    resume_unigrams = preprocess_text(resume_text, remove_stopwords=True)
    resume_bigrams = [ ' '.join(resume_unigrams[i:i+2]) for i in range(len(resume_unigrams)-1) ]
    resume_ngrams_set = set(resume_unigrams + resume_bigrams)
    
    unwanted_suggestions = set([
        'experience', 'responsibilities', 'building', 'looking', 'engineer', 'developer',
        'software', 'engineer software', 'software engineer', 'engineer developer', 
        'developer software', 'years', 'plus', 'related', 'field', 'strong', 'proficiency', 
        'understanding', 'knowledge', 'excellent', 'skills', 'data', 'science', 'team',
        'solutions', 'products', 'systems', 'design', 'develop', 'maintain', 'corp', 'company',
        'requirements', 'implement', 'optimize', 'cutting', 'edge', 'involved'
    ])
    
    sorted_jd_words = sorted(jd_word_scores.items(), key=lambda item: item[1], reverse=True)

    for word, score in sorted_jd_words:
        if word not in resume_ngrams_set and score > 0.05 and word not in unwanted_suggestions:
            suggestions.append(word)
        if len(suggestions) >= top_n:
            break
            
    return suggestions

# NEW FUNCTION: AI-powered Resume Optimization
async def optimize_resume_with_ai(masked_resume_content: str, jd_text: str, api_key: str) -> dict:
    """
    Uses a Generative AI model (Google Gemini) to optimize a resume for a given job description.
    Returns a dictionary with 'status' and 'message' or 'optimized_text'.
    """
    if not api_key:
        return {"status": "error", "message": "AI optimization unavailable (API Key missing)."}

    
    
    try:
        
        client = genai.Client()
    except Exception as e:
        return {"status": "error", "message": f"Failed to initialize Gemini client: {e}. Check API key configuration."}

    GEMINI_MODEL_NAME = 'gemini-2.5-flash' 

    # --- THIS IS THE MODIFIED PROMPT ---
    prompt_template = textwrap.dedent(f"""
    You are an expert resume writer. Your task is to rewrite the provided resume to better match the given job description.

    **CRITICAL INSTRUCTION: The resume text contains special placeholders for privacy (e.g., __PERSON_0__, __EMAIL_ADDRESS_1__, __PHONE_NUMBER_0__). YOU MUST PRESERVE THESE PLACEHOLDERS EXACTLY AS THEY ARE. Do NOT alter, remove, rephrase, or modify them in any way. Carry them over to the final output in their original form.**

    **Instructions:**
    1. Read both the resume and the job description carefully.
    2. Identify key skills, responsibilities, and experience required by the job description.
    3. Rewrite or add to the existing resume sections to align with the job description, while preserving the placeholders.
    4. Prioritize using the exact terminology and phrases from the job description where appropriate.
    5. Do NOT remove any existing relevant information from the resume, only rephrase or add.
    6. Ensure the optimized resume is well-formatted and easy to read.
    7. Return ONLY the full, optimized resume text, without any additional conversational text or explanations.

    **Original Resume (with PII placeholders):**
    ---
    {masked_resume_content}
    ---

    **Job Description:**
    ---
    {jd_text}
    ---

    **Optimized Resume:**
    """)


    try:
       
        response = await client.aio.models.generate_content( # <--- CORRECT ASYNC CALL
            model=GEMINI_MODEL_NAME,        
            contents=prompt_template,
            config=types.GenerateContentConfig( # <-- config as named argument
                candidate_count=1,
                temperature=0.7,
                top_p=0.9,
                top_k=40
            )
        )
        
        optimized_text = response.text
        return {"status": "success", "optimized_text": optimized_text}

    except Exception as e:
        
        error_message = f"Error calling Gemini API: {e}"
        print(error_message) 
        return {"status": "error", "message": error_message}


def check_mismatch_and_threshold(
    resume_text: str, 
    jd_text: str, 
    min_match_percentage: float = 0.40, # 40% threshold
    experience_diff_tolerance: int = 5, # e.g., if JD asks for 15, resume has 2, diff > 5 triggers warning
    role_mismatch_threshold_words: int = 2 # If 2 or more distinct core role words don't overlap, flag.
) -> dict:
    """
    Analyzes resume and JD for match percentage, experience, role mismatch, and keyword suggestions.
    """
    warnings = []
    
    similarity_score = calculate_semantic_similarity(resume_text, jd_text)
    match_percentage = round(similarity_score * 100, 2)

    resume_exp = extract_experience(resume_text)
    jd_exp = extract_experience(jd_text)

    if jd_exp > 0 and resume_exp > 0:
        if jd_exp > resume_exp + experience_diff_tolerance:
            warnings.append(
                f"Job requires approx. {jd_exp} years of experience, "
                f"but resume indicates {resume_exp} years. Significant experience gap detected."
            )
        elif resume_exp > jd_exp + experience_diff_tolerance:
            warnings.append(
                f"Your resume indicates {resume_exp} years of experience, "
                f"while the job requires approx. {jd_exp} years. "
                f"Consider tailoring to fit the advertised level."
            )
    elif jd_exp > 0 and resume_exp == 0:
        warnings.append(
            f"Job requires approx. {jd_exp} years of experience, "
            f"but no clear experience found in your resume."
        )

    resume_roles = set(extract_job_title_keywords(resume_text))
    jd_roles = set(extract_job_title_keywords(jd_text))

    if resume_roles and jd_roles:
        missing_in_resume = jd_roles - resume_roles
        missing_in_jd = resume_roles - jd_roles
        
        preprocessed_resume_for_roles = preprocess_text(resume_text, remove_stopwords=True)
        preprocessed_jd_for_roles = preprocess_text(jd_text, remove_stopwords=True)

        if len(missing_in_resume) >= role_mismatch_threshold_words and len(missing_in_jd) >= role_mismatch_threshold_words:
            if not any(word in " ".join(preprocessed_resume_for_roles) for word in jd_roles) or \
                not any(word in " ".join(preprocessed_jd_for_roles) for word in resume_roles):
                warnings.append(
                    f"Potential role mismatch. Your resume mentions roles like {', '.join(resume_roles)}, "
                    f"while the JD focuses on {', '.join(jd_roles)}. "
                )
    
    if similarity_score < min_match_percentage:
        warnings.append(
            f"The overall match is below the {min_match_percentage*100:.1f}% threshold. "
            f"Your resume might not be a good fit for this job description. "
        )

    suggestions = get_keyword_suggestions(resume_text, jd_text)
    if suggestions:
        warnings.append(f"Suggestions: Consider adding/emphasizing these keywords: {', '.join(suggestions)}.")
   

    return {
        "match_percentage": match_percentage,
        "warnings": warnings,
        "suggestions": suggestions
    }