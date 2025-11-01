import 'dotenv/config';
import express from "express";
import { Sandbox } from "@e2b/code-interpreter";
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { SYSTEM_PROMPT } from './prompt.js';
import { tools } from './tools/index.js';
import cors from "cors";
const TEMPLATE_ID = "1axn30rortnj6c7uptx9";
const app = express();
const port = process.env.PORT || 3003;
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
            timeoutMs: 600000,
        });
        console.log(`Sandbox created successfully`);
        const sandboxId = sandbox.sandboxId;
        const host = sandbox.getHost(5173);
        const previewUrl = `https://${host}`;
        activeSandboxes.set(sandboxId, sandbox);
        const toolContext = { sandbox };
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
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
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
                            const execution = await sandbox.runCode(input.command);
                            const stdout = execution.logs.stdout.join('\n');
                            const stderr = execution.logs.stderr.join('\n');
                            const output = stdout + (stderr ? `\nSTDERR: ${stderr}` : '');
                            const errorMsg = execution.error ? `\nError: ${execution.error.name}: ${execution.error.value}` : '';
                            result = `Command: \`${input.command}\`\nOutput:\n\`\`\`\n${output}${errorMsg}\n\`\`\``;
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
        res.write(`\n\n**Website Preview Available!**\n`);
        res.write(`Preview URL: ${previewUrl}\n`);
        res.write(`Sandbox ID: ${sandboxId}\n`);
        res.write(`\nYou can now view your website at the preview URL above!\n`);
        res.write(`\nTo clean up this sandbox later, use: DELETE /sandbox/${sandboxId}\n`);
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
});
app.delete("/sandbox/:sandboxId", async (req, res) => {
    const { sandboxId } = req.params;
    try {
        const sandbox = activeSandboxes.get(sandboxId);
        if (sandbox) {
            await sandbox.kill();
            activeSandboxes.delete(sandboxId);
            console.log(`Sandbox ${sandboxId} cleaned up successfully`);
            res.json({
                success: true,
                message: `Sandbox ${sandboxId} cleaned up successfully`
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: `Sandbox ${sandboxId} not found`
            });
        }
    }
    catch (error) {
        console.error('Error cleaning up sandbox:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while cleaning up the sandbox',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
app.get("/sandboxes", (req, res) => {
    const sandboxList = Array.from(activeSandboxes.keys()).map(sandboxId => ({
        sandboxId,
        previewUrl: `https://${sandboxId}`,
        projectPath: '/my-react-app'
    }));
    res.json({
        success: true,
        activeSandboxes: sandboxList,
        count: sandboxList.length
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map