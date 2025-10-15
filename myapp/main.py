from fastapi import FastAPI
from myapp.routes import rag, voice
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="My FastAPI RAG App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "🚀 FastAPI backend is running!"}

# Include RAG routes
app.include_router(rag.router, prefix="/api")

#Voice route
app.include_router(voice.router, prefix="/api")
