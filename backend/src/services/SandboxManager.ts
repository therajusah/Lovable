import { Sandbox } from '@e2b/code-interpreter';
import { E2BEventEmitter } from '../websocket/E2BEventEmitter.js';

export class SandboxManager {
  private activeSandboxes: Map<string, Sandbox> = new Map();

  async createSandbox(
    templateId: string,
    apiKey: string,
    eventEmitter: E2BEventEmitter
  ): Promise<{ sandbox: Sandbox; sandboxId: string; previewUrl: string }> {
    eventEmitter.emitSandboxCreating();

    console.log(`Creating sandbox from template ${templateId}...`);

    const sandbox = await Sandbox.create(templateId, {
      apiKey,
      timeoutMs: 600000,
    });

    const sandboxId = sandbox.sandboxId;
    const host = sandbox.getHost(5173);
    const previewUrl = `https://${host}`;

    this.activeSandboxes.set(sandboxId, sandbox);

    eventEmitter.emitSandboxCreated(sandboxId, previewUrl);

    return { sandbox, sandboxId, previewUrl };
  }

  getSandbox(sandboxId: string): Sandbox | undefined {
    return this.activeSandboxes.get(sandboxId);
  }

  async deleteSandbox(sandboxId: string): Promise<boolean> {
    const sandbox = this.activeSandboxes.get(sandboxId);

    if (sandbox) {
      await sandbox.kill();
      this.activeSandboxes.delete(sandboxId);
      console.log(`Sandbox ${sandboxId} cleaned up successfully`);
      return true;
    }

    return false;
  }

  getAllSandboxes(): Array<{
    sandboxId: string;
    previewUrl: string;
    projectPath: string;
  }> {
    return Array.from(this.activeSandboxes.keys()).map((sandboxId) => ({
      sandboxId,
      previewUrl: `https://${sandboxId}`,
      projectPath: '/my-react-app',
    }));
  }

  getActiveSandboxCount(): number {
    return this.activeSandboxes.size;
  }
}

export const sandboxManager = new SandboxManager();
