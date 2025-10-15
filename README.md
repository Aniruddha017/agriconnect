# AgriConnect

## Project overview
AgriConnect is a small full-stack project that provides:
- A FastAPI backend with RAG (Retrieval-Augmented Generation) endpoints and a model prediction endpoint.
- A React + Vite frontend in `frontend/Agriconnect`.
- A simple in-memory context cache so document retrieval is performed once per exact query (per process).

This README explains how to run the backend and frontend, where to place your ML model, how to call endpoints (including streaming `/api/rag_query_stream`), and common troubleshooting tips.

---

## Requirements
- Python 3.10+ (recommended)
- Node.js (16+ recommended) and npm
- Backend Python dependencies defined in `requirements.txt` (install with pip)
- (Optional) Ollama or your LLM server listening as expected (the RAG route calls `http://localhost:11434/api/generate` in current code)

---

## Project layout (important files/dirs)
- `myapp/` — FastAPI backend
  - `myapp/main.py` — FastAPI app and router includes
  - `myapp/routes/rag.py` — RAG retrieval + streaming route
  - `myapp/routes/predict.py` — model prediction route (added)
- `model1.pkl` — your ML model file (see below where to put it)
- `frontend/Agriconnect/` — React frontend (Vite)

---

## Where to place your model
The prediction route expects `model1.pkl` at the project root relative to the code:
- Path used in code: `os.path.join(os.path.dirname(__file__), '..', '..', 'model1.pkl')`
- So place `model1.pkl` at:
  ```
  <repo-root>/model1.pkl
  ```
  e.g.
  `C:\Users\shukl\Desktop\farmer\model1.pkl`

If your model lives elsewhere, update the `MODEL_PATH` in `myapp/routes/predict.py`.

---

## Backend: setup & run (PowerShell)
1. Activate your Python virtual environment (if you have one). If the project already includes a venv under `myapp/myvenv` (as in your workspace):
   ```powershell
   .\myapp\myvenv\Scripts\Activate.ps1
   ```

2. Install dependencies (if needed):
   ```powershell
   pip install -r requirements.txt
   ```

3. Start FastAPI with uvicorn:
   ```powershell
   uvicorn myapp.main:app --reload --host 0.0.0.0 --port 8000
   ```
   - The app root (`GET /`) should return: `{"message":"🚀 FastAPI backend is running!"}`

---

## Frontend: setup & run (PowerShell)
1. Open a second terminal and go to the frontend folder:
   ```powershell
   cd frontend\Agriconnect
   ```

2. Install Node dependencies (first-time only):
   ```powershell
   npm install
   ```

3. Start the dev server:
   ```powershell
   npm run dev
   ```
   - Vite will typically run on `http://localhost:5173` (or another port shown in terminal).

Optional: If you want to avoid cross-origin requests in dev, configure a proxy (example below).

---

## Vite proxy (optional, recommended for local dev)
Add or update `vite.config.js` to proxy `/api` to your FastAPI backend:
```js
// vite.config.js (snippet)
export default {
  // ...existing config
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
}
```
If you use this, the frontend can request `/api/...` rather than `http://localhost:8000/api/...`.

---

## API endpoints

1. Health / root
- GET `/`
- Returns JSON like `{"message":"🚀 FastAPI backend is running!"}`

2. Predict (model)
- POST `/api/predict`
- Request JSON:
  ```json
  { "features": [1.2, 3.4, 5.6] }
  ```
- Response JSON:
  ```json
  { "prediction": <model_output> }
  ```
- Example (PowerShell):
  ```powershell
  Invoke-RestMethod -Uri http://localhost:8000/api/predict -Method Post -Body (@{features=@(1.2,3.4,5.6)} | ConvertTo-Json) -ContentType 'application/json'
  ```

3. RAG streaming endpoint
- POST `/api/rag_query_stream`
- Request JSON:
  ```json
  { "query": "your question here" }
  ```
- This endpoint returns an HTTP streaming response (text/plain) with partial text chunks from the LLM. The frontend listens to the stream and appends data as it arrives.
- Example test via Python (streams and prints chunks):
  ```powershell
  python - <<'PY'
  import requests
  r = requests.post("http://localhost:8000/api/rag_query_stream", json={"query":"What is in document X?"}, stream=True)
  for chunk in r.iter_content(chunk_size=None):
      if chunk:
          print(chunk.decode(), end="", flush=True)
  PY
  ```

---

## RAG context caching
- The backend caches retrieved context per exact query string (after `.strip()`).
- Cache type: in-memory LRU (OrderedDict). Configured in `myapp/routes/rag.py`:
  - `MAX_CACHE_SIZE = 200` (adjustable)
- Behavior:
  - First time a given exact query is processed: the code computes embeddings and queries Chroma to retrieve context (this can be slow).
  - Subsequent identical queries reuse the cached context (faster).
  - Cache is non-persistent — cleared on server restart.
- If you want the cache to be normalized (ignore case/whitespace) or to have TTL, see "Possible improvements" below.

---

## Troubleshooting & common issues

1. 404 on `/api/rag_query_stream`
- Ensure backend is running and the frontend is calling the correct path: `/api/rag_query_stream` (router is included with `prefix="/api"` in `myapp/main.py`).
- If frontend tries `/chatbot/rag_query_stream` or another path, change it to `http://localhost:8000/api/rag_query_stream` or configure a proxy as above.

2. CORS errors
- `myapp/main.py` config currently allows all origins (`allow_origins=["*"]`). If you have custom restrictions, make sure `allow_origins` includes your frontend origin (e.g. `http://localhost:5173`).

3. Streaming not showing content
- Confirm the Ollama / LLM server (or other LLM endpoint) you use supports streaming newline-delimited JSON lines; `rag.py` expects JSON per-line with a `response` field (or text chunks).
- Check uvicorn logs for exceptions.
- For debugging, try a simple non-stream response first (`get_answer()` returns non-streaming fallback).

4. Model file not found for `/api/predict`
- Put `model1.pkl` at repo root: `<repo-root>/model1.pkl`.
- If path differs, update `MODEL_PATH` in `myapp/routes/predict.py`.
- Confirm that the model object implements `.predict()` which accepts a 2D array-like input.

5. Ollama or external LLM connection errors
- `rag.py` posts to `http://localhost:11434/api/generate` by default. Confirm the LLM server is running on that host+port.

6. Submodule appears on GitHub
- If GitHub shows `Agriconnect` as a submodule, the index contains a gitlink. To convert to a normal folder (if that's what you want):
  ```powershell
  # From repo root
  git rm --cached Agriconnect
  # If nested .git exists (a true nested repo), remove it before adding:
  Remove-Item -Recurse -Force .\Agriconnect\.git
  git add Agriconnect
  git commit -m "Convert Agriconnect from submodule to normal folder"
  git push
  ```

---

## Quick test examples (PowerShell)

- Health:
  ```powershell
  Invoke-RestMethod -Uri http://localhost:8000/ -Method Get
  ```

- Predict:
  ```powershell
  Invoke-RestMethod -Uri http://localhost:8000/api/predict -Method Post -Body (@{features=@(1.2,3.4)} | ConvertTo-Json) -ContentType 'application/json'
  ```

- RAG streaming (measure and see speed difference between first and second call for caching):
  ```powershell
  Measure-Command { Invoke-RestMethod -Uri http://localhost:8000/api/rag_query_stream -Method Post -Body (@{query='what is in doc x'} | ConvertTo-Json) -ContentType 'application/json' }
  # repeat to observe cache speedup
  ```

---

## Possible improvements (optional)
- Normalize cache key (lowercase, trim extra whitespace) to improve cache hits for similar queries.
- Add TTL (expire entries after N minutes).
- Replace in-memory cache with Redis for multi-process/multi-instance deployments.
- Add request logging and cache hit/miss metrics.
- Add authentication to sensitive endpoints.
- Support batch predictions or named features in `predict` endpoint.

---

## Contact / Notes
- Contact me at my email if you face any issuesm or you can fix some bugs here(cause there are some:)
---
