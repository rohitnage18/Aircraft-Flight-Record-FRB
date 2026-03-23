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
import { Plus, FileText, AlertTriangle, Clock } from "lucide-react"

function getDaysUntil(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function CrewDocumentsModule() {
  const { crewDocuments, addCrewDocument } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    crewName: "",
    documentType: "License" as "License" | "Training",
    documentName: "",
    issuedDate: "",
    expiryDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const daysUntil = getDaysUntil(formData.expiryDate)
    addCrewDocument({
      crewName: formData.crewName,
      documentType: formData.documentType,
      documentName: formData.documentName,
      issuedDate: formData.issuedDate,
      expiryDate: formData.expiryDate,
      isExpiringSoon: daysUntil <= 30,
    })
    setOpen(false)
    setFormData({
      crewName: "",
      documentType: "License",
      documentName: "",
      issuedDate: "",
      expiryDate: "",
    })
  }

  const expiringSoon = crewDocuments.filter((d) => {
    const days = getDaysUntil(d.expiryDate)
    return days <= 30 && days > 0
  })

  const expired = crewDocuments.filter((d) => getDaysUntil(d.expiryDate) <= 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Crew Training & Documents</h1>
          <p className="text-muted-foreground">License and training certificate management</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Document/Training Record</DialogTitle>
                <DialogDescription>Track crew licenses and training certificates</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Crew Name</Label>
                  <Input
                    value={formData.crewName}
                    onChange={(e) => setFormData({ ...formData, crewName: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Document Type</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value: "License" | "Training" | null) => {
                        if (!value) return
                        setFormData({ ...formData, documentType: value })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="License">License</SelectItem>
                        <SelectItem value="Training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Document Name</Label>
                    <Input
                      value={formData.documentName}
                      onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                      placeholder="e.g., ATPL, CRM Training"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issued Date</Label>
                    <Input
                      type="date"
                      value={formData.issuedDate}
                      onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Document</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {expired.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-destructive text-base">
                <AlertTriangle className="h-5 w-5" />
                Expired Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expired.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div>
                      <p className="font-medium text-sm">{d.crewName}</p>
                      <p className="text-xs text-muted-foreground">{d.documentName}</p>
                    </div>
                    <Badge variant="destructive">Expired</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {expiringSoon.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-amber-800 text-base">
                <Clock className="h-5 w-5" />
                Expiring Within 30 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expiringSoon.map((d) => {
                  const days = getDaysUntil(d.expiryDate)
                  return (
                    <div key={d.id} className="flex items-center justify-between p-2 bg-background rounded border">
                      <div>
                        <p className="font-medium text-sm">{d.crewName}</p>
                        <p className="text-xs text-muted-foreground">{d.documentName}</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">{days} days</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Documents & Certificates
          </CardTitle>
          <CardDescription>Alerts generated 30 days before expiry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crew Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crewDocuments.map((doc) => {
                  const days = getDaysUntil(doc.expiryDate)
                  const isExpired = days <= 0
                  const isExpiringSoon = days > 0 && days <= 30
                  return (
                    <TableRow key={doc.id} className={isExpired ? "bg-destructive/5" : isExpiringSoon ? "bg-amber-50" : ""}>
                      <TableCell className="font-medium">{doc.crewName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.documentType}</Badge>
                      </TableCell>
                      <TableCell>{doc.documentName}</TableCell>
                      <TableCell>{doc.issuedDate}</TableCell>
                      <TableCell>{doc.expiryDate}</TableCell>
                      <TableCell>
                        {isExpired ? (
                          <Badge variant="destructive">Expired</Badge>
                        ) : isExpiringSoon ? (
                          <Badge className="bg-amber-100 text-amber-800">{days} days</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-800">Valid</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
