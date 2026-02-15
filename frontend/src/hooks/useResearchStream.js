import { useState, useRef } from 'react';

export function useResearchStream() {
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState({}); // { agent: 'working' | 'completed' | 'idle' }
    const [activeAgent, setActiveAgent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef(null);

    const handleEvent = (event) => {
        if (event.type === 'status') {
            setStatus(prev => ({ ...prev, [event.agent]: event.status }));
            if (event.status === 'working' || event.status === 'planning') {
                setActiveAgent(event.agent);
            } else if (event.status === 'finished') {
                setActiveAgent(null);
            }
        } else if (event.type === 'message') {
            setMessages(prev => [...prev, {
                agent: event.agent,
                content: event.content,
                type: 'agent',
                timestamp: Date.now()
            }]);
        } else if (event.type === 'error') {
            setMessages(prev => [...prev, { type: 'error', content: event.content, timestamp: Date.now() }]);
        }
    };

    const startResearch = async (topic) => {
        setIsLoading(true);
        setMessages([]);
        setStatus({});
        setActiveAgent(null);

        // Abort previous request if any
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/research-stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
                signal: abortControllerRef.current.signal,
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n\n');
                // Keep the last part in buffer as it might be incomplete
                buffer = lines.pop();

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('data: ')) {
                        const jsonStr = trimmedLine.replace('data: ', '');
                        try {
                            const event = JSON.parse(jsonStr);
                            handleEvent(event);
                        } catch (e) {
                            console.error('Error parsing SSE event:', e);
                        }
                    }
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Stream error:', error);
                setMessages(prev => [...prev, { type: 'error', content: 'Connection failed.', timestamp: Date.now() }]);
            }
        } finally {
            setIsLoading(false);
            setActiveAgent(null);
        }
    };

    const stopResearch = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsLoading(false);
            setMessages(prev => [...prev, { type: 'error', content: 'Research stopped by user.', timestamp: Date.now() }]);
        }
    };

    return { messages, status, activeAgent, isLoading, startResearch, stopResearch };
}
