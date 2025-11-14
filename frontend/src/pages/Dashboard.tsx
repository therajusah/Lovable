import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ChatPanel from '../components/ChatPanel'
import CodeEditor from '../components/CodeEditor'
import PreviewPanel from '../components/PreviewPanel'
import { Sun, Moon } from 'lucide-react'
import { apiService } from '../services/api'
import type { Message, GenerationState } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { useWebSocketContext } from '../hooks/useWebSocketContext'

const Dashboard = () => {
  const location = useLocation()
  const { sessionId, e2bEvents } = useWebSocketContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentCode, setCurrentCode] = useState('')
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    currentSandboxId: null,
    currentPreviewUrl: null,
    error: null
  })
  const [backendConnected, setBackendConnected] = useState(false)
  const [activeView, setActiveView] = useState<'code' | 'preview'>('preview')
  const [backendLogs, setBackendLogs] = useState<string[]>([])
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const lastEvent = e2bEvents[e2bEvents.length - 1]
    if (lastEvent?.type === 'sandbox:created' && lastEvent.sandboxId && lastEvent.previewUrl) {
      setGenerationState(prev => ({
        ...prev,
        currentSandboxId: lastEvent.sandboxId!,
        currentPreviewUrl: lastEvent.previewUrl!
      }))
    }
  }, [e2bEvents])


  useEffect(() => {
    if (e2bEvents.length > 0) {
      const lastEvent = e2bEvents[e2bEvents.length - 1]
      setBackendLogs(prev => [...prev, `[${new Date(lastEvent.timestamp).toLocaleTimeString()}] ${lastEvent.message}`])
    }
  }, [e2bEvents])

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const handleGenerateWebsite = useCallback(async (prompt: string) => {
    setGenerationState(prev => ({
      ...prev,
      isGenerating: true,
      error: null
    }))

    const aiMessageId = (Date.now() + 1).toString()
    const aiMessage: Message = {
      id: aiMessageId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true
    }
    setMessages(prev => [...prev, aiMessage])

    await apiService.generateWebsite(
      prompt,
      (chunk: string) => {
        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: msg.content + chunk }
            : msg
        ))

        setBackendLogs(prev => [...prev, chunk])

        if (chunk.includes('Creating sandbox') || chunk.includes('Generating website')) {
          setActiveView('preview')
        }
      },
      (result) => {
        setGenerationState(prev => ({
          ...prev,
          isGenerating: false,
          currentSandboxId: result.sandboxId,
          currentPreviewUrl: result.previewUrl
        }))

        setActiveView('preview')

        toast.success('Website generated!')

        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: msg.content + 'Your website is ready! You can now view it in the preview panel.',
                isStreaming: false
              }
            : msg
        ))
      },
      (error) => {
        setGenerationState(prev => ({
          ...prev,
          isGenerating: false,
          error
        }))

        toast.error(error, {
          duration: 5000,
        })

        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, isStreaming: false }
            : msg
        ))
      },
      sessionId
    )
  }, [sessionId])

  useEffect(() => {
    const checkBackendConnection = async () => {
      const isConnected = await apiService.healthCheck()
      setBackendConnected(isConnected)

      if (!isConnected) {
        toast.error('Backend disconnected')
      }
    }

    checkBackendConnection()

    const initialPrompt = location.state?.initialPrompt
    if (initialPrompt) {
      const initialMessage: Message = {
        id: '1',
        content: initialPrompt,
        role: 'user',
        timestamp: new Date()
      }
      setMessages([initialMessage])
      handleGenerateWebsite(initialPrompt)
    }
  }, [location.state, handleGenerateWebsite])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    handleGenerateWebsite(content)
  }

  return (
    <div className="h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-card/60 backdrop-blur-xl border-b border-border/50 px-6 py-4 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl font-black text-foreground">
                AIsiteBuilder
              </span>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-muted/50 backdrop-blur-sm rounded-2xl p-1 shadow-inner">
              <motion.button
                onClick={() => setActiveView('code')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                  activeView === 'code'
                    ? 'bg-foreground text-background shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Show Code Editor"
              >
                <span>Code</span>
              </motion.button>
              <motion.button
                onClick={() => setActiveView('preview')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                  activeView === 'preview'
                    ? 'bg-foreground text-background shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Show Preview"
              >
                <span>Preview</span>
              </motion.button>
            </div>


            <motion.button
              onClick={() => {
                const isCurrentlyDark = document.documentElement.classList.contains('dark')
                if (isCurrentlyDark) {
                  document.documentElement.classList.remove('dark')
                  localStorage.setItem('theme', 'light')
                  setIsDark(false)
                } else {
                  document.documentElement.classList.add('dark')
                  localStorage.setItem('theme', 'dark')
                  setIsDark(true)
                }
              }}
              className="p-2.5 rounded-xl bg-muted/50 backdrop-blur-sm hover:bg-muted/80 transition-all duration-200"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>


      <div className="relative z-10 flex-1 flex overflow-hidden gap-4 p-4">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-1/3 bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isGenerating={generationState.isGenerating}
            backendConnected={backendConnected}
            e2bEvents={e2bEvents}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {activeView === 'code' && (
            <motion.div
              key="code"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-2/3 bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
            >
              <CodeEditor
                code={currentCode}
                onChange={setCurrentCode}
                sandboxId={generationState.currentSandboxId}
              />
            </motion.div>
          )}

          {activeView === 'preview' && (
            <motion.div
              key="preview"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-2/3 bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
            >
              <PreviewPanel
                url={generationState.currentPreviewUrl || ''}
                sandboxId={generationState.currentSandboxId}
                logs={backendLogs}
                e2bEvents={e2bEvents}
                isGenerating={generationState.isGenerating}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard
