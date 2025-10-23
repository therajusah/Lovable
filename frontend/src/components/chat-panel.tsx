"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatPanelProps {
  messages: Message[]
  onSendMessage: (message: string) => void
}

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput("")
    }
  }

  return (
    <div className="flex flex-col w-full h-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 min-w-0">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800/50 bg-slate-950/30 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-white text-sm truncate">AI Assistant</h2>
          <p className="text-xs text-slate-400 truncate">Ready to help you code</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 overflow-y-auto min-w-0">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 shadow-sm wrap-break-word ${
                  message.role === "user"
                    ? "bg-linear-to-r from-cyan-600 to-blue-600 text-white"
                    : "bg-slate-800/50 text-slate-100 border border-slate-700/50 backdrop-blur-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-800/50 bg-slate-950/30 backdrop-blur-sm shrink-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to build..."
              className="min-h-[80px] resize-none bg-slate-900/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 backdrop-blur-sm w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </form>
      </div>
    </div>
  )
}
