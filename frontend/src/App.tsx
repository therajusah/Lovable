"use client"

import { useState } from "react"
import { ChatPanel } from "./components/chat-panel"
import { CodeEditor } from "./components/code-editor"
import { PreviewPanel } from "./components/preview-panel"
import { Button } from "./components/ui/button"
import { Code2, Eye, Maximize2, PanelLeftOpen, X, TerminalSquare } from "lucide-react"
import { Terminal } from "./components/terminal"

export interface FileNode {
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
}

const defaultFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "App.tsx",
        type: "file",
        content: `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App`,
      },
      {
        name: "App.css",
        type: "file",
        content: `.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}`,
      },
      {
        name: "main.tsx",
        type: "file",
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      },
      {
        name: "index.css",
        type: "file",
        content: `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}`,
      },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [],
  },
  {
    name: "index.html",
    type: "file",
    content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lovable</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
  },
  {
    name: "package.json",
    type: "file",
    content: `{
  "name": "ai-code-studio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "@monaco-editor/react": "^4.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.16"
  }
}`,
  },
  {
    name: "vite.config.ts",
    type: "file",
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`,
  },
]

export default function App() {
  const [activeView, setActiveView] = useState<"split" | "code" | "preview">("split")
  const [showChat, setShowChat] = useState(true)
  const [showCode, setShowCode] = useState(true)
  const [showTerminal, setShowTerminal] = useState(false)
  const [chatWidth, setChatWidth] = useState(320) // Default width in pixels

  const [files, setFiles] = useState<FileNode[]>(defaultFiles)
  const [activeFile, setActiveFile] = useState<string>("src/App.tsx")

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI coding assistant. Describe what you'd like to build, and I'll generate the code for you.",
    },
  ])

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }])

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I've generated the code based on your request. Check the editor and preview!",
        },
      ])
    }, 1000)
  }

  const updateFileContent = (path: string, content: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        const nodePath = node.type === "folder" ? node.name : node.name
        if (path.startsWith(nodePath)) {
          if (path === nodePath && node.type === "file") {
            return { ...node, content }
          }
          if (node.type === "folder" && node.children) {
            return { ...node, children: updateNode(node.children) }
          }
        }
        return node
      })
    }

    setFiles(updateNode(files))
  }

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = chatWidth

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX)
      const minWidth = 200
      const maxWidth = 600
      setChatWidth(Math.min(Math.max(newWidth, minWidth), maxWidth))
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-sm shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Code Studio</h1>
              <p className="text-xs text-slate-400">Build with AI assistance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant={activeView === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("split")}
              className="gap-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium shadow-lg"
            >
              <Maximize2 className="w-4 h-4" />
              Split
            </Button>
            <Button
              variant={activeView === "code" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("code")}
              className="gap-2 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all duration-200"
            >
              <Code2 className="w-4 h-4" />
              Code
            </Button>
            <Button
              variant={activeView === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("preview")}
              className="gap-2 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button
              variant={showTerminal ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowTerminal(!showTerminal)}
              className="gap-2 hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all duration-200"
            >
              <TerminalSquare className="w-4 h-4" />
              Terminal
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col">
        <div className={`flex flex-1 overflow-hidden ${showTerminal ? "h-2/3" : ""}`}>
          <div
            className={`${activeView === "preview" || activeView === "code" ? "hidden" : showChat ? "flex" : "hidden"} border-r border-slate-800/50 bg-slate-950/20 backdrop-blur-sm relative shadow-lg shrink-0`}
            style={{ width: `${chatWidth}px` }}
          >
            <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(false)}
              className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm transition-all duration-200 z-10"
            >
              <X className="w-4 h-4" />
            </Button>
            {/* Resize handle */}
            <div
              className="absolute top-0 right-0 w-2 h-full bg-transparent hover:bg-cyan-500/30 cursor-col-resize transition-colors duration-200 z-20 group"
              onMouseDown={handleResize}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-slate-600 group-hover:bg-cyan-400 transition-colors duration-200 rounded-full" />
            </div>
          </div>

          {!showChat && activeView === "split" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(true)}
              className="absolute left-2 top-20 h-10 w-10 bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-slate-700 z-10 backdrop-blur-sm"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </Button>
          )}

          <div
            className={`${activeView === "preview" ? "hidden" : showCode ? "flex" : "hidden"} ${activeView === "code" ? "flex-1" : "flex-1"} border-r border-slate-800/50 relative shadow-lg`}
          >
            <CodeEditor
              files={files}
              activeFile={activeFile}
              onFileSelect={setActiveFile}
              onFileChange={updateFileContent}
            />
            {activeView === "split" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCode(false)}
                className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm z-10 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {!showCode && activeView === "split" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCode(true)}
              className="absolute left-2 top-20 h-10 w-10 bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-slate-700 z-10 backdrop-blur-sm"
            >
              <Code2 className="w-5 h-5" />
            </Button>
          )}

          <div
            className={`${activeView === "code" ? "hidden" : "flex"} ${activeView === "preview" ? "flex-1" : "flex-1"}`}
          >
            <PreviewPanel files={files} />
          </div>
        </div>

        {showTerminal && (
          <div className="h-1/3 border-t border-slate-800">
            <Terminal onClose={() => setShowTerminal(false)} />
          </div>
        )}
      </div>
    </div>
  )
}
