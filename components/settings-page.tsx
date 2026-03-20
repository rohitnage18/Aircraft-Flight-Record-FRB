"use client"

import { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ThemeMode = "light" | "dark" | "system"

export function SettingsPage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system")
  const [defaultExportRangeDays, setDefaultExportRangeDays] = useState("7")
  const [notes, setNotes] = useState("")
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!saveMessage) return
    const t = window.setTimeout(() => setSaveMessage(null), 2500)
    return () => window.clearTimeout(t)
  }, [saveMessage])

  const onSave = () => {
    // These settings are local-only for now (no backend).
    setSaveMessage("Settings saved.")
  }

  const onReset = () => {
    setThemeMode("system")
    setDefaultExportRangeDays("7")
    setNotes("")
    setSaveMessage("Defaults restored.")
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Settings</CardTitle>
          <CardDescription>Configure your preferences (demo/local).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm">Theme</Label>
            <Select value={themeMode} onValueChange={(v) => setThemeMode(v as ThemeMode)}>
              <SelectTrigger className="w-full sm:w-[260px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm">Default export range (days)</Label>
              <Input
                inputMode="numeric"
                type="number"
                min={1}
                value={defaultExportRangeDays}
                onChange={(e) => setDefaultExportRangeDays(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Quick actions</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setDefaultExportRangeDays("1")}
                >
                  1 day
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setDefaultExportRangeDays("30")}
                >
                  30 days
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Notes</Label>
            <textarea
              className="h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any preferences or reminders..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={onSave} className="text-base">
              Save settings
            </Button>
            <Button variant="ghost" onClick={onReset} className="text-base">
              Reset
            </Button>
            {saveMessage && (
              <span className="text-sm text-muted-foreground">{saveMessage}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

