# api/services/privacy_service.py
from presidio_analyzer import AnalyzerEngine
from presidio_analyzer.nlp_engine import NlpEngineProvider

# --- Engine Configuration (This part is correct and remains the same) ---
config = {"nlp_engine_name": "spacy", "models": [{"lang_code": "en", "model_name": "en_core_web_md"}]}
provider = NlpEngineProvider(nlp_configuration=config)
nlp_engine = provider.create_engine()
analyzer = AnalyzerEngine(nlp_engine=nlp_engine, supported_languages=["en"])

def _create_placeholder(entity_type: str, index: int) -> str:
    return f"__{entity_type.replace(' ', '_')}_{index}__"

def mask_text(text: str) -> tuple[str, dict]:
    """
    Masks PII in the input text, correctly handling and filtering overlapping entities.
    """
    try:
        analyzer_results = analyzer.analyze(text=text, language='en')

        # --- START OF NEW FILTERING LOGIC ---
        # This is the crucial step to remove smaller entities contained within larger ones.
        # For example, removing a 'URL' if it's part of a larger 'EMAIL_ADDRESS'.
        filtered_results = []
        for res_i in analyzer_results:
            is_contained = False
            for res_j in analyzer_results:
                if res_i == res_j:
                    continue
                # Check if res_j is a superset of res_i
                if res_j.start <= res_i.start and res_j.end >= res_i.end:
                    is_contained = True
                    break
            if not is_contained:
                filtered_results.append(res_i)
        # --- END OF NEW FILTERING LOGIC ---

        # Now, proceed with the string building logic using the CLEAN, filtered list.
        sorted_results = sorted(filtered_results, key=lambda x: x.start)
        
        pii_map = {}
        masked_text = ""
        last_end = 0

        for i, result in enumerate(sorted_results):
            placeholder = _create_placeholder(result.entity_type, i)
            pii_map[placeholder] = text[result.start:result.end]
            
            masked_text += text[last_end:result.start]
            masked_text += placeholder
            last_end = result.end
            
        masked_text += text[last_end:]

        return masked_text, pii_map
        
    except Exception as e:
        print(f"Error during PII masking: {e}")
        return text, {}


def unmask_text(masked_text: str, pii_map: dict) -> str:
    """
    This function is already correct and does not need to be changed.
    """
    if not pii_map:
        return masked_text
    unmasked_text = masked_text
    for placeholder, original_value in pii_map.items():
        unmasked_text = unmasked_text.replace(placeholder, original_value)
    return unmasked_text
