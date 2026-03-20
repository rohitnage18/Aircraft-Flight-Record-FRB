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
import { Plus, Droplet } from "lucide-react"

export function OilDataModule() {
  const { oilDataRecords, addOilDataRecord } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    engine1Arrival: "",
    engine1Uplifted: "",
    engine2Arrival: "",
    engine2Uplifted: "",
    apuArrival: "",
    apuUplifted: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addOilDataRecord({
      frbSheetNo: formData.frbSheetNo,
      date: formData.date,
      engine1Arrival: Number(formData.engine1Arrival),
      engine1Uplifted: Number(formData.engine1Uplifted),
      engine1Total: Number(formData.engine1Arrival) + Number(formData.engine1Uplifted),
      engine2Arrival: Number(formData.engine2Arrival),
      engine2Uplifted: Number(formData.engine2Uplifted),
      engine2Total: Number(formData.engine2Arrival) + Number(formData.engine2Uplifted),
      apuArrival: Number(formData.apuArrival),
      apuUplifted: Number(formData.apuUplifted),
      apuTotal: Number(formData.apuArrival) + Number(formData.apuUplifted),
    })
    setOpen(false)
    setFormData({
      frbSheetNo: "",
      date: new Date().toISOString().split("T")[0],
      engine1Arrival: "",
      engine1Uplifted: "",
      engine2Arrival: "",
      engine2Uplifted: "",
      apuArrival: "",
      apuUplifted: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Oil Data</h1>
          <p className="text-muted-foreground">Engine and APU oil quantity tracking</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Oil Data Record</DialogTitle>
                <DialogDescription>Record oil quantities for engines and APU (in quarts)</DialogDescription>
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
                  <h4 className="font-semibold text-sm">Engine #1 (quarts)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>At Arrival</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.engine1Arrival}
                        onChange={(e) => setFormData({ ...formData, engine1Arrival: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Uplifted</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.engine1Uplifted}
                        onChange={(e) => setFormData({ ...formData, engine1Uplifted: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        value={(Number(formData.engine1Arrival || 0) + Number(formData.engine1Uplifted || 0)).toFixed(1)}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Engine #2 (quarts)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>At Arrival</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.engine2Arrival}
                        onChange={(e) => setFormData({ ...formData, engine2Arrival: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Uplifted</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.engine2Uplifted}
                        onChange={(e) => setFormData({ ...formData, engine2Uplifted: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        value={(Number(formData.engine2Arrival || 0) + Number(formData.engine2Uplifted || 0)).toFixed(1)}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">APU (quarts)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>At Arrival</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.apuArrival}
                        onChange={(e) => setFormData({ ...formData, apuArrival: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Uplifted</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.apuUplifted}
                        onChange={(e) => setFormData({ ...formData, apuUplifted: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        value={(Number(formData.apuArrival || 0) + Number(formData.apuUplifted || 0)).toFixed(1)}
                        disabled
                        className="bg-muted"
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
            <Droplet className="h-5 w-5" />
            Oil Data Records
          </CardTitle>
          <CardDescription>Engine and APU oil quantities (in quarts)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FRB Sheet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead colSpan={3} className="text-center border-l">Engine #1</TableHead>
                  <TableHead colSpan={3} className="text-center border-l">Engine #2</TableHead>
                  <TableHead colSpan={3} className="text-center border-l">APU</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-xs border-l">Arr</TableHead>
                  <TableHead className="text-xs">Upl</TableHead>
                  <TableHead className="text-xs">Tot</TableHead>
                  <TableHead className="text-xs border-l">Arr</TableHead>
                  <TableHead className="text-xs">Upl</TableHead>
                  <TableHead className="text-xs">Tot</TableHead>
                  <TableHead className="text-xs border-l">Arr</TableHead>
                  <TableHead className="text-xs">Upl</TableHead>
                  <TableHead className="text-xs">Tot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {oilDataRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono">{record.frbSheetNo}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="border-l">{record.engine1Arrival}</TableCell>
                    <TableCell>{record.engine1Uplifted}</TableCell>
                    <TableCell className="font-semibold">{record.engine1Total}</TableCell>
                    <TableCell className="border-l">{record.engine2Arrival}</TableCell>
                    <TableCell>{record.engine2Uplifted}</TableCell>
                    <TableCell className="font-semibold">{record.engine2Total}</TableCell>
                    <TableCell className="border-l">{record.apuArrival}</TableCell>
                    <TableCell>{record.apuUplifted}</TableCell>
                    <TableCell className="font-semibold">{record.apuTotal}</TableCell>
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
