import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings2, PanelLeft } from 'lucide-react';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import SettingsPanel from '../components/chat/SettingsPanel';
import useChatStore from '../store/chatStore';

export default function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { createNewChat, chats, isSettingsOpen, setSettingsOpen } = useChatStore();

  useEffect(() => {
    // Basic auth check
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Create initial chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats.length, createNewChat]);

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-text-primary">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background pointer-events-none"></div>

      {/* Main Layout Container */}
      <div className="flex w-full h-full relative z-10">
        
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

        {/* Central Chat Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative">
          
          {/* Top Navbar */}
          <div className="h-14 border-b border-border-color glass flex items-center justify-between px-4 shrink-0 bg-background/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                >
                  <PanelLeft size={20} />
                </button>
              )}
              <div className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                INSIDE 
                <span className="text-text-secondary text-sm ml-2 font-normal">Hallucination Verification System</span>
              </div>
            </div>
          </div>

          {/* Messages and Input */}
          <ChatArea onOpenSettings={() => setSettingsOpen(true)} />

        </div>

        {/* Desktop Settings Panel (Always visible on large screens when not hidden, but let's make it an overlay/drawer for cleaner look or standard right sidebar) */}
        <div className="hidden md:block">
          <SettingsPanel isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
        
        {/* Mobile Settings Panel Modal/Drawer */}
        <div className="md:hidden">
          <SettingsPanel isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>

      </div>
    </div>
  );
}
