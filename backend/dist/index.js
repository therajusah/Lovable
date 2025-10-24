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
        });
        console.log(`Sandbox created successfully`);
        const sandboxId = sandbox.sandboxId;
        sandbox.setTimeout(300000);
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
                model: google('gemini-2.5-flash'),
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
        res.write(`\n\n🎉 **Website Preview Available!**\n`);
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
app.post("/init-vite-react", async (req, res) => {
    let sandbox = null;
    try {
        console.log(`Creating sandbox from template ${TEMPLATE_ID}...`);
        sandbox = await Sandbox.create(TEMPLATE_ID);
        console.log(`Sandbox created successfully`);
        const sandboxId = sandbox.sandboxId;
        sandbox.setTimeout(300000);
        const host = sandbox.getHost(5173);
        const previewUrl = `https://${host}`;
        activeSandboxes.set(sandboxId, sandbox);
        console.log(" Initializing Vite React app inside sandbox...");
        console.log("Starting Vite development server...");
        try {
            const checkProcess = await sandbox.commands.run("ps aux | grep vite", {
                cwd: "/home/user/react-app",
            });
            console.log("Vite process check:", checkProcess);
            const portCheck = await sandbox.commands.run("netstat -tlnp | grep 5173", {
                cwd: "/home/user/react-app",
            });
            console.log("Port 5173 check:", portCheck);
            const configCheck = await sandbox.commands.run("cat vite.config.js", {
                cwd: "/home/user/react-app",
            });
            console.log("Vite config:", configCheck);
        }
        catch (checkError) {
            console.log("Error checking Vite process:", checkError);
        }
        console.log(`React app should be running at: ${previewUrl}:5173`);
        res.json({
            success: true,
            message: "Vite React app created and running inside the sandbox",
            sandboxId,
            previewUrl: previewUrl,
            nextSteps: [
                "Visit the preview URL to access your running React app",
                "Use the E2B dashboard to inspect or manage the sandbox",
            ],
        });
    }
    catch (error) {
        console.error("Error initializing Vite React app:", error);
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        const isPortError = errorMessage.includes("port is not open") ||
            errorMessage.includes("502") ||
            errorMessage.includes("connection refused");
        res.status(500).json({
            success: false,
            message: isPortError
                ? "E2B sandbox port configuration issue — try a different template or contact E2B support"
                : "An error occurred while initializing the Vite React app",
            error: errorMessage,
            sandboxId: sandbox?.sandboxId || "unknown",
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
app.delete("/cleanup-templates", async (req, res) => {
    const templatesToDelete = ["73bu50moaayy3jt8ftpv", "v8sgpvr28cszl74a9w52"];
    const results = [];
    for (const templateId of templatesToDelete) {
        try {
            results.push({
                templateId,
                status: 'requires_manual_deletion',
                message: 'Template deletion must be done through E2B dashboard'
            });
        }
        catch (error) {
            results.push({
                templateId,
                status: 'error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    res.json({
        success: true,
        message: 'Template cleanup attempted',
        results: results,
        note: 'Templates must be deleted manually through the E2B dashboard'
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map