import React, { useState } from 'react';
import { MessageSquare, Plus, Search, MoreVertical, Trash2, Edit2, Check, X, PanelLeftClose, PanelLeft } from 'lucide-react';
import useChatStore from '../../store/chatStore';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { chats, activeChatId, setActiveChatId, createNewChat, deleteChat, renameChat } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChats = (chatList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: []
    };

    chatList.forEach(chat => {
      const chatDate = new Date(chat.updatedAt);
      if (chatDate >= today) groups.Today.push(chat);
      else if (chatDate >= yesterday) groups.Yesterday.push(chat);
      else if (chatDate >= weekAgo) groups['Previous 7 Days'].push(chat);
      else groups.Older.push(chat);
    });

    return groups;
  };

  const groupedChats = groupChats(filteredChats);

  const startEdit = (chat) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const saveEdit = (id) => {
    if (editTitle.trim()) {
      renameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="h-full border-r border-border-color glass z-20 flex flex-col bg-background/95 overflow-hidden absolute md:relative left-0 top-0 bottom-0"
        >
          <div className="p-4 flex items-center justify-between">
            <button 
              onClick={createNewChat}
              className="flex-1 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2.5 rounded-lg transition-colors font-medium"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
            <button onClick={toggleSidebar} className="ml-2 p-2 hover:bg-white/5 rounded-lg text-text-secondary md:hidden">
              <PanelLeftClose size={20} />
            </button>
          </div>

          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
              <input 
                type="text" 
                placeholder="Search chats..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-border-color rounded-lg py-2 pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 custom-scrollbar">
            {Object.entries(groupedChats).map(([label, groupChats]) => {
              if (groupChats.length === 0) return null;
              return (
                <div key={label} className="px-2">
                  <h3 className="text-xs font-semibold text-text-secondary mb-2 px-2 tracking-wider uppercase">
                    {label}
                  </h3>
                  <div className="space-y-1">
                    {groupChats.map(chat => (
                      <div 
                        key={chat.id}
                        className={cn(
                          "group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                          activeChatId === chat.id 
                            ? "bg-white/10 text-text-primary" 
                            : "hover:bg-white/5 text-text-secondary hover:text-text-primary"
                        )}
                        onClick={() => setActiveChatId(chat.id)}
                      >
                        <MessageSquare size={16} className="shrink-0" />
                        
                        {editingId === chat.id ? (
                          <div className="flex-1 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <input 
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEdit(chat.id)}
                              autoFocus
                              className="flex-1 bg-background border border-primary/50 rounded px-2 py-0.5 text-sm outline-none"
                            />
                            <button onClick={() => saveEdit(chat.id)} className="text-green-500 hover:text-green-400">
                              <Check size={14} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400">
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1 truncate text-sm relative pr-6">
                            {chat.title}
                            {/* Action overlay on hover */}
                            <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#1e1e2e] via-[#1e1e2e] to-transparent w-12 hidden group-hover:flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => { e.stopPropagation(); startEdit(chat); }}
                                className="p-1 hover:text-primary transition-colors"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                                className="p-1 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
