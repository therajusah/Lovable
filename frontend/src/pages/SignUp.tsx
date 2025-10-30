import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sun, Moon, Mail, Lock, User } from 'lucide-react'
import logowhite from '../assets/lovable-brand/logowhite.svg'
import logoblack from '../assets/lovable-brand/logoblack.svg'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'

interface SignUpProps {
  isDark: boolean
  onToggleTheme: () => void
}

const SignUp = ({ isDark, onToggleTheme }: SignUpProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: SIGNUP LOGIC
    console.log('Sign up:', { name, email, password })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={isDark ? logowhite : logoblack}
              alt="Lovable"
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                Create account
              </h1>
              <p className="text-sm text-muted-foreground">
                Start building with AI
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center space-x-2 hover:bg-accent"
                onClick={() => console.log('Sign up with Google')}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm">Continue with Google</span>
              </Button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-foreground mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground text-foreground placeholder-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground text-foreground placeholder-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground text-foreground placeholder-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-3 h-3 mt-0.5 rounded border-border text-foreground focus:ring-foreground"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-xs text-muted-foreground">
                  I agree to the{' '}
                  <a href="#" className="text-foreground hover:underline">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-foreground hover:underline">Privacy</a>
                </label>
              </div>

              <Button
                type="submit"
                variant="default"
                size="sm"
                className="w-full mt-1"
              >
                Create Account
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="text-foreground hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUp
