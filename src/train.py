import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def train_models():
    # Load data
    if not os.path.exists('data/cognitive_load_data.csv'):
        print("Data not found. Run data_engine.py first.")
        # Attempt to run it automatically
        from data_engine import generate_cognitive_load_data
        df = generate_cognitive_load_data(2000)
        os.makedirs('data', exist_ok=True)
        df.to_csv('data/cognitive_load_data.csv', index=False)
        print("Dataset generated automatically.")
    else:
        df = pd.read_csv('data/cognitive_load_data.csv')
        
    X = df.drop('cognitive_load', axis=1)
    y = df['cognitive_load']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Save scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(scaler, 'models/scaler.joblib')
    
    results = {}

    # 1. Random Forest
    print("\nTraining Random Forest...")
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train_scaled, y_train)
    rf_preds = rf.predict(X_test_scaled)
    results['Random Forest'] = accuracy_score(y_test, rf_preds)
    joblib.dump(rf, 'models/rf_model.joblib')
    print(classification_report(y_test, rf_preds))

    # 2. Gradient Boosting
    print("\nTraining Gradient Boosting...")
    gb = GradientBoostingClassifier(random_state=42)
    gb.fit(X_train_scaled, y_train)
    gb_preds = gb.predict(X_test_scaled)
    results['Gradient Boosting'] = accuracy_score(y_test, gb_preds)
    joblib.dump(gb, 'models/gb_model.joblib')
    print(classification_report(y_test, gb_preds))

    # 3. Neural Network (MLP)
    print("\nTraining Neural Network (MLP)...")
    mlp = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42)
    mlp.fit(X_train_scaled, y_train)
    mlp_preds = mlp.predict(X_test_scaled)
    results['Neural Network'] = accuracy_score(y_test, mlp_preds)
    joblib.dump(mlp, 'models/mlp_model.joblib')
    print(classification_report(y_test, mlp_preds))

    print("\nModel Comparison:")
    for model_name, acc in results.items():
        print(f"{model_name}: {acc:.4f}")

if __name__ == "__main__":
    train_models()
