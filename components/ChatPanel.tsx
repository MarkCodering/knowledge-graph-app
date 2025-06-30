import { useState, FormEvent } from 'react';

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onNewMessage(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="bg-dark-primary border-l border-border-color h-full flex flex-col">
      <div className="p-6 border-b border-border-color flex-shrink-0">
        <h1 className="text-lg font-semibold">Dynamic AI Knowledge Graph</h1>
      </div>
      <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 max-w-[95%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className="w-8 h-8 rounded-full bg-panel flex-shrink-0 flex items-center justify-center text-sm">{msg.sender === 'user' ? '🧑‍💻' : '🤖'}</div>
            <div className={`p-3 rounded-lg whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-accent-primary rounded-br-sm' : 'bg-panel rounded-bl-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].sender === 'user' && (
             <div className="flex gap-3 max-w-[95%] self-start">
                <div className="w-8 h-8 rounded-full bg-panel flex-shrink-0 flex items-center justify-center text-sm">🤖</div>
                <div className="p-3 rounded-lg bg-panel rounded-bl-sm flex items-center">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-text-secondary animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 rounded-full bg-text-secondary animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 rounded-full bg-text-secondary animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
      </div>
      <div className="p-4 border-t border-border-color flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center bg-panel border border-border-color rounded-lg">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-grow bg-transparent border-none p-3 focus:outline-none"
          />
          <button type="submit" disabled={isLoading} className="p-2 mr-2 rounded-md text-accent-secondary hover:bg-accent-primary hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-accent-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}