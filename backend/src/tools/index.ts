import { tool } from 'ai';
import { z } from "zod";

// Define tools that work with AI SDK 5
export const createFile = tool({
    description: 'Create a file at a certain directory',
    inputSchema: z.object({
        location: z.string().describe('Relative path to the file (e.g., src/components/Button.tsx)'),
        content: z.string().describe('Content of the file'),
    }),
    execute: async ({ location, content }: { location: string; content: string }) => {
        // This will be handled by the tool execution in the main file
        return `File '${location}' created successfully.`;
    },
});

export const updateFile = tool({
    description: 'Update a file at a certain directory. This overwrites the file.',
    inputSchema: z.object({
        location: z.string().describe('Relative path to the file'),
        content: z.string().describe('New content of the file'),
    }),
    execute: async ({ location, content }: { location: string; content: string }) => {
        return `File '${location}' updated successfully.`;
    },
});

export const deleteFile = tool({
    description: 'Delete a file or directory at a certain directory',
    inputSchema: z.object({
        location: z.string().describe('Relative path to the file or directory'),
    }),
    execute: async ({ location }: { location: string }) => {
        return `File/Directory '${location}' deleted successfully.`;
    },
});

export const readFile = tool({
    description: 'Read the content of a file at a certain directory',
    inputSchema: z.object({
        location: z.string().describe('Relative path to the file'),
    }),
    execute: async ({ location }: { location: string }) => {
        return `Content of '${location}' would be read here.`;
    },
});

export const runCommand = tool({
    description: 'Execute a shell command in the sandbox and get its output. Use this for `npm install`, `npm run build`, `npm run dev`, or any other shell commands.',
    inputSchema: z.object({
        command: z.string().describe('The shell command to execute'),
    }),
    execute: async ({ command }: { command: string }) => {
        return `Command '${command}' would be executed here.`;
    },
});

// Export all tools as an object
export const tools = {
    createFile,
    updateFile,
    deleteFile,
    readFile,
    runCommand,
};