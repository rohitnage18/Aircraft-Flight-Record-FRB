"use client"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { AIRCRAFT_REG } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Plus, FileText, FileDown } from "lucide-react"

function generateWorkOrderPDF(wo: {
  workOrderNo: string
  frbSheetNo: string
  defectDescription: string
  createdDate: string
  assignedTo: string
}) {
  const pdfWindow = window.open("", "_blank")
  if (!pdfWindow) return

  pdfWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Work Order - ${wo.workOrderNo}</title>
      <style>
        @media print { body { margin: 0; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1a1a1a; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #5c3d1a; padding-bottom: 20px; margin-bottom: 30px; }
        .header-left h1 { font-size: 22px; color: #5c3d1a; }
        .header-left p { font-size: 13px; color: #666; margin-top: 4px; }
        .header-right { text-align: right; }
        .header-right .wo-no { font-size: 20px; font-weight: bold; font-family: monospace; color: #5c3d1a; }
        .header-right .date { font-size: 13px; color: #666; margin-top: 4px; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #5c3d1a; font-weight: 600; margin-bottom: 10px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; }
        .field { display: flex; margin-bottom: 8px; }
        .field-label { width: 200px; font-weight: 600; font-size: 14px; color: #444; }
        .field-value { flex: 1; font-size: 14px; }
        .defect-box { background: #f9f5f0; border: 1px solid #e5ddd3; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 1.6; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; }
        .signature { text-align: center; }
        .signature .line { width: 200px; border-bottom: 1px solid #999; margin-bottom: 6px; height: 40px; }
        .signature .label { font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-left">
          <h1>POONAWALLA AVIATION</h1>
          <p>Work Order Document</p>
          <p>Aircraft: ${AIRCRAFT_REG}</p>
        </div>
        <div class="header-right">
          <div class="wo-no">${wo.workOrderNo}</div>
          <div class="date">Date: ${wo.createdDate}</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Work Order Details</div>
        <div class="field"><div class="field-label">Work Order No.</div><div class="field-value">${wo.workOrderNo}</div></div>
        <div class="field"><div class="field-label">FRB Sheet No.</div><div class="field-value">${wo.frbSheetNo}</div></div>
        <div class="field"><div class="field-label">Created Date</div><div class="field-value">${wo.createdDate}</div></div>
        <div class="field"><div class="field-label">Assigned To</div><div class="field-value">${wo.assignedTo}</div></div>
      </div>
      <div class="section">
        <div class="section-title">Defect Description</div>
        <div class="defect-box">${wo.defectDescription}</div>
      </div>
      <div class="section">
        <div class="section-title">Rectification Action</div>
        <div class="defect-box" style="min-height: 100px; background: #fff;">&nbsp;</div>
      </div>
      <div class="footer">
        <div class="signature"><div class="line"></div><div class="label">Engineer Signature</div></div>
        <div class="signature"><div class="line"></div><div class="label">Quality Inspector</div></div>
        <div class="signature"><div class="line"></div><div class="label">Approved By</div></div>
      </div>
      <script>window.print();</script>
    </body>
    </html>
  `)
  pdfWindow.document.close()
}

export function WorkOrdersModule() {
  const { workOrders, addWorkOrder } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    defectDescription: "",
    assignedTo: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const woNumber = `WO-2024-${String(workOrders.length + 46).padStart(3, "0")}`

    addWorkOrder({
      workOrderNo: woNumber,
      frbSheetNo: formData.frbSheetNo,
      defectDescription: formData.defectDescription,
      status: "Open",
      createdDate: new Date().toISOString().split("T")[0],
      assignedTo: formData.assignedTo,
    })

    setOpen(false)
    setFormData({
      frbSheetNo: "",
      defectDescription: "",
      assignedTo: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Work Orders</h1>
          <p className="text-sm text-muted-foreground">Defect rectification tracking and management</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Work Order
                                    </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Work Order</DialogTitle>
                <DialogDescription>Create a new work order for defect rectification</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Linked FRB Sheet No.</Label>
                  <Input
                    value={formData.frbSheetNo}
                    onChange={(e) => setFormData({ ...formData, frbSheetNo: e.target.value })}
                    placeholder="FRB-2024-XXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Defect Description</Label>
                  <Textarea
                    value={formData.defectDescription}
                    onChange={(e) => setFormData({ ...formData, defectDescription: e.target.value })}
                    placeholder="Describe the defect that needs rectification"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <Input
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    placeholder="Engineer name"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Work Order</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Work Orders
          </CardTitle>
          <CardDescription>Work orders with downloadable PDF documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order No.</TableHead>
                  <TableHead>FRB Sheet</TableHead>
                  <TableHead>Defect Description</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-center">PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((wo) => (
                  <TableRow key={wo.id}>
                    <TableCell className="font-mono font-semibold">{wo.workOrderNo}</TableCell>
                    <TableCell className="font-mono text-sm">{wo.frbSheetNo}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="whitespace-normal break-words text-sm">{wo.defectDescription}</p>
                    </TableCell>
                    <TableCell>{wo.assignedTo}</TableCell>
                    <TableCell>{wo.createdDate}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Download Work Order PDF"
                        onClick={() => generateWorkOrderPDF(wo)}
                      >
                        <FileDown className="h-4 w-4 text-primary" />
                      </Button>
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
