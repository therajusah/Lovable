import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
export class WebSocketManager {
    wss = null;
    sessionClients = new Map();
    initialize(server) {
        this.wss = new WebSocketServer({ server });
        this.wss.on('connection', (ws) => {
            ws.on('message', (message) => {
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
    handleMessage(ws, message) {
        try {
            const data = JSON.parse(message.toString());
            if (data.type === 'register' && data.sessionId) {
                this.registerSession(data.sessionId, ws);
            }
        }
        catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    }
    registerSession(sessionId, ws) {
        const existingClient = this.sessionClients.get(sessionId);
        if (existingClient && existingClient.readyState === WebSocket.OPEN) {
            existingClient.close();
        }
        this.sessionClients.set(sessionId, ws);
        console.log(`Session registered: ${sessionId}`);
        ws.send(JSON.stringify({
            type: 'registered',
            sessionId,
        }));
    }
    handleDisconnect(ws) {
        for (const [sessionId, client] of this.sessionClients.entries()) {
            if (client === ws) {
                this.sessionClients.delete(sessionId);
                console.log(`Session disconnected: ${sessionId}`);
                break;
            }
        }
    }
    emitEvent(sessionId, event) {
        const client = this.sessionClients.get(sessionId);
        if (client && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(event));
        }
    }
    getActiveSessionsCount() {
        return this.sessionClients.size;
    }
    hasSession(sessionId) {
        return this.sessionClients.has(sessionId);
    }
}
export const wsManager = new WebSocketManager();
//# sourceMappingURL=WebSocketManager.js.map