import React, { useState, useMemo } from 'react';
import { useWebSocket, type E2BEvent } from '../hooks/useWebSocket';
import type { ReactNode } from 'react';
import { WebSocketContext, type WebSocketContextType } from './WebSocketContextDefinition';

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [e2bEvents, setE2bEvents] = useState<E2BEvent[]>([]);

  const sessionId = useMemo(
    () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const wsUrl = useMemo(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3003';
    return backendUrl.replace(/^http/, 'ws');
  }, []);

  const { isConnected } = useWebSocket({
    url: wsUrl,
    sessionId,
    onEvent: (event: E2BEvent) => {
      setE2bEvents((prev) => [...prev, event]);
    },
  });

  const clearEvents = () => {
    setE2bEvents([]);
  };

  const value: WebSocketContextType = {
    isConnected,
    sessionId,
    e2bEvents,
    clearEvents,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};
