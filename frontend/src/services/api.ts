const API_BASE_URL = import.meta.env.VITE_BACKEND_URL 

export interface GenerationResponse {
  success: boolean
  sandboxId?: string
  previewUrl?: string
  message?: string
  error?: string
}

export interface Sandbox {
  sandboxId: string
  previewUrl: string
  projectPath: string
}

export interface SandboxListResponse {
  success: boolean
  activeSandboxes: Sandbox[]
  count: number
}

export class ApiService {
  private static instance: ApiService
  
  private constructor() {}
  
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }


  public async generateWebsite(
    prompt: string,
    onChunk?: (chunk: string) => void,
    onComplete?: (result: { sandboxId: string; previewUrl: string }) => void,
    onError?: (error: string) => void,
    sessionId?: string
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, sessionId }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      if (!response.body) {
        throw new Error('No response')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let sandboxId = ''
      let previewUrl = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk
          
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' 
          
          for (const line of lines) {
            if (line.trim()) {
              if (line.includes('Preview URL:')) {
                const match = line.match(/Preview URL: (https:\/\/[^\s]+)/)
                if (match) previewUrl = match[1]
              }
              if (line.includes('Sandbox ID:')) {
                const match = line.match(/Sandbox ID: ([^\s]+)/)
                if (match) sandboxId = match[1]
              }
              
              const shouldShowLine = this.shouldShowLineToUser(line)
              if (shouldShowLine && onChunk) {
                const cleanedLine = this.cleanLineForUser(line)
                if (cleanedLine) {
                  onChunk(cleanedLine + '\n')
                }
              }
            }
          }
        }
        
        if (buffer.trim() && onChunk) {
          onChunk(buffer)
        }
        if (onComplete && sandboxId && previewUrl) {
          onComplete({ sandboxId, previewUrl })
        }

      } finally {
        reader.releaseLock()
      }

    } catch (error) {
      console.error('Error generating website:', error)
      if (onError) {
        onError(error instanceof Error ? error.message : 'Request failed')
      }
    }
  }

  public async getSandboxes(): Promise<SandboxListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sandboxes`)

      if (!response.ok) {
        throw new Error('Request failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching sandboxes:', error)
      return {
        success: false,
        activeSandboxes: [],
        count: 0
      }
    }
  }


  public async deleteSandbox(sandboxId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/sandbox/${sandboxId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error deleting sandbox:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Request failed'
      }
    }
  }

  private shouldShowLineToUser(line: string): boolean {
    if (line.includes('[Tool') && line.includes('executed:')) {
      return false
    }
    
    if (line.includes('Error executing command') && line.includes('sandbox')) {
      return false
    }
    
    if (line.includes('DELETE /sandbox/')) {
      return false
    }
    

    if (line.includes('Sandbox ID:') || line.includes('Preview URL:')) {
      return false
    }
  
    return true
  }

  private cleanLineForUser(line: string): string {
    if (line.includes('🎉 **Website Preview Available!**')) {
      return '✨ Your website has been generated successfully!'
    }
    
    const cleanedLine = line
      .replace(/^\[Tool.*?\]/, '')
      .replace(/^Command:.*?\n/, '')
      .replace(/^Output:.*?\n/, '')
      .trim()
    
    if (!cleanedLine) {
      return ''
    }
    
    return cleanedLine
  }


  public async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/sandboxes`)
      return response.ok
    } catch (error) {
      console.error('Backend health check failed:', error)
      return false
    }
  }
}

export const apiService = ApiService.getInstance()
