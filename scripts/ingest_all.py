import os
import pdfplumber
import tiktoken
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

# -------- SETTINGS --------
RAW_DIR = "data/raw"
PERSIST_DIR = "data/chroma_index"
COLLECTION_NAME = "my_docs"
CHUNK_SIZE = 500          # approx tokens per chunk
CHUNK_OVERLAP = 50        # token overlap

# -------- Initialize ChromaDB (v1.x) --------
chroma_client = PersistentClient(path=PERSIST_DIR)
collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)

# -------- Embedding Model --------
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# -------- Tokenizer --------
enc = tiktoken.get_encoding("cl100k_base")


def extract_text_from_file(filepath: str) -> str:
    if filepath.endswith(".txt"):
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    elif filepath.endswith(".pdf"):
        text = ""
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    else:
        return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP):
    tokens = enc.encode(text)
    chunks = []
    start = 0
    while start < len(tokens):
        end = start + chunk_size
        chunk_tokens = tokens[start:end]
        chunk_text = enc.decode(chunk_tokens)
        chunks.append(chunk_text)
        start += chunk_size - overlap
    return chunks


def ingest_file(filepath: str):
    filename = os.path.basename(filepath)
    text = extract_text_from_file(filepath)
    if not text.strip():
        print(f"⚠️  No text found in {filename}")
        return

    chunks = chunk_text(text)
    print(f"📄 {filename}: {len(chunks)} chunks")

    embeddings = embed_model.encode(chunks, show_progress_bar=False).tolist()

    # Assign unique IDs
    ids = [f"{filename}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"source": filename, "chunk": i} for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )


def main():
    files = [os.path.join(RAW_DIR, f) for f in os.listdir(RAW_DIR)
             if f.endswith(".pdf") or f.endswith(".txt")]
    if not files:
        print(f"❌ No PDF or TXT files found in {RAW_DIR}")
        return

    for fpath in tqdm(files, desc="Ingesting files"):
        ingest_file(fpath)

    # Persist the collection
    print("✅ Ingestion complete. Index persisted at", PERSIST_DIR)


if __name__ == "__main__":
    main()
