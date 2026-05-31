import numpy as np
from sklearn.decomposition import PCA

def calculate_eigenscore(hidden_states_list):
    """
    Calculates the EigenScore across multiple generations.
    hidden_states_list: list of numpy arrays, each of shape (seq_len, hidden_size)
    We will average the hidden states over the sequence length for each generation to get a fixed-size vector,
    then compute PCA over the set of generations.
    """
    if len(hidden_states_list) < 2:
        return 1.0 # If only 1 generation, no variance
        
    # Average over sequence length to get sentence-level embedding
    # Shape: (num_generations, hidden_size)
    sentence_embeddings = []
    for hs in hidden_states_list:
        if hs.shape[0] > 0:
            sentence_embeddings.append(np.mean(hs, axis=0))
        else:
            # Fallback if empty sequence generated
            sentence_embeddings.append(np.zeros(hs.shape[1]))
            
    sentence_embeddings = np.array(sentence_embeddings)
    
    # Compute PCA
    # EigenScore can be defined as the explained variance ratio of the first principal component.
    # High EigenScore (close to 1) means all generations are very similar (1 PC explains everything) -> Low hallucination.
    # Low EigenScore means generations are diverse/scattered -> High hallucination risk.
    n_components = min(len(sentence_embeddings), sentence_embeddings.shape[1])
    if n_components < 2:
        return 1.0
        
    pca = PCA(n_components=n_components)
    pca.fit(sentence_embeddings)
    
    eigenscore = pca.explained_variance_ratio_[0]
    return float(np.nan_to_num(eigenscore, nan=1.0))

def calculate_dispersion(hidden_states_list):
    """
    Calculates a dispersion metric (proxy for entropy) based on the pairwise cosine distances
    of the sentence embeddings.
    Higher dispersion -> higher hallucination risk.
    """
    if len(hidden_states_list) < 2:
        return 0.0
        
    sentence_embeddings = []
    for hs in hidden_states_list:
        if hs.shape[0] > 0:
            sentence_embeddings.append(np.mean(hs, axis=0))
        else:
            sentence_embeddings.append(np.zeros(hs.shape[1] if len(hidden_states_list) > 0 and len(hidden_states_list[0].shape) > 1 else 768))
            
    sentence_embeddings = np.array(sentence_embeddings)
    
    # Normalize
    norms = np.linalg.norm(sentence_embeddings, axis=1, keepdims=True)
    # Avoid division by zero
    norms[norms == 0] = 1
    normalized_embeddings = sentence_embeddings / norms
    
    # Compute pairwise cosine similarity
    similarity_matrix = np.dot(normalized_embeddings, normalized_embeddings.T)
    
    # Average off-diagonal elements
    n = len(sentence_embeddings)
    mask = np.ones((n, n), dtype=bool)
    np.fill_diagonal(mask, 0)
    
    if n > 1:
        avg_similarity = np.mean(similarity_matrix[mask])
    else:
        avg_similarity = 1.0
    
    # Dispersion = 1 - avg_similarity
    dispersion = 1.0 - avg_similarity
    return float(np.nan_to_num(max(0.0, dispersion), nan=0.0))
