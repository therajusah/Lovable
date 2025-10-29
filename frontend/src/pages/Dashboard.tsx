import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import ChatPanel from '../components/ChatPanel'
import CodeEditor from '../components/CodeEditor'
import PreviewPanel from '../components/PreviewPanel'
import { Sun, Moon } from 'lucide-react'
import { apiService } from '../services/api'
import type { Message, GenerationState } from '../types'
import logowhite from '../assets/lovable-brand/logowhite.svg'
import logoblack from '../assets/lovable-brand/logoblack.svg'


const Dashboard = () => {
  const location = useLocation()
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
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const checkBackendConnection = async () => {
      const isConnected = await apiService.healthCheck()
      setBackendConnected(isConnected)
      
      if (!isConnected) {
        toast.error('Backend server is disconnected. Please start the backend server.')
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
  }, [location.state])

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

  const handleGenerateWebsite = async (prompt: string) => {
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
      
        toast.success('Your website has been generated successfully!')
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { 
                ...msg, 
                content: msg.content + '\n\nYour website is ready! You can now view it in the preview panel.',
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
        
        toast.error(`Failed to generate website: ${error}`, {
          duration: 5000,
        })
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        ))
      }
    )
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="bg-card/80 backdrop-blur-md border-b border-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <img 
                src={isDark ? logowhite : logoblack} 
                alt="Lovable" 
                className="h-6 w-auto"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-muted rounded-2xl p-1">
              <button
                onClick={() => setActiveView('code')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                  activeView === 'code'
                    ? 'bg-foreground text-background shadow-sm scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                title="Show Code Editor"
              >
                <span>Code</span>
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                  activeView === 'preview'
                    ? 'bg-foreground text-background shadow-sm scale-105'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                title="Show Preview"
              >
                <span>Preview</span>
              </button>
            </div>

            {(() => {
              const isWorking = generationState.isGenerating
              const statusColor = backendConnected 
                ? (isWorking ? 'bg-yellow-500' : 'bg-green-500')
                : 'bg-red-500'
              
              const statusBg = backendConnected
                ? (isWorking ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20')
                : 'bg-red-500/10 border-red-500/20'
              
              const statusText = backendConnected
                ? (isWorking ? 'text-yellow-600' : 'text-green-600')
                : 'text-red-600'
              
              const statusLabel = backendConnected
                ? (isWorking ? 'Working...' : 'Connected')
                : 'Disconnected'
              
              return (
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${statusBg} ${statusText} border`}>
                  <div className={`w-2 h-2 rounded-full ${statusColor} ${isWorking ? 'animate-pulse' : ''}`} />
                  <span>{statusLabel}</span>
                </div>
              )
            })()}
            
            <button
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
              className="p-2 rounded-xl bg-muted hover:bg-accent transition-all duration-200"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-muted-foreground hover:text-chart-3" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground hover:text-chart-1" />
              )}
            </button>
          </div>
        </div>
      </header>


      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        <div className="w-1/3 bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-lg">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isGenerating={generationState.isGenerating}
            backendConnected={backendConnected}
          />
        </div>

        {activeView === 'code' && (
          <div className="w-2/3 bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-lg animate-in fade-in duration-300 slide-in-from-right-5">
            <CodeEditor
              code={currentCode}
              onChange={setCurrentCode}
              sandboxId={generationState.currentSandboxId}
            />
          </div>
        )}

        {activeView === 'preview' && (
          <div className="w-2/3 bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-lg animate-in fade-in duration-300 slide-in-from-left-5">
          <PreviewPanel
            url={generationState.currentPreviewUrl || ''}
            sandboxId={generationState.currentSandboxId}
            logs={backendLogs}
          />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
