"use client"

import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  CalendarClock,
  Shield,
} from "lucide-react"

function getDaysUntil(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function AdminDocumentsExpiry() {
  const { crewDocuments, maintenanceRecords } = useDataStore()

  // Crew documents with days
  const crewDocsWithDays = crewDocuments.map((d) => ({
    ...d,
    daysUntil: getDaysUntil(d.expiryDate),
    category: "Crew",
  }))

  // Maintenance as documents (for tracking)
  const maintenanceDocsWithDays = maintenanceRecords.map((m) => ({
    id: m.id,
    name: m.frbSheetNo,
    type: "Maintenance",
    expiryDate: m.nextDueDate,
    daysUntil: getDaysUntil(m.nextDueDate),
    category: "Maintenance",
  }))

  // Combined document tracking
  const allExpiriesWithDays = [
    ...crewDocsWithDays.map((d) => ({
      id: d.id,
      name: `${d.crewName} - ${d.documentName}`,
      type: d.documentType,
      expiryDate: d.expiryDate,
      daysUntil: d.daysUntil,
      category: "Crew Document",
    })),
    ...maintenanceDocsWithDays,
  ].sort((a, b) => a.daysUntil - b.daysUntil)

  // Statistics
  const expired = allExpiriesWithDays.filter((d) => d.daysUntil <= 0).length
  const within7 = allExpiriesWithDays.filter((d) => d.daysUntil > 0 && d.daysUntil <= 7).length
  const within30 = allExpiriesWithDays.filter((d) => d.daysUntil > 7 && d.daysUntil <= 30).length
  const within60 = allExpiriesWithDays.filter((d) => d.daysUntil > 30 && d.daysUntil <= 60).length
  const within90 = allExpiriesWithDays.filter((d) => d.daysUntil > 60 && d.daysUntil <= 90).length
  const valid = allExpiriesWithDays.filter((d) => d.daysUntil > 90).length

  const total = allExpiriesWithDays.length
  const compliancePercent = total > 0 ? Math.round(((total - expired) / total) * 100) : 100

  // Critical items (expired or within 30 days)
  const criticalItems = allExpiriesWithDays.filter((d) => d.daysUntil <= 30)

  // Crew document breakdown by type
  const docTypeBreakdown = crewDocuments.reduce((acc, d) => {
    acc[d.documentType] = (acc[d.documentType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Documents & Expiry Tracker</h1>
        <p className="text-sm text-muted-foreground">Comprehensive document validity and expiry monitoring</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className={expired > 0 ? "border-red-300 bg-red-50" : ""}>
          <CardContent className="p-3 text-center">
            <AlertTriangle className={`h-5 w-5 mx-auto mb-1 ${expired > 0 ? "text-red-500" : "text-muted-foreground"}`} />
            <p className={`text-xl font-bold ${expired > 0 ? "text-red-600" : ""}`}>{expired}</p>
            <p className="text-xs text-muted-foreground">Expired</p>
          </CardContent>
        </Card>

        <Card className={within7 > 0 ? "border-red-200 bg-red-50/50" : ""}>
          <CardContent className="p-3 text-center">
            <Clock className={`h-5 w-5 mx-auto mb-1 ${within7 > 0 ? "text-red-500" : "text-muted-foreground"}`} />
            <p className={`text-xl font-bold ${within7 > 0 ? "text-red-600" : ""}`}>{within7}</p>
            <p className="text-xs text-muted-foreground">{"<7 days"}</p>
          </CardContent>
        </Card>

        <Card className={within30 > 0 ? "border-amber-200 bg-amber-50" : ""}>
          <CardContent className="p-3 text-center">
            <CalendarClock className={`h-5 w-5 mx-auto mb-1 ${within30 > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
            <p className={`text-xl font-bold ${within30 > 0 ? "text-amber-600" : ""}`}>{within30}</p>
            <p className="text-xs text-muted-foreground">7-30 days</p>
          </CardContent>
        </Card>

        <Card className={within60 > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
          <CardContent className="p-3 text-center">
            <FileText className={`h-5 w-5 mx-auto mb-1 ${within60 > 0 ? "text-yellow-600" : "text-muted-foreground"}`} />
            <p className="text-xl font-bold">{within60}</p>
            <p className="text-xs text-muted-foreground">30-60 days</p>
          </CardContent>
        </Card>

        <Card className={within90 > 0 ? "border-blue-200 bg-blue-50" : ""}>
          <CardContent className="p-3 text-center">
            <FileText className={`h-5 w-5 mx-auto mb-1 ${within90 > 0 ? "text-blue-500" : "text-muted-foreground"}`} />
            <p className="text-xl font-bold">{within90}</p>
            <p className="text-xs text-muted-foreground">60-90 days</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
            <p className="text-xl font-bold text-emerald-600">{valid}</p>
            <p className="text-xs text-muted-foreground">{">90 days"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Compliance */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Overall Document Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-4xl font-bold">{compliancePercent}%</span>
              <Badge className={compliancePercent >= 90 ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}>
                {compliancePercent >= 90 ? "Compliant" : "Action Required"}
              </Badge>
            </div>
            <Progress value={compliancePercent} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {total} total tracked items | {expired} expired | {criticalItems.length - expired} expiring within 30 days
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Document Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Crew Documents by Type</CardTitle>
            <CardDescription>Distribution of document types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(docTypeBreakdown).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm">{type}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {Object.keys(docTypeBreakdown).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No documents</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Tracking Summary</CardTitle>
            <CardDescription>Items being monitored</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Crew Documents</span>
                <Badge variant="outline">{crewDocuments.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Maintenance Items</span>
                <Badge variant="outline">{maintenanceRecords.length}</Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-medium">Total Tracked</span>
                <Badge>{total}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Items Table */}
      {criticalItems.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Critical Items - Expiring Within 30 Days
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[600px] px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criticalItems.map((item) => (
                      <TableRow 
                        key={item.id} 
                        className={item.daysUntil <= 0 ? "bg-red-50" : item.daysUntil <= 7 ? "bg-red-50/50" : "bg-amber-50/50"}
                      >
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.expiryDate}</TableCell>
                        <TableCell>
                          {item.daysUntil <= 0 ? (
                            <Badge className="bg-red-100 text-red-800">Expired</Badge>
                          ) : item.daysUntil <= 7 ? (
                            <Badge className="bg-red-100 text-red-800">{item.daysUntil}d left</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">{item.daysUntil}d left</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">All Tracked Items</CardTitle>
          <CardDescription>Complete document and maintenance expiry list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[600px] px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allExpiriesWithDays.map((item) => (
                    <TableRow 
                      key={`${item.category}-${item.id}`}
                      className={
                        item.daysUntil <= 0 
                          ? "bg-red-50" 
                          : item.daysUntil <= 30 
                          ? "bg-amber-50/50" 
                          : ""
                      }
                    >
                      <TableCell className="font-medium max-w-[200px]">
                        <p className="truncate">{item.name}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell className="font-mono">
                        {item.daysUntil <= 0 ? (
                          <span className="text-red-600">{Math.abs(item.daysUntil)}d overdue</span>
                        ) : (
                          <span>{item.daysUntil}d</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.daysUntil <= 0 ? (
                          <Badge className="bg-red-100 text-red-800">Expired</Badge>
                        ) : item.daysUntil <= 30 ? (
                          <Badge className="bg-amber-100 text-amber-800">Expiring</Badge>
                        ) : item.daysUntil <= 90 ? (
                          <Badge className="bg-blue-100 text-blue-800">Monitor</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-800">Valid</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
