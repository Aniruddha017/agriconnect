from fastapi import FastAPI
from myapp.routes import rag, voice

app = FastAPI(title="My FastAPI RAG App")

@app.get("/")
def read_root():
    return {"message": "🚀 FastAPI backend is running!"}

# Include RAG routes
app.include_router(rag.router, prefix="/api")

#Voice route
app.include_router(voice.router, prefix="/api")
