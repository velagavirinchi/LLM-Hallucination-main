import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Global model and tokenizer instances
model = None
tokenizer = None
device = "cpu"

def load_model():
    global model, tokenizer, device
    model_name = "Qwen/Qwen1.5-0.5B-Chat"
    print(f"Loading model {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    # Set output_hidden_states=True to get internal representations
    model = AutoModelForCausalLM.from_pretrained(model_name, output_hidden_states=True)
    model.to(device)
    model.eval()
    print("Model loaded successfully.")

def generate_responses(prompt: str, num_generations: int = 3, temperature: float = 0.7, top_k: int = 50, top_p: float = 0.9):
    """
    Generates multiple responses for a given prompt and extracts their hidden states.
    Returns a list of (generated_text, hidden_states) tuples.
    """
    global model, tokenizer, device
    if model is None or tokenizer is None:
        load_model()
        
    messages = [
        {"role": "system", "content": "You are a helpful assistant. Provide concise and accurate answers."},
        {"role": "user", "content": prompt}
    ]
    formatted_prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(formatted_prompt, return_tensors="pt").to(device)
    
    attention_mask = inputs.input_ids.ne(tokenizer.pad_token_id).long()
    
    results = []
    
    with torch.no_grad():
        for _ in range(num_generations):
            outputs = model.generate(
                inputs.input_ids,
                attention_mask=attention_mask,
                max_new_tokens=256,
                temperature=temperature,
                top_k=top_k,
                top_p=top_p,
                do_sample=True,
                return_dict_in_generate=True,
                output_hidden_states=True,
                pad_token_id=tokenizer.eos_token_id
            )
            
            # generated sequence
            seq = outputs.sequences[0]
            generated_text = tokenizer.decode(seq[inputs.input_ids.shape[1]:], skip_special_tokens=True)
            
            # hidden states: tuple of tuple of tensors. 
            last_layer_hidden_states = []
            for token_hidden_states in outputs.hidden_states:
                last_layer_hidden_states.append(token_hidden_states[-1][0, -1, :])
                
            if len(last_layer_hidden_states) > 0:
                stacked_hidden_states = torch.stack(last_layer_hidden_states)
            else:
                hidden_size = getattr(model.config, "hidden_size", getattr(model.config, "n_embd", 768))
                stacked_hidden_states = torch.empty((0, hidden_size))
                
            results.append({
                "text": generated_text,
                "hidden_states": stacked_hidden_states.to(torch.float32).cpu().numpy()
            })
            
    return results
