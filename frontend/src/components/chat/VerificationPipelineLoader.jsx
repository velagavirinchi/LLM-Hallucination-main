import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BrainCircuit, Cpu, ShieldAlert, Check, Loader2 } from 'lucide-react';

export default function VerificationPipelineLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Progress through the pipeline steps based on average timing
    const stepDurations = [1200, 2000, 1200, 1000]; // milliseconds for each phase
    let currentStep = 0;

    const runTimer = () => {
      if (currentStep < 3) {
        currentStep += 1;
        setActiveStep(currentStep);
        setTimeout(runTimer, stepDurations[currentStep]);
      }
    };

    const initialTimer = setTimeout(runTimer, stepDurations[0]);
    return () => clearTimeout(initialTimer);
  }, []);

  const steps = [
    {
      id: 0,
      label: 'DDG Web Search & Context Retrieval',
      icon: Search,
      desc: 'Searching web to ground prompt with real-time facts'
    },
    {
      id: 1,
      label: 'Parallel Candidate Generation',
      icon: BrainCircuit,
      desc: 'Generating multiple candidate answers with Qwen-1.5'
    },
    {
      id: 2,
      label: 'Internal Layer Hidden-State Extraction',
      icon: Cpu,
      desc: 'Extracting tensor activations from key decoder layers'
    },
    {
      id: 3,
      label: 'Self-Consistency Classifier Evaluation',
      icon: ShieldAlert,
      desc: 'Running Random Forest classifier to predict hallucination risk'
    }
  ];

  return (
    <div className="w-full max-w-2xl bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 space-y-6 shadow-xl backdrop-blur-md">
      
      {/* Title block */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.04]">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
          <Loader2 className="animate-spin" size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-text-primary">VERIFYING RESPONSE</h3>
          <p className="text-[10px] text-text-secondary">Computing factual consistency & layer metrics...</p>
        </div>
      </div>

      {/* Pipeline Steps List */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          const isCompleted = activeStep > idx;
          const isActive = activeStep === idx;
          const isPending = activeStep < idx;

          return (
            <div 
              key={step.id} 
              className={`flex gap-4 items-start transition-opacity duration-300 ${
                isPending ? 'opacity-35' : 'opacity-100'
              }`}
            >
              {/* Step indicator circle */}
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                {isCompleted ? (
                  <motion.div 
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.div>
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/60 flex items-center justify-center text-primary relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/30 opacity-75"></span>
                    <Loader2 size={12} className="animate-spin relative z-10" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary/50 text-xs font-mono">
                    {idx + 1}
                  </div>
                )}
                
                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div className={`absolute top-6 bottom-[-20px] left-[11.5px] w-[1px] ${
                    isCompleted ? 'bg-green-500/30' : 'bg-white/10'
                  }`} />
                )}
              </div>

              {/* Step details */}
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-semibold ${
                  isActive ? 'text-primary' : isCompleted ? 'text-green-400/80' : 'text-text-secondary'
                }`}>
                  {step.label}
                </h4>
                {isActive && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[10px] text-text-secondary/80 mt-0.5 leading-relaxed"
                  >
                    {step.desc}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Shimmer loading placeholders */}
      <div className="space-y-2.5 pt-4 border-t border-white/[0.04]">
        <div className="h-3.5 w-full skeleton-shimmer rounded"></div>
        <div className="h-3.5 w-5/6 skeleton-shimmer rounded"></div>
        <div className="h-3.5 w-2/3 skeleton-shimmer rounded"></div>
      </div>

    </div>
  );
}
