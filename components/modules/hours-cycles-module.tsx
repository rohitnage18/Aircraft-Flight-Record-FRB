"use client"

import React from "react"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Plus, Clock } from "lucide-react"

export function HoursCyclesModule() {
  const { hoursCyclesRecords, addHoursCyclesRecord } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    totalBfHrs: "",
    totalBfCycles: "",
    totalCfHrs: "",
    totalCfCycles: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addHoursCyclesRecord({
      frbSheetNo: formData.frbSheetNo,
      date: formData.date,
      totalBfHrs: Number(formData.totalBfHrs),
      totalBfCycles: Number(formData.totalBfCycles),
      totalCfHrs: Number(formData.totalCfHrs),
      totalCfCycles: Number(formData.totalCfCycles),
    })
    setOpen(false)
    setFormData({
      frbSheetNo: "",
      date: new Date().toISOString().split("T")[0],
      totalBfHrs: "",
      totalBfCycles: "",
      totalCfHrs: "",
      totalCfCycles: "",
    })
  }

  // Calculate flight hours/cycles from B/F to C/F
  const calculateDelta = (bf: number, cf: number) => {
    const delta = cf - bf
    return delta >= 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)
  }

  // Get latest record for summary
  const latestRecord = hoursCyclesRecords[hoursCyclesRecords.length - 1]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Hours & Cycles</h1>
          <p className="text-muted-foreground">Aircraft total hours and cycles tracking</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Hours & Cycles Record</DialogTitle>
                <DialogDescription>Record total B/F (Brought Forward) and C/F (Carried Forward)</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Brought Forward (B/F)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total B/F Hours</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.totalBfHrs}
                        onChange={(e) => setFormData({ ...formData, totalBfHrs: e.target.value })}
                        placeholder="Hours"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total B/F Cycles</Label>
                      <Input
                        type="number"
                        value={formData.totalBfCycles}
                        onChange={(e) => setFormData({ ...formData, totalBfCycles: e.target.value })}
                        placeholder="Cycles"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Carried Forward (C/F)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total C/F Hours</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.totalCfHrs}
                        onChange={(e) => setFormData({ ...formData, totalCfHrs: e.target.value })}
                        placeholder="Hours"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total C/F Cycles</Label>
                      <Input
                        type="number"
                        value={formData.totalCfCycles}
                        onChange={(e) => setFormData({ ...formData, totalCfCycles: e.target.value })}
                        placeholder="Cycles"
                        required
                      />
                    </div>
                  </div>
                </div>

                {formData.totalBfHrs && formData.totalCfHrs && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Flight Time: <strong>{calculateDelta(Number(formData.totalBfHrs), Number(formData.totalCfHrs))} hrs</strong>
                      {" | "}
                      Cycles: <strong>{calculateDelta(Number(formData.totalBfCycles), Number(formData.totalCfCycles))}</strong>
                    </p>
                  </div>
                )}

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

      {/* Summary Cards */}
      {latestRecord && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestRecord.totalCfHrs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">As of {latestRecord.date}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Total Cycles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{latestRecord.totalCfCycles.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">As of {latestRecord.date}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hours & Cycles Log
          </CardTitle>
          <CardDescription>Aircraft utilization records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FRB Sheet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>B/F Hours</TableHead>
                  <TableHead>B/F Cycles</TableHead>
                  <TableHead>C/F Hours</TableHead>
                  <TableHead>C/F Cycles</TableHead>
                  <TableHead>Flight Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hoursCyclesRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.frbSheetNo}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.totalBfHrs.toLocaleString()}</TableCell>
                    <TableCell>{record.totalBfCycles.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">{record.totalCfHrs.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">{record.totalCfCycles.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-emerald-600 font-medium">
                        {calculateDelta(record.totalBfHrs, record.totalCfHrs)} hrs
                      </span>
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
