import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sun, Moon, Github, Twitter, Linkedin } from 'lucide-react'
import { BackgroundBeams } from '../components/ui/BackgroundBeams'
import { SparklesCore } from '../components/ui/SparklesCore'
import { CardSpotlight } from '../components/ui/CardSpotlight'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'

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
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5"></div>
        <BackgroundBeams className="opacity-40" />
        <div className="absolute inset-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={80}
            className="w-full h-full"
            particleColor={isDark ? "#FFFFFF" : "#000000"}
          />
        </div>
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-black text-foreground">
                AIsiteBuilder
              </span>
            </Link>
          </motion.div>
          <nav className="hidden md:flex items-center space-x-6">
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Community
            </motion.a>
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Pricing
            </motion.a>
            <motion.a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Enterprise
            </motion.a>
            <Link to="/signin">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <motion.button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-muted/50 backdrop-blur-sm hover:bg-muted transition-all duration-200"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </motion.button>
            <Link to="/signup">
              <Button variant="default" size="sm">
                Get started
              </Button>
            </Link>
          </nav>
        </div>
      </motion.header>

      <main className="relative z-10 px-6 flex-1 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-card/80 backdrop-blur-md border border-border rounded-full mb-10 text-card-foreground text-sm font-medium shadow-lg"
          >
            <span className="mr-3">✨</span>
            Introducing AIsiteBuilder
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 leading-tight tracking-tight">
              Build something with{' '}
              <span className="text-foreground">
                ❤️ AIsiteBuilder
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed">
              Create stunning websites by chatting with AI. Turn your ideas into reality in seconds.
            </p>
          </motion.div>

          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <motion.div
                className="relative bg-card/90 backdrop-blur-xl border-2 border-border rounded-3xl p-3 shadow-2xl"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-start space-x-4 px-4 pt-4">
                  <div className="flex-1">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask AIsiteBuilder to create a website..."
                      className="w-full bg-transparent text-card-foreground placeholder-muted-foreground resize-none focus:outline-none text-lg leading-relaxed min-h-[60px] max-h-[120px] font-light"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end px-4 pb-3">
                  <motion.button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground transition-opacity duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 hover:bg-foreground/90"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="100%" height="100%" className="shrink-0 h-6 w-6 text-background">
                      <path fill="currentColor" d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0"></path>
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </form>
          </motion.div>

          <motion.div
            className="text-left max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-foreground">From the Community</h2>
              <motion.button
                className="text-foreground hover:text-muted-foreground transition-all duration-200 flex items-center space-x-2 font-medium"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View all</span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  className="rotate-45"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path fill="currentColor" d="M11 19V7.415l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5 .074-.067a1 1 0 0 1 1.34.067l5 5a1 1 0 1 1-1.414 1.414L13 7.415V19a1 1 0 1 1-2 0"></path>
                </motion.svg>
              </motion.button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {examplePrompts.slice(0, 3).map((example, index) => {
                const spotlightColors = [
                  "rgba(59, 130, 246, 0.35)",
                  "rgba(16, 185, 129, 0.35)",
                  "rgba(168, 85, 247, 0.35)"
                ];
                const accentColors = [
                  'from-blue-500 to-cyan-500',
                  'from-emerald-500 to-teal-500',
                  'from-purple-500 to-pink-500'
                ];

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8 }}
                  >
                    <CardSpotlight
                      className="cursor-pointer text-left h-full"
                      spotlightColor={spotlightColors[index]}
                      onClick={() => setPrompt(example)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-end mb-4">
                          <div className="px-3 py-1 bg-muted/50 backdrop-blur-sm rounded-full">
                            <span className="text-xs font-medium text-muted-foreground">Template</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-card-foreground mb-2 leading-tight">
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
                              <div className={`w-2 h-2 rounded-full bg-linear-to-r ${accentColors[index]}`}></div>
                              <span>{Math.floor(Math.random() * 50) + 20}k uses</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                              <span>4.{Math.floor(Math.random() * 3) + 7}/5</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardSpotlight>
                  </motion.div>
                );
              })}
            </div>

          </motion.div>
        </div>
      </main>
      <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="text-xl font-black text-foreground mb-3 block">
                AIsiteBuilder
              </span>
              <p className="text-xs text-muted-foreground">
                Build websites with AI
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-3 text-sm">Product</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-3 text-sm">Company</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground mb-3 md:mb-0">
              © 2025 AIsiteBuilder. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage