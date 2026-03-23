"use client"

import React from "react"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { flightTypes } from "@/lib/mock-data"
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
import { Plus, PlaneTakeoff } from "lucide-react"

function calculateTimeDiff(from: string, to: string): string {
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
  
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
}

export function DepartureModule() {
  const { departureRecords, addDepartureRecord } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    placeOfDeparture: "",
    placeOfArrival: "",
    departureTime: "",
    arrivalTime: "",
    takeoffTime: "",
    touchdownTime: "",
    apuHrs: "",
    apuCycles: "",
    flightType: "Passenger",
  })

  const blockTime = formData.departureTime && formData.arrivalTime
    ? calculateTimeDiff(formData.departureTime, formData.arrivalTime)
    : "00:00"

  const airTime = formData.takeoffTime && formData.touchdownTime
    ? calculateTimeDiff(formData.takeoffTime, formData.touchdownTime)
    : "00:00"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addDepartureRecord({
      frbSheetNo: formData.frbSheetNo,
      date: formData.date,
      placeOfDeparture: formData.placeOfDeparture,
      placeOfArrival: formData.placeOfArrival,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      takeoffTime: formData.takeoffTime,
      touchdownTime: formData.touchdownTime,
      apuHrs: Number(formData.apuHrs),
      apuCycles: Number(formData.apuCycles),
      blockTime,
      airTime,
      flightType: formData.flightType,
    })
    setOpen(false)
    setFormData({
      frbSheetNo: "",
      date: new Date().toISOString().split("T")[0],
      placeOfDeparture: "",
      placeOfArrival: "",
      departureTime: "",
      arrivalTime: "",
      takeoffTime: "",
      touchdownTime: "",
      apuHrs: "",
      apuCycles: "",
      flightType: "Passenger",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Departure Details</h1>
          <p className="text-sm text-muted-foreground">Flight timing and sector information</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Departure Record</DialogTitle>
                <DialogDescription>Record flight departure and arrival details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>FRB Sheet No.</Label>
                    <Input
                      value={formData.frbSheetNo}
                      onChange={(e) => setFormData({ ...formData, frbSheetNo: e.target.value })}
                      placeholder="FRB-2024-XXX"
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
                  <div className="space-y-2">
                    <Label>Flight Type</Label>
                    <Select
                      value={formData.flightType}
                      onValueChange={(value) => setFormData({ ...formData, flightType: value ?? "Passenger" })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {flightTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Place of Departure</Label>
                    <Input
                      value={formData.placeOfDeparture}
                      onChange={(e) => setFormData({ ...formData, placeOfDeparture: e.target.value })}
                      placeholder="e.g., VABB (Mumbai)"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Place of Arrival</Label>
                    <Input
                      value={formData.placeOfArrival}
                      onChange={(e) => setFormData({ ...formData, placeOfArrival: e.target.value })}
                      placeholder="e.g., VIDP (Delhi)"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Block Time (Chocks Off/On)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Departure Time (Chocks Off - UTC)</Label>
                      <Input
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Arrival Time (Chocks On - UTC)</Label>
                      <Input
                        type="time"
                        value={formData.arrivalTime}
                        onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Calculated Block Time: <strong>{blockTime}</strong></p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Air Time (Takeoff/Touchdown)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Takeoff Time (UTC)</Label>
                      <Input
                        type="time"
                        value={formData.takeoffTime}
                        onChange={(e) => setFormData({ ...formData, takeoffTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Touchdown Time (UTC)</Label>
                      <Input
                        type="time"
                        value={formData.touchdownTime}
                        onChange={(e) => setFormData({ ...formData, touchdownTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Calculated Air Time: <strong>{airTime}</strong></p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>APU Hours</Label>
                    <Input
                      type="number"
                      value={formData.apuHrs}
                      onChange={(e) => setFormData({ ...formData, apuHrs: e.target.value })}
                      placeholder="Total APU hours"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>APU Cycles</Label>
                    <Input
                      type="number"
                      value={formData.apuCycles}
                      onChange={(e) => setFormData({ ...formData, apuCycles: e.target.value })}
                      placeholder="Total APU cycles"
                      required
                    />
                  </div>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlaneTakeoff className="h-5 w-5" />
            Departure Records
          </CardTitle>
          <CardDescription>Flight sector timing details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FRB Sheet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Dep/Arr (UTC)</TableHead>
                  <TableHead>Block Time</TableHead>
                  <TableHead>Air Time</TableHead>
                  <TableHead>APU Hrs/Cyc</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departureRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.frbSheetNo}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{record.placeOfDeparture}</p>
                        <p className="text-muted-foreground">to {record.placeOfArrival}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {record.departureTime} / {record.arrivalTime}
                    </TableCell>
                    <TableCell className="font-semibold">{record.blockTime}</TableCell>
                    <TableCell>{record.airTime}</TableCell>
                    <TableCell>{record.apuHrs} / {record.apuCycles}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.flightType}</Badge>
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
