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
import { Plus, ClipboardCheck, Check, X } from "lucide-react"

interface PreDepartureRecord {
  id: string
  frbSheetNo: string
  date: string
  equipmentServiceable: "YES" | "NO"
  preFlightInspection: "YES" | "NO"
  rnp1and2: "YES" | "NO"
  rnav1and2: "YES" | "NO"
  rnav5: "YES" | "NO"
  rnp10: "YES" | "NO"
  rnpApch: "YES" | "NO"
  rnp4: "YES" | "NO"
  adsBOut: "YES" | "NO"
  rvsm: "YES" | "NO"
  natHla: "YES" | "NO"
  fans1a: "YES" | "NO"
  signOffName: string
  licenseNo: string
}

const declarationFields = [
  { key: "equipmentServiceable", label: "All Operational & Emergency Equipment Serviceable" },
  { key: "preFlightInspection", label: "Pre-Flight Inspection carried out I.A.W approved task card" },
  { key: "rnp1and2", label: "RNP 1 & 2" },
  { key: "rnav1and2", label: "RNAV 1 & 2" },
  { key: "rnav5", label: "RNAV 5" },
  { key: "rnp10", label: "RNP 10 (RNAV 10)" },
  { key: "rnpApch", label: "RNP-APCH" },
  { key: "rnp4", label: "RNP 4" },
  { key: "adsBOut", label: "ADS-B OUT" },
  { key: "rvsm", label: "RVSM" },
  { key: "natHla", label: "NAT HLA" },
  { key: "fans1a", label: "FANS 1/A+" },
] as const

const initialMockRecords: PreDepartureRecord[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    equipmentServiceable: "YES",
    preFlightInspection: "YES",
    rnp1and2: "YES",
    rnav1and2: "YES",
    rnav5: "YES",
    rnp10: "YES",
    rnpApch: "YES",
    rnp4: "NO",
    adsBOut: "YES",
    rvsm: "YES",
    natHla: "NO",
    fans1a: "YES",
    signOffName: "Capt. Rajesh Kumar",
    licenseNo: "ATPL-IN-2045",
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-002",
    date: new Date().toISOString().split("T")[0],
    equipmentServiceable: "YES",
    preFlightInspection: "YES",
    rnp1and2: "YES",
    rnav1and2: "YES",
    rnav5: "YES",
    rnp10: "YES",
    rnpApch: "YES",
    rnp4: "YES",
    adsBOut: "YES",
    rvsm: "YES",
    natHla: "YES",
    fans1a: "YES",
    signOffName: "Capt. Suresh Menon",
    licenseNo: "ATPL-IN-1987",
  },
]

type FormDataType = Omit<PreDepartureRecord, "id">

export function PreDepartureModule() {
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [records, setRecords] = useState<PreDepartureRecord[]>(initialMockRecords)
  const [open, setOpen] = useState(false)

  const defaultForm: FormDataType = {
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    equipmentServiceable: "YES",
    preFlightInspection: "YES",
    rnp1and2: "YES",
    rnav1and2: "YES",
    rnav5: "YES",
    rnp10: "YES",
    rnpApch: "YES",
    rnp4: "YES",
    adsBOut: "YES",
    rvsm: "YES",
    natHla: "YES",
    fans1a: "YES",
    signOffName: "",
    licenseNo: "",
  }

  const [formData, setFormData] = useState<FormDataType>(defaultForm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRecord: PreDepartureRecord = {
      ...formData,
      id: Math.random().toString(36).substring(2, 9),
    }
    setRecords((prev) => [...prev, newRecord])
    setOpen(false)
    setFormData(defaultForm)
  }

  const updateField = (key: string, value: "YES" | "NO") => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const StatusBadge = ({ value }: { value: "YES" | "NO" }) =>
    value === "YES" ? (
      <Badge className="bg-emerald-100 text-emerald-800 gap-1">
        <Check className="h-3 w-3" /> YES
      </Badge>
    ) : (
      <Badge variant="destructive" className="gap-1">
        <X className="h-3 w-3" /> NO
      </Badge>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Pre-Departure Details</h1>
          <p className="text-sm text-muted-foreground">Pre-Departure Special / Operations Status declarations</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Pre-Departure Special / Operations Status</DialogTitle>
                <DialogDescription>
                  Complete all YES/NO declarations before departure
                </DialogDescription>
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

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm border-b pb-2">Declarations (YES / NO)</h4>
                  <div className="space-y-2">
                    {declarationFields.map((field) => (
                      <div
                        key={field.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-muted/30"
                      >
                        <span className="text-sm font-medium flex-1">{field.label}</span>
                        <Select
                          value={(formData as Record<string, string>)[field.key]}
                          onValueChange={(value: "YES" | "NO") => updateField(field.key, value)}
                        >
                          <SelectTrigger className="w-24 shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="YES">YES</SelectItem>
                            <SelectItem value="NO">NO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold text-sm">Sign-Off</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sign-off Name</Label>
                      <Input
                        value={formData.signOffName}
                        onChange={(e) => setFormData({ ...formData, signOffName: e.target.value })}
                        placeholder="Full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>License / Authorization No.</Label>
                      <Input
                        value={formData.licenseNo}
                        onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                        placeholder="ATPL-IN-XXXX"
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
            <ClipboardCheck className="h-5 w-5" />
            Pre-Departure Records
          </CardTitle>
          <CardDescription>Operations status declarations for each FRB sheet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">FRB Sheet</TableHead>
                  <TableHead className="w-[90px]">Date</TableHead>
                  <TableHead>Equip.</TableHead>
                  <TableHead>Pre-Flt</TableHead>
                  <TableHead>RNP 1/2</TableHead>
                  <TableHead>RNAV 1/2</TableHead>
                  <TableHead>RNAV 5</TableHead>
                  <TableHead>RNP 10</TableHead>
                  <TableHead>RNP-APCH</TableHead>
                  <TableHead>RNP 4</TableHead>
                  <TableHead>ADS-B</TableHead>
                  <TableHead>RVSM</TableHead>
                  <TableHead>NAT HLA</TableHead>
                  <TableHead>FANS</TableHead>
                  <TableHead>Signed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-xs">{record.frbSheetNo}</TableCell>
                    <TableCell className="text-sm">{record.date}</TableCell>
                    <TableCell><StatusBadge value={record.equipmentServiceable} /></TableCell>
                    <TableCell><StatusBadge value={record.preFlightInspection} /></TableCell>
                    <TableCell><StatusBadge value={record.rnp1and2} /></TableCell>
                    <TableCell><StatusBadge value={record.rnav1and2} /></TableCell>
                    <TableCell><StatusBadge value={record.rnav5} /></TableCell>
                    <TableCell><StatusBadge value={record.rnp10} /></TableCell>
                    <TableCell><StatusBadge value={record.rnpApch} /></TableCell>
                    <TableCell><StatusBadge value={record.rnp4} /></TableCell>
                    <TableCell><StatusBadge value={record.adsBOut} /></TableCell>
                    <TableCell><StatusBadge value={record.rvsm} /></TableCell>
                    <TableCell><StatusBadge value={record.natHla} /></TableCell>
                    <TableCell><StatusBadge value={record.fans1a} /></TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{record.signOffName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{record.licenseNo}</p>
                      </div>
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
