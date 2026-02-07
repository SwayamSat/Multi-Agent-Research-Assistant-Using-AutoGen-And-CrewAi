'use client';

import React, { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useResearchStream } from '@/hooks/useResearchStream';

export default function Home() {
  const { messages, isLoading, startResearch, stopResearch } = useResearchStream();
  const [userMessages, setUserMessages] = useState([]);

  const handleSend = (topic) => {
    const userMessage = {
      type: 'user',
      content: topic,
      timestamp: Date.now()
    };
    setUserMessages(prev => [...prev, userMessage]);
    startResearch(topic);
  };

  const handleStop = () => {
    stopResearch();
  };

  const displayMessages = [
    ...userMessages,
    ...messages
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-900 justify-center">
      <div className="w-full max-w-5xl flex flex-col h-full bg-white shadow-xl border-x border-gray-200">
        <header className="h-16 border-b border-gray-100 flex items-center px-6 bg-white justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              RA
            </div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ResearchAgent Pro
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            Powered by CrewAI & LangGraph
          </div>
        </header>

        <ChatInterface
          messages={displayMessages}
          isLoading={isLoading}
          onSend={handleSend}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}
