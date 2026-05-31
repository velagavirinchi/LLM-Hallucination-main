import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { BrainCircuit, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-card border-r border-border-color flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div>
          <Link to="/" className="flex items-center gap-3 text-text-primary hover:opacity-80 transition-opacity w-fit z-10 relative">
            <div className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30">
              <BrainCircuit size={24} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight">InsightAI</span>
          </Link>
        </div>

        <div className="z-10 relative space-y-6 max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-text-primary leading-tight">
            Trust your AI,<br/>Verify its truth.
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Enter the dashboard to monitor your language models in real-time. Detect hidden hallucinations before they reach production.
          </p>
        </div>

        <div className="z-10 relative">
          <div className="flex items-center gap-4 text-text-secondary text-sm font-medium">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-card bg-blue-500/20"></div>
              <div className="w-10 h-10 rounded-full border-2 border-card bg-emerald-500/20"></div>
              <div className="w-10 h-10 rounded-full border-2 border-card bg-purple-500/20"></div>
            </div>
            <p>Trusted by AI engineering teams worldwide</p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Mobile only back button */}
        <Link to="/" className="lg:hidden absolute top-8 left-8 p-2 text-text-secondary hover:text-text-primary bg-card border border-border-color rounded-xl">
          <ArrowLeft size={20} />
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 lg:mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Welcome Back</h2>
            <p className="text-text-secondary">Log in to access your hallucination dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-card border border-border-color rounded-xl py-3.5 pl-12 pr-4 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-text-primary">Password</label>
                <a href="#" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card border border-border-color rounded-xl py-3.5 pl-12 pr-4 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 mt-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-[15px] transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-hover font-bold transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
      
    </div>
  );
}
