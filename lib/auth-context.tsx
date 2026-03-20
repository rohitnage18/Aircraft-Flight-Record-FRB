"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "operations" | "engineering" | "admin"

export interface User {
  username: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const users: Record<string, { password: string; role: UserRole; name: string }> = {
  operations_user: { password: "ops@123", role: "operations", name: "Operations User" },
  engineer_user: { password: "eng@123", role: "engineering", name: "Engineering User" },
  admin_user: { password: "admin@123", role: "admin", name: "Admin User" },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("frb_user") : null
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const userData = users[username]
    if (userData && userData.password === password) {
      const loggedInUser: User = {
        username,
        role: userData.role,
        name: userData.name,
      }
      setUser(loggedInUser)
      sessionStorage.setItem("frb_user", JSON.stringify(loggedInUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("frb_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
