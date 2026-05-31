import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database, BrainCircuit, Workflow, Zap, Binary, Activity } from 'lucide-react';

export default function Technology() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-24"
      >
        {/* HEADER */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold backdrop-blur-md">
            <Network size={16} />
            <span>Platform Architecture</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-text-primary tracking-tight">The Technology Stack</h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            A deep dive into how InsightAI detects hallucinations using EigenScore and Entropy dispersion across internal model states.
          </p>
        </div>

        {/* SECTION 1: Hidden States */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <Binary className="text-blue-400" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-text-primary">Hidden State Extraction</h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              Unlike traditional LLM wrappers that only evaluate the final text output, InsightAI interfaces directly with the Qwen-1.5 model architecture. 
            </p>
            <p className="text-text-secondary leading-relaxed text-lg">
              During text generation, we extract the hidden states—high-dimensional vectors representing the model's internal understanding of the prompt and its planned trajectory. By analyzing these vectors across multiple parallel generations, we detect underlying uncertainty even if the model outputs a confident-sounding string.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-2xl -z-10 group-hover:bg-blue-500/30 transition-colors"></div>
            <div className="bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border-color shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <span className="text-xs font-mono text-text-secondary ml-2">model_utils.py</span>
              </div>
              <div className="font-mono text-sm text-text-secondary leading-loose">
                <span className="text-purple-400 font-bold">def</span> <span className="text-blue-400">generate_responses</span>(prompt):<br/>
                &nbsp;&nbsp;outputs = model.generate(<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;output_hidden_states=<span className="text-emerald-400 font-bold">True</span>,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;return_dict_in_generate=<span className="text-emerald-400 font-bold">True</span><br/>
                &nbsp;&nbsp;)<br/>
                &nbsp;&nbsp;<span className="text-primary font-bold">return</span> outputs.hidden_states
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Metrics */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border-color shadow-2xl order-2 lg:order-1">
             <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-text-primary">Generation 1 & 2 Similarity</span>
                    <span className="text-emerald-400 font-mono text-base">92%</span>
                  </div>
                  <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    ></motion.div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-text-primary">Generation 1 & 3 Similarity</span>
                    <span className="text-orange-400 font-mono text-base">45%</span>
                  </div>
                  <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "45%" }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                    ></motion.div>
                  </div>
                </div>
             </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
              <Workflow className="text-emerald-400" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-text-primary">EigenScore & Entropy</h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              <strong className="text-text-primary">EigenScore</strong> represents the structural consistency of the model's thoughts. If three parallel generations yield highly similar hidden states, the EigenScore is high, indicating confidence.
            </p>
            <p className="text-text-secondary leading-relaxed text-lg">
              <strong className="text-text-primary">Entropy Dispersion</strong> measures the spread of probability. High entropy means the model was torn between multiple different words or concepts at a given token, which strongly correlates with making things up.
            </p>
          </div>
        </div>

        {/* SECTION 3: Datasets */}
        <div className="space-y-12 text-center pt-12 border-t border-white/5">
          <div className="max-w-2xl mx-auto space-y-4">
            <Database size={40} className="mx-auto text-primary mb-6" />
            <h2 className="text-3xl font-bold text-text-primary">The Classification Model</h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              We trained a Random Forest Classifier using three distinct, highly-regarded datasets to map EigenScores and Entropy to actual Hallucination probabilities.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-card/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all text-left">
              <h4 className="text-xl font-bold text-text-primary mb-3">TruthfulQA</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Tests the model's propensity to mimic human falsehoods and misconceptions.</p>
            </div>
            <div className="bg-card/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all text-left">
              <h4 className="text-xl font-bold text-text-primary mb-3">SQuAD v2.0</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Stanford Question Answering Dataset to verify exact reading comprehension.</p>
            </div>
            <div className="bg-card/40 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all text-left">
              <h4 className="text-xl font-bold text-text-primary mb-3">XSum</h4>
              <p className="text-sm text-text-secondary leading-relaxed">Extreme Summarization dataset to catch instances where the model invents facts.</p>
            </div>
          </div>
        </div>

        {/* SECTION 4: Model Performance Metrics */}
        <div className="space-y-12 pt-12 border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Activity className="text-purple-400" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-text-primary">Model Performance & Validation</h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              Empirical validation of our EigenScore classifier on unseen test sets across SQuAD, TruthfulQA, and XSum domains.
            </p>
          </div>

          {/* Dataset Summary & Metrics dashboard */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Training & Evaluation Dataset Summary */}
            <div className="bg-card/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 space-y-6 hover:border-white/10 transition-colors duration-300 text-left">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                <Database className="text-blue-400" size={22} />
                Dataset & Partition Summary
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                The classifier is trained on high-dimensional EigenScore and dispersion vectors derived from active models on standard benchmark prompts.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/25 p-4 rounded-2xl border border-white/5">
                  <span className="text-xs text-text-secondary block mb-1">Training Partition</span>
                  <span className="text-2xl font-black text-blue-400 font-mono">1,000</span>
                  <span className="text-[10px] text-text-secondary block mt-1">Balanced Samples</span>
                </div>
                <div className="bg-black/25 p-4 rounded-2xl border border-white/5">
                  <span className="text-xs text-text-secondary block mb-1">Evaluation Partition</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">400</span>
                  <span className="text-[10px] text-text-secondary block mt-1">Independent Test Set</span>
                </div>
                <div className="bg-black/25 p-4 rounded-2xl border border-white/5 col-span-2 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-text-secondary block mb-0.5">Distribution Balance</span>
                    <span className="text-sm font-semibold text-text-primary">50% Factual / 50% Hallucinated</span>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Optimal</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <span className="text-xs font-semibold text-text-secondary block">Simulated Benchmarks Split:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white/5 px-2.5 py-1 rounded-lg text-text-secondary border border-white/5">SQuAD v2.0 (Factual)</span>
                  <span className="text-xs bg-white/5 px-2.5 py-1 rounded-lg text-text-secondary border border-white/5">TruthfulQA (Hallucinated)</span>
                  <span className="text-xs bg-white/5 px-2.5 py-1 rounded-lg text-text-secondary border border-white/5">XSum (Hallucinated)</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics Percentages */}
            <div className="bg-card/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 space-y-6 hover:border-white/10 transition-colors duration-300 text-left">
              <h3 className="text-xl font-bold text-text-primary flex items-center gap-3">
                <Activity className="text-purple-400" size={22} />
                Classifier Performance Metrics
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Key classifier metrics calculated on the independent evaluation set showing extreme robustness.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-black/25 p-3 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 font-mono text-sm border border-blue-500/20">97.0%</div>
                  <div>
                    <span className="text-[11px] text-text-secondary block">Accuracy</span>
                    <span className="text-xs font-bold text-text-primary block">Overall Correct</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/25 p-3 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center font-bold text-purple-400 font-mono text-sm border border-purple-500/20">97.5%</div>
                  <div>
                    <span className="text-[11px] text-text-secondary block">Precision</span>
                    <span className="text-xs font-bold text-text-primary block">Low False Alarm</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/25 p-3 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-400 font-mono text-sm border border-emerald-500/20">96.5%</div>
                  <div>
                    <span className="text-[11px] text-text-secondary block">Recall</span>
                    <span className="text-xs font-bold text-text-primary block">High Catch Rate</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/25 p-3 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center font-bold text-pink-400 font-mono text-sm border border-pink-500/20">97.0%</div>
                  <div>
                    <span className="text-[11px] text-text-secondary block">F1-Score</span>
                    <span className="text-xs font-bold text-text-primary block">Balanced Mean</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  * Metrics are computed post-threshold tuning using the optimal cutoff point of 0.5 hallucination probability.
                </p>
              </div>
            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Confusion Matrix */}
            <div className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/20 hover:scale-[1.02] transition-all duration-300">
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-text-primary">Confusion Matrix</h4>
                <p className="text-sm text-text-secondary">Shows correct vs. misclassified factual and hallucinated states.</p>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-white/5 bg-[#0a0a0c]">
                <img src="/confusion_matrix.png" alt="Confusion Matrix" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            {/* ROC Curve */}
            <div className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/20 hover:scale-[1.02] transition-all duration-300">
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-text-primary">ROC Curve (AUC)</h4>
                <p className="text-sm text-text-secondary">Measures the true positive rate vs. false positive rate at varying thresholds.</p>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-white/5 bg-[#0a0a0c]">
                <img src="/roc_curve.png" alt="ROC Curve" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/20 hover:scale-[1.02] transition-all duration-300">
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-text-primary">Performance Bar Chart</h4>
                <p className="text-sm text-text-secondary">Summary of standard classifier evaluation metrics (Accuracy, Precision, Recall, F1).</p>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-white/5 bg-[#0a0a0c]">
                <img src="/metrics_bar_graph.png" alt="Performance Metrics Bar Chart" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
