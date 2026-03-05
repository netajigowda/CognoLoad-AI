# CognoLoad AI - Cognitive Load Prediction System

CognoLoad AI is a Machine Learning system designed to predict the mental effort (cognitive load) of students based on their real-time behavioral learning signals.

## 🚀 Overview
Unlike traditional assessment tools that only look at scores, CognoLoad AI analyzes interaction patterns—such as solving time, hint usage, and mouse movement—to identify when a learner is experiencing high mental strain.

## 🧠 Core Idea (Cognitive Load Theory)
The system classifies learner states into three levels:
- **Low**: The task is well-within the student's mastery.
- **Medium**: High engagement and optimal learning challenge.
- **High**: Potential cognitive overload, indicating the need for adaptive intervention.

## ⚙️ Technical Stack
- **Backend**: Python, FastAPI, Scikit-Learn (Random Forest, MLP, Gradient Boosting).
- **Frontend**: React, Vite, Recharts, Lucide-React.
- **Styling**: Premium Glassmorphism UI with Vanilla CSS.

## 📊 Features
- **Multimodal Data Generation**: Real-time synthetic dataset powered by behavioral heuristics.
- **Ensemble Intelligence**: Combines multiple ML models for robust predictions.
- **Explainable AI (XAI)**: Provides human-readable reasons for every prediction.
- **Interactive Dashboard**: Real-time sliders to simulate student behavior.

## 🛠️ Setup & Usage

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/netajigowda/CognoLoad-AI.git
cd netaji

# Install Python dependencies
pip install -r requirements.txt

# Install Frontend dependencies
cd dashboard
npm install
```

### 3. Run the System
**Start the Backend API:**
```bash
# From the root directory
python src/api.py
```

**Start the Dashboard:**
```bash
# From the dashboard directory
npm run dev
```

Visit `http://localhost:5173` to view the dashboard.

## 📈 Real-World Impact
This project is designed for integration into platforms like Coursera and Khan Academy to create truly adaptive learning environments that respond to a student's mental state in real-time.
