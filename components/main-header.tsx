"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Settings } from "lucide-react"
import { AIRCRAFT_REG } from "@/lib/mock-data"

const roleLabels = {
  operations: "Operations",
  engineering: "Engineering",
  admin: "Administrator",
}

const roleColors = {
  operations: "bg-blue-100 text-blue-800",
  engineering: "bg-amber-100 text-amber-800",
  admin: "bg-emerald-100 text-emerald-800",
}

export function MainHeader({
  onProfile,
  onSettings,
}: {
  onProfile: () => void
  onSettings: () => void
}) {
  const { user, logout } = useAuth()

  if (!user) return null

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 h-14 bg-card border-b border-border/50 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4 pl-12 lg:pl-0">
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-muted-foreground text-sm">Aircraft:</span>
          <Badge variant="outline" className="font-mono text-sm border-border/60">
            {AIRCRAFT_REG}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={`${roleColors[user.role]} text-sm`}>
          {roleLabels[user.role]}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-9 w-9 rounded-full" />}><Avatar className="h-9 w-9">
                                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">{user.name}</p>
                  <p className="text-sm leading-none text-muted-foreground">
                    {user.username}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
