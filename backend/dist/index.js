import 'dotenv/config';
import express from "express";
import { Sandbox } from "@e2b/code-interpreter";
import { v0 } from 'v0-sdk';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { SYSTEM_PROMPT } from './prompt.js';
import { tools } from './tools/index.js';
import cors from "cors";
const TEMPLATE_ID = "iigcaz28v99qoyhuqm1j";
const app = express();
const port = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());
const activeSandboxes = new Map();
app.post("/prompt", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({
            message: 'prompt is required.'
        });
    }
    let sandbox = null;
    try {
        console.log(`Creating sandbox from template ${TEMPLATE_ID}...`);
        sandbox = await Sandbox.create(TEMPLATE_ID, {
            apiKey: process.env.E2B_API_KEY,
            timeoutMs: 300000, // 5 minutes timeout
        });
        console.log(`Sandbox created successfully`);
        const toolContext = { sandbox };
        // Option 1: Use v0 SDK for chat creation (non-streaming)
        // const chat = await v0.chats.create({
        //     message: prompt,
        // });
        // Use Gemini for streaming with tools
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });
        const textStream = streamText({
            model: google('gemini-1.5-flash'),
            tools: tools,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });
        // Set up streaming response
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        let finalResponseText = '';
        // Handle streaming with tool calls
        for await (const delta of textStream.fullStream) {
            if (delta.type === 'text-delta') {
                finalResponseText += delta.text;
                res.write(delta.text);
            }
            else if (delta.type === 'tool-call') {
                console.log(`Tool call: ${delta.toolName} with input:`, delta.input);
                // Handle tool execution with sandbox
                try {
                    let result = '';
                    const input = delta.input;
                    if (delta.toolName === 'createFile') {
                        await sandbox.files.write(input.location, input.content);
                        result = `File '${input.location}' created successfully.`;
                    }
                    else if (delta.toolName === 'updateFile') {
                        await sandbox.files.write(input.location, input.content);
                        result = `File '${input.location}' updated successfully.`;
                    }
                    else if (delta.toolName === 'deleteFile') {
                        await sandbox.files.remove(input.location);
                        result = `File/Directory '${input.location}' deleted successfully.`;
                    }
                    else if (delta.toolName === 'readFile') {
                        const content = await sandbox.files.read(input.location);
                        result = `Content of '${input.location}':\n\`\`\`\n${content}\n\`\`\``;
                    }
                    else if (delta.toolName === 'runCommand') {
                        try {
                            // Use E2B's correct API for running commands
                            const commandResult = await sandbox.runCode(input.command);
                            result = `Command: \`${input.command}\`\nOutput:\n\`\`\`\n${commandResult}\n\`\`\``;
                        }
                        catch (cmdError) {
                            result = `Error executing command '${input.command}': ${cmdError instanceof Error ? cmdError.message : String(cmdError)}`;
                        }
                    }
                    console.log(`Tool result: ${result}`);
                    res.write(`\n[Tool ${delta.toolName} executed: ${result}]\n`);
                }
                catch (error) {
                    const errorMsg = `Error executing tool ${delta.toolName}: ${error instanceof Error ? error.message : String(error)}`;
                    console.error(errorMsg);
                    res.write(`\n[Tool ${delta.toolName} error: ${errorMsg}]\n`);
                }
            }
        }
        console.log("LLM finished processing. Final Text output:", finalResponseText);
        // Get preview URL for the sandbox
        const viteDevPort = 5173;
        const host = sandbox.getHost(viteDevPort);
        const previewUrl = `https://${host}`;
        // Send preview URL information as part of the stream
        res.write(`\n\n🎉 **Website Preview Available!**\n`);
        res.write(`Preview URL: ${previewUrl}\n`);
        res.write(`Sandbox ID: ${host}\n`);
        res.write(`\nYou can now view your website at the preview URL above!\n`);
        res.end();
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
    finally {
        // Clean up sandbox
        if (sandbox) {
            try {
                await sandbox.kill();
                console.log(`Sandbox closed`);
            }
            catch (closeError) {
                console.error('Error closing sandbox:', closeError);
            }
        }
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Make sure to set V0_API_KEY, GOOGLE_API_KEY and E2B_API_KEY in your .env file`);
});
//# sourceMappingURL=index.js.map