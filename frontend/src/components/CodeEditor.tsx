import { useRef, useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { Monaco } from '@monaco-editor/react'
import type { editor as MonacoEditor } from 'monaco-editor'
import { Copy, Download, Code } from 'lucide-react'
import { motion } from 'framer-motion'

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  sandboxId?: string | null
}

const CodeEditor = ({ code, onChange, sandboxId: _sandboxId }: CodeEditorProps) => {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const handleEditorDidMount = (editor: MonacoEditor.IStandaloneCodeEditor, monaco: Monaco): void => {
    editorRef.current = editor
    
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      renderLineHighlight: 'line',
      selectOnLineNumbers: true,
    })


    monaco.languages.html.htmlDefaults.setOptions({
      format: {
        tabSize: 2,
        insertSpaces: true,
        wrapLineLength: 120,
        unformatted: 'default, a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, mark, math, noscript, object, q, ruby, samp, script, select, small, span, strong, sub, sup, textarea, tt, var',
        contentUnformatted: 'pre',
        indentInnerHtml: false,
        preserveNewLines: true,
        maxPreserveNewLines: undefined,
        indentHandlebars: false,
        endWithNewline: false,
        extraLiners: 'head, body, /html',
        wrapAttributes: 'auto'
      }
    })
  }

  const handleCopyCode = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code)
      console.log('Code copied to clipboard')
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const handleDownloadCode = (): void => {
    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-website.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatCode = (): void => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
    }
  }

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-muted/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-semibold text-foreground">Code Editor</h2>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={formatCode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm bg-muted/50 backdrop-blur-sm text-muted-foreground rounded-xl hover:bg-accent transition-all duration-200 font-medium border border-border/30"
            title="Format Code"
          >
            Format
          </motion.button>
          <motion.button
            onClick={handleCopyCode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm bg-muted/50 backdrop-blur-sm text-muted-foreground rounded-xl hover:bg-accent transition-all duration-200 flex items-center space-x-2 font-medium border border-border/30"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </motion.button>
          <motion.button
            onClick={handleDownloadCode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm bg-foreground text-background rounded-xl hover:shadow-xl transition-all duration-200 flex items-center space-x-2 font-medium"
            title="Download Code"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </motion.button>
        </div>
      </div>

      <div className="flex-1">
        {code ? (
          <Editor
            height="100%"
            defaultLanguage="html"
            value={code}
            onChange={(value) => onChange(value || '')}
            onMount={handleEditorDidMount}
            theme={isDark ? 'vs-dark' : 'vs-light'}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              renderLineHighlight: 'line',
              selectOnLineNumbers: true,
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center justify-center text-muted-foreground"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Code className="w-10 h-10" />
              </div>
              <p className="text-lg font-semibold mb-2 text-card-foreground">No Code Yet</p>
              <p className="text-sm text-muted-foreground">Generate a website to see the code here</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor
