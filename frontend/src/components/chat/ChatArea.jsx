import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings2, ShieldCheck, ChevronDown, Bot, User } from 'lucide-react';
import MessageBubble from './MessageBubble';
import GenerationControls from './GenerationControls';
import useChatStore from '../../store/chatStore';

export default function ChatArea({ onOpenSettings }) {
  const { activeChatId, getActiveChat, addMessageToActiveChat, updateMessageInActiveChat, config } = useChatStore();
  const chat = getActiveChat();
  const messages = chat ? chat.messages : [];
  
  const [input, setInput] = useState('');
  const [genState, setGenState] = useState('idle'); // idle, generating, paused, completed
  const [activeTypingId, setActiveTypingId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const typingRef = useRef({ interval: null, fullText: '', currentIndex: 0, messageId: null, isPaused: false, shouldStop: false });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, genState]);

  // Clean up typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingRef.current.interval) clearInterval(typingRef.current.interval);
    };
  }, []);

  const simulateStreaming = (messageId, fullText, payload) => {
    if (!config.streaming) {
      updateMessageInActiveChat(messageId, { 
        content: fullText, 
        isTyping: false,
        isVerifiedData: true,
        metrics: payload.metrics,
        otherGenerations: payload.all_generations?.slice(1) || [],
        confidenceStats: payload.generation_metrics || []
      });
      setGenState('completed');
      return;
    }

    setGenState('generating');
    setActiveTypingId(messageId);
    
    // Initialize typing ref state
    typingRef.current = {
      interval: null,
      fullText: fullText,
      currentIndex: 0,
      messageId: messageId,
      isPaused: false,
      shouldStop: false,
      payload: payload
    };

    const typeNextToken = () => {
      const state = typingRef.current;
      
      if (state.shouldStop) {
        setGenState('completed');
        setActiveTypingId(null);
        return;
      }

      if (state.isPaused) {
        return; // wait for next interval cycle
      }

      if (state.currentIndex < state.fullText.length) {
        // Find next word boundary or advance by a few chars for smooth effect
        const nextSpace = state.fullText.indexOf(' ', state.currentIndex + 1);
        const jump = nextSpace !== -1 ? (nextSpace - state.currentIndex + 1) : 1;
        state.currentIndex += Math.min(jump, 5); // chunk size for speed
        
        if (state.currentIndex >= state.fullText.length) {
          state.currentIndex = state.fullText.length;
        }

        const currentContent = state.fullText.substring(0, state.currentIndex);
        updateMessageInActiveChat(state.messageId, { content: currentContent });
      } else {
        // Done typing
        clearInterval(state.interval);
        setGenState('completed');
        setActiveTypingId(null);
        
        // Show verified UI after done typing
        updateMessageInActiveChat(state.messageId, { 
          isTyping: false,
          isVerifiedData: true,
          metrics: state.payload.metrics,
          otherGenerations: state.payload.all_generations?.slice(1) || [],
          confidenceStats: state.payload.generation_metrics || []
        });
      }
    };

    typingRef.current.interval = setInterval(typeNextToken, 20); // 20ms per tick
  };

  const handlePause = () => {
    typingRef.current.isPaused = true;
    setGenState('paused');
  };

  const handleResume = () => {
    typingRef.current.isPaused = false;
    setGenState('generating');
  };

  const handleStop = () => {
    typingRef.current.shouldStop = true;
    clearInterval(typingRef.current.interval);
    setGenState('completed');
    setActiveTypingId(null);
    updateMessageInActiveChat(typingRef.current.messageId, { isTyping: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || genState === 'generating' || !activeChatId) return;

    const userPrompt = input.trim();
    setInput('');

    // Add user message
    const userMsgId = Date.now().toString();
    addMessageToActiveChat({
      id: userMsgId,
      role: 'user',
      content: userPrompt,
      timestamp: Date.now()
    });

    // Add placeholder AI message
    const aiMsgId = (Date.now() + 1).toString();
    addMessageToActiveChat({
      id: aiMsgId,
      role: 'assistant',
      content: '',
      isTyping: true,
      timestamp: Date.now()
    });

    setGenState('generating');

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'https://llm-hallucination.onrender.com';
      const response = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          temperature: config.temperature,
          top_p: config.top_p,
          top_k: config.top_k,
          num_generations: config.num_generations
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // Data format: { response: "text", metrics: {...}, all_generations: [...], generation_metrics: [...] }
      const mainText = data.response;
      
      simulateStreaming(aiMsgId, mainText, data);

    } catch (error) {
      console.error("Error generating response:", error);
      updateMessageInActiveChat(aiMsgId, { 
        content: "Sorry, I encountered an error communicating with the backend. Please ensure the backend is running.",
        isTyping: false 
      });
      setGenState('completed');
    }
  };

  if (!activeChatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-text-secondary">
        <ShieldCheck size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-medium mb-2 text-text-primary">Welcome to the AI Verification Interface</h2>
        <p>Select a chat from the sidebar or start a new conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center pt-20 px-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
              <Bot size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">How can I help you today?</h1>
            <p className="text-text-secondary text-center max-w-md">
              Ask any question. The system will internally generate multiple candidate answers and evaluate them to provide a verified, high-confidence response.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Floating Controls */}
      <GenerationControls 
        state={genState}
        onPause={handlePause}
        onResume={handleResume}
        onStop={handleStop}
      />

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="max-w-4xl mx-auto relative">
          <form 
            onSubmit={handleSubmit}
            className="relative glass-premium border border-white/[0.08] focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.15)] rounded-2xl shadow-xl overflow-hidden transition-all duration-300"
          >
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Message the verified AI..."
              className="w-full bg-transparent text-text-primary placeholder:text-text-secondary/50 px-4 py-4 pr-24 resize-none outline-none min-h-[60px] max-h-[200px] custom-scrollbar"
              rows={1}
              style={{
                height: 'auto',
              }}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenSettings}
                className="p-2 text-text-secondary hover:text-primary hover:bg-white/5 rounded-xl transition-colors md:hidden"
              >
                <Settings2 size={20} />
              </button>
              
              <button 
                type="submit"
                disabled={!input.trim() || genState === 'generating' || genState === 'paused'}
                className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-text-secondary/50 font-medium tracking-wide">
              AI CAN MAKE MISTAKES. VERIFIED ANSWERS HAVE LOWER HALLUCINATION RISK.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
