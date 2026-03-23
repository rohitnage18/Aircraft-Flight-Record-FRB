"use client"

import React from "react"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Gauge } from "lucide-react"

export function EngineHealthModule() {
  const { engineHealthRecords, addEngineHealthRecord } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    engine: "LH" as "LH" | "RH",
    timeUtc: "",
    pressureAltitude: "",
    ias: "",
    sat: "",
    epr: "",
    lpN1: "",
    itt: "",
    hpN2: "",
    fuelFlow: "",
    oilTemp: "",
    oilPressure: "",
    evmLp: "",
    evmHp: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addEngineHealthRecord({
      frbSheetNo: formData.frbSheetNo,
      date: formData.date,
      engine: formData.engine,
      timeUtc: formData.timeUtc,
      pressureAltitude: Number(formData.pressureAltitude),
      ias: Number(formData.ias),
      sat: Number(formData.sat),
      epr: Number(formData.epr),
      lpN1: Number(formData.lpN1),
      itt: Number(formData.itt),
      hpN2: Number(formData.hpN2),
      fuelFlow: Number(formData.fuelFlow),
      oilTemp: Number(formData.oilTemp),
      oilPressure: Number(formData.oilPressure),
      evmLp: Number(formData.evmLp),
      evmHp: Number(formData.evmHp),
    })
    setOpen(false)
    setFormData({
      frbSheetNo: "",
      date: new Date().toISOString().split("T")[0],
      engine: "LH",
      timeUtc: "",
      pressureAltitude: "",
      ias: "",
      sat: "",
      epr: "",
      lpN1: "",
      itt: "",
      hpN2: "",
      fuelFlow: "",
      oilTemp: "",
      oilPressure: "",
      evmLp: "",
      evmHp: "",
    })
  }

  const lhRecords = engineHealthRecords.filter((r) => r.engine === "LH")
  const rhRecords = engineHealthRecords.filter((r) => r.engine === "RH")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Engine Health Monitoring</h1>
          <p className="text-sm text-muted-foreground">FRB Parameters Section - Engine performance data at stable cruise</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Engine Health Record</DialogTitle>
                <DialogDescription>Record engine parameters at stabilized cruise</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                    <Label>Engine</Label>
                    <Select
                      value={formData.engine}
                      onValueChange={(value: "LH" | "RH" | null) => {
                        if (!value) return
                        setFormData({ ...formData, engine: value })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LH">LH (Left)</SelectItem>
                        <SelectItem value="RH">RH (Right)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time (UTC)</Label>
                    <Input
                      type="time"
                      value={formData.timeUtc}
                      onChange={(e) => setFormData({ ...formData, timeUtc: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Flight Parameters</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Pressure Alt (ft)</Label>
                      <Input
                        type="number"
                        value={formData.pressureAltitude}
                        onChange={(e) => setFormData({ ...formData, pressureAltitude: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IAS (kt)</Label>
                      <Input
                        type="number"
                        value={formData.ias}
                        onChange={(e) => setFormData({ ...formData, ias: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SAT (C)</Label>
                      <Input
                        type="number"
                        value={formData.sat}
                        onChange={(e) => setFormData({ ...formData, sat: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>EPR</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.epr}
                        onChange={(e) => setFormData({ ...formData, epr: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Engine Parameters</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>LP (N1) %</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.lpN1}
                        onChange={(e) => setFormData({ ...formData, lpN1: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ITT (C)</Label>
                      <Input
                        type="number"
                        value={formData.itt}
                        onChange={(e) => setFormData({ ...formData, itt: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>HP (N2) %</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.hpN2}
                        onChange={(e) => setFormData({ ...formData, hpN2: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fuel Flow (lb/hr)</Label>
                      <Input
                        type="number"
                        value={formData.fuelFlow}
                        onChange={(e) => setFormData({ ...formData, fuelFlow: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Oil & EVM Parameters</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Oil Temp (C)</Label>
                      <Input
                        type="number"
                        value={formData.oilTemp}
                        onChange={(e) => setFormData({ ...formData, oilTemp: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Oil Pressure (PSI)</Label>
                      <Input
                        type="number"
                        value={formData.oilPressure}
                        onChange={(e) => setFormData({ ...formData, oilPressure: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>EVM LP</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.evmLp}
                        onChange={(e) => setFormData({ ...formData, evmLp: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>EVM HP</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.evmHp}
                        onChange={(e) => setFormData({ ...formData, evmHp: e.target.value })}
                        required
                      />
                    </div>
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
            <Gauge className="h-5 w-5" />
            Engine Health Records
          </CardTitle>
          <CardDescription>Stabilized cruise parameter recordings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Engines</TabsTrigger>
              <TabsTrigger value="lh">LH Engine</TabsTrigger>
              <TabsTrigger value="rh">RH Engine</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <EngineTable records={engineHealthRecords} />
            </TabsContent>
            <TabsContent value="lh">
              <EngineTable records={lhRecords} />
            </TabsContent>
            <TabsContent value="rh">
              <EngineTable records={rhRecords} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function EngineTable({ records }: { records: typeof import("@/lib/mock-data").engineHealthRecords }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>FRB</TableHead>
            <TableHead>Engine</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Alt (ft)</TableHead>
            <TableHead>IAS</TableHead>
            <TableHead>EPR</TableHead>
            <TableHead>N1 %</TableHead>
            <TableHead>ITT</TableHead>
            <TableHead>N2 %</TableHead>
            <TableHead>FF (lb/hr)</TableHead>
            <TableHead>Oil T/P</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-mono text-xs">{record.frbSheetNo}</TableCell>
              <TableCell>
                <Badge variant={record.engine === "LH" ? "default" : "secondary"}>
                  {record.engine}
                </Badge>
              </TableCell>
              <TableCell>{record.timeUtc}</TableCell>
              <TableCell>{record.pressureAltitude.toLocaleString()}</TableCell>
              <TableCell>{record.ias}</TableCell>
              <TableCell>{record.epr}</TableCell>
              <TableCell>{record.lpN1}</TableCell>
              <TableCell>{record.itt}</TableCell>
              <TableCell>{record.hpN2}</TableCell>
              <TableCell>{record.fuelFlow.toLocaleString()}</TableCell>
              <TableCell>{record.oilTemp}/{record.oilPressure}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
