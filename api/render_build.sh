#!/usr/bin/env bash
# api/render_build.sh

echo "--- Installing Python dependencies ---"
pip install -r requirements.txt

echo "--- Setting up NLTK data directory ---"
# NLTK data will be downloaded into a folder INSIDE the 'api' directory
NLTK_LOCAL_DATA_PATH="./nltk_data" # Relative to the 'api/' folder
mkdir -p "$NLTK_LOCAL_DATA_PATH"

echo "--- Downloading NLTK data ---"
python -c "import nltk; nltk.download('stopwords', download_dir='$NLTK_LOCAL_DATA_PATH'); nltk.download('punkt', download_dir='$NLTK_LOCAL_DATA_PATH'); nltk.download('punkt_tab', download_dir='$NLTK_LOCAL_DATA_PATH')"

echo "Downloading spaCy NLP model (small version)..."
python -m spacy download en_core_web_sm

echo "Build process complete."