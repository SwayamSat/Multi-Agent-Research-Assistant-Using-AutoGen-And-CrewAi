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
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-black min-h-0 relative">
            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 scroll-smooth pb-32">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400 dark:text-stone-600 animate-fade-in delay-150">
                        <div className="w-16 h-16 mb-6 rounded-2xl bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
                            <Brain size={32} className="opacity-20" />
                        </div>
                        <p className="text-lg font-medium text-stone-500 dark:text-stone-400 text-center tracking-tight">
                            Start a new research session
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isLastMessage = idx === messages.length - 1;
                    const isAgent = msg.type === 'agent' || msg.type === 'message';
                    const isUser = msg.type === 'user';

                    const AgentIcon = AGENT_ICONS[msg.agent] || Brain;

                    return (
                        <div key={idx} className={`flex w-full group ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[90%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>

                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-opacity ${isUser
                                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-black'
                                    : 'bg-stone-100 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400'
                                    }`}>
                                    {isUser ? <User size={16} /> : <AgentIcon size={16} />}
                                </div>

                                <div className={`p-4 sm:p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5 ${isUser
                                    ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-2xl rounded-tr-sm'
                                    : 'bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl rounded-tl-sm prose prose-stone dark:prose-invert max-w-none'
                                    }`}>
                                    {!isUser && msg.agent && (
                                        <div className="text-[10px] font-semibold uppercase tracking-widest mb-2 text-stone-400 dark:text-stone-500 select-none flex items-center gap-1">
                                            {msg.agent.replace('_', ' ')}
                                        </div>
                                    )}
                                    <div className={`text-sm sm:text-base leading-relaxed ${isUser ? '' : 'markdown-body dark:markdown-invert font-normal text-stone-700 dark:text-stone-300'}`}>
                                        {((isAgent || msg.agent === 'Supervisor') && isLastMessage && isLoading) ? (
                                            <TypingEffect text={msg.content} speed={2} />
                                        ) : (
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isLoading && (
                    <div className="flex w-full justify-start animate-fade-in pl-12 bg-transparent">
                        <div className="flex items-center gap-4 py-2 px-4 rounded-full bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
                            <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce delay-0" />
                            <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce delay-150" />
                            <div className="w-2 h-2 rounded-full bg-stone-400 animate-bounce delay-300" />
                            <span className="text-xs font-medium text-stone-400 uppercase tracking-widest ml-2">Thinking</span>
                        </div>
                    </div>
                )}

                <div ref={endRef} />
            </div>

            {/* Input Area - Floats above bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black dark:to-transparent pt-20">
                <div className="max-w-3xl mx-auto relative flex items-center gap-3">
                    <form onSubmit={handleSubmit} className="flex-1 relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Type a research topic..."
                            className="w-full pl-6 pr-14 py-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 backdrop-blur-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 shadow-xl shadow-stone-200/50 dark:shadow-none focus:border-stone-400 dark:focus:border-stone-600 focus:ring-0 outline-none transition-all disabled:opacity-50 text-base"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 bottom-2 p-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-black rounded-xl hover:bg-black dark:hover:bg-white disabled:bg-stone-200 disabled:text-stone-400 dark:disabled:bg-stone-800 dark:disabled:text-stone-600 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center aspect-square"
                        >
                            <Send size={18} />
                        </button>
                    </form>

                    {isLoading && (
                        <button
                            onClick={onStop}
                            className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/50 dark:hover:text-red-400 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
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
