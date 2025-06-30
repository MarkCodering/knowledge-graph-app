"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatPanelProps {
  messages: Message[];
  onNewMessage: (prompt: string) => void;
  isLoading: boolean;
}

export default function ChatPanel({ messages, onNewMessage, isLoading }: ChatPanelProps) {
  const [prompt, setPrompt] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onNewMessage(prompt.trim());
      setPrompt('');
    }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-full flex flex-col">

      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Chat Assistant</h1>
          {/* Add any controls here (e.g., settings, theme toggle) */}
        </div>
      </header>

      {/* Message List */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm">
              {msg.sender === 'user' ? '🧑‍💻' : '🤖'}
            </div>

            {/* Bubble */}
            <div
              className={`ml-3 mr-3 p-4 rounded-2xl whitespace-pre-wrap break-words relative
                ${msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'}
                shadow-md transition-colors`}
            >
              {msg.text}
              {/* Tail corner */}
              <span
                className={`absolute bottom-0 w-3 h-3
                  ${msg.sender === 'user'
                    ? 'bg-blue-600 right-2 -mb-1 rotate-45'
                    : 'bg-white dark:bg-gray-800 left-2 -mb-1 rotate-45'}
                  transform origin-center`}
              />
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm">🤖</div>
            <div className="flex items-center space-x-1 p-4 bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none shadow-md">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <footer className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow bg-gray-100 dark:bg-gray-700 border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="flex-shrink-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
