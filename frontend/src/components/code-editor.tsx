"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
import { Code2, ChevronRight, ChevronDown, File, Folder, PanelLeftClose, PanelLeft } from "lucide-react"
import type { FileNode } from "@/App"

interface CodeEditorProps {
  files: FileNode[]
  activeFile: string
  onFileSelect: (path: string) => void
  onFileChange: (path: string, content: string) => void
}

function FileTree({
  nodes,
  onFileSelect,
  activeFile,
  basePath = "",
}: {
  nodes: FileNode[]
  onFileSelect: (path: string) => void
  activeFile: string
  basePath?: string
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ src: true })

  const toggleFolder = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="text-sm">
      {nodes.map((node) => {
        const fullPath = basePath ? `${basePath}/${node.name}` : node.name
        const isActive = activeFile === fullPath

        if (node.type === "folder") {
          const isExpanded = expanded[node.name]
          return (
            <div key={fullPath}>
              <button
                onClick={() => toggleFolder(node.name)}
                className="flex items-center gap-1 w-full px-2 py-1 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 shrink-0" />
                )}
                <Folder className="w-4 h-4 shrink-0 text-cyan-400" />
                <span className="truncate">{node.name}</span>
              </button>
              {isExpanded && node.children && (
                <div className="ml-4">
                  <FileTree
                    nodes={node.children}
                    onFileSelect={onFileSelect}
                    activeFile={activeFile}
                    basePath={fullPath}
                  />
                </div>
              )}
            </div>
          )
        }

        return (
          <button
            key={fullPath}
            onClick={() => onFileSelect(fullPath)}
            className={`flex items-center gap-1 w-full px-2 py-1 hover:bg-slate-800 transition-colors ${
              isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            <File className="w-4 h-4 shrink-0 text-slate-400 ml-4" />
            <span className="truncate">{node.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export function CodeEditor({ files, activeFile, onFileSelect, onFileChange }: CodeEditorProps) {
  const [showExplorer, setShowExplorer] = useState(true)

  const getFileContent = (path: string): string => {
    const parts = path.split("/")
    let current: FileNode[] = files

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const node = current.find((n) => n.name === part)

      if (!node) return ""

      if (i === parts.length - 1) {
        return node.content || ""
      }

      if (node.type === "folder" && node.children) {
        current = node.children
      }
    }

    return ""
  }

  const getLanguage = (filename: string): string => {
    const ext = filename.split(".").pop()
    const languageMap: Record<string, string> = {
      tsx: "typescript",
      ts: "typescript",
      jsx: "javascript",
      js: "javascript",
      css: "css",
      html: "html",
      json: "json",
    }
    return languageMap[ext || ""] || "plaintext"
  }

  const activeFileContent = getFileContent(activeFile)
  const language = getLanguage(activeFile)

  return (
    <div className="flex w-full h-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {showExplorer && (
        <div className="w-64 border-r border-slate-800/50 bg-slate-950/20 backdrop-blur-sm overflow-y-auto shadow-lg">
          <div className="px-4 py-3 border-b border-slate-800/50 bg-slate-950/30">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Explorer</span>
          </div>
          <div className="py-2">
            <FileTree nodes={files} onFileSelect={onFileSelect} activeFile={activeFile} />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExplorer(!showExplorer)}
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-200 text-slate-400 hover:text-white"
              title={showExplorer ? "Hide Explorer" : "Show Explorer"}
            >
              {showExplorer ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-white">{activeFile}</span>
              <p className="text-xs text-slate-400">Code Editor</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={activeFileContent}
            onChange={(value) => onFileChange(activeFile, value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              padding: { top: 16, bottom: 16 },
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
            }}
          />
        </div>
      </div>
    </div>
  )
}
