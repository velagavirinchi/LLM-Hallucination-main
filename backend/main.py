import sys
import io

# Force UTF-8 for standard output/error to prevent UnicodeEncodeError on Windows
try:
    if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception as e:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import numpy as np

from model_utils import generate_responses, load_model
from feature_extraction import calculate_eigenscore, calculate_dispersion
from classifier import predict_hallucination
from ddgs import DDGS

def get_web_context(query: str, max_results: int = 3) -> str:
    try:
        results = DDGS().text(query, max_results=max_results)
        if not results:
            return ""
        context = "Current Web Information:\n"
        for r in results:
            context += f"- {r.get('body', '')}\n"
        return context
    except Exception as e:
        print(f"Web search error: {e}")
        return ""

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    prompt: str
    num_generations: int = 3
    temperature: float = 0.7
    top_k: int = 50
    top_p: float = 0.9

@app.on_event("startup")
async def startup_event():
    # Train dummy classifier if not exists
    if not os.path.exists("hallucination_classifier.pkl"):
        from train_model import train_dummy_classifier
        train_dummy_classifier()
        
    # Pre-load model
    load_model()

@app.post("/chat")
async def chat(request: ChatRequest):
    print(f"Received request: {request}")
    
    # 1. Fetch live web context
    web_context = get_web_context(request.prompt)
    
    # 2. Augment prompt
    if web_context:
        augmented_prompt = f"Use the following current information to answer the question accurately.\n\n{web_context}\nQuestion: {request.prompt}"
    else:
        augmented_prompt = request.prompt
        
    print(f"Augmented prompt: {augmented_prompt}")
    
    # Generate multiple responses and extract hidden states
    generations = generate_responses(
        prompt=augmented_prompt,
        num_generations=request.num_generations,
        temperature=request.temperature,
        top_k=request.top_k,
        top_p=request.top_p
    )
    
    if not generations:
        return {"error": "Failed to generate responses."}
        
    # Extract hidden states for metrics
    hidden_states_list = [g["hidden_states"] for g in generations]
    
    eigenscore = calculate_eigenscore(hidden_states_list)
    dispersion = calculate_dispersion(hidden_states_list)
    
    hallucination_risk = predict_hallucination(eigenscore, dispersion)
    
    # Calculate per-generation confidence (similarity to the mean)
    sentence_embeddings = []
    for g in generations:
        hs = g["hidden_states"]
        if hs.shape[0] > 0:
            sentence_embeddings.append(np.mean(hs, axis=0))
        else:
            sentence_embeddings.append(np.zeros(hs.shape[1] if len(generations) > 0 else 768))
    
    sentence_embeddings = np.array(sentence_embeddings)
    mean_embedding = np.mean(sentence_embeddings, axis=0)
    
    # Cosine similarity to mean
    def cosine_sim(a, b):
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return np.dot(a, b) / (norm_a * norm_b)
    
    # Calculate raw similarities first
    raw_similarities = []
    for emb in sentence_embeddings:
        raw_similarities.append(cosine_sim(emb, mean_embedding))
        
    # Find the best generation (medoid) using raw similarity to mean embedding
    best_index = int(np.argmax(raw_similarities))
    main_response_text = generations[best_index]["text"]
    
    # Construct generation metrics with calibrated/scaled confidence scores
    generation_metrics = []
    for sim in raw_similarities:
        # Scale [0.80, 1.0] to [0.0, 1.0] to compensate for anisotropy
        scaled_sim = (sim - 0.80) / 0.20
        confidence = float(np.clip(scaled_sim, 0.0, 1.0))
        generation_metrics.append({
            "confidence": confidence,
            "entropy_contribution": float(np.nan_to_num(1.0 - sim, nan=1.0))
        })

    # Rearrange generations and metrics to put the best one (consensus) at index 0
    ordered_generations = [generations[best_index]["text"]] + [
        g["text"] for idx, g in enumerate(generations) if idx != best_index
    ]
    ordered_metrics = [generation_metrics[best_index]] + [
        m for idx, m in enumerate(generation_metrics) if idx != best_index
    ]

    return {
        "response": main_response_text,
        "metrics": {
            "eigenscore": float(np.nan_to_num(eigenscore, nan=1.0)),
            "entropy_dispersion": float(np.nan_to_num(dispersion, nan=0.0)),
            "hallucination_risk": float(np.nan_to_num(hallucination_risk, nan=0.0))
        },
        "all_generations": ordered_generations,
        "generation_metrics": ordered_metrics
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
