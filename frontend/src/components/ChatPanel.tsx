import { useState, useRef, useEffect } from 'react'
import { Bot, User, Loader, AlertCircle } from 'lucide-react'
import type { Message } from '../types'

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isGenerating: boolean
  backendConnected?: boolean
}

const ChatPanel = ({ messages, onSendMessage, isGenerating, backendConnected }: ChatPanelProps) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isGenerating && backendConnected) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  return (
    <div className="h-full flex flex-col bg-card backdrop-blur-sm rounded-xl overflow-hidden border border-border">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-base font-medium text-foreground">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            <p className="text-sm">Start a conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                message.role === 'user' 
                  ? 'bg-foreground text-background' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>
              <div className={`flex-1 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                 <div className={`inline-block px-3 py-2 rounded-lg text-sm ${
                   message.role === 'user'
                     ? 'bg-foreground text-background'
                     : 'bg-muted text-foreground'
                }`}>
                  {message.content && (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  {message.isStreaming && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Loader className="w-3 h-3 animate-spin" />
                      <span className="text-xs">Generating...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-3">
        {!backendConnected && (
          <div className="mb-2 p-2 bg-destructive/5 border border-destructive/20 rounded text-xs text-destructive">
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Backend disconnected</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={backendConnected ? "Type your message..." : "Backend disconnected..."}
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring bg-input placeholder-muted-foreground disabled:bg-muted"
            disabled={isGenerating || !backendConnected}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating || !backendConnected}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground transition-opacity duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24" className="shrink-0 h-6 w-6 text-background">
              <path fill="currentColor" d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatPanel
