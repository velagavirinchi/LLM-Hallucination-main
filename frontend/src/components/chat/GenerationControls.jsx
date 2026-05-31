import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, Square, Loader2 } from 'lucide-react';

export default function GenerationControls({ state, onPause, onResume, onStop }) {
  if (state === 'idle' || state === 'completed') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="bg-[#1e1e2e]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-full px-4 py-2 flex items-center gap-4 text-sm">
          
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            {state === 'generating' ? (
              <Loader2 size={14} className="text-primary animate-spin" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-amber-500" />
            )}
            <span className="text-text-secondary font-medium tracking-wide text-xs uppercase">
              {state === 'generating' ? 'Generating...' : 'Paused'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {state === 'generating' ? (
              <button 
                onClick={onPause}
                className="flex items-center gap-1.5 hover:bg-white/10 px-3 py-1.5 rounded-full text-text-primary transition-colors"
              >
                <Pause size={14} />
                <span>Pause</span>
              </button>
            ) : (
              <button 
                onClick={onResume}
                className="flex items-center gap-1.5 hover:bg-white/10 px-3 py-1.5 rounded-full text-text-primary transition-colors"
              >
                <Play size={14} />
                <span>Resume</span>
              </button>
            )}
            
            <button 
              onClick={onStop}
              className="flex items-center gap-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-full transition-colors"
            >
              <Square size={14} />
              <span>Stop</span>
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
