import React, { useState } from 'react';
import { Book, Terminal, Code, Cpu, Settings, MessageSquare, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('quickstart');

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden md:block z-10">
        <div className="p-6">
          <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2 text-lg">
            <Book size={20} className="text-primary" /> Documentation
          </h3>
          <nav className="space-y-2">
            <NavItem 
              active={activeTab === 'quickstart'} 
              onClick={() => setActiveTab('quickstart')}
              icon={<Terminal size={18} />}
              label="Quickstart"
            />
            <NavItem 
              active={activeTab === 'api'} 
              onClick={() => setActiveTab('api')}
              icon={<Code size={18} />}
              label="API Reference"
            />
            <NavItem 
              active={activeTab === 'config'} 
              onClick={() => setActiveTab('config')}
              icon={<Settings size={18} />}
              label="Configuration"
            />
            <NavItem 
              active={activeTab === 'metrics'} 
              onClick={() => setActiveTab('metrics')}
              icon={<Cpu size={18} />}
              label="Metrics Guide"
            />
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-4xl z-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {activeTab === 'quickstart' && (
            <motion.div 
              key="quickstart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight">Quickstart Guide</h1>
                <p className="text-xl text-text-secondary leading-relaxed">
                  Get up and running with InsightAI's hallucination detection in minutes. Ensure your backend server is running locally.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">1</span> 
                  Install Dependencies
                </h3>
                <div className="bg-[#0a0a0b] border border-border-color rounded-xl p-5 font-mono text-sm text-text-secondary overflow-x-auto shadow-inner">
                  <div className="text-text-primary/40 mb-2"># Install Python requirements</div>
                  <span className="text-emerald-400">$</span> pip install -r backend/requirements.txt<br/><br/>
                  <div className="text-text-primary/40 mb-2"># Install Node.js requirements</div>
                  <span className="text-emerald-400">$</span> npm install --prefix frontend
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">2</span> 
                  Start the Backend
                </h3>
                <p className="text-text-secondary text-lg">The backend runs FastAPI and loads the Qwen-1.5 model. The initial model download may take a few minutes.</p>
                <div className="bg-[#0a0a0b] border border-border-color rounded-xl p-5 font-mono text-sm text-text-secondary overflow-x-auto shadow-inner">
                  <span className="text-emerald-400">$</span> cd backend<br/>
                  <span className="text-emerald-400">$</span> uvicorn main:app --reload
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm">3</span> 
                  Launch Chat Interface
                </h3>
                <p className="text-text-secondary text-lg">Sign up for an account via the web UI and head to the Chat Interface to test the hallucination metrics in real-time.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div 
              key="api"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight">API Reference</h1>
                <p className="text-xl text-text-secondary leading-relaxed">
                  Interact directly with the <code className="bg-white/10 px-2 py-1 rounded text-text-primary">/chat</code> endpoint to integrate hallucination detection into your own applications.
                </p>
              </div>
              
              <div className="bg-card/40 backdrop-blur-md p-8 rounded-2xl border border-border-color">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg font-bold text-sm tracking-wider">POST</span>
                  <code className="text-text-primary font-mono text-lg">/chat</code>
                </div>
                <p className="text-text-secondary text-lg mb-6">Generates a response and computes EigenScore/Entropy.</p>
                
                <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                  <ChevronRight size={18} className="text-primary" /> Request Body (JSON)
                </h4>
                <div className="bg-[#0a0a0b] border border-white/5 rounded-xl p-6 font-mono text-sm text-text-secondary mb-8 shadow-inner">
                  &#123;<br/>
                  &nbsp;&nbsp;<span className="text-blue-400">"prompt"</span>: <span className="text-emerald-400">"What is the capital of France?"</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-400">"temperature"</span>: <span className="text-orange-400">0.7</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-400">"top_k"</span>: <span className="text-orange-400">50</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-400">"top_p"</span>: <span className="text-orange-400">0.9</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-400">"num_generations"</span>: <span className="text-orange-400">3</span><br/>
                  &#125;
                </div>

                <h4 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                  <ChevronRight size={18} className="text-primary" /> Response (JSON)
                </h4>
                <p className="text-text-secondary">Returns the final string, parallel generations, and risk metrics.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div 
              key="config"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight">Configuration</h1>
                <p className="text-xl text-text-secondary leading-relaxed">
                  Fine-tune the model parameters to balance latency, creativity, and mathematical certainty.
                </p>
              </div>
              
              <div className="grid gap-6">
                <ConfigItem name="Temperature" defaultVal="0.7" desc="Controls randomness. Lower values make the output more deterministic. Higher values increase entropy, which may artificially inflate hallucination risk if set too high." />
                <ConfigItem name="Top K" defaultVal="50" desc="Restricts the model to the top K most likely tokens at each step." />
                <ConfigItem name="Top P" defaultVal="0.9" desc="Nucleus sampling. Restricts the model to a subset of tokens whose cumulative probability is P." />
                <ConfigItem name="Generations Count" defaultVal="3" desc="The number of parallel responses generated to compute the EigenScore. Minimum 2. Higher values increase latency but provide more accurate similarity matrices." />
              </div>
            </motion.div>
          )}

          {activeTab === 'metrics' && (
            <motion.div 
              key="metrics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight">Understanding Metrics</h1>
                <p className="text-xl text-text-secondary leading-relaxed">How to interpret the dashboard analytics.</p>
              </div>
              
              <div className="grid gap-6 mt-6">
                <div className="bg-card/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 border-l-4 border-l-red-500 shadow-lg">
                  <h3 className="font-bold text-text-primary text-xl mb-3">Hallucination Risk &gt; 50%</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    The Random Forest classifier determined the generation is highly likely a hallucination based on severe divergence in the parallel hidden states. You should discard or flag the response.
                  </p>
                </div>
                <div className="bg-card/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 border-l-4 border-l-blue-500 shadow-lg">
                  <h3 className="font-bold text-text-primary text-xl mb-3">EigenScore (~1.0)</h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    All parallel generations followed the exact same mathematical trajectory in their internal representations. This indicates extreme confidence and factual certainty.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-primary/10 text-primary border border-primary/20 shadow-inner' 
          : 'text-text-secondary hover:bg-card/40 hover:text-text-primary border border-transparent'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function ConfigItem({ name, defaultVal, desc }) {
  return (
    <div className="bg-card/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-colors">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h4 className="font-bold text-text-primary text-xl">{name}</h4>
        <span className="text-xs font-mono bg-white/10 text-text-secondary px-3 py-1 rounded-full border border-white/5">Default: {defaultVal}</span>
      </div>
      <p className="text-lg text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}
