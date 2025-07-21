# api/test_privacy.py
from services import privacy_service

sample_resume = """
John Doe
123-456-7890 | john.doe.email@example.com | San Francisco, CA | linkedin.com/in/johndoe

Summary:
A highly motivated software engineer. My name is John and I live in California.

Experience:
Lead Developer at Innovate Corp.

Education:
B.S. in Computer Science | State University, Anytown, CA
Graduated: May 2023
"""


def run_test():
    print("--- Original Text ---")
    print(sample_resume)
    print("\n" + "="*40 + "\n")

    # 1. Test the masking function
    print("--- Testing Masking ---")
    masked_text, pii_map = privacy_service.mask_text(sample_resume)
    
    print("Masked Text:")
    print(masked_text)
    print("\nPII Map (for unmasking):")
    print(pii_map)
    print("\n" + "="*40 + "\n")
    
    # Assert that key PII was removed from the text
    assert "John Doe" not in masked_text
    assert "123-456-7890" not in masked_text
    assert "john.doe.email@example.com" not in masked_text
    print("✅ SUCCESS: Key PII strings removed from masked text.")

    # 2. Test the unmasking function
    print("--- Testing Unmasking ---")
    unmasked_text = privacy_service.unmask_text(masked_text, pii_map)
    
    print("Unmasked Text:")
    print(unmasked_text)
    print("\n" + "="*40 + "\n")

    # 3. Verify that the unmasked text matches the original
    print("--- Verification ---")
    # Using strip() to handle any potential whitespace differences at the ends
    if unmasked_text.strip() == sample_resume.strip():
        print("✅✅✅ SUCCESS: Unmasked text perfectly matches the original text.")
    else:
        print("❌ FAILED: Unmasked text does NOT match the original.")
        # For debugging, let's see where they differ
        print("\nOriginal vs Unmasked Diff:")
        import difflib
        diff = difflib.unified_diff(
            sample_resume.strip().splitlines(keepends=True),
            unmasked_text.strip().splitlines(keepends=True),
            fromfile='original',
            tofile='unmasked',
        )
        for line in diff:
            print(line, end="")

if __name__ == "__main__":
    run_test()
