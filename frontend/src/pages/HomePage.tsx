import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import logowhite from '../assets/lovable-brand/logowhite.svg'
import logoblack from '../assets/lovable-brand/logoblack.svg'

interface HomePageProps {
  isDark: boolean
  onToggleTheme: () => void
}

const HomePage = ({ isDark, onToggleTheme }: HomePageProps) => {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      navigate('/dashboard', { state: { initialPrompt: prompt } })
    }
  }

  const examplePrompts = [
    "Create a modern landing page for a SaaS product",
    "Build a todo app with dark mode", 
    "Design a portfolio website with animations"
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-chart-1/5 via-chart-2/5 to-chart-3/5"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-chart-1/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-chart-2/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-chart-3/8 rounded-full blur-3xl"></div>
      </div>
      
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={isDark ? logowhite : logoblack} 
              alt="Lovable" 
              className="h-8 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-105">Community</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-105">Pricing</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-105">Enterprise</a>
            <button className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-105">Log in</button>
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-all duration-200 hover:scale-105"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
            </button>
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg">
              Get started
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-6 flex-1 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-card/80 backdrop-blur-md border border-border rounded-full mb-10 text-card-foreground text-sm font-medium shadow-lg">
            <span className="mr-3 text-chart-2">✨</span>
            Introducing Lovable

          </div>

          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-foreground mb-8 leading-tight tracking-tight">
              Build something with{' '}
              <span className="bg-linear-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
                ❤️ Lovable
              </span>
            </h1>
            <p className="text-1xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Create stunning websites by chatting with AI
            </p>
          </div>

          <div className="mb-20">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="relative bg-card/90 backdrop-blur-xl border border-border rounded-3xl p-3 shadow-2xl hover:shadow-chart-1/10 transition-all duration-300">
                <div className="flex items-start space-x-4 px-4 pt-4">
                  <div className="flex-1">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ask Lovable to create a website..."
                      className="w-full bg-transparent text-card-foreground placeholder-muted-foreground resize-none focus:outline-none text-lg leading-relaxed min-h-[60px] max-h-[120px] font-light"
                      rows={2}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end px-4 pb-3 ">
                   
                    <button
                      type="submit"
                      disabled={!prompt.trim()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground transition-opacity duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 md:h-8 md:w-8"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%" className="shrink-0 h-6 w-6 text-background">
                        <path fill="currentColor" d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0"></path>
                      </svg>
                    </button>
                </div>
              </div>
            </form>
          </div>

          <div className="text-left max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-foreground">From the Community</h2>
              <button className="text-chart-1 hover:text-foreground transition-all duration-200 flex items-center space-x-2 font-medium hover:scale-105">
                <span>View all</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20" className="rotate-45">
                  <path fill="currentColor" d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {examplePrompts.slice(0, 3).map((example, index) => {
                const cardAccents = [
                  'text-blue-600',
                  'text-emerald-600', 
                  'text-purple-600'
                ];
                const cardAccent = cardAccents[index];
                
                return (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="group relative bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl p-6 hover:bg-card/80 hover:border-chart-1/40 transition-all duration-500 text-left hover:translate-y-[-2px] hover:shadow-xl hover:shadow-chart-1/10"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-chart-1/5 via-transparent to-chart-2/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-end mb-4">
                        <div className="px-3 py-1 bg-muted/50 rounded-full">
                          <span className="text-xs font-medium text-muted-foreground">Template</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-card-foreground mb-2 leading-tight group-hover:text-chart-1 transition-colors duration-300">
                        {example}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {index === 0 && "Professional landing page with hero section, features, and pricing"}
                        {index === 1 && "Task management app with modern dark theme and smooth animations"}
                        {index === 2 && "Creative portfolio showcasing work with beautiful transitions"}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-chart-3"></div>
                            <span>{Math.floor(Math.random() * 50) + 20}k uses</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                            <span>4.{Math.floor(Math.random() * 3) + 7}/5</span>
                          </span>
                        </div>
                        <div className={`${cardAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" className="rotate-45">
                            <path fill="currentColor" d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage