import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Settings2 } from 'lucide-react';
import useChatStore from '../../store/chatStore';

export default function SettingsPanel({ isOpen, onClose }) {
  const { config, setConfig } = useChatStore();

  const handleSliderChange = (key, value) => {
    setConfig({ [key]: parseFloat(value) });
  };

  const handleToggle = (key) => {
    setConfig({ [key]: !config[key] });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="fixed md:absolute right-0 top-0 bottom-0 w-80 bg-background/95 border-l border-border-color glass z-30 flex flex-col shadow-2xl"
        >
          <div className="p-4 border-b border-border-color flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-primary font-medium">
              <Settings2 size={18} />
              <h2>Model Parameters</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md text-text-secondary transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            
            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-text-secondary font-medium">Temperature</label>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-primary font-mono">{config.temperature.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="2" step="0.01"
                value={config.temperature}
                onChange={(e) => handleSliderChange('temperature', e.target.value)}
                className="w-full accent-primary"
              />
              <p className="text-[10px] text-text-secondary/60">Controls randomness: Lowering results in less random completions.</p>
            </div>

            {/* Top P */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-text-secondary font-medium">Top P</label>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-primary font-mono">{config.top_p.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01"
                value={config.top_p}
                onChange={(e) => handleSliderChange('top_p', e.target.value)}
                className="w-full accent-primary"
              />
            </div>

            {/* Top K */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-text-secondary font-medium">Top K</label>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-primary font-mono">{config.top_k}</span>
              </div>
              <input 
                type="range" min="1" max="100" step="1"
                value={config.top_k}
                onChange={(e) => handleSliderChange('top_k', e.target.value)}
                className="w-full accent-primary"
              />
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-text-secondary font-medium">Max Tokens</label>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-primary font-mono">{config.max_tokens}</span>
              </div>
              <input 
                type="range" min="256" max="4096" step="64"
                value={config.max_tokens}
                onChange={(e) => handleSliderChange('max_tokens', e.target.value)}
                className="w-full accent-primary"
              />
            </div>

            {/* Number of Generations */}
            <div className="space-y-2 pt-4 border-t border-border-color">
              <div className="flex justify-between items-center">
                <label className="text-sm text-text-secondary font-medium">Candidate Generations</label>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-primary font-mono">{config.num_generations}</span>
              </div>
              <input 
                type="range" min="2" max="5" step="1"
                value={config.num_generations}
                onChange={(e) => handleSliderChange('num_generations', e.target.value)}
                className="w-full accent-primary"
              />
              <p className="text-[10px] text-text-secondary/60">Number of internal responses to generate for hallucination checking.</p>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-border-color">
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary font-medium">Enable Streaming</label>
                <button 
                  onClick={() => handleToggle('streaming')}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${config.streaming ? 'bg-primary' : 'bg-white/20'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${config.streaming ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
