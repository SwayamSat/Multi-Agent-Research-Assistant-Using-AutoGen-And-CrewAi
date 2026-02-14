'use client';

import React, { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useResearchStream } from '@/hooks/useResearchStream';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <div className="flex h-screen w-full flex-col bg-white dark:bg-black font-sans text-stone-900 dark:text-stone-100 overflow-hidden">
      <header className="h-16 flex-none border-b border-stone-100 dark:border-stone-900 flex items-center px-6 sm:px-8 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-20 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center text-stone-900 dark:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <h1 className="font-medium text-lg tracking-tight text-stone-900 dark:text-white hidden sm:block">
            ResearchAgent
          </h1>
          <h1 className="font-medium text-lg tracking-tight text-stone-900 dark:text-white sm:hidden">
            RA
          </h1>
        </div>
        <div className="flex items-center gap-6 ml-auto">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400 hidden sm:block tracking-wide uppercase">
            v1.0
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-xl border-x border-gray-200 dark:border-gray-800">
        <ChatInterface
          messages={displayMessages}
          isLoading={isLoading}
          onSend={handleSend}
          onStop={handleStop}
        />
      </main>
    </div>
  );
}
