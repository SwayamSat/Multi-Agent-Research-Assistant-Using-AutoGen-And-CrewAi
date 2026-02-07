'use client';

import { Brain } from 'lucide-react';

export function ThinkingBubble() {
    return (
        <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-2xl rounded-tl-none border border-gray-200 w-fit">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            </div>
            <span className="text-xs text-gray-400 font-medium">Thinking...</span>
        </div>
    );
}
