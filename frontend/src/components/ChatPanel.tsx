import { useState, useRef, useEffect } from 'react'
import { Bot, User, Loader, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message } from '../types'
import type { E2BEvent } from '../hooks/useWebSocket'
import { E2BEventList } from './E2BEvents/E2BEventList'

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isGenerating: boolean
  backendConnected?: boolean
  e2bEvents?: E2BEvent[]
}

const ChatPanel = ({ messages, onSendMessage, isGenerating, backendConnected, e2bEvents = [] }: ChatPanelProps) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, e2bEvents])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isGenerating && backendConnected) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden">
      <div className="px-6 py-5 border-b border-border/50 bg-muted/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-semibold text-foreground">Chat</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-muted-foreground mt-12"
          >
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center">
                <Bot className="w-8 h-8" />
              </div>
            </div>
            <p className="text-sm font-medium">Start a conversation</p>
            <p className="text-xs mt-1">Ask me to create anything!</p>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${
                    message.role === 'user'
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </motion.div>
                <div
                  className={`flex-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`inline-block px-4 py-2.5 rounded-2xl text-sm shadow-md ${
                      message.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-muted/50 backdrop-blur-sm text-foreground border border-border/50'
                    }`}
                  >
                    {message.content && (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                    {message.isStreaming && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader className="w-3.5 h-3.5" />
                        </motion.div>
                        <span className="text-xs">Generating...</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isGenerating && <E2BEventList events={e2bEvents} maxVisible={5} />}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border/50 p-4 bg-card/30 backdrop-blur-sm">
        <AnimatePresence>
          {!backendConnected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-600 dark:text-red-400"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Backend disconnected</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={backendConnected ? "Type your message..." : "Backend disconnected..."}
              className="w-full px-4 py-3 text-sm border-2 border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:border-transparent bg-background/50 backdrop-blur-sm placeholder-muted-foreground disabled:bg-muted/30 disabled:cursor-not-allowed transition-all duration-200"
              disabled={isGenerating || !backendConnected}
            />
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || isGenerating || !backendConnected}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="shrink-0 h-5 w-5"
            >
              <path
                fill="currentColor"
                d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0"
              ></path>
            </svg>
          </motion.button>
        </form>
      </div>
    </div>
  )
}

export default ChatPanel
