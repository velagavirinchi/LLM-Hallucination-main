import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      // Chat History
      chats: [],
      activeChatId: null,

      // UI State
      isSettingsOpen: false,
      setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),

      // Model Parameters
      config: {
        temperature: 0.7,
        top_k: 50,
        top_p: 0.9,
        num_generations: 3,
        max_tokens: 1024,
        frequency_penalty: 0,
        presence_penalty: 0,
        streaming: true,
      },

      // Chat state actions
      setActiveChatId: (id) => set({ activeChatId: id }),
      
      createNewChat: () => {
        const newChat = {
          id: Date.now().toString(),
          title: 'New Conversation',
          messages: [],
          updatedAt: Date.now(),
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: newChat.id,
        }));
        return newChat.id;
      },

      deleteChat: (id) => set((state) => ({
        chats: state.chats.filter((c) => c.id !== id),
        activeChatId: state.activeChatId === id ? null : state.activeChatId,
      })),

      renameChat: (id, newTitle) => set((state) => ({
        chats: state.chats.map((c) => 
          c.id === id ? { ...c, title: newTitle } : c
        )
      })),

      addMessageToActiveChat: (message) => set((state) => {
        const { activeChatId, chats } = state;
        if (!activeChatId) return state;

        return {
          chats: chats.map(chat => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: [...chat.messages, message],
                updatedAt: Date.now()
              };
            }
            return chat;
          })
        };
      }),

      updateMessageInActiveChat: (messageId, updates) => set((state) => {
        const { activeChatId, chats } = state;
        if (!activeChatId) return state;

        return {
          chats: chats.map(chat => {
            if (chat.id === activeChatId) {
              return {
                ...chat,
                messages: chat.messages.map(msg => 
                  msg.id === messageId ? { ...msg, ...updates } : msg
                ),
                updatedAt: Date.now()
              };
            }
            return chat;
          })
        };
      }),

      setConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig }
      })),
      
      // Selectors to help UI
      getActiveChat: () => {
        const state = get();
        return state.chats.find(c => c.id === state.activeChatId) || null;
      }
    }),
    {
      name: 'hallucination-chat-storage', // unique name
      partialize: (state) => ({ chats: state.chats, config: state.config }),
    }
  )
);

export default useChatStore;
