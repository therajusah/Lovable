export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

export interface GenerationState {
  isGenerating: boolean
  currentSandboxId: string | null
  currentPreviewUrl: string | null
  error: string | null
}

export interface SandboxInfo {
  sandboxId: string
  previewUrl: string
  projectPath?: string
  createdAt?: Date
}

export interface ChatSession {
  id: string
  messages: Message[]
  sandboxInfo?: SandboxInfo
  createdAt: Date
  updatedAt: Date
}
