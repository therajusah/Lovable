"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { TerminalIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TerminalProps {
  onClose: () => void
}

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
}

export function Terminal({ onClose }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: "Terminal ready. Type 'help' for available commands." },
  ])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    setLines((prev) => [...prev, { type: "command", content: `$ ${trimmedCmd}` }])
    setHistory((prev) => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    const [command, ...args] = trimmedCmd.split(" ")

    switch (command.toLowerCase()) {
      case "help":
        setLines((prev) => [
          ...prev,
          { type: "output", content: "Available commands:" },
          { type: "output", content: "  help       - Show this help message" },
          { type: "output", content: "  clear      - Clear terminal" },
          { type: "output", content: "  npm        - Run npm commands (simulated)" },
          { type: "output", content: "  ls         - List files" },
          { type: "output", content: "  pwd        - Print working directory" },
          { type: "output", content: "  echo       - Echo text" },
        ])
        break

      case "clear":
        setLines([])
        break

      case "npm":
        if (args[0] === "install" || args[0] === "i") {
          setLines((prev) => [
            ...prev,
            { type: "output", content: `Installing ${args.slice(1).join(" ") || "dependencies"}...` },
            { type: "output", content: "✓ Dependencies installed successfully" },
          ])
        } else if (args[0] === "run") {
          setLines((prev) => [
            ...prev,
            { type: "output", content: `Running script: ${args[1]}...` },
            { type: "output", content: "✓ Script executed successfully" },
          ])
        } else {
          setLines((prev) => [...prev, { type: "output", content: `npm ${args.join(" ")}` }])
        }
        break

      case "ls":
        setLines((prev) => [
          ...prev,
          { type: "output", content: "src/  public/  index.html  package.json  vite.config.ts  tsconfig.json" },
        ])
        break

      case "pwd":
        setLines((prev) => [...prev, { type: "output", content: "/workspace/ai-code-studio" }])
        break

      case "echo":
        setLines((prev) => [...prev, { type: "output", content: args.join(" ") }])
        break

      default:
        setLines((prev) => [
          ...prev,
          { type: "error", content: `Command not found: ${command}. Type 'help' for available commands.` },
        ])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/50 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600">
            <TerminalIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-white">Terminal</span>
            <p className="text-xs text-slate-400">Command line interface</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-4 font-mono text-sm space-y-1">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`${
                line.type === "command" ? "text-cyan-400 font-semibold" : line.type === "error" ? "text-red-400" : "text-slate-300"
              }`}
            >
              {line.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-800/50 bg-slate-950/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm font-semibold">$</span>
          <div className="w-2 h-4 bg-cyan-400 animate-pulse"></div>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-slate-300 font-mono text-sm outline-none placeholder:text-slate-500"
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </div>
  )
}
