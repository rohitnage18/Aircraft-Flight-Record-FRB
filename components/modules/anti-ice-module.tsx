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
import { Plus, Snowflake } from "lucide-react"

interface AntiIceRecord {
  id: string
  frbSheetNo: string
  date: string
  antiIce: "ON" | "OFF"
  groundDeIcing: "YES" | "NO"
  timeOfStart: string
  typeOfFluid: string
  mixtureRatio: string
}

const initialRecords: AntiIceRecord[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    antiIce: "ON",
    groundDeIcing: "YES",
    timeOfStart: "05:30",
    typeOfFluid: "Type IV",
    mixtureRatio: "75/25",
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-002",
    date: new Date().toISOString().split("T")[0],
    antiIce: "OFF",
    groundDeIcing: "NO",
    timeOfStart: "",
    typeOfFluid: "-",
    mixtureRatio: "-",
  },
]

export function AntiIceModule() {
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [records, setRecords] = useState<AntiIceRecord[]>(initialRecords)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    antiIce: "OFF" as "ON" | "OFF",
    groundDeIcing: "NO" as "YES" | "NO",
    timeOfStart: "",
    typeOfFluid: "",
    mixtureRatio: "",
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
      antiIce: "OFF",
      groundDeIcing: "NO",
      timeOfStart: "",
      typeOfFluid: "",
      mixtureRatio: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Anti-Ice & Ground De-Icing Record</h1>
          <p className="text-sm text-muted-foreground">Anti-ice status and ground de-icing operations</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Anti-Ice / De-Icing Record</DialogTitle>
                <DialogDescription>Record anti-ice and ground de-icing details</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Anti-Ice</Label>
                    <Select
                      value={formData.antiIce}
                      onValueChange={(value: "ON" | "OFF") =>
                        setFormData({ ...formData, antiIce: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ON">ON</SelectItem>
                        <SelectItem value="OFF">OFF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ground De-Icing Performed</Label>
                    <Select
                      value={formData.groundDeIcing}
                      onValueChange={(value: "YES" | "NO") =>
                        setFormData({ ...formData, groundDeIcing: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">YES</SelectItem>
                        <SelectItem value="NO">NO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.groundDeIcing === "YES" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-semibold text-sm">Ground De-Icing Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Time of Start (UTC)</Label>
                      <Input
                        type="time"
                        value={formData.timeOfStart}
                        onChange={(e) => setFormData({ ...formData, timeOfStart: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type of Fluid</Label>
                      <Select
                        value={formData.typeOfFluid}
                        onValueChange={(value) => setFormData({ ...formData, typeOfFluid: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Type I">Type I</SelectItem>
                          <SelectItem value="Type II">Type II</SelectItem>
                          <SelectItem value="Type III">Type III</SelectItem>
                          <SelectItem value="Type IV">Type IV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Mixture Ratio</Label>
                      <Input
                        value={formData.mixtureRatio}
                        onChange={(e) => setFormData({ ...formData, mixtureRatio: e.target.value })}
                        placeholder="e.g., 75/25"
                      />
                    </div>
                    </div>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Snowflake className="h-5 w-5" />
            Anti-Ice & De-Icing Records
          </CardTitle>
          <CardDescription>Anti-ice system status and ground de-icing operations log</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FRB Sheet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Anti-Ice</TableHead>
                  <TableHead>Ground De-Icing</TableHead>
                  <TableHead>Time of Start</TableHead>
                  <TableHead>Fluid Type</TableHead>
                  <TableHead>Mixture Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-xs">{record.frbSheetNo}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.antiIce === "ON"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {record.antiIce}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.groundDeIcing === "YES"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {record.groundDeIcing}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{record.groundDeIcing === "YES" ? record.timeOfStart : "-"}</TableCell>
                    <TableCell>{record.groundDeIcing === "YES" ? record.typeOfFluid : "-"}</TableCell>
                    <TableCell>{record.groundDeIcing === "YES" ? record.mixtureRatio : "-"}</TableCell>
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
