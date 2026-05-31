import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from datasets import load_dataset
from model_utils import generate_responses
from feature_extraction import calculate_eigenscore, calculate_dispersion
import tqdm

def train_dummy_classifier():
    print("Loading real datasets for training (TruthfulQA & SQuAD)...")
    
    # TruthfulQA: Often triggers hallucinations/untruthful answers
    truthful_qa = load_dataset("truthful_qa", "generation", split="validation", trust_remote_code=True)
    # SQuAD: Fact-based contextually grounded questions (usually higher confidence)
    squad = load_dataset("squad", split="train", trust_remote_code=True)

    X = []
    y = []

    # Process SQuAD (Good examples - Label 0)
    print("Processing SQuAD (Target: Factual/Stable)...")
    for i in tqdm.tqdm(range(5)):
        prompt = squad[i]["question"]
        try:
            generations = generate_responses(prompt, num_generations=3)
            hs_list = [g["hidden_states"] for g in generations]
            eigenscore = calculate_eigenscore(hs_list)
            dispersion = calculate_dispersion(hs_list)
            X.append([eigenscore, dispersion])
            y.append(0)
        except:
            continue

    # Process TruthfulQA (Potential Hallucination examples - Label 1)
    print("Processing TruthfulQA (Target: Uncertain/Hallucination)...")
    for i in tqdm.tqdm(range(5)):
        prompt = truthful_qa[i]["question"]
        try:
            generations = generate_responses(prompt, num_generations=3)
            hs_list = [g["hidden_states"] for g in generations]
            eigenscore = calculate_eigenscore(hs_list)
            dispersion = calculate_dispersion(hs_list)
            X.append([eigenscore, dispersion])
            y.append(1)
        except:
            continue

    X = np.array(X)
    y = np.array(y)
    
    # Clip values to realistic ranges [0, 1]
    X = np.clip(X, 0, 1)
    
    print(f"Training on {len(X)} real-world samples...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)
    
    joblib.dump(clf, "hallucination_classifier.pkl")
    print("Classifier trained on TruthfulQA/SQuAD and saved as hallucination_classifier.pkl")

if __name__ == "__main__":
    train_dummy_classifier()
