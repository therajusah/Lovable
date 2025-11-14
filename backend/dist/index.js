import 'dotenv/config';
import express from 'express';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { SYSTEM_PROMPT } from './prompt.js';
import { tools } from './tools/index.js';
import cors from 'cors';
import { createServer } from 'http';
import { wsManager } from './websocket/WebSocketManager.js';
import { E2BEventEmitter } from './websocket/E2BEventEmitter.js';
import { sandboxManager } from './services/SandboxManager.js';
import { ToolHandlers } from './handlers/toolHandlers.js';
const TEMPLATE_ID = '1axn30rortnj6c7uptx9';
const app = express();
const port = process.env.PORT || 3003;
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => {
    res.json('Backend is running');
});
app.post('/prompt', async (req, res) => {
    const { prompt, sessionId } = req.body;
    if (!prompt) {
        return res.status(400).json({
            message: 'Prompt required',
        });
    }
    try {
        const eventEmitter = new E2BEventEmitter(sessionId);
        const { sandbox, sandboxId, previewUrl } = await sandboxManager.createSandbox(TEMPLATE_ID, process.env.E2B_API_KEY, eventEmitter);
        const toolContext = { sandbox, eventEmitter };
        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });
        let textStream;
        try {
            textStream = streamText({
                model: google('gemini-2.5-pro'),
                tools: tools,
                toolChoice: 'auto',
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT,
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            console.log('AI stream created successfully');
        }
        catch (aiError) {
            console.error('Error creating AI stream:', aiError);
            throw aiError;
        }
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        let finalResponseText = '';
        for await (const delta of textStream.fullStream) {
            if (delta.type === 'text-delta') {
                finalResponseText += delta.text;
                res.write(delta.text);
                console.log('AI text delta:', delta.text);
            }
            else if (delta.type === 'tool-call') {
                console.log(`Tool call: ${delta.toolName} with input:`, delta.input);
                try {
                    const result = await ToolHandlers.executeToolCall(delta.toolName, delta.input, toolContext);
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
        console.log('LLM finished processing. Final Text output:', finalResponseText);
        res.write('your website is ready! you can now view it in the preview panel.');
        res.end();
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Request failed',
            error: error instanceof Error ? error.message : 'Request failed',
        });
    }
});
app.delete('/sandbox/:sandboxId', async (req, res) => {
    const { sandboxId } = req.params;
    try {
        const deleted = await sandboxManager.deleteSandbox(sandboxId);
        if (deleted) {
            res.json({
                success: true,
                message: 'Sandbox deleted',
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: 'Sandbox not found',
            });
        }
    }
    catch (error) {
        console.error('Error cleaning up sandbox:', error);
        res.status(500).json({
            success: false,
            message: 'Request failed',
            error: error instanceof Error ? error.message : 'Request failed',
        });
    }
});
app.get('/sandboxes', (req, res) => {
    const sandboxList = sandboxManager.getAllSandboxes();
    res.json({
        success: true,
        activeSandboxes: sandboxList,
        count: sandboxList.length,
    });
});
const server = createServer(app);
wsManager.initialize(server);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`WebSocket server is ready`);
});
//# sourceMappingURL=index.js.map