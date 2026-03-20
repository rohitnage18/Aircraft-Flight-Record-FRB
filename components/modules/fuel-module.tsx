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
import { Plus, Fuel } from "lucide-react"

export function FuelModule() {
  const { fuelRecords, addFuelRecord } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    fuelPlannedForSector: "",
    beforeFlightLHMain: "",
    beforeFlightRHMain: "",
    beforeFlightCenter: "",
    beforeFlightAft: "",
    afterDepartureLHMain: "",
    afterDepartureRHMain: "",
    afterDepartureCenter: "",
    afterDepartureAft: "",
    upliftedLitres: "",
    upliftedReceiptNo: "",
    upliftedVendorName: "",
  })

  const calculateTotals = () => {
    const beforeTotal =
      Number(formData.beforeFlightLHMain || 0) +
      Number(formData.beforeFlightRHMain || 0) +
      Number(formData.beforeFlightCenter || 0) +
      Number(formData.beforeFlightAft || 0)

    const afterTotal =
      Number(formData.afterDepartureLHMain || 0) +
      Number(formData.afterDepartureRHMain || 0) +
      Number(formData.afterDepartureCenter || 0) +
      Number(formData.afterDepartureAft || 0)

    return {
      beforeTotal,
      afterTotal,
      fuelBurned: beforeTotal - afterTotal,
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { beforeTotal, afterTotal, fuelBurned } = calculateTotals()

    addFuelRecord({
      frbSheetNo: formData.frbSheetNo,
      date: formData.date,
      fuelVendor: formData.upliftedVendorName,
      fuelPlannedForSector: Number(formData.fuelPlannedForSector),
      beforeFlightLHMain: Number(formData.beforeFlightLHMain),
      beforeFlightRHMain: Number(formData.beforeFlightRHMain),
      beforeFlightCenter: Number(formData.beforeFlightCenter),
      beforeFlightAft: Number(formData.beforeFlightAft),
      beforeFlightTotal: beforeTotal,
      afterDepartureLHMain: Number(formData.afterDepartureLHMain),
      afterDepartureRHMain: Number(formData.afterDepartureRHMain),
      afterDepartureCenter: Number(formData.afterDepartureCenter),
      afterDepartureAft: Number(formData.afterDepartureAft),
      afterDepartureTotal: afterTotal,
      upliftedLitres: Number(formData.upliftedLitres),
      upliftedReceiptNo: formData.upliftedReceiptNo,
      upliftedName: formData.upliftedVendorName,
      fuelBurned,
    })
    setOpen(false)
    setFormData({
      frbSheetNo: "",
      date: new Date().toISOString().split("T")[0],
      fuelPlannedForSector: "",
      beforeFlightLHMain: "",
      beforeFlightRHMain: "",
      beforeFlightCenter: "",
      beforeFlightAft: "",
      afterDepartureLHMain: "",
      afterDepartureRHMain: "",
      afterDepartureCenter: "",
      afterDepartureAft: "",
      upliftedLitres: "",
      upliftedReceiptNo: "",
      upliftedVendorName: "",
    })
  }

  const { beforeTotal, afterTotal, fuelBurned } = calculateTotals()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Fuel Monitoring</h1>
          <p className="text-sm text-muted-foreground">FRB Section 3 - Fuel distribution and consumption tracking</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Fuel Record</DialogTitle>
                <DialogDescription>Record fuel distribution details per FRB Section 3</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="space-y-2">
                  <Label>Fuel Planned for Sector (lbs)</Label>
                  <Input
                    type="number"
                    value={formData.fuelPlannedForSector}
                    onChange={(e) => setFormData({ ...formData, fuelPlannedForSector: e.target.value })}
                    placeholder="Planned fuel"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Before Flight (lbs)</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>LH Main</Label>
                      <Input
                        type="number"
                        value={formData.beforeFlightLHMain}
                        onChange={(e) => setFormData({ ...formData, beforeFlightLHMain: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>RH Main</Label>
                      <Input
                        type="number"
                        value={formData.beforeFlightRHMain}
                        onChange={(e) => setFormData({ ...formData, beforeFlightRHMain: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Center</Label>
                      <Input
                        type="number"
                        value={formData.beforeFlightCenter}
                        onChange={(e) => setFormData({ ...formData, beforeFlightCenter: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Aft Tank</Label>
                      <Input
                        type="number"
                        value={formData.beforeFlightAft}
                        onChange={(e) => setFormData({ ...formData, beforeFlightAft: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Before Flight: <strong>{beforeTotal.toLocaleString()} lbs</strong></p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">After Departure (lbs)</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>LH Main</Label>
                      <Input
                        type="number"
                        value={formData.afterDepartureLHMain}
                        onChange={(e) => setFormData({ ...formData, afterDepartureLHMain: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>RH Main</Label>
                      <Input
                        type="number"
                        value={formData.afterDepartureRHMain}
                        onChange={(e) => setFormData({ ...formData, afterDepartureRHMain: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Center</Label>
                      <Input
                        type="number"
                        value={formData.afterDepartureCenter}
                        onChange={(e) => setFormData({ ...formData, afterDepartureCenter: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Aft Tank</Label>
                      <Input
                        type="number"
                        value={formData.afterDepartureAft}
                        onChange={(e) => setFormData({ ...formData, afterDepartureAft: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Total After Departure: <strong>{afterTotal.toLocaleString()} lbs</strong></p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-lg font-semibold">Fuel Burned: {fuelBurned.toLocaleString()} lbs</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Fuel Uplifted</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Litres</Label>
                      <Input
                        type="number"
                        value={formData.upliftedLitres}
                        onChange={(e) => setFormData({ ...formData, upliftedLitres: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Receipt No.</Label>
                      <Input
                        value={formData.upliftedReceiptNo}
                        onChange={(e) => setFormData({ ...formData, upliftedReceiptNo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vendor Name</Label>
                      <Input
                        value={formData.upliftedVendorName}
                        onChange={(e) => setFormData({ ...formData, upliftedVendorName: e.target.value })}
                        placeholder="Fuel vendor name"
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
            <Fuel className="h-5 w-5" />
            Fuel Records
          </CardTitle>
          <CardDescription>Fuel distribution per flight sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FRB Sheet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Planned (lbs)</TableHead>
                  <TableHead>Before (lbs)</TableHead>
                  <TableHead>After (lbs)</TableHead>
                  <TableHead>Burned (lbs)</TableHead>
                  <TableHead>Uplifted (L)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fuelRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.frbSheetNo}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.fuelVendor}</TableCell>
                    <TableCell>{record.fuelPlannedForSector.toLocaleString()}</TableCell>
                    <TableCell>{record.beforeFlightTotal.toLocaleString()}</TableCell>
                    <TableCell>{record.afterDepartureTotal.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">{record.fuelBurned.toLocaleString()}</TableCell>
                    <TableCell>{record.upliftedLitres.toLocaleString()}</TableCell>
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
