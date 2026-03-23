"use client"

import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react"

function getDaysUntil(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getStatusBadge(days: number) {
  if (days <= 0) return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
  if (days <= 30) return <Badge className="bg-red-100 text-red-800">{days}d</Badge>
  if (days <= 60) return <Badge className="bg-amber-100 text-amber-800">{days}d</Badge>
  if (days <= 90) return <Badge className="bg-blue-100 text-blue-800">{days}d</Badge>
  return <Badge className="bg-emerald-100 text-emerald-800">{days}d</Badge>
}

export function AdminMaintenanceCompliance() {
  const { maintenanceRecords, crsRecords, hoursCyclesRecords } = useDataStore()

  // Maintenance with days calculation
  const maintenanceWithDays = maintenanceRecords.map((m) => ({
    ...m,
    daysUntil: getDaysUntil(m.nextDueDate),
  })).sort((a, b) => a.daysUntil - b.daysUntil)

  // Compliance stats
  const overdue = maintenanceWithDays.filter((m) => m.daysUntil <= 0).length
  const within30 = maintenanceWithDays.filter((m) => m.daysUntil > 0 && m.daysUntil <= 30).length
  const within60 = maintenanceWithDays.filter((m) => m.daysUntil > 30 && m.daysUntil <= 60).length
  const within90 = maintenanceWithDays.filter((m) => m.daysUntil > 60 && m.daysUntil <= 90).length
  const compliant = maintenanceWithDays.filter((m) => m.daysUntil > 90).length

  const total = maintenanceRecords.length
  const compliancePercent = total > 0 ? Math.round(((total - overdue) / total) * 100) : 100

  // Latest hours/cycles
  const latestHours = hoursCyclesRecords[hoursCyclesRecords.length - 1]

  // CRS summary
  const recentCRS = crsRecords.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Maintenance & Compliance</h1>
        <p className="text-sm text-muted-foreground">Maintenance status and compliance tracking</p>
      </div>

      {/* Compliance Summary */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Shield className="h-5 w-5" />
            Overall Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-emerald-700">{compliancePercent}%</span>
              <Badge className={compliancePercent >= 90 ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}>
                {compliancePercent >= 90 ? "Compliant" : "Attention Required"}
              </Badge>
            </div>
            <Progress value={compliancePercent} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className={overdue > 0 ? "border-red-200 bg-red-50" : ""}>
          <CardContent className="p-3 sm:p-4 text-center">
            <AlertTriangle className={`h-6 w-6 mx-auto mb-2 ${overdue > 0 ? "text-red-500" : "text-muted-foreground"}`} />
            <p className="text-xl sm:text-2xl font-bold">{overdue}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>

        <Card className={within30 > 0 ? "border-red-200 bg-red-50/50" : ""}>
          <CardContent className="p-3 sm:p-4 text-center">
            <Clock className={`h-6 w-6 mx-auto mb-2 ${within30 > 0 ? "text-red-500" : "text-muted-foreground"}`} />
            <p className="text-xl sm:text-2xl font-bold">{within30}</p>
            <p className="text-xs text-muted-foreground">{"<30 days"}</p>
          </CardContent>
        </Card>

        <Card className={within60 > 0 ? "border-amber-200 bg-amber-50" : ""}>
          <CardContent className="p-3 sm:p-4 text-center">
            <Calendar className={`h-6 w-6 mx-auto mb-2 ${within60 > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
            <p className="text-xl sm:text-2xl font-bold">{within60}</p>
            <p className="text-xs text-muted-foreground">30-60 days</p>
          </CardContent>
        </Card>

        <Card className={within90 > 0 ? "border-blue-200 bg-blue-50" : ""}>
          <CardContent className="p-3 sm:p-4 text-center">
            <Calendar className={`h-6 w-6 mx-auto mb-2 ${within90 > 0 ? "text-blue-500" : "text-muted-foreground"}`} />
            <p className="text-xl sm:text-2xl font-bold">{within90}</p>
            <p className="text-xs text-muted-foreground">60-90 days</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50 col-span-2 sm:col-span-1">
          <CardContent className="p-3 sm:p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-xl sm:text-2xl font-bold">{compliant}</p>
            <p className="text-xs text-muted-foreground">{">90 days"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Schedule Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Maintenance Schedule</CardTitle>
          <CardDescription>All scheduled maintenance items sorted by urgency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[600px] px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FRB Sheet</TableHead>
                    <TableHead>Date Recorded</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenanceWithDays.map((record) => (
                    <TableRow 
                      key={record.id} 
                      className={record.daysUntil <= 0 ? "bg-red-50" : record.daysUntil <= 30 ? "bg-red-50/50" : ""}
                    >
                      <TableCell className="font-mono text-sm">{record.frbSheetNo}</TableCell>
                      <TableCell className="text-sm">{record.date}</TableCell>
                      <TableCell className="text-sm">{record.nextDueDate}</TableCell>
                      <TableCell>{getStatusBadge(record.daysUntil)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hours & Cycles and Recent CRS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current Hours & Cycles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Current Hours & Cycles</CardTitle>
            <CardDescription>Latest airframe and engine data</CardDescription>
          </CardHeader>
          <CardContent>
            {latestHours ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Airframe Hours</p>
                    <p className="text-lg font-bold">{latestHours.totalCfHrs.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Airframe Cycles</p>
                    <p className="text-lg font-bold">{latestHours.totalCfCycles.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Before Flight</p>
                    <p className="text-sm">{latestHours.totalBfHrs}h / {latestHours.totalBfCycles}c</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Flight</p>
                    <p className="text-sm">{latestHours.totalCfHrs}h / {latestHours.totalCfCycles}c</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Last updated: {latestHours.date}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Recent CRS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Recent Certificate of Release</CardTitle>
            <CardDescription>Latest CRS entries</CardDescription>
          </CardHeader>
          <CardContent>
            {recentCRS.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No CRS records</p>
            ) : (
              <div className="space-y-3">
                {recentCRS.map((crs) => (
                  <div key={crs.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm truncate">{crs.crsNo}</p>
                      <p className="text-xs text-muted-foreground">{crs.date}</p>
                    </div>
                    <Badge variant="outline" className="ml-2 shrink-0">{crs.authNo}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
