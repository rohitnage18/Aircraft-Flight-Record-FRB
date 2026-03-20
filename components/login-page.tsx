"use client"

import { useState, type FormEvent } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    const success = login(username, password)
    if (!success) {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/images/login-bg-new.jpg')" }}
      />
      {/* Gradient Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60" />
      
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <Card className="border-0 shadow-2xl bg-white rounded-2xl overflow-hidden">
          <CardHeader className="space-y-3 pb-2 pt-4 bg-white">
            {/* Logo above title */}
            <div className="flex justify-center bg-white">
              <img 
                src="/images/xenvolt-logo.jpg" 
                alt="Xenvolt" 
                className="h-14 sm:h-16 w-auto max-w-[200px] sm:max-w-[240px] object-contain mix-blend-multiply"
              />
            </div>
            <div className="space-y-0.5">
              <CardTitle className="text-base sm:text-lg text-center font-semibold text-foreground">Flight Operations Platform</CardTitle>
              <CardDescription className="text-center text-xs">
                Sign in to access the Technical Log Management System
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <Alert variant="destructive" className="py-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-1">
                <Label htmlFor="username" className="text-sm">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-9"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9"
                />
              </div>

              <Button type="submit" className="w-full h-9">
                Sign In
              </Button>
            </form>

            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground text-center mb-2 font-medium">Demo Credentials</p>
              <div className="grid gap-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => { setUsername("operations_user"); setPassword("ops@123") }}
                  className="flex justify-between items-center py-1.5 px-2 bg-muted/40 rounded hover:bg-muted/60 transition-colors text-left cursor-pointer"
                >
                  <span className="font-medium text-foreground">Operations:</span>
                  <code className="text-muted-foreground">operations_user / ops@123</code>
                </button>
                <button
                  type="button"
                  onClick={() => { setUsername("engineer_user"); setPassword("eng@123") }}
                  className="flex justify-between items-center py-1.5 px-2 bg-muted/40 rounded hover:bg-muted/60 transition-colors text-left cursor-pointer"
                >
                  <span className="font-medium text-foreground">Engineering:</span>
                  <code className="text-muted-foreground">engineer_user / eng@123</code>
                </button>
                <button
                  type="button"
                  onClick={() => { setUsername("admin_user"); setPassword("admin@123") }}
                  className="flex justify-between items-center py-1.5 px-2 bg-muted/40 rounded hover:bg-muted/60 transition-colors text-left cursor-pointer"
                >
                  <span className="font-medium text-foreground">Admin:</span>
                  <code className="text-muted-foreground">admin_user / admin@123</code>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}
