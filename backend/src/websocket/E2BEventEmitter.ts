import { wsManager, type E2BEventData } from './WebSocketManager.js';

export class E2BEventEmitter {
  constructor(private sessionId?: string) {}

  private emit(event: E2BEventData) {
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

  emitSandboxCreated(sandboxId: string, previewUrl: string) {
    this.emit({
      type: 'sandbox:created',
      message: 'Sandbox created successfully',
      sandboxId,
      previewUrl,
      timestamp: Date.now(),
    });
  }

  emitFileCreating(location: string) {
    this.emit({
      type: 'tool:executing',
      tool: 'createFile',
      message: `Creating file: ${location}`,
      details: { location },
      timestamp: Date.now(),
    });
  }

  emitFileCreated(location: string) {
    this.emit({
      type: 'tool:completed',
      tool: 'createFile',
      message: `File '${location}' created successfully.`,
      details: { location },
      timestamp: Date.now(),
    });
  }

  emitFileUpdating(location: string) {
    this.emit({
      type: 'tool:executing',
      tool: 'updateFile',
      message: `Updating file: ${location}`,
      details: { location },
      timestamp: Date.now(),
    });
  }

  emitFileUpdated(location: string) {
    this.emit({
      type: 'tool:completed',
      tool: 'updateFile',
      message: `File '${location}' updated successfully.`,
      details: { location },
      timestamp: Date.now(),
    });
  }

  emitFileDeleting(location: string) {
    this.emit({
      type: 'tool:executing',
      tool: 'deleteFile',
      message: `Deleting: ${location}`,
      details: { location },
      timestamp: Date.now(),
    });
  }

  emitFileDeleted(location: string) {
    this.emit({
      type: 'tool:completed',
      tool: 'deleteFile',
      message: `File/Directory '${location}' deleted successfully.`,
      details: { location },
      timestamp: Date.now(),
    });
  }

  emitFileReading(location: string) {
    this.emit({
      type: 'tool:executing',
      tool: 'readFile',
      message: `Reading file: ${location}`,
      details: { location },
      timestamp: Date.now(),
    });
  }

  emitFileRead(location: string) {
    this.emit({
      type: 'tool:completed',
      tool: 'readFile',
      message: `File read: ${location}`,
      details: { location },
      timestamp: Date.now(),
    });
  }

  emitCommandExecuting(command: string) {
    this.emit({
      type: 'command:executing',
      tool: 'runCommand',
      message: `Running: ${command}`,
      details: { command },
      timestamp: Date.now(),
    });
  }

  emitCommandCompleted(command: string, stdout: string, stderr: string, error: any) {
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

  emitCommandError(command: string, errorMessage: string) {
    this.emit({
      type: 'command:error',
      tool: 'runCommand',
      message: errorMessage,
      details: { command },
      timestamp: Date.now(),
    });
  }

  emitToolError(toolName: string, errorMessage: string) {
    this.emit({
      type: 'tool:error',
      tool: toolName,
      message: errorMessage,
      timestamp: Date.now(),
    });
  }
}
