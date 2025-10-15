from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from chromadb import PersistentClient
import requests
import json
from collections import OrderedDict

router = APIRouter()

# -------- Settings ----------
PERSIST_DIR = "data/chroma_index"
COLLECTION_NAME = "my_docs"
TOP_K = 5
SIMILARITY_THRESHOLD = 0.25  # tweak as needed

# -------- Initialize Chroma and embedding model ----------
chroma_client = PersistentClient(path=PERSIST_DIR)
collection = chroma_client.get_collection(name=COLLECTION_NAME)
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# -------- Request Schema ----------
class QueryRequest(BaseModel):
    query: str

# -------- Pure greetings ----------
PURE_GREETINGS = ["hi", "hello", "hey", "good morning", "good evening", "greetings"]

# -------- Retrieval Function ----------
def retrieve_context(query: str, top_k: int = TOP_K) -> tuple[str, float]:
    query_embedding = embed_model.encode([query]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=top_k)
    chunks = results['documents'][0]  # documents for first query
    distances = results["distances"][0]  # distances for first query
    return "\n\n".join(chunks), max(distances)


# -------- Simple in-memory LRU cache for retrieved contexts ----------
# This caches (context, max_similarity) per exact query string so retrieval
# is only performed once for the same query. Adjust MAX_CACHE_SIZE as needed.
CONTEXT_CACHE = OrderedDict()
MAX_CACHE_SIZE = 200


def cache_context(query: str, context_tuple: tuple[str, float]):
    # Move-to-end to mark as most-recently-used
    if query in CONTEXT_CACHE:
        CONTEXT_CACHE.move_to_end(query)
    CONTEXT_CACHE[query] = context_tuple
    if len(CONTEXT_CACHE) > MAX_CACHE_SIZE:
        CONTEXT_CACHE.popitem(last=False)


# -------- RAG Core Function (non-streaming fallback) ----------
def get_answer(query_text: str) -> str:
    query_text = query_text.strip()

    # Step 1: Check for greetings
    if query_text.lower() in PURE_GREETINGS:
        return "Hello! How can I help you today?"

    # Step 2: Retrieve context (cached)
    if query_text in CONTEXT_CACHE:
        context, max_similarity = CONTEXT_CACHE[query_text]
    else:
        context, max_similarity = retrieve_context(query_text, top_k=TOP_K)
        cache_context(query_text, (context, max_similarity))

    # Step 3: Check similarity threshold
    if max_similarity < SIMILARITY_THRESHOLD:
        return "I can help answer questions about the documents. Could you ask something related?"

    # Step 4: Build prompt
    prompt = (
        f"Answer the following question based on the context within 100 to 200 words and do not tell me your reasoning.\n\n"
        f"Context:\n{context}\n\n"
        f"Question:\n{query_text}"
    )

    # Step 5: Call Ollama API (non-streaming)
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral:7b",
                "prompt": prompt,
                "stream": False
            }
        )
        result = response.json()
        return result.get("response", "Sorry, no answer returned from Ollama.")
    except Exception as e:
        return f"Error calling Ollama: {e}"

# -------- Streaming version ----------
@router.post("/rag_query_stream")
def rag_query_stream(request: QueryRequest):
    query_text = request.query.strip()

    # Step 1: Greetings
    if query_text.lower() in PURE_GREETINGS:
        return StreamingResponse(iter([f"Hello! How can I help you today?"]), media_type="text/plain")

    # Step 2: Retrieve context (cached)
    if query_text in CONTEXT_CACHE:
        context, max_similarity = CONTEXT_CACHE[query_text]
    else:
        context, max_similarity = retrieve_context(query_text, top_k=TOP_K)
        cache_context(query_text, (context, max_similarity))

    # Step 3: Similarity check
    if max_similarity < SIMILARITY_THRESHOLD:
        return StreamingResponse(iter(["I can help answer questions about the documents. Could you ask something related?"]),
                                 media_type="text/plain")

    # Step 4: Build prompt
    prompt = (
        f"Answer the following question based on the context within 100 to 200 words\n\n"
        f"Context:\n{context}\n\n"
        f"Question:\n{query_text}"
    )

    # Step 5: Call Ollama API with stream=True
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral:7b",
                "prompt": prompt,
                "stream": True
            },
            stream=True
        )

        # Generator to yield chunks as they arrive
        def event_stream():
            for line in response.iter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        chunk = data.get("response", "")
                        if chunk:
                            yield chunk
                    except json.JSONDecodeError:
                        continue

        return StreamingResponse(event_stream(), media_type="text/plain")

    except Exception as e:
        return StreamingResponse(iter([f"Error calling Ollama: {e}"]), media_type="text/plain")
