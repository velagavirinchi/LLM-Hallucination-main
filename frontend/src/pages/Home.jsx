import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Bot, Zap, ArrowRight, Activity, Layers, Lock, Cpu, Globe, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col relative overflow-hidden bg-background">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <main className="flex-1 flex flex-col z-10">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            {/* Centered Hero Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-8 text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold backdrop-blur-md">
                <ShieldAlert size={16} />
                <span>Next-Gen Hallucination Detection</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
                Trust your AI.<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
                  Verify every token.
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                InsightAI provides real-time hallucination risk scoring and deep internal state analytics for enterprise LLMs. Don't guess if your AI is right—know it mathematically.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link 
                  to="/signup" 
                  className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-text-primary rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
                >
                  Start Verifying <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/technology" 
                  className="w-full sm:w-auto px-8 py-4 bg-card/40 border border-border-color text-text-primary hover:bg-white/10 rounded-xl font-semibold text-lg transition-all backdrop-blur-md flex justify-center"
                >
                  Explore Tech
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-6 pt-8 text-text-secondary text-sm font-medium">
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Powered by Qwen-1.5</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Real-time Streaming</div>
              </div>
            </motion.div>
        </section>

        {/* LOGO CLOUD / DATASETS */}
        <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm font-semibold text-text-secondary uppercase tracking-widest mb-6">
              Trained on Industry-Standard Benchmarks
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xl font-bold font-mono text-text-primary">TruthfulQA</span>
              <span className="text-xl font-bold font-mono text-text-primary">SQuAD v2.0</span>
              <span className="text-xl font-bold font-mono text-text-primary">XSum</span>
              <span className="text-xl font-bold font-mono text-text-primary">Qwen-1.5</span>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-primary">Beyond the Final Token</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              We analyze the statistical dispersion of internal model states across parallel generations to detect uncertainty before it becomes a hallucination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Layers className="text-blue-400" />}
              title="Internal State Extraction"
              desc="We extract hidden state representations across multiple parallel generations to compute mathematical similarities."
            />
            <FeatureCard 
              icon={<Activity className="text-emerald-400" />}
              title="EigenScore Metrics"
              desc="Our proprietary Random Forest classifier analyzes internal generation states to detect hallucinations instantly."
            />
            <FeatureCard 
              icon={<Zap className="text-purple-400" />}
              title="Dynamic Configuration"
              desc="Take full control over Temperature, Top-K, Top-P, and Generation count for a customized evaluation."
            />
            <FeatureCard 
              icon={<Lock className="text-orange-400" />}
              title="Data Privacy"
              desc="Your prompts and internal state analytics are processed securely without being stored for future training."
            />
            <FeatureCard 
              icon={<Globe className="text-cyan-400" />}
              title="Multi-Domain Validation"
              desc="Trained on reasoning, summarization, and facts to ensure robust detection across any prompt category."
            />
            <FeatureCard 
              icon={<Cpu className="text-pink-400" />}
              title="High Performance"
              desc="Optimized for CPU/GPU hybrid environments, providing fast token streaming alongside deep mathematical validation."
            />
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/20 to-emerald-500/10 border border-border-color rounded-3xl p-12 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 relative z-10">Ready to secure your AI deployments?</h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto relative z-10">
              Join the developers building reliable, hallucination-free applications with InsightAI.
            </p>
            <Link 
              to="/signup" 
              className="inline-flex px-8 py-4 bg-primary text-white hover:bg-primary-hover rounded-xl font-bold text-lg transition-colors shadow-lg relative z-10"
            >
              Get Started for Free
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all group"
    >
      <div className="w-12 h-12 bg-card/40 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}
