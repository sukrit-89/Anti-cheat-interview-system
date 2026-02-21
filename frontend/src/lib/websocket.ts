import { useEffect, useCallback, useRef, useState } from 'react';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export interface WebSocketMessage {
    type: string;
    timestamp: string;
    data: any;
}

export function useWebSocket(sessionId: number | null) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);

    const connect = useCallback(() => {
        if (!sessionId) return;

        const ws = new WebSocket(`${WS_BASE_URL}/api/ws/session/${sessionId}`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setLastMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            wsRef.current = null;

            reconnectTimeoutRef.current = setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect();
            }, 3000);
        };

        wsRef.current = ws;
    }, [sessionId]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return {
        isConnected,
        lastMessage,
        sendMessage,
        reconnect: connect,
    };
}

export function useLiveMonitoring(sessionId: number | null) {
    const [isConnected, setIsConnected] = useState(false);
    const [metrics, setMetrics] = useState<any>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const pingIntervalRef = useRef<number | null>(null);

    const connect = useCallback(() => {
        if (!sessionId) return;

        const ws = new WebSocket(`${WS_BASE_URL}/api/ws/live/${sessionId}`);

        ws.onopen = () => {
            console.log('Live monitoring connected');
            setIsConnected(true);

            pingIntervalRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'ping' }));
                }
            }, 30000);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'metrics_update') {
                    setMetrics(message.data);
                }
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        };

        ws.onclose = () => {
            console.log('Live monitoring disconnected');
            setIsConnected(false);
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
        };

        wsRef.current = ws;
    }, [sessionId]);

    const disconnect = useCallback(() => {
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const requestMetrics = useCallback(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'request_metrics' }));
        }
    }, []);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return {
        isConnected,
        metrics,
        requestMetrics,
        flags: [] as any[], // Add flags for compatibility - will be populated when backend implements it
    };
}
