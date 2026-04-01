import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserName } from '../types'
import { supabase } from '../integrations/supabase/client'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
  currentUser: UserName | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function emailToUserName(email: string): UserName | null {
  if (email === 'livia@app.local') return 'livia'
  if (email === 'camila@app.local') return 'camila'
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [currentUser, setCurrentUser] = useState<UserName | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user?.email) {
        setCurrentUser(emailToUserName(session.user.email))
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user?.email) {
        setCurrentUser(emailToUserName(session.user.email))
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return error.message
    return null
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
