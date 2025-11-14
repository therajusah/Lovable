import { wsManager } from './WebSocketManager.js';
export class E2BEventEmitter {
    sessionId;
    constructor(sessionId) {
        this.sessionId = sessionId;
    }
    emit(event) {
        if (this.sessionId) {
            wsManager.emitEvent(this.sessionId, event);
        }
    }
    emitSandboxCreating() {
        this.emit({
            type: 'sandbox:creating',
            message: 'Creating E2B sandbox...',
            timestamp: Date.now(),
        });
    }
    emitSandboxCreated(sandboxId, previewUrl) {
        this.emit({
            type: 'sandbox:created',
            message: 'Sandbox created successfully',
            sandboxId,
            previewUrl,
            timestamp: Date.now(),
        });
    }
    emitFileCreating(location) {
        this.emit({
            type: 'tool:executing',
            tool: 'createFile',
            message: `Creating file: ${location}`,
            details: { location },
            timestamp: Date.now(),
        });
    }
    emitFileCreated(location) {
        this.emit({
            type: 'tool:completed',
            tool: 'createFile',
            message: `File '${location}' created successfully.`,
            details: { location },
            timestamp: Date.now(),
        });
    }
    emitFileUpdating(location) {
        this.emit({
            type: 'tool:executing',
            tool: 'updateFile',
            message: `Updating file: ${location}`,
            details: { location },
            timestamp: Date.now(),
        });
    }
    emitFileUpdated(location) {
        this.emit({
            type: 'tool:completed',
            tool: 'updateFile',
            message: `File '${location}' updated successfully.`,
            details: { location },
            timestamp: Date.now(),
        });
    }
    emitFileDeleting(location) {
        this.emit({
            type: 'tool:executing',
            tool: 'deleteFile',
            message: `Deleting: ${location}`,
            details: { location },
            timestamp: Date.now(),
        });
    }
    emitFileDeleted(location) {
        this.emit({
            type: 'tool:completed',
            tool: 'deleteFile',
            message: `File/Directory '${location}' deleted successfully.`,
            details: { location },
            timestamp: Date.now(),
        });
    }
    emitFileReading(location) {
        this.emit({
            type: 'tool:executing',
            tool: 'readFile',
            message: `Reading file: ${location}`,
            details: { location },
            timestamp: Date.now(),
        });
    }
    emitFileRead(location) {
        this.emit({
            type: 'tool:completed',
            tool: 'readFile',
            message: `File read: ${location}`,
            details: { location },
            timestamp: Date.now(),
        });
    }
    emitCommandExecuting(command) {
        this.emit({
            type: 'command:executing',
            tool: 'runCommand',
            message: `Running: ${command}`,
            details: { command },
            timestamp: Date.now(),
        });
    }
    emitCommandCompleted(command, stdout, stderr, error) {
        this.emit({
            type: 'command:completed',
            tool: 'runCommand',
            message: `Command completed: ${command}`,
            details: {
                command,
                stdout,
                stderr,
                error,
            },
            timestamp: Date.now(),
        });
    }
    emitCommandError(command, errorMessage) {
        this.emit({
            type: 'command:error',
            tool: 'runCommand',
            message: errorMessage,
            details: { command },
            timestamp: Date.now(),
        });
    }
    emitToolError(toolName, errorMessage) {
        this.emit({
            type: 'tool:error',
            tool: toolName,
            message: errorMessage,
            timestamp: Date.now(),
        });
    }
}
//# sourceMappingURL=E2BEventEmitter.js.map