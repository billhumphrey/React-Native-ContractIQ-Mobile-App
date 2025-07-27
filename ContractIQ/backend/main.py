# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import docx2txt
import openai
import os

app = FastAPI()

# Allow requests from your mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set your app IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_contract(file: UploadFile = File(...)):
    content = await file.read()
    filename = f"temp/{file.filename}"

    with open(filename, "wb") as f:
        f.write(content)

    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(filename)
    elif file.filename.endswith(".docx"):
        text = docx2txt.process(filename)
    else:
        return {"error": "Unsupported file type"}

    response = call_openai_contract_analysis(text)

    return {"clauses": response}


# ✅ Helper function: Extract PDF text
def extract_text_from_pdf(path: str) -> str:
    import fitz  # PyMuPDF
    text = ""
    doc = fitz.open(path)
    for page in doc:
        text += page.get_text()
    return text

# ✅ Helper function: Analyze text using OpenAI
def call_openai_contract_analysis(text: str):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    prompt = f"""
    Analyze the following contract and extract important clauses.
    For each clause, return:
    - title
    - explanation
    - risk (Low, Medium, High)

    Contract:
    {text[:3000]}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    content = response.choices[0].message.content

    # Return as sample structure
    return [
        {
            "title": "Sample Clause",
            "explanation": content,
            "risk": "Medium"
        }
    ]
