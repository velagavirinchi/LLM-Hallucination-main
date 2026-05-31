import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, MessageCircle, Code, Briefcase, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border-color pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-primary/20 rounded-lg text-primary">
                <BrainCircuit size={20} />
              </div>
              <span className="font-bold text-lg text-text-primary">
                InsightAI
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Empowering enterprise AI with real-time hallucination detection and deep internal state analytics.
            </p>
            <div className="flex gap-4 text-text-secondary">
              <a href="#" className="hover:text-primary transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Code size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Briefcase size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Platform</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/technology" className="hover:text-primary transition-colors">Technology</Link></li>
              <li><Link to="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/chat" className="hover:text-primary transition-colors">Chat Interface</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary transition-colors">Research Papers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Stay Updated</h3>
            <p className="text-sm text-text-secondary mb-4">Subscribe to our newsletter for the latest in AI safety research.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-card border border-border-color rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary"
              />
              <button className="bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded-lg transition-colors">
                <Mail size={16} />
              </button>
            </div>
          </div>

        </div>
        
        <div className="border-t border-border-color pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-secondary text-center md:text-left">
            &copy; {new Date().getFullYear()} InsightAI Technologies. All rights reserved. Built with Qwen-1.5.
          </p>
          <div className="flex gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
