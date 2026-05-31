import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function Contact() {
  const indianNumbers = [
    { label: "Inquiries", number: "+91 7396968805" }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">Get in Touch</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Have questions about our hallucination detection technology? Our team is here to help you secure your AI deployments.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-card/40 backdrop-blur-md border border-border-color rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-text-primary mb-8 flex items-center gap-3">
                <MessageSquare className="text-primary" /> Contact Details
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Call Us (India)</h3>
                    {indianNumbers.map((item, idx) => (
                      <p key={idx} className="text-text-secondary mt-1">
                        <span className="text-text-primary/60 text-sm block">{item.label}:</span>
                        {item.number}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Email Us</h3>
                    <p className="text-text-secondary mt-1">raghuveerxg@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Office</h3>
                    <p className="text-text-secondary mt-1">
                      KMIT<br />
                      Hyderabad, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Support Hours</h3>
                    <p className="text-text-secondary mt-1">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form className="bg-card/40 backdrop-blur-md border border-border-color rounded-2xl p-8 shadow-xl space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-card/40 border border-border-color rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-card/40 border border-border-color rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Subject</label>
                <input 
                  type="text" 
                  className="w-full bg-card/40 border border-border-color rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enterprise Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Message</label>
                <textarea 
                  rows="4"
                  className="w-full bg-card/40 border border-border-color rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary-hover text-text-primary rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                Send Message <Send size={18} />
              </button>

            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
