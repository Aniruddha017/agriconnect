from fastapi import APIRouter, UploadFile, File
from pathlib import Path
from faster_whisper import WhisperModel
from myapp.routes.rag import get_answer  # your existing RAG + hybrid function

import os

router = APIRouter()

# ----------------- Load Whisper Model -----------------
whisper_model = WhisperModel("small")  # You can use "base", "medium", "large", etc.

@router.post("/voice_query")
async def voice_query(file: UploadFile = File(...)):
    """
    1️⃣ Upload audio file
    2️⃣ Convert to text
    3️⃣ Query RAG
    4️⃣ Return answer
    """
    temp_file = f"temp_{file.filename}"
    with open(temp_file, "wb") as f:
        f.write(await file.read())

    try:
        # 2️⃣ Transcribe with faster-whisper
        segments, _ = whisper_model.transcribe(temp_file)
        query_text = " ".join(segment.text for segment in segments).strip()

        if not query_text:
            return {"query": "", "answer": "Could not detect any speech in the audio."}

        # 3️⃣ Query RAG pipeline
        answer = get_answer(query_text)

        return {"query": query_text, "answer": answer}

    except Exception as e:
        return {"query": "", "answer": f"Error processing audio: {e}"}

    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)
