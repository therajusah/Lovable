import { Sandbox } from '@e2b/code-interpreter';
import { E2BEventEmitter } from '../websocket/E2BEventEmitter.js';
export interface ToolExecutionContext {
    sandbox: Sandbox;
    eventEmitter: E2BEventEmitter;
}
export declare class ToolHandlers {
    static handleCreateFile(input: {
        location: string;
        content: string;
    }, context: ToolExecutionContext): Promise<string>;
    static handleUpdateFile(input: {
        location: string;
        content: string;
    }, context: ToolExecutionContext): Promise<string>;
    static handleDeleteFile(input: {
        location: string;
    }, context: ToolExecutionContext): Promise<string>;
    static handleReadFile(input: {
        location: string;
    }, context: ToolExecutionContext): Promise<string>;
    static handleRunCommand(input: {
        command: string;
    }, context: ToolExecutionContext): Promise<string>;
    static executeToolCall(toolName: string, input: any, context: ToolExecutionContext): Promise<string>;
}
//# sourceMappingURL=toolHandlers.d.ts.map