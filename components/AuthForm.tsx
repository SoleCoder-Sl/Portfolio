'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Mail, Lock, User } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signUp') {
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        })

        if (signUpError) {
          console.error('Sign up error:', signUpError)
          setError(signUpError.message)
          setLoading(false)
          return
        }

        if (data.user) {
          console.log('Sign up successful. User:', data.user.email)
          console.log('Email confirmed:', data.user.email_confirmed_at !== null)
          
          // Check if email confirmation is required
          if (data.user.email_confirmed_at === null) {
            setError('Account created! Please check your email and confirm your account before signing in.')
            setLoading(false)
            // Don't redirect - let user read the message
            return
          }
          // Success - the onAuthStateChange listener will update the state
          router.push('/')
        } else {
          setError('Sign up failed. Please try again.')
          setLoading(false)
        }
      } else {
        // Sign In
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          console.error('Sign in error:', signInError)
          setError(signInError.message)
          setLoading(false)
          return
        }

        if (data?.user) {
          // Success - the onAuthStateChange listener will update the state
          console.log('Sign in successful:', data.user.email)
          router.push('/')
        } else {
          setError('Sign in failed. Please check your credentials.')
          setLoading(false)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError(null)
    setLoading(true)

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })

      if (oauthError) {
        setError(oauthError.message)
        setLoading(false)
      }
      // OAuth redirect will happen automatically
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/40 p-8 shadow-2xl backdrop-blur-2xl">
      {/* Title */}
      <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md text-center">
        {mode === 'signIn' ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      <p className="text-gray-300 text-sm text-center mb-8">
        {mode === 'signIn' 
          ? 'Sign in to continue to your account' 
          : 'Join us and start your journey'
        }
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      {/* Social Logins - Top Priority */}
      <div className="flex flex-col gap-4">
        {/* Google Button */}
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          Continue with Google
        </button>

        {/* GitHub Button */}
        <button
          onClick={() => handleSocialLogin('github')}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>
      </div>

      {/* Separator */}
      <div className="my-6 flex items-center gap-4">
        <hr className="flex-1 border-gray-600" />
        <span className="text-gray-400 text-sm">or</span>
        <hr className="flex-1 border-gray-600" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name - Only for Sign Up */}
        <AnimatePresence>
          {mode === 'signUp' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required={mode === 'signUp'}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Confirm Password - Only for Sign Up */}
        <AnimatePresence>
          {mode === 'signUp' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={mode === 'signUp'}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : mode === 'signIn' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      {/* Toggle Link */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
          className="text-gray-300 text-sm hover:text-white transition-colors"
        >
          {mode === 'signIn' ? (
            <>
              Don't have an account? <span className="font-semibold text-white">Sign Up</span>
            </>
          ) : (
            <>
              Already have an account? <span className="font-semibold text-white">Sign In</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

