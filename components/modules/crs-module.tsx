"use client"

import { useState, useRef } from "react"
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
import { Plus, CheckCircle, Upload, FileUp, File } from "lucide-react"

export function CRSModule() {
  const { crsRecords, addCRSRecord } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extracting, setExtracting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    frbSheetNo: "",
    workDetails: "",
    crsNo: "",
    name: "",
    date: new Date().toISOString().split("T")[0],
    authNo: "",
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setExtracting(true)

    // Simulate PDF field extraction (in production, use a real PDF parser)
    setTimeout(() => {
      // Simulate extracting data from the uploaded PDF
      const mockExtracted = {
        crsNo: `CRS-2024-${String(crsRecords.length + 92).padStart(3, "0")}`,
        workDetails: "Maintenance work as per uploaded CRS document",
        name: "",
        date: new Date().toISOString().split("T")[0],
      }
      setFormData((prev) => ({
        ...prev,
        crsNo: mockExtracted.crsNo,
        workDetails: prev.workDetails || mockExtracted.workDetails,
        date: mockExtracted.date,
      }))
      setExtracting(false)
    }, 1200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const crsNo = formData.crsNo || `CRS-2024-${String(crsRecords.length + 92).padStart(3, "0")}`

    addCRSRecord({
      crsNo,
      workOrderRefNo: "-",
      frbSheetNo: formData.frbSheetNo,
      workDetails: formData.workDetails,
      name: formData.name,
      date: formData.date,
      authNo: formData.authNo,
    })

    setOpen(false)
    setUploadedFile(null)
    setFormData({
      frbSheetNo: "",
      workDetails: "",
      crsNo: "",
      name: "",
      date: new Date().toISOString().split("T")[0],
      authNo: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Certificate of Release to Service (CRS)</h1>
          <p className="text-sm text-muted-foreground">Maintenance release documentation</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setUploadedFile(null); setExtracting(false); } }}>
            <DialogTrigger render={<Button />}><Upload className="h-4 w-4 mr-2" />Upload CRS
                                    </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Certificate of Release to Service</DialogTitle>
                <DialogDescription>
                  Upload a CRS PDF to auto-extract fields, or fill in manually
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* File Upload Area */}
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {uploadedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <File className="h-10 w-10 text-primary" />
                      <p className="text-sm font-medium">{uploadedFile.name}</p>
                      <Badge className="bg-emerald-100 text-emerald-800">
                        {extracting ? "Extracting fields..." : "Fields extracted"}
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FileUp className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload CRS PDF</p>
                      <p className="text-xs text-muted-foreground">PDF files only. Fields will be auto-extracted.</p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {uploadedFile ? "Verify & Edit Fields" : "Or Enter Manually"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CRS Number</Label>
                    <Input
                      value={formData.crsNo}
                      onChange={(e) => setFormData({ ...formData, crsNo: e.target.value })}
                      placeholder="CRS-2024-XXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>FRB Sheet No.</Label>
                    <Input
                      value={formData.frbSheetNo}
                      onChange={(e) => setFormData({ ...formData, frbSheetNo: e.target.value })}
                      placeholder="FRB-2024-XXX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Details of Work Carried Out</Label>
                  <Textarea
                    value={formData.workDetails}
                    onChange={(e) => setFormData({ ...formData, workDetails: e.target.value })}
                    placeholder="Describe the maintenance work completed"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Certifying engineer name"
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

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={extracting}>
                    Submit CRS
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            CRS Records
          </CardTitle>
          <CardDescription>Certificate of Release to Service documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CRS No.</TableHead>
                  <TableHead>FRB Sheet</TableHead>
                  <TableHead>Work Details</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crsRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono font-semibold">{record.crsNo}</TableCell>
                    <TableCell className="font-mono text-sm">{record.frbSheetNo}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="whitespace-normal break-words text-sm">{record.workDetails}</p>
                    </TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
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
