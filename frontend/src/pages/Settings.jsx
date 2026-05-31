import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Key, 
  Globe,
  Save,
  Check
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary">Settings</h1>
            <p className="text-text-secondary mt-1">Manage your account and application preferences.</p>
          </div>
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              isSaved ? 'bg-emerald-500 text-text-primary' : 'bg-primary hover:bg-primary-hover text-text-primary shadow-lg shadow-primary/20'
            }`}
          >
            {isSaved ? <Check size={20} /> : <Save size={20} />}
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="bg-card/40 backdrop-blur-md border border-border-color rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-border-color bg-card/40">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <User size={20} className="text-primary" /> Profile Information
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-1">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-3xl font-bold text-text-primary overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.[0] || 'U'
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-card border border-border-color rounded-full text-text-secondary hover:text-text-primary transition-colors shadow-lg"
                  >
                    <SettingsIcon size={14} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>

                <div className="flex-1 grid md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || "John Doe"}
                      className="w-full bg-card/40 border border-border-color rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || "john@example.com"}
                      className="w-full bg-card/40 border border-border-color rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-card/40 backdrop-blur-md border border-border-color rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-border-color bg-card/40">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Globe size={20} className="text-emerald-400" /> App Preferences
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-amber-500/20 text-amber-500'}`}>
                    {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Dark Mode</h3>
                    <p className="text-sm text-text-secondary">Use the dark theme for the interface.</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-14 h-7 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Email Notifications</h3>
                    <p className="text-sm text-text-secondary">Receive weekly reports on AI accuracy.</p>
                  </div>
                </div>
                <button className="w-14 h-7 bg-primary rounded-full p-1">
                  <div className="w-5 h-5 bg-white rounded-full translate-x-7"></div>
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-card/40 backdrop-blur-md border border-border-color rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-border-color bg-card/40">
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Shield size={20} className="text-purple-400" /> Security & API
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                    <Key size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">API Keys</h3>
                    <p className="text-sm text-text-secondary">Manage access keys for your integrations.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-card/40 hover:bg-white/10 border border-border-color rounded-xl text-sm font-semibold text-text-primary transition-all">
                  Manage Keys
                </button>

              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
