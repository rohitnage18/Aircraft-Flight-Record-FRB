"use client"

import React from "react"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { dutyStatusOptions, type DutyStatus } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Clock, AlertTriangle } from "lucide-react"

// FDTL validation: Max duty is 14 hours
const MAX_DUTY_HOURS = 14

function calculateDuration(from: string, to: string): number {
  const [fromH, fromM] = from.split(":").map(Number)
  const [toH, toM] = to.split(":").map(Number)
  let hours = toH - fromH
  let mins = toM - fromM
  if (mins < 0) {
    hours -= 1
    mins += 60
  }
  if (hours < 0) {
    hours += 24
  }
  return hours + mins / 60
}

export function CrewDutyModule() {
  const { crewDuties, addCrewDuty } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    crewName: "",
    dutyStatus: "Duty" as DutyStatus,
    city: "",
    rosterNumber: "",
    date: new Date().toISOString().split("T")[0],
    fromTime: "06:00",
    toTime: "18:00",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const duration = calculateDuration(formData.fromTime, formData.toTime)
    const isViolation = formData.dutyStatus === "Duty" && duration > MAX_DUTY_HOURS
    
    addCrewDuty({
      crewName: formData.crewName,
      dutyStatus: formData.dutyStatus,
      city: formData.city,
      rosterNumber: formData.rosterNumber,
      date: formData.date,
      fromTime: formData.fromTime,
      toTime: formData.toTime,
      duration: Number(duration.toFixed(1)),
      isViolation,
    })
    setOpen(false)
    setFormData({
      crewName: "",
      dutyStatus: "Duty",
      city: "",
      rosterNumber: "",
      date: new Date().toISOString().split("T")[0],
      fromTime: "06:00",
      toTime: "18:00",
    })
  }

  const violations = crewDuties.filter((d) => d.isViolation)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Crew Duty Monitoring (FDTL)</h1>
          <p className="text-sm text-muted-foreground">Flight Duty Time Limitations tracking and validation</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Crew Duty Record</DialogTitle>
                <DialogDescription>Record crew duty hours (FDTL validated)</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Crew Name</Label>
                  <Input
                    value={formData.crewName}
                    onChange={(e) => setFormData({ ...formData, crewName: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duty Status</Label>
                    <Select
                      value={formData.dutyStatus}
                      onValueChange={(value: DutyStatus) => setFormData({ ...formData, dutyStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dutyStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Roster Number</Label>
                    <Input
                      value={formData.rosterNumber}
                      onChange={(e) => setFormData({ ...formData, rosterNumber: e.target.value })}
                      placeholder="RST-XXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From Time</Label>
                    <Input
                      type="time"
                      value={formData.fromTime}
                      onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To Time</Label>
                    <Input
                      type="time"
                      value={formData.toTime}
                      onChange={(e) => setFormData({ ...formData, toTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Calculated Duration: <strong>{calculateDuration(formData.fromTime, formData.toTime).toFixed(1)} hours</strong>
                  </p>
                  {formData.dutyStatus === "Duty" && calculateDuration(formData.fromTime, formData.toTime) > MAX_DUTY_HOURS && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      FDTL Violation: Exceeds {MAX_DUTY_HOURS}h limit
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Record</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {violations.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              FDTL Violations Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {violations.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-2 bg-background rounded border">
                  <span className="font-medium">{v.crewName}</span>
                  <span className="text-sm text-muted-foreground">{v.date} | {v.city}</span>
                  <Badge variant="destructive">{v.duration}h duty</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Crew Duty Records
          </CardTitle>
          <CardDescription>FDTL monitoring - Max duty time: {MAX_DUTY_HOURS} hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crew Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Roster No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time (From-To)</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>FDTL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crewDuties.map((duty) => (
                  <TableRow key={duty.id} className={duty.isViolation ? "bg-destructive/5" : ""}>
                    <TableCell className="font-medium">{duty.crewName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{duty.dutyStatus}</Badge>
                    </TableCell>
                    <TableCell>{duty.city}</TableCell>
                    <TableCell className="font-mono">{duty.rosterNumber}</TableCell>
                    <TableCell>{duty.date}</TableCell>
                    <TableCell>{duty.fromTime} - {duty.toTime}</TableCell>
                    <TableCell>{duty.duration}h</TableCell>
                    <TableCell>
                      {duty.isViolation ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" />
                          Violation
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-800">OK</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
