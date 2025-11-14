import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export interface E2BEventData {
  type: string;
  tool?: string;
  message: string;
  details?: any;
  timestamp: number;
  sandboxId?: string;
  previewUrl?: string;
}

export class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private sessionClients: Map<string, WebSocket> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string) => {
        this.handleMessage(ws, message);
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });

    console.log('WebSocket server initialized');
  }

  private handleMessage(ws: WebSocket, message: string) {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'register' && data.sessionId) {
        this.registerSession(data.sessionId, ws);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  private registerSession(sessionId: string, ws: WebSocket) {
    const existingClient = this.sessionClients.get(sessionId);
    if (existingClient && existingClient.readyState === WebSocket.OPEN) {
      existingClient.close();
    }

    this.sessionClients.set(sessionId, ws);
    console.log(`Session registered: ${sessionId}`);

    ws.send(
      JSON.stringify({
        type: 'registered',
        sessionId,
      })
    );
  }

  private handleDisconnect(ws: WebSocket) {
    for (const [sessionId, client] of this.sessionClients.entries()) {
      if (client === ws) {
        this.sessionClients.delete(sessionId);
        console.log(`Session disconnected: ${sessionId}`);
        break;
      }
    }
  }

  emitEvent(sessionId: string, event: E2BEventData) {
    const client = this.sessionClients.get(sessionId);

    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  }

  getActiveSessionsCount(): number {
    return this.sessionClients.size;
  }

  hasSession(sessionId: string): boolean {
    return this.sessionClients.has(sessionId);
  }
}

export const wsManager = new WebSocketManager();
