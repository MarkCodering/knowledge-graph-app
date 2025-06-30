// File: app/page.tsx
'use client';

import { useState } from 'react';
import ChatPanel from '../components/ChatPanel';
import GraphScene from '../components/GraphScene';

export interface GraphData {
  nodes: { id: string }[];
  edges: { from: string; to: string }[];
}

export interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export default function RootPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! Ask a question and I'll generate a knowledge graph. Try 'What is React?'",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleNewMessage = async (prompt: string) => {
    setIsLoading(true);
    setLoadingProgress(0);
    setGraphData(null);
    setMessages((prev) => [...prev, { sender: 'user', text: prompt }]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('Failed to get response from AI');

      const { text, graph } = await response.json();
      setMessages((prev) => [...prev, { sender: 'ai', text }]);

      const totalNodes = graph.nodes.length;
      let nodesLoaded = 0;
      const interval = setInterval(() => {
        nodesLoaded++;
        setLoadingProgress(Math.round((nodesLoaded / totalNodes) * 100));
        if (nodesLoaded >= totalNodes) {
          clearInterval(interval);
          setTimeout(() => {
            setGraphData(graph);
            setIsLoading(false);
            setLoadingProgress(100);
          }, 500);
        }
      }, 150);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an error.' },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-screen h-screen bg-dark-primary">
      <div className="flex-1 relative min-w-0">
        <GraphScene
          graphData={graphData}
          isLoading={isLoading}
          progress={loadingProgress}
        />
      </div>
      <div className="flex-shrink-0 w-[38%] max-w-[500px]">
        <ChatPanel
          messages={messages}
          onNewMessage={handleNewMessage}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}