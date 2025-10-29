import { useRef } from 'react'
import Editor from '@monaco-editor/react'
import type { Monaco } from '@monaco-editor/react'
import type { editor as MonacoEditor } from 'monaco-editor'
import { Copy, Download, Code } from 'lucide-react'

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  sandboxId?: string | null
}

const CodeEditor = ({ code, onChange, sandboxId: _sandboxId }: CodeEditorProps) => {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null)

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
    <div className="h-full flex flex-col bg-card backdrop-blur-sm rounded-xl overflow-hidden border border-border">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold text-card-foreground">Code Editor</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={formatCode}
            className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105 font-medium"
            title="Format Code"
          >
            Format
          </button>
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105 flex items-center space-x-2 font-medium"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          <button
            onClick={handleDownloadCode}
            className="px-4 py-2 text-sm bg-foreground text-background rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 font-medium"
            title="Download Code"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
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
            theme="vs-light"
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
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2 text-card-foreground">No Code Yet</p>
              <p className="text-sm text-muted-foreground">Generate a website to see the code here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeEditor
