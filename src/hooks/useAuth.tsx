import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserName } from '../types'

interface AuthContextType {
  currentUser: UserName | null
  login: (user: UserName) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserName | null>(() =>
    localStorage.getItem('lc_user') as UserName | null
  )

  useEffect(() => {
    if (currentUser) localStorage.setItem('lc_user', currentUser)
    else localStorage.removeItem('lc_user')
  }, [currentUser])

  return (
    <AuthContext.Provider value={{
      currentUser,
      login: (u) => setCurrentUser(u),
      logout: () => setCurrentUser(null),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
