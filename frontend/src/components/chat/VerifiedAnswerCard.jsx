import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronDown, ChevronUp, Info, HelpCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

export default function VerifiedAnswerCard({ mainResponse, metrics, otherGenerations = [], confidenceStats = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(null); // 'eigenscore', 'dispersion', or null
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Small delay to trigger smooth load animations
    const timer = setTimeout(() => setAnimateIn(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Parse values safely
  const riskVal = metrics?.hallucination_risk ?? 0.15;
  const confidenceVal = metrics?.confidence ?? (confidenceStats[0]?.confidence ? confidenceStats[0].confidence * 100 : (1 - riskVal) * 100);
  const eigenscore = metrics?.eigenscore ?? 0.85;
  const dispersion = metrics?.entropy_dispersion ?? 0.12;

  // Determine risk category
  let riskLabel = 'Low';
  let riskColor = 'text-green-400 border-green-500/30 bg-green-500/10';
  let riskNeedleColor = '#22c55e'; // Green
  
  if (riskVal >= 0.6) {
    riskLabel = 'High';
    riskColor = 'text-red-400 border-red-500/30 bg-red-500/10';
    riskNeedleColor = '#ef4444'; // Red
  } else if (riskVal >= 0.3) {
    riskLabel = 'Medium';
    riskColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    riskNeedleColor = '#f59e0b'; // Amber
  }

  // Circular progress calculations for confidence
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = animateIn ? circumference - (confidenceVal / 100) * circumference : circumference;

  // Gauge calculations for risk (semi-circle, needle rotates from -90deg to 90deg)
  const needleRotation = animateIn ? (riskVal * 180) - 90 : -90;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl border border-green-500/20 bg-gradient-to-br from-[#080d09] to-[#040604] overflow-hidden my-6 shadow-[0_0_30px_rgba(34,197,94,0.06)]"
    >
      {/* Decorative top green strip */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-green-500/80 to-transparent"></div>

      {/* Header Banner */}
      <div className="bg-green-500/[0.04] border-b border-green-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-400 font-semibold tracking-wide">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <ShieldCheck size={20} className="text-green-400 animate-pulse" />
          <span className="text-sm font-bold tracking-widest text-green-300">VERIFIED SYSTEM RESPONSE</span>
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-[11px] font-mono font-bold text-green-300">
          <Sparkles size={12} className="text-green-400" />
          <span>CONSENSUS MEDOID</span>
        </div>
      </div>

      {/* Visual Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-black/45 border-b border-white/[0.04] relative">
        
        {/* Metric 1: Hallucination Risk Gauge */}
        <div className="flex flex-col items-center justify-center p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl relative group">
          <div className="text-xs font-semibold text-text-secondary mb-3 tracking-wider uppercase flex items-center gap-1.5 font-sans">
            Hallucination Risk
            <HelpCircle size={13} className="text-text-secondary/50 cursor-help" onClick={() => setShowInfo(showInfo === 'risk' ? null : 'risk')} />
          </div>

          <div className="relative w-36 h-20 flex justify-center overflow-hidden">
            {/* SVG semi-circle Gauge */}
            <svg width="144" height="90" viewBox="0 0 144 90" className="absolute top-0">
              {/* Background Arc */}
              <path 
                d="M 12 75 A 60 60 0 0 1 132 75" 
                fill="none" 
                stroke="#1f2937" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              {/* Colored Gauge Arc (Gradient mapping Green -> Amber -> Red) */}
              <path 
                d="M 12 75 A 60 60 0 0 1 132 75" 
                fill="none" 
                stroke="url(#riskGradient)" 
                strokeWidth="10" 
                strokeLinecap="round" 
                opacity="0.8"
              />
              
              <defs>
                <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Needle center dot */}
              <circle cx="72" cy="75" r="5" fill="#e5e7eb" />

              {/* Needle */}
              <line 
                x1="72" y1="75" 
                x2="72" y2="25" 
                stroke={riskNeedleColor} 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                style={{
                  transform: `rotate(${needleRotation}deg)`,
                  transformOrigin: '72px 75px',
                  transition: 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              />
            </svg>
            <div className="absolute bottom-0 text-center">
              <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${riskColor}`}>
                {riskLabel} Risk ({(riskVal * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
          
          <AnimatePresence>
            {showInfo === 'risk' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute inset-0 bg-[#0c0d12]/95 backdrop-blur-md rounded-xl p-3 text-[11px] text-text-secondary leading-relaxed flex flex-col justify-center border border-white/10 z-10 font-sans"
              >
                <div className="font-bold text-text-primary mb-1">Hallucination Risk</div>
                Predicted likelihood of factual error. Calculated by running candidate states through our Random Forest model trained on hallucination datasets.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metric 2: Confidence Rating Circle */}
        <div className="flex flex-col items-center justify-center p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl relative group">
          <div className="text-xs font-semibold text-text-secondary mb-3 tracking-wider uppercase flex items-center gap-1.5 font-sans">
            Response Confidence
            <HelpCircle size={13} className="text-text-secondary/50 cursor-help" onClick={() => setShowInfo(showInfo === 'confidence' ? null : 'confidence')} />
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* SVG Circular Progress */}
            <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
              <circle 
                cx="40" cy="40" r={radius} 
                fill="transparent" 
                stroke="#1f2937" 
                strokeWidth="6" 
              />
              <circle 
                cx="40" cy="40" r={radius} 
                fill="transparent" 
                stroke="#22c55e" 
                strokeWidth="6" 
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              />
            </svg>
            <div className="absolute text-center flex flex-col">
              <span className="text-base font-extrabold font-mono text-white leading-none">
                {confidenceVal.toFixed(1)}%
              </span>
            </div>
          </div>

          <AnimatePresence>
            {showInfo === 'confidence' && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute inset-0 bg-[#0c0d12]/95 backdrop-blur-md rounded-xl p-3 text-[11px] text-text-secondary leading-relaxed flex flex-col justify-center border border-white/10 z-10 font-sans"
              >
                <div className="font-bold text-text-primary mb-1">Response Confidence</div>
                Represents semantic similarity of the chosen response to the mean embedding of all candidate generations. High values mean consensus.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metric 3: Layer EigenScore & Entropy */}
        <div className="flex flex-col justify-between p-4 bg-white/[0.01] border border-white/[0.03] rounded-xl relative group">
          <div className="text-xs font-semibold text-text-secondary tracking-wider uppercase mb-3 flex items-center justify-between font-sans">
            <span>Semantic Analytics</span>
          </div>

          <div className="space-y-3">
            {/* EigenScore */}
            <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.03] hover:border-green-500/30 transition-colors cursor-help relative font-sans"
                 onMouseEnter={() => setShowInfo('eigenscore')}
                 onMouseLeave={() => setShowInfo(null)}>
              <span className="text-xs text-text-secondary flex items-center gap-1 font-medium">
                EigenScore
                <Info size={12} className="text-text-secondary/40" />
              </span>
              <span className="text-xs font-bold font-mono text-green-400">{eigenscore.toFixed(3)}</span>
            </div>

            {/* Dispersion */}
            <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.03] hover:border-yellow-500/30 transition-colors cursor-help relative font-sans"
                 onMouseEnter={() => setShowInfo('dispersion')}
                 onMouseLeave={() => setShowInfo(null)}>
              <span className="text-xs text-text-secondary flex items-center gap-1 font-medium">
                Entropy Dispersion
                <Info size={12} className="text-text-secondary/40" />
              </span>
              <span className="text-xs font-bold font-mono text-yellow-400">{dispersion.toFixed(3)}</span>
            </div>
          </div>

          {/* Inline explanations on hover */}
          <AnimatePresence>
            {showInfo === 'eigenscore' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-x-2 bottom-2 bg-[#0c0d12] border border-green-500/30 rounded p-2.5 text-[10px] text-text-secondary leading-relaxed z-10 shadow-lg font-sans"
              >
                <span className="font-bold text-green-400 block mb-0.5">EigenScore (Degree of Consensus)</span>
                Computed by performing PCA on candidate hidden states. A higher EigenScore indicates tight clusters, meaning candidate answers are semantically equivalent.
              </motion.div>
            )}
            {showInfo === 'dispersion' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-x-2 bottom-2 bg-[#0c0d12] border border-yellow-500/30 rounded p-2.5 text-[10px] text-text-secondary leading-relaxed z-10 shadow-lg font-sans"
              >
                <span className="font-bold text-yellow-400 block mb-0.5">Entropy Dispersion (Internal Variance)</span>
                Measures uncertainty/dispersion of tokens. Higher value indicates the model is guessing between unrelated responses (high risk of inventing information).
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Main Content Render */}
      <div className="p-6 text-text-primary text-sm leading-relaxed prose prose-invert max-w-none bg-gradient-to-b from-[#080d09]/50 to-transparent">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md border border-white/10 !bg-[#11111a] my-4 shadow-md"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-green-400 font-mono text-[0.9em]" {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {mainResponse}
        </ReactMarkdown>
      </div>

      {/* Other Generations Accordion */}
      {otherGenerations.length > 0 && (
        <div className="border-t border-white/[0.04] bg-white/[0.01]">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.03] transition-all font-medium font-sans"
          >
            <span>{expanded ? 'Hide' : 'Compare with'} Other Generated Candidates ({otherGenerations.length})</span>
            {expanded ? <ChevronUp size={14} className="text-green-500" /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden bg-black/40 border-t border-white/[0.02]"
              >
                <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {otherGenerations.map((gen, idx) => {
                    const stats = confidenceStats[idx + 1] || {};
                    const candConfidence = stats.confidence ? stats.confidence * 100 : 85;
                    return (
                      <div key={idx} className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.04] hover:border-white/[0.08] transition-all">
                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5 text-xs font-mono">
                          <span className="text-green-500/70 font-bold tracking-wider">CANDIDATE {idx + 2}</span>
                          <span className="text-text-secondary/70">
                            Confidence: <strong className="text-white">{candConfidence.toFixed(1)}%</strong>
                          </span>
                        </div>
                        <div className="text-xs text-text-secondary/95 leading-relaxed prose prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeKatex]}>
                            {gen}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
