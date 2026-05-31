import joblib
import os
import numpy as np

MODEL_PATH = "hallucination_classifier.pkl"

def load_classifier():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    return None

def predict_hallucination(eigenscore, dispersion):
    """
    Returns the probability of hallucination.
    """
    clf = load_classifier()
    if clf is None:
        # Fallback heuristic if not trained
        # High eigenscore -> Low hallucination (e.g. eigenscore=0.9 -> hallucination=0.1)
        # High dispersion -> High hallucination
        risk = (1.0 - eigenscore) * 0.5 + dispersion * 0.5
        risk = max(0.0, min(1.0, risk))
        return float(risk)
        
    features = np.array([[eigenscore, dispersion]])
    prob = clf.predict_proba(features)[0][1] # Probability of class 1 (Hallucination)
    return float(prob)
