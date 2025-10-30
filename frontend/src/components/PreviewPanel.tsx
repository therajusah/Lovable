import { useState, useRef, useEffect } from 'react'
import { RefreshCw, ExternalLink, Monitor, Smartphone, Tablet, Code, Rocket, Terminal, ChevronUp, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

interface PreviewPanelProps {
  url: string
  sandboxId?: string | null
  logs?: string[]
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile'

const PreviewPanel = ({ url, sandboxId: _sandboxId, logs: initialLogs }: PreviewPanelProps) => {
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingTip, setLoadingTip] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [logs, setLogs] = useState<string[]>(initialLogs ||  [])
  const [showLogs, setShowLogs] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)
  
  const generationSteps = [
    { name: "Planning", description: "Analyzing your requirements..." },
    { name: "Design", description: "Creating the visual structure..." },
    { name: "HTML", description: "Building the page structure..." },
    { name: "CSS", description: "Styling your components..." },
    { name: "JavaScript", description: "Adding interactivity..." },
    { name: "Optimization", description: "Optimizing for performance..." },
    { name: "Testing", description: "Ensuring everything works..." },
    { name: "Finalizing", description: "Preparing for preview..." }
  ]
  
  const loadingTips = [
    "Crafting responsive layouts for all devices...",
    "Optimizing images for faster loading...",
    "Adding beautiful typography and spacing...",
    "Implementing modern UI components...",
    "Applying accessibility best practices...",
    "Creating smooth animations and transitions...",
    "Optimizing for performance and speed...",
    "Ensuring cross-browser compatibility...",
    "Implementing color psychology for better UX...",
    "Adding micro-interactions for engagement..."
  ]

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleOpenInNewTab = () => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setIsGenerating(false)
  }
  
  useEffect(() => {
    if (!url && _sandboxId) {
      setIsGenerating(true)
      setCurrentStep(0)
      
      setLoadingTip(loadingTips[Math.floor(Math.random() * loadingTips.length)])
      
      const tipInterval = setInterval(() => {
        setLoadingTip(loadingTips[Math.floor(Math.random() * loadingTips.length)])
      }, 3000)
      
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => { 
          if (prev >= generationSteps.length - 1) {
            return 0
          }
          return prev + 1
        })
      }, 2000)
      
      return () => {
        clearInterval(tipInterval)
        clearInterval(stepInterval)
      }
    } else {
      setIsGenerating(false)
      setCurrentStep(0)
    }
  }, [url, _sandboxId, loadingTips.length, generationSteps.length])
  
  useEffect(() => {
    if (initialLogs && initialLogs.length > 0) {
      setLogs(prev => [...prev, ...initialLogs])
      setTimeout(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [initialLogs])
  
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  const getViewportStyles = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-sm mx-auto'
      case 'tablet':
        return 'max-w-2xl mx-auto'
      case 'desktop':
      default:
        return 'w-full'
    }
  }

  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile':
        return { width: '375px', height: '100%' }
      case 'tablet':
        return { width: '768px', height: '100%' }
      case 'desktop':
      default:
        return { width: '100%', height: '100%' }
    }
  }

  return (
    <div className="h-full flex flex-col bg-transparent overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-muted/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-semibold text-foreground">Preview</h2>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-muted/50 backdrop-blur-sm rounded-xl p-1 border border-border/30">
            <motion.button
              onClick={() => setViewport('desktop')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewport === 'desktop'
                  ? 'bg-foreground text-background shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setViewport('tablet')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewport === 'tablet'
                  ? 'bg-foreground text-background shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setViewport('mobile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewport === 'mobile'
                  ? 'bg-foreground text-background shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
              title="Refresh Preview"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              onClick={handleOpenInNewTab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              title="Open in New Tab"
              disabled={!url}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-card p-4 overflow-auto">
        {url ? (
          <div className={`h-full ${getViewportStyles()}`}>
            <div 
              className="bg-card backdrop-blur-sm shadow-lg rounded-lg overflow-hidden h-full"
              style={getViewportDimensions()}
            >
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Loading preview...</span>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={url}
                className="w-full h-full border-0"
                onLoad={handleIframeLoad}
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        ) : isGenerating ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center max-w-lg px-8 py-12 bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50">
              <motion.div
                className="relative mb-6"
              >
                <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto relative shadow-xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-10 h-10" />
                  </motion.div>
                </div>
              </motion.div>
              
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <h3 className="text-2xl font-bold text-card-foreground mb-1">
                  {generationSteps[currentStep].name}
                </h3>
                <p className="text-chart-2 font-medium">
                  {generationSteps[currentStep].description}
                </p>
              </div>
              <div className="relative flex items-center justify-between mb-6 px-2">
                <div className="absolute h-0.5 bg-border w-[80%] left-[10%] z-0" />
                {generationSteps.map((step, index) => (
                  <div key={step.name} className="flex flex-col items-center z-10">
                    <div 
                      className={`w-3 h-3 rounded-full mb-1 transition-all duration-300 ${
                        index < currentStep 
                          ? 'bg-green-500' 
                          : index === currentStep 
                            ? 'bg-blue-500 animate-pulse' 
                            : 'bg-border'
                      }`}
                    />
                    <span className={`text-[10px] ${
                      index === currentStep ? 'text-chart-2 font-medium' : 'text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mb-6 h-16">
                <p className="text-muted-foreground mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500 min-h-8">{loadingTip}</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full relative transition-all duration-1000 ease-in-out"
                    style={{ width: `${((currentStep + 1) / generationSteps.length) * 100}%` }}
                  >
                    <div className="absolute top-0 left-0 h-full w-1/3 bg-background/30 animate-shimmer"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">This may take a few moments...</p>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="flex items-center space-x-1 text-sm text-foreground hover:text-muted-foreground transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{showLogs ? "Hide Logs" : "Show Logs"}</span>
                  {showLogs ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showLogs && (
                <div className="mt-4 border border-border rounded-lg bg-muted p-2">
                  <div className="text-xs font-mono text-left h-40 overflow-y-auto bg-popover text-popover-foreground p-3 rounded">
                    {logs.length === 0 ? (
                      <p className="text-muted-foreground italic">Waiting for logs...</p>
                    ) : (
                      logs.map((log, index) => (
                        <div key={index} className="whitespace-pre-wrap mb-1">
                          <span className="text-foreground">$</span> {log}
                        </div>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center justify-center"
          >
            <div className="text-center max-w-md px-8 py-12 bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Code className="w-7 h-7 text-foreground" />
                </motion.div>
                <div className="w-8 h-1 bg-foreground/30 rounded-full"></div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-14 h-14 bg-foreground rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Rocket className="w-7 h-7 text-background" />
                </motion.div>
                <div className="w-8 h-1 bg-foreground/30 rounded-full"></div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Monitor className="w-7 h-7 text-foreground" />
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-3">Ready to Create</h3>
              <p className="text-muted-foreground mb-6">Describe your website idea in the chat panel, and I'll generate a custom website for you to preview here.</p>
              <div className="bg-muted/50 p-5 rounded-xl text-left border border-border">
                <p className="text-sm font-semibold text-card-foreground mb-2">
                  Try something like:
                </p>
                <p className="text-sm text-muted-foreground italic">"Create a modern landing page for a fitness app with a hero section, features, and pricing"</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PreviewPanel
