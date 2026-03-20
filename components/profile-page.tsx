"use client"

import { useAuth } from "@/lib/auth-context"
import { AIRCRAFT_REG } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut } from "lucide-react"

const roleLabels = {
  operations: "Operations",
  engineering: "Engineering",
  admin: "Administrator",
} as const

export function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>
            Your account details for the current session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm">Full name</Label>
              <Input value={user.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Username</Label>
              <Input value={user.username} readOnly />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm">Role</Label>
              <Input value={roleLabels[user.role]} readOnly />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Aircraft (demo)</Label>
              <Input value={AIRCRAFT_REG} readOnly />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="destructive" onClick={logout} className="text-base">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

