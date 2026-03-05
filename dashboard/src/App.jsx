import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Brain,
  Clock,
  RotateCcw,
  HelpCircle,
  Pause,
  Keyboard,
  MousePointer2,
  Activity,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

function App() {
  const [formData, setFormData] = useState({
    problem_difficulty: 1,
    time_taken: 120,
    attempts: 2,
    hints_used: 1,
    pause_duration: 15,
    typing_speed: 35,
    mouse_movement: 450
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://cognoload-ai.onrender.com/predict', formData);
      setPrediction(response.data);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to connect to the backend API. Please make sure it's running.");
    } finally {
      setLoading(false);
    }
  };

  const radarData = [
    { subject: 'Difficulty', A: (formData.problem_difficulty + 1) * 33 },
    { subject: 'Time', A: Math.min(100, (formData.time_taken / 300) * 100) },
    { subject: 'Attempts', A: Math.min(100, (formData.attempts / 5) * 100) },
    { subject: 'Hints', A: Math.min(100, (formData.hints_used / 5) * 100) },
    { subject: 'Hesitation', A: Math.min(100, (formData.pause_duration / 60) * 100) },
  ];

  return (
    <div className="min-vh-100 p-4 max-w-7xl mx-auto" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
            <Brain size={40} className="text-blue-500" />
            CognoLoad AI
          </h1>
          <p className="text-secondary mt-2">Multimodal Cognitive Load Prediction for Adaptive Learning</p>
        </div>
        <div className="glass px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium">System Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass card">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Activity size={20} className="text-blue-400" />
              Learning Behavior Signals
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-secondary flex items-center gap-2">
                  <Brain size={14} /> Problem Difficulty
                </label>
                <select
                  value={formData.problem_difficulty}
                  onChange={(e) => setFormData({ ...formData, problem_difficulty: parseInt(e.target.value) })}
                >
                  <option value={0}>Easy</option>
                  <option value={1}>Medium</option>
                  <option value={2}>Hard</option>
                </select>
              </div>

              {[
                { label: 'Time Taken (s)', key: 'time_taken', icon: <Clock size={14} />, min: 10, max: 600 },
                { label: 'Attempts', key: 'attempts', icon: <RotateCcw size={14} />, min: 1, max: 10 },
                { label: 'Hints Used', key: 'hints_used', icon: <HelpCircle size={14} />, min: 0, max: 10 },
                { label: 'Pause Duration (s)', key: 'pause_duration', icon: <Pause size={14} />, min: 0, max: 120 },
                { label: 'Typing Speed (wpm)', key: 'typing_speed', icon: <Keyboard size={14} />, min: 0, max: 100 },
                { label: 'Mouse Distance (px)', key: 'mouse_movement', icon: <MousePointer2 size={14} />, min: 0, max: 2000 },
              ].map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-sm text-secondary flex items-center justify-between">
                    <span className="flex items-center gap-2">{field.icon} {field.label}</span>
                    <span className="text-blue-400 font-mono">{formData[field.key]}</span>
                  </label>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: parseFloat(e.target.value) })}
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
            >
              {loading ? 'Analyzing...' : (
                <>
                  Analyze Cognitive Load
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-12 xl:lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Main Result */}
            <div className="glass card flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-white/5 to-transparent">
              <h3 className="text-secondary text-sm uppercase tracking-widest mb-4">Predicted Cognitive Load</h3>
              {prediction ? (
                <>
                  <div className={`text-6xl font-black mb-4 ${prediction.prediction === 'LOW' ? 'text-green-500' :
                      prediction.prediction === 'MEDIUM' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                    {prediction.prediction}
                  </div>
                  <div className="load-badge glass">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </div>

                  <div className="mt-8 w-full text-left">
                    <h4 className="text-xs font-bold text-secondary flex items-center gap-2 mb-3">
                      <Info size={12} /> KEY REASONS
                    </h4>
                    <div className="flex flex-col gap-2">
                      {prediction.reasons.map((r, i) => (
                        <div key={i} className="text-sm glass px-3 py-2 border-l-2 border-blue-500 bg-blue-500/5">
                          • {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-secondary/40">
                  <Brain size={64} strokeWidth={1} />
                  <p>Awaiting behavioral data inputs...</p>
                </div>
              )}
            </div>

            {/* Radar Chart */}
            <div className="glass card">
              <h3 className="text-secondary text-sm uppercase tracking-widest mb-6">Cognitive Profile</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar
                      name="Learner"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass p-6 mt-auto">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">ML Insights</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="px-4 py-3 rounded-lg border border-white/5 bg-white/2">
                <p className="text-[10px] text-secondary">Random Forest</p>
                <p className="font-mono text-sm">{prediction?.prediction || '--'}</p>
              </div>
              <div className="px-4 py-3 rounded-lg border border-white/5 bg-white/2">
                <p className="text-[10px] text-secondary">Neural Network</p>
                <p className="font-mono text-sm">{prediction?.nn_prediction || '--'}</p>
              </div>
              <div className="px-4 py-3 rounded-lg border border-white/5 bg-white/2">
                <p className="text-[10px] text-secondary">Response Time</p>
                <p className="font-mono text-sm">~42ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .gap-1 { gap: 0.25rem; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-6 { gap: 1.5rem; }
        .gap-8 { gap: 2rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-8 { margin-top: 2rem; }
        .max-w-7xl { max-width: 80rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }
        .p-8 { padding: 2rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .text-4xl { font-size: 2.25rem; }
        .text-6xl { font-size: 3.75rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .font-black { font-weight: 900; }
        .font-mono { font-family: ui-monospace, monospace; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .w-full { width: 100%; }
        .h-64 { height: 16rem; }
        .h-full { height: 100%; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        @media (min-width: 768px) {
          .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (min-width: 1024px) {
          .lg\\:col-span-5 { grid-column: span 5 / span 5; }
          .lg\\:col-span-12 { grid-column: span 12 / span 12; }
        }
        @media (min-width: 1280px) {
          .xl\\:lg\\:col-span-7 { grid-column: span 7 / span 7; }
        }
      `}</style>
    </div>
  );
}

export default App;
