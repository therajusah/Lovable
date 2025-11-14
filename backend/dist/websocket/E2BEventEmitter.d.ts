export declare class E2BEventEmitter {
    private sessionId?;
    constructor(sessionId?: string | undefined);
    private emit;
    emitSandboxCreating(): void;
    emitSandboxCreated(sandboxId: string, previewUrl: string): void;
    emitFileCreating(location: string): void;
    emitFileCreated(location: string): void;
    emitFileUpdating(location: string): void;
    emitFileUpdated(location: string): void;
    emitFileDeleting(location: string): void;
    emitFileDeleted(location: string): void;
    emitFileReading(location: string): void;
    emitFileRead(location: string): void;
    emitCommandExecuting(command: string): void;
    emitCommandCompleted(command: string, stdout: string, stderr: string, error: any): void;
    emitCommandError(command: string, errorMessage: string): void;
    emitToolError(toolName: string, errorMessage: string): void;
}
//# sourceMappingURL=E2BEventEmitter.d.ts.map