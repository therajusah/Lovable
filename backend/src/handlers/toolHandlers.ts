import { Sandbox } from '@e2b/code-interpreter';
import { E2BEventEmitter } from '../websocket/E2BEventEmitter.js';

export interface ToolExecutionContext {
  sandbox: Sandbox;
  eventEmitter: E2BEventEmitter;
}

export class ToolHandlers {
  static async handleCreateFile(
    input: { location: string; content: string },
    context: ToolExecutionContext
  ): Promise<string> {
    context.eventEmitter.emitFileCreating(input.location);

    await context.sandbox.files.write(input.location, input.content);
    const result = `File created: ${input.location}`;

    context.eventEmitter.emitFileCreated(input.location);

    return result;
  }

  static async handleUpdateFile(
    input: { location: string; content: string },
    context: ToolExecutionContext
  ): Promise<string> {
    context.eventEmitter.emitFileUpdating(input.location);

    await context.sandbox.files.write(input.location, input.content);
    const result = `File updated: ${input.location}`;

    context.eventEmitter.emitFileUpdated(input.location);

    return result;
  }

  static async handleDeleteFile(
    input: { location: string },
    context: ToolExecutionContext
  ): Promise<string> {
    context.eventEmitter.emitFileDeleting(input.location);

    await context.sandbox.files.remove(input.location);
    const result = `Deleted: ${input.location}`;

    context.eventEmitter.emitFileDeleted(input.location);

    return result;
  }

  static async handleReadFile(
    input: { location: string },
    context: ToolExecutionContext
  ): Promise<string> {
    context.eventEmitter.emitFileReading(input.location);

    const content = await context.sandbox.files.read(input.location);
    const result = `${input.location}:\n\`\`\`\n${content}\n\`\`\``;

    context.eventEmitter.emitFileRead(input.location);

    return result;
  }

  static async handleRunCommand(
    input: { command: string },
    context: ToolExecutionContext
  ): Promise<string> {
    try {
      context.eventEmitter.emitCommandExecuting(input.command);

      const execution = await context.sandbox.runCode(input.command);
      const stdout = execution.logs.stdout.join('\n');
      const stderr = execution.logs.stderr.join('\n');
      const output = stdout + (stderr ? `\nSTDERR: ${stderr}` : '');
      const errorMsg = execution.error
        ? `\nError: ${execution.error.name}: ${execution.error.value}`
        : '';
      const result = `\`${input.command}\`\n\`\`\`\n${output}${errorMsg}\n\`\`\``;

      context.eventEmitter.emitCommandCompleted(
        input.command,
        stdout,
        stderr,
        execution.error
      );

      return result;
    } catch (cmdError) {
      const errorMessage = `Command failed: ${
        cmdError instanceof Error ? cmdError.message : String(cmdError)
      }`;

      context.eventEmitter.emitCommandError(input.command, errorMessage);

      return errorMessage;
    }
  }

  static async executeToolCall(
    toolName: string,
    input: any,
    context: ToolExecutionContext
  ): Promise<string> {
    try {
      switch (toolName) {
        case 'createFile':
          return await this.handleCreateFile(input, context);
        case 'updateFile':
          return await this.handleUpdateFile(input, context);
        case 'deleteFile':
          return await this.handleDeleteFile(input, context);
        case 'readFile':
          return await this.handleReadFile(input, context);
        case 'runCommand':
          return await this.handleRunCommand(input, context);
        default:
          throw new Error(`Unknown tool`);
      }
    } catch (error) {
      const errorMsg = `Tool failed: ${
        error instanceof Error ? error.message : String(error)
      }`;
      context.eventEmitter.emitToolError(toolName, errorMsg);
      throw error;
    }
  }
}
