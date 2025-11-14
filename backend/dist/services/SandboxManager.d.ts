import { Sandbox } from '@e2b/code-interpreter';
import { E2BEventEmitter } from '../websocket/E2BEventEmitter.js';
export declare class SandboxManager {
    private activeSandboxes;
    createSandbox(templateId: string, apiKey: string, eventEmitter: E2BEventEmitter): Promise<{
        sandbox: Sandbox;
        sandboxId: string;
        previewUrl: string;
    }>;
    getSandbox(sandboxId: string): Sandbox | undefined;
    deleteSandbox(sandboxId: string): Promise<boolean>;
    getAllSandboxes(): Array<{
        sandboxId: string;
        previewUrl: string;
        projectPath: string;
    }>;
    getActiveSandboxCount(): number;
}
export declare const sandboxManager: SandboxManager;
//# sourceMappingURL=SandboxManager.d.ts.map