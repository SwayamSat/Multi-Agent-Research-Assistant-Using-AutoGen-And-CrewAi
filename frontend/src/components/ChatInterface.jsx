'use client';

import { Send, Square, Terminal, Search, FileText, AlertCircle, Brain, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import { TypingEffect } from './TypingEffect';
import { ThinkingBubble } from './ThinkingBubble';
import remarkGfm from 'remark-gfm';

// Map agent names to icons
const AGENT_ICONS = {
    'Supervisor': Brain,
    'Topic_Refiner': Terminal,
    'Paper_Discoverer': Search,
    'Insight_Synthesizer': FileText,
    'Report_Compiler': FileText,
    'Gap_Analyst': AlertCircle,
    'User': User
};

export function ChatInterface({ messages, isLoading, onSend, onStop }) {
    const [input, setInput] = useState('');
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="text-lg">Enter a research topic to begin.</p>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isLastMessage = idx === messages.length - 1;
                    const isAgent = msg.type === 'agent' || msg.type === 'message'; // Handle both types if backend emits different types
                    const isUser = msg.type === 'user';

                    // Determine Icon
                    const AgentIcon = AGENT_ICONS[msg.agent] || Brain; // Default to Brain if unknown, though user has no agent name usually

                    return (
                        <div key={idx} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>

                                {/* Avatar/Icon */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
                                    }`}>
                                    {isUser ? <User size={18} /> : <AgentIcon size={18} />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`rounded-2xl p-4 shadow-sm ${isUser
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-200 rounded-tl-none prose prose-slate max-w-none' // Modified classes
                                    }`}>
                                    {!isUser && msg.agent && (
                                        <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400 select-none"> {/* Added select-none */}
                                            {msg.agent.replace('_', ' ')}
                                        </div>
                                    )}
                                    <div className={`text-sm leading-relaxed ${isUser ? '' : 'markdown-body'}`}>
                                        {((isAgent || msg.agent === 'Supervisor') && isLastMessage && isLoading) ? (
                                            <TypingEffect text={msg.content} speed={5} />
                                        ) : (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isLoading && ( // Added thinking bubble when loading
                    <div className="flex w-full justify-start animate-fade-in">
                        <div className="flex max-w-[80%] flex-row items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-600">
                                <Brain size={18} className="animate-pulse" />
                            </div>
                            <ThinkingBubble />
                        </div>
                    </div>
                )}

                <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="max-w-4xl mx-auto relative flex items-center gap-2">
                    <form onSubmit={handleSubmit} className="flex-1 relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="What would you like to research?"
                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>

                    {isLoading && (
                        <button
                            onClick={onStop}
                            className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                            title="Stop Research"
                        >
                            <Square size={20} fill="currentColor" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
