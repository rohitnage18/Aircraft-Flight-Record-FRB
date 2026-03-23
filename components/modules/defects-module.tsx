"use client"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, AlertTriangle, FileText } from "lucide-react"

export function DefectsModule() {
  const { defectRecords, addDefectRecord, addWorkOrder, workOrders } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    defectDetails: "",
    specialObservation: "",
    enteredBy: "",
    enteredByType: "Pilot" as "Pilot" | "Certifying Staff",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const isNil = 
      (formData.defectDetails.toLowerCase() === "nil" || formData.defectDetails.trim() === "") &&
      (formData.specialObservation.toLowerCase() === "nil" || formData.specialObservation.trim() === "")
    
    // Auto-generate work order if defect exists
    let workOrderNo = ""
    let workOrderGenerated = false
    
    if (!isNil && formData.defectDetails.toLowerCase() !== "nil" && formData.defectDetails.trim() !== "") {
      const woNumber = `WO-2024-${String(workOrders.length + 46).padStart(3, "0")}`
      workOrderNo = woNumber
      workOrderGenerated = true
      
      addWorkOrder({
        workOrderNo: woNumber,
        frbSheetNo: formData.frbSheetNo,
        defectDescription: formData.defectDetails,
        status: "Open",
        createdDate: formData.date,
        assignedTo: "Unassigned",
      })
    }

    addDefectRecord({
      frbSheetNo: formData.frbSheetNo,
      date: formData.date,
      defectDetails: formData.defectDetails || "NIL",
      specialObservation: formData.specialObservation || "NIL",
      enteredBy: formData.enteredBy,
      enteredByType: formData.enteredByType,
      workOrderGenerated,
      workOrderNo,
    })
    
    setOpen(false)
    setFormData({
      frbSheetNo: "",
      date: new Date().toISOString().split("T")[0],
      defectDetails: "",
      specialObservation: "",
      enteredBy: "",
      enteredByType: "Pilot",
    })
  }

  const activeDefects = defectRecords.filter(
    (d) => d.workOrderGenerated && d.defectDetails.toLowerCase() !== "nil"
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Defects & Observations</h1>
          <p className="text-sm text-muted-foreground">FRB Section 3 - Defect reporting and work order generation</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
              <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
                <DialogTitle className="text-lg">Report Defect/Observation</DialogTitle>
                <DialogDescription className="text-sm">
                  Enter NIL if no defects. Work orders are auto-generated for actual defects.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 px-6 pb-6">
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

                <div className="space-y-2">
                  <Label>Details of Failure/Defect/Malfunction</Label>
                  <Textarea
                    value={formData.defectDetails}
                    onChange={(e) => setFormData({ ...formData, defectDetails: e.target.value })}
                    placeholder="Enter defect details or type NIL if none"
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty or enter NIL if no defects</p>
                </div>

                <div className="space-y-2">
                  <Label>Special/Significant Observation</Label>
                  <Textarea
                    value={formData.specialObservation}
                    onChange={(e) => setFormData({ ...formData, specialObservation: e.target.value })}
                    placeholder="Enter observations or type NIL if none"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Entered By</Label>
                    <Input
                      value={formData.enteredBy}
                      onChange={(e) => setFormData({ ...formData, enteredBy: e.target.value })}
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Entered By Type</Label>
                    <Select
                      value={formData.enteredByType}
                      onValueChange={(value: "Pilot" | "Certifying Staff" | null) => {
                        if (!value) return
                        setFormData({ ...formData, enteredByType: value })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pilot">Pilot</SelectItem>
                        <SelectItem value="Certifying Staff">Certifying Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.defectDetails && 
                 formData.defectDetails.toLowerCase() !== "nil" && 
                 formData.defectDetails.trim() !== "" && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      A Work Order will be automatically generated for this defect
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
              </ScrollArea> 
            </DialogContent>
          </Dialog>
        )}
      </div>

      {activeDefects.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-800 text-base">
              <AlertTriangle className="h-5 w-5" />
              Active Defects with Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeDefects.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2 bg-background rounded border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{d.defectDetails}</p>
                    <p className="text-xs text-muted-foreground">{d.frbSheetNo} | {d.date}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 shrink-0">{d.workOrderNo}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Defect & Observation Records
          </CardTitle>
          <CardDescription>All reported defects and observations (excluding NIL entries)</CardDescription>
        </CardHeader>
        <CardContent>
          {defectRecords.filter(
            (r) =>
              r.defectDetails.toLowerCase() !== "nil" &&
              r.defectDetails.trim() !== "" ||
              (r.specialObservation.toLowerCase() !== "nil" && r.specialObservation.trim() !== "")
          ).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No defects or observations recorded</p>
              <p className="text-sm">All entries are NIL or empty</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">FRB Sheet</TableHead>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[200px]">Defect Details</TableHead>
                    <TableHead className="min-w-[200px]">Special Observation</TableHead>
                    <TableHead className="w-[150px]">Entered By</TableHead>
                    <TableHead className="w-[120px]">Work Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defectRecords
                    .filter(
                      (r) =>
                        (r.defectDetails.toLowerCase() !== "nil" && r.defectDetails.trim() !== "") ||
                        (r.specialObservation.toLowerCase() !== "nil" && r.specialObservation.trim() !== "")
                    )
                    .map((record) => {
                      const hasDefect =
                        record.defectDetails.toLowerCase() !== "nil" && record.defectDetails.trim() !== ""
                      const hasObservation =
                        record.specialObservation.toLowerCase() !== "nil" &&
                        record.specialObservation.trim() !== ""
                      return (
                        <TableRow key={record.id} className={hasDefect ? "bg-amber-50/50" : ""}>
                          <TableCell className="font-mono align-top">{record.frbSheetNo}</TableCell>
                          <TableCell className="align-top">{record.date}</TableCell>
                          <TableCell className="align-top">
                            <div className="whitespace-normal break-words">
                              {hasDefect ? (
                                <span className="font-medium">{record.defectDetails}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="whitespace-normal break-words text-sm">
                              {hasObservation ? record.specialObservation : <span className="text-muted-foreground">-</span>}
                            </div>
                          </TableCell>
                          <TableCell className="align-top">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{record.enteredBy}</p>
                              <Badge variant="outline" className="text-xs">
                                {record.enteredByType}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="align-top">
                            {record.workOrderGenerated ? (
                              <Badge className="bg-amber-100 text-amber-800">{record.workOrderNo}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
