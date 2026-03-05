import pandas as pd
import numpy as np
import os

def generate_cognitive_load_data(n_samples=1000, seed=42):
    np.random.seed(seed)
    
    # Features
    # difficulty: 0 (Easy), 1 (Medium), 2 (Hard)
    difficulty = np.random.randint(0, 3, n_samples)
    
    # Base parameters influenced by difficulty
    # Higher difficulty generally leads to more time, attempts, etc.
    time_taken = 30 + difficulty * 60 + np.random.normal(0, 20, n_samples)
    time_taken = np.maximum(time_taken, 10) # Min time 10s
    
    attempts = 1 + difficulty + np.random.randint(0, 3, n_samples)
    
    hints_used = (difficulty * 1.5 + np.random.normal(0, 1, n_samples)).astype(int)
    hints_used = np.clip(hints_used, 0, 5)
    
    pause_duration = 5 + difficulty * 10 + np.random.normal(0, 5, n_samples)
    pause_duration = np.maximum(pause_duration, 1)
    
    typing_speed = 40 - difficulty * 10 + np.random.normal(0, 5, n_samples)
    typing_speed = np.maximum(typing_speed, 5)
    
    mouse_movement = 100 + difficulty * 200 + np.random.normal(0, 100, n_samples)
    mouse_movement = np.maximum(mouse_movement, 50)
    
    # Calculate a synthetic "Cognitive Load Score" to derive labels
    # Weights for features
    load_score = (
        0.2 * (difficulty / 2) +
        0.2 * (time_taken / 300) +
        0.15 * (attempts / 5) +
        0.15 * (hints_used / 5) +
        0.1 * (pause_duration / 60) +
        -0.1 * (typing_speed / 60) +  # Higher speed might mean lower load/fluency
        0.1 * (mouse_movement / 1000)
    )
    
    # Add some noise to the score
    load_score += np.random.normal(0, 0.05, n_samples)
    
    # Labels: 0 (Low), 1 (Medium), 2 (High)
    labels = pd.cut(load_score, bins=[-np.inf, 0.3, 0.6, np.inf], labels=[0, 1, 2]).astype(int)
    
    data = pd.DataFrame({
        'problem_difficulty': difficulty,
        'time_taken': time_taken,
        'attempts': attempts,
        'hints_used': hints_used,
        'pause_duration': pause_duration,
        'typing_speed': typing_speed,
        'mouse_movement': mouse_movement,
        'cognitive_load': labels
    })
    
    return data

if __name__ == "__main__":
    df = generate_cognitive_load_data(2000)
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/cognitive_load_data.csv', index=False)
    print(f"Generated {len(df)} samples and saved to data/cognitive_load_data.csv")
    print(df.head())
    print("\nClass distribution:")
    print(df['cognitive_load'].value_counts(normalize=True))
