"use client"

import { useEffect, useState } from "react"
import { Eye, AlertCircle, RefreshCw } from "lucide-react"
import type { FileNode } from "@/App"
import { Button } from "@/components/ui/button"

interface PreviewPanelProps {
  files: FileNode[]
}

export function PreviewPanel({ files }: PreviewPanelProps) {
  const [error, setError] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    try {
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

      const appTsx = getFileContent("src/App.tsx")
      const appCss = getFileContent("src/App.css")
      const indexCss = getFileContent("src/index.css")

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                  sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              ${indexCss}
              ${appCss}
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              const { useState, useEffect, useRef, useMemo, useCallback } = React;
              
              class ErrorBoundary extends React.Component {
                constructor(props) {
                  super(props);
                  this.state = { hasError: false, error: null };
                }

                static getDerivedStateFromError(error) {
                  return { hasError: true, error };
                }

                componentDidCatch(error, errorInfo) {
                  console.error('React Error:', error, errorInfo);
                }

                render() {
                  if (this.state.hasError) {
                    return (
                      <div style={{
                        padding: '20px',
                        margin: '20px',
                        backgroundColor: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '8px',
                        fontFamily: 'monospace'
                      }}>
                        <h2 style={{ color: '#c00', marginBottom: '10px' }}>⚠️ Component Error</h2>
                        <pre style={{ color: '#600', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                          {this.state.error?.toString()}
                        </pre>
                      </div>
                    );
                  }

                  return this.props.children;
                }
              }
              
              try {
                ${appTsx.replace("export default", "const AppComponent =")}
                
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(
                  <ErrorBoundary>
                    <AppComponent />
                  </ErrorBoundary>
                );
              } catch (error) {
                document.getElementById('root').innerHTML = \`
                  <div style="padding: 20px; margin: 20px; background-color: #fee; border: 1px solid #fcc; border-radius: 8px; font-family: monospace;">
                    <h2 style="color: #c00; margin-bottom: 10px;">⚠️ Compilation Error</h2>
                    <pre style="color: #600; font-size: 14px; white-space: pre-wrap;">\${error.toString()}</pre>
                  </div>
                \`;
                console.error('Compilation Error:', error);
              }
            </script>
          </body>
        </html>
      `
      setPreviewHtml(htmlContent)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [files, refreshKey])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col w-full h-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-white">Live Preview</span>
            <p className="text-xs text-slate-400">Real-time updates</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="h-8 px-3 text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">Live</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white shadow-inner">
        {error ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="flex items-start gap-3 p-6 bg-red-50 border border-red-200 rounded-xl max-w-md shadow-lg">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Preview Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            key={refreshKey}
            srcDoc={previewHtml}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts"
          />
        )}
      </div>
    </div>
  )
}
