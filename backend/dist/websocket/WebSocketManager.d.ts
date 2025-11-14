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
export declare class WebSocketManager {
    private wss;
    private sessionClients;
    initialize(server: Server): void;
    private handleMessage;
    private registerSession;
    private handleDisconnect;
    emitEvent(sessionId: string, event: E2BEventData): void;
    getActiveSessionsCount(): number;
    hasSession(sessionId: string): boolean;
}
export declare const wsManager: WebSocketManager;
//# sourceMappingURL=WebSocketManager.d.ts.map