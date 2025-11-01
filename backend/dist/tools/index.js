import { tool } from 'ai';
import { z } from "zod";
export const createFile = tool({
    description: 'Create a file at a certain directory',
    inputSchema: z.object({
        location: z.string().describe('Relative path to the file (e.g., src/components/Button.jsx)'),
        content: z.string().describe('Content of the file'),
    }),
    execute: async ({ location, content }) => {
        return `File '${location}' would be created with content.`;
    },
});
export const updateFile = tool({
    description: 'Update a file at a certain directory. This overwrites the file.',
    inputSchema: z.object({
        location: z.string().describe('Relative path to the file'),
        content: z.string().describe('New content of the file'),
    }),
    execute: async ({ location, content }) => {
        return `File '${location}' would be updated with new content.`;
    },
});
export const deleteFile = tool({
    description: 'Delete a file or directory at a certain directory',
    inputSchema: z.object({
        location: z.string().describe('Relative path to the file or directory'),
    }),
    execute: async ({ location }) => {
        return `File/Directory '${location}' would be deleted.`;
    },
});
export const readFile = tool({
    description: 'Read the content of a file at a certain directory',
    inputSchema: z.object({
        location: z.string().describe('Relative path to the file'),
    }),
    execute: async ({ location }) => {
        return `Content of '${location}' would be read.`;
    },
});
export const runCommand = tool({
    description: 'Execute a shell command in the sandbox and get its output. Use this for `npm install`, `npm run build`, `npm run dev`, or any other shell commands.',
    inputSchema: z.object({
        command: z.string().describe('The shell command to execute'),
    }),
    execute: async ({ command }) => {
        return `Command '${command}' would be executed.`;
    },
});
export const tools = {
    createFile,
    updateFile,
    deleteFile,
    readFile,
    runCommand,
};
//# sourceMappingURL=index.js.map