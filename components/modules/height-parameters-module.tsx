"use client"

import { useState } from "react"
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
import { Plus, Ruler } from "lucide-react"

interface HeightParameterRecord {
  id: string
  frbSheetNo: string
  date: string
  flightLevel: string
  atcXPdr12: string
  altimeterReadingP1: string
  altimeterReadingP2: string
  altimeterStandby: string
  altimeterAP: "Y" | "N"
  heightKeepingSystem: "Normal" | "Defective"
  timeUtc: string
}

const initialRecords: HeightParameterRecord[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    flightLevel: "FL350",
    atcXPdr12: "35010",
    altimeterReadingP1: "35010",
    altimeterReadingP2: "35000",
    altimeterStandby: "35005",
    altimeterAP: "Y",
    heightKeepingSystem: "Normal",
    timeUtc: "08:45",
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-002",
    date: new Date().toISOString().split("T")[0],
    flightLevel: "FL410",
    atcXPdr12: "41005",
    altimeterReadingP1: "41000",
    altimeterReadingP2: "40990",
    altimeterStandby: "40995",
    altimeterAP: "N",
    heightKeepingSystem: "Normal",
    timeUtc: "14:20",
  },
]

export function HeightParametersModule() {
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [records, setRecords] = useState<HeightParameterRecord[]>(initialRecords)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    flightLevel: "",
    atcXPdr12: "",
    altimeterReadingP1: "",
    altimeterReadingP2: "",
    altimeterStandby: "",
    altimeterAP: "Y" as "Y" | "N",
    heightKeepingSystem: "Normal" as "Normal" | "Defective",
    timeUtc: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRecords((prev) => [
      ...prev,
      { ...formData, id: Math.random().toString(36).substring(2, 9) },
    ])
    setOpen(false)
    setFormData({
      frbSheetNo: "",
      date: new Date().toISOString().split("T")[0],
      flightLevel: "",
      atcXPdr12: "",
      altimeterReadingP1: "",
      altimeterReadingP2: "",
      altimeterStandby: "",
      altimeterAP: "Y",
      heightKeepingSystem: "Normal",
      timeUtc: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Height Keeping Parameters</h1>
          <p className="text-sm text-muted-foreground">
            Stable cruise recording at or above FL290 up to FL410
          </p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Height Parameter Record</DialogTitle>
                <DialogDescription>
                  Record height keeping parameter data at stable cruise
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <Label>Time (UTC)</Label>
                    <Input
                      type="time"
                      value={formData.timeUtc}
                      onChange={(e) => setFormData({ ...formData, timeUtc: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Flight Level</Label>
                  <Input
                    value={formData.flightLevel}
                    onChange={(e) => setFormData({ ...formData, flightLevel: e.target.value })}
                    placeholder="e.g., FL350"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{"ATC'X PDR 1 & 2"}</Label>
                  <Input
                    type="number"
                    value={formData.atcXPdr12}
                    onChange={(e) => setFormData({ ...formData, atcXPdr12: e.target.value })}
                    placeholder="e.g., 35010"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm border-b pb-2">Altimeter Reading</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>P1 Reading (ft)</Label>
                      <Input
                        type="number"
                        value={formData.altimeterReadingP1}
                        onChange={(e) => setFormData({ ...formData, altimeterReadingP1: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>P2 Reading (ft)</Label>
                      <Input
                        type="number"
                        value={formData.altimeterReadingP2}
                        onChange={(e) => setFormData({ ...formData, altimeterReadingP2: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Standby Reading (ft)</Label>
                      <Input
                        type="number"
                        value={formData.altimeterStandby}
                        onChange={(e) => setFormData({ ...formData, altimeterStandby: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>A/P</Label>
                      <Select
                        value={formData.altimeterAP}
                        onValueChange={(value: "Y" | "N" | null) => {
                          if (!value) return
                          setFormData({ ...formData, altimeterAP: value })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N">N</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Height Keeping System Monitoring</Label>
                  <Select
                    value={formData.heightKeepingSystem}
                    onValueChange={(value: "Normal" | "Defective" | null) => {
                      if (!value) return
                      setFormData({ ...formData, heightKeepingSystem: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Defective">Defective</SelectItem>
                    </SelectContent>
                  </Select>
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
            <Ruler className="h-5 w-5" />
            Height Keeping Records
          </CardTitle>
          <CardDescription>FL290 - FL410 stable cruise recordings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FRB Sheet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time (UTC)</TableHead>
                  <TableHead>Flight Level</TableHead>
                  <TableHead>{"ATC'X PDR 1&2"}</TableHead>
                  <TableHead>Alt. P1</TableHead>
                  <TableHead>Alt. P2</TableHead>
                  <TableHead>Standby</TableHead>
                  <TableHead>A/P</TableHead>
                  <TableHead>System Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-xs">{record.frbSheetNo}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="font-mono">{record.timeUtc}</TableCell>
                    <TableCell className="font-semibold">{record.flightLevel}</TableCell>
                    <TableCell>{record.atcXPdr12}</TableCell>
                    <TableCell>{record.altimeterReadingP1}</TableCell>
                    <TableCell>{record.altimeterReadingP2}</TableCell>
                    <TableCell>{record.altimeterStandby}</TableCell>
                    <TableCell>
                      <Badge className={record.altimeterAP === "Y" ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"}>
                        {record.altimeterAP}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.heightKeepingSystem === "Normal"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {record.heightKeepingSystem}
                      </Badge>
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
