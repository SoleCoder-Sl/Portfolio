'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Session, User } from '@supabase/supabase-js'

// Define the shape of our context
interface AuthContextType {
  user: User | null
  session: Session | null
  isLoggedIn: boolean
  logout: () => Promise<void>
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the AuthProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Check for an active session on initial load
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
    }
    getSession()

    // Listen for auth state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    // Cleanup the listener on unmount
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    isLoggedIn: !!user, // True if user is not null
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Create the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

