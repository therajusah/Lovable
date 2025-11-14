import { createContext } from 'react';
import type { E2BEvent } from '../hooks/useWebSocket';

export interface WebSocketContextType {
  isConnected: boolean;
  sessionId: string;
  e2bEvents: E2BEvent[];
  clearEvents: () => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);
