import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, RefreshCw, GitCompare, Download, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import VerifiedAnswerCard from './VerifiedAnswerCard';
import VerificationPipelineLoader from './VerificationPipelineLoader';
import { cn } from '../../lib/utils';
import { useState } from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([message.content || ''], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full py-6 group transition-all duration-300 border-b border-white/[0.02]", 
        isUser ? "bg-transparent" : "bg-white/[0.01] hover:bg-white/[0.02]"
      )}
    >
      <div className="max-w-4xl mx-auto w-full px-4 flex gap-5">
        
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 text-blue-400">
              <User size={18} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary">
              <Bot size={18} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-text-primary text-sm tracking-wide">
              {isUser ? 'You' : 'Assistant'}
            </span>
          </div>

          <div className="text-text-primary text-sm leading-relaxed max-w-none">
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              message.isVerifiedData ? (
                <VerifiedAnswerCard 
                  mainResponse={message.content}
                  metrics={message.metrics}
                  otherGenerations={message.otherGenerations}
                  confidenceStats={message.confidenceStats}
                />
              ) : (
                message.isTyping && !message.content ? (
                  <VerificationPipelineLoader />
                ) : (
                  <div className="prose prose-invert max-w-none">
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
                              className="rounded-md border border-white/10 !bg-[#1e1e1e] my-3"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary font-mono text-[0.9em]" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {message.content + (message.isTyping ? ' ▋' : '')}
                    </ReactMarkdown>
                  </div>
                )
              )
            )}
          </div>

          {/* Action Toolbar */}
          {!isUser && !message.isTyping && (
            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 text-xs">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 text-xs">
                <RefreshCw size={14} />
                Regenerate
              </button>
              <button onClick={handleDownload} className="p-1.5 hover:bg-white/10 rounded text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 text-xs">
                <Download size={14} />
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
