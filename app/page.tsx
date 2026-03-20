"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { DataStoreProvider } from "@/lib/data-store"
import { LoginPage } from "@/components/login-page"
import { FRBDashboard } from "@/components/frb-dashboard"

function AppContent() {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginPage />
  }
  
  return (
    <DataStoreProvider>
      <FRBDashboard />
    </DataStoreProvider>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
