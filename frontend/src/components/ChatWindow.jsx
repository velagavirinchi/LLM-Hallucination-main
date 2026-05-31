import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertTriangle, ChevronDown, ChevronUp, Activity, CheckCircle } from 'lucide-react';

export default function ChatWindow({ config }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          ...config
        })
      });
      
      const data = await res.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'bot', content: "Error: " + data.error, isError: true }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          content: data.response,
          metrics: data.metrics,
          all_generations: data.all_generations,
          generation_metrics: data.generation_metrics
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "Failed to connect to backend server.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto z-10 relative">
      {/* Header */}
      <div className="p-6 border-b border-border-color bg-background/50 backdrop-blur-md">
        <h2 className="text-xl font-medium flex items-center gap-2 text-text-primary">
          <Bot className="text-primary" /> Assistant
        </h2>
        <p className="text-sm text-text-secondary mt-1">Real-time Hallucination Detection active.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-50">
            <Bot size={48} className="mb-4" />
            <p>Ask a question to start detecting hallucinations.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={idx} msg={msg} />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border-color rounded-2xl rounded-tl-sm p-4 flex gap-3 items-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-background/50 backdrop-blur-md border-t border-border-color">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your prompt here..."
            className="w-full bg-card border border-border-color rounded-2xl py-4 pl-6 pr-16 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-lg"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const [expanded, setExpanded] = useState(false);

  // Determine the best generation
  let bestGen = msg.content;
  let hasMetrics = !isUser && !!msg.metrics;

  if (hasMetrics && msg.generation_metrics && msg.all_generations) {
    const bestIndex = msg.generation_metrics.reduce((iMax, x, i, arr) => x.confidence > arr[iMax].confidence ? i : iMax, 0);
    bestGen = msg.all_generations[bestIndex];
  }

  // Default Bot styling
  let bubbleClasses = 'bg-card border border-border-color text-text-primary rounded-tl-sm';
  if (isUser) {
    bubbleClasses = 'bg-primary text-white rounded-tr-sm';
  } else if (msg.isError) {
    bubbleClasses = 'bg-red-500/10 text-red-500 border border-red-500/30 rounded-tl-sm';
  }

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Chat Bubble */}
        <div 
          onClick={() => hasMetrics && setExpanded(!expanded)}
          className={`flex gap-3 p-4 rounded-2xl shadow-md transition-all ${
            hasMetrics ? 'cursor-pointer hover:border-primary/40' : ''
          } ${bubbleClasses}`}>
          {!isUser && <Bot size={20} className="shrink-0 mt-0.5 text-blue-400" />}
          <div className="flex-1 w-full overflow-hidden">
            
            <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
              {hasMetrics ? bestGen : msg.content}
            </div>

            {hasMetrics && !expanded && (
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-text-secondary font-bold uppercase tracking-wider bg-border-color/20 w-fit px-2 py-0.5 rounded border border-border-color">
                <Activity size={10} className="text-primary" />
                Click to view details & metrics
              </div>
            )}
          </div>
          {isUser && <User size={20} className="shrink-0 mt-0.5 opacity-80" />}
          {hasMetrics && (
            <div className="shrink-0 text-text-secondary self-center">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          )}
        </div>

        {/* Metrics Panel (Collapsible) */}
        {msg.metrics && expanded && (
          <div className="w-full max-w-[500px] mt-2 bg-card border border-border-color rounded-xl overflow-hidden shadow-lg animate-fade-in">
            <div className="px-4 py-3 flex justify-between items-center bg-border-color/10 border-b border-border-color">
              <div className="flex items-center gap-2 font-semibold text-text-primary">
                <Activity size={18} className={msg.metrics.hallucination_risk > 0.5 ? 'text-orange-500' : 'text-emerald-500'} />
                <span>Overall Hallucination Risk: {(msg.metrics.hallucination_risk * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="px-4 py-3 space-y-4 text-xs">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border-color">
                <div className="space-y-1">
                  <div className="flex justify-between text-text-secondary">
                    <span>EigenScore:</span>
                    <span className="font-mono text-blue-500">{msg.metrics.eigenscore.toFixed(4)}</span>
                  </div>
                  <div className="w-full h-1 bg-border-color/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${msg.metrics.eigenscore * 100}%` }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-text-secondary">
                    <span>Entropy (Dispersion):</span>
                    <span className="font-mono text-purple-500">{msg.metrics.entropy_dispersion.toFixed(4)}</span>
                  </div>
                  <div className="w-full h-1 bg-border-color/30 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, msg.metrics.entropy_dispersion * 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Individual Generations */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Parallel Generations & Confidence</h4>
                {msg.all_generations && msg.all_generations.map((gen, i) => (
                  <div key={i} className="p-2 bg-border-color/10 rounded-lg border border-border-color space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-primary font-bold">GEN #{i+1}</span>
                      {msg.generation_metrics && msg.generation_metrics[i] && (
                        <div className="flex gap-3">
                          <span className="text-emerald-600 dark:text-emerald-400">Similarity: {(msg.generation_metrics[i].confidence * 100).toFixed(1)}%</span>
                          <span className="text-purple-600 dark:text-purple-400">Entropy: {msg.generation_metrics[i].entropy_contribution.toFixed(4)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-text-primary line-clamp-2 italic">"{gen}"</p>
                  </div>
                ))}
              </div>

              {msg.metrics.hallucination_risk > 0.5 && (
                <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-600 dark:text-orange-400 flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>High hallucination risk detected. Model generations vary significantly.</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
