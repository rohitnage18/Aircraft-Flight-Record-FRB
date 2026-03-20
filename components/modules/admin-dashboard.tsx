"use client"

import { useDataStore } from "@/lib/data-store"
import { AIRCRAFT_REG } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plane,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle,
  Users,
  Wrench,
  Shield,
  Fuel,
  ClipboardList,
} from "lucide-react"

function getDaysUntil(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function AdminDashboard() {
  const {
    maintenanceRecords,
    crewDuties,
    crewDocuments,
    workOrders,
    hoursCyclesRecords,
    frbEntries,
    departureRecords,
    defectRecords,
  } = useDataStore()

  // Maintenance compliance
  const totalMaintenance = maintenanceRecords.length
  const overdueMaintenanceCount = maintenanceRecords.filter((m) => getDaysUntil(m.nextDueDate) <= 0).length
  const maintenanceWithin30 = maintenanceRecords.filter((m) => {
    const days = getDaysUntil(m.nextDueDate)
    return days > 0 && days <= 30
  }).length
  const maintenanceCompliance = totalMaintenance > 0 
    ? Math.round(((totalMaintenance - overdueMaintenanceCount) / totalMaintenance) * 100) 
    : 100

  // FDTL compliance
  const totalDuties = crewDuties.length
  const violationsCount = crewDuties.filter((d) => d.isViolation).length
  const fdtlCompliance = totalDuties > 0 
    ? Math.round(((totalDuties - violationsCount) / totalDuties) * 100) 
    : 100

  // Document compliance
  const totalDocs = crewDocuments.length
  const expiredDocs = crewDocuments.filter((d) => getDaysUntil(d.expiryDate) <= 0).length
  const expiringSoonDocs = crewDocuments.filter((d) => {
    const days = getDaysUntil(d.expiryDate)
    return days > 0 && days <= 30
  }).length
  const docCompliance = totalDocs > 0 
    ? Math.round(((totalDocs - expiredDocs) / totalDocs) * 100) 
    : 100

  // Work order stats
  const openWO = workOrders.filter((wo) => wo.status === "Open").length
  const inProgressWO = workOrders.filter((wo) => wo.status === "In Progress").length

  // Defects (non-NIL)
  const actualDefects = defectRecords.filter(
    (d) => d.defectDetails.toLowerCase() !== "nil" && d.defectDetails.trim() !== ""
  ).length

  // Fleet utilization
  const latestHours = hoursCyclesRecords[hoursCyclesRecords.length - 1]
  const totalFlightHours = latestHours?.totalCfHrs || 0
  const totalCycles = latestHours?.totalCfCycles || 0

  // FRB Status
  const frbComplete = frbEntries.filter((e) => e.status === "Complete").length
  const frbPending = frbEntries.filter((e) => e.status === "Pending Review").length
  const frbIncomplete = frbEntries.filter((e) => e.status === "Incomplete").length

  // Upcoming expiries (combined)
  const upcomingExpiries = [
    ...crewDocuments
      .map((d) => ({
        type: "Document",
        name: `${d.crewName} - ${d.documentName}`,
        daysUntil: getDaysUntil(d.expiryDate),
      }))
      .filter((d) => d.daysUntil > 0 && d.daysUntil <= 30),
    ...maintenanceRecords
      .map((m) => ({
        type: "Maintenance",
        name: m.frbSheetNo,
        daysUntil: getDaysUntil(m.nextDueDate),
      }))
      .filter((m) => m.daysUntil > 0 && m.daysUntil <= 30),
  ].sort((a, b) => a.daysUntil - b.daysUntil)

  // Determine overall status
  const hasHighAlerts = overdueMaintenanceCount > 0 || expiredDocs > 0 || violationsCount > 0 || openWO > 0
  const hasMediumAlerts = maintenanceWithin30 > 0 || expiringSoonDocs > 0 || inProgressWO > 0

  return (
    <div className="space-y-6 scrollbar-thin">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Compliance overview and operational status monitoring</p>
        </div>
      </div>

      {/* Overall Status Banner */}
      <Card className={
        hasHighAlerts 
          ? "bg-gradient-to-r from-red-50 to-red-100/50 border-red-200" 
          : hasMediumAlerts 
          ? "bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200"
          : "bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-200"
      }>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className={`p-3 rounded-xl w-fit ${
              hasHighAlerts ? "bg-red-100" : hasMediumAlerts ? "bg-amber-100" : "bg-emerald-100"
            }`}>
              <Shield className={`h-6 w-6 ${
                hasHighAlerts ? "text-red-600" : hasMediumAlerts ? "text-amber-600" : "text-emerald-600"
              }`} />
            </div>
            <div className="flex-1">
              <CardTitle className={`text-lg ${
                hasHighAlerts ? "text-red-800" : hasMediumAlerts ? "text-amber-800" : "text-emerald-800"
              }`}>
                {hasHighAlerts ? "Attention Required" : hasMediumAlerts ? "Items Need Review" : "All Systems Compliant"}
              </CardTitle>
              <CardDescription>
                {hasHighAlerts 
                  ? `${overdueMaintenanceCount + expiredDocs + violationsCount + openWO} critical items need immediate attention`
                  : hasMediumAlerts
                  ? `${maintenanceWithin30 + expiringSoonDocs + inProgressWO} items expiring or in progress`
                  : "No critical alerts at this time"
                }
              </CardDescription>
            </div>
            <Badge className={
              hasHighAlerts ? "bg-red-600 text-white" : hasMediumAlerts ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"
            }>
              {AIRCRAFT_REG}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className={overdueMaintenanceCount > 0 ? "border-red-200" : ""}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className={`h-4 w-4 ${overdueMaintenanceCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground">Maintenance Due</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${overdueMaintenanceCount > 0 ? "text-red-600" : ""}`}>
              {overdueMaintenanceCount + maintenanceWithin30}
            </p>
            {overdueMaintenanceCount > 0 && (
              <p className="text-xs text-red-600">{overdueMaintenanceCount} overdue</p>
            )}
          </CardContent>
        </Card>

        <Card className={violationsCount > 0 ? "border-red-200" : ""}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`h-4 w-4 ${violationsCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground">FDTL Violations</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${violationsCount > 0 ? "text-red-600" : ""}`}>
              {violationsCount}
            </p>
          </CardContent>
        </Card>

        <Card className={openWO > 0 ? "border-red-200" : ""}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className={`h-4 w-4 ${openWO > 0 ? "text-red-500" : "text-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground">Open W/O</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${openWO > 0 ? "text-red-600" : ""}`}>
              {openWO}
            </p>
            {inProgressWO > 0 && (
              <p className="text-xs text-amber-600">{inProgressWO} in progress</p>
            )}
          </CardContent>
        </Card>

        <Card className={expiredDocs > 0 ? "border-red-200" : expiringSoonDocs > 0 ? "border-amber-200" : ""}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className={`h-4 w-4 ${expiredDocs > 0 ? "text-red-500" : expiringSoonDocs > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground">Expiring Docs</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${expiredDocs > 0 ? "text-red-600" : expiringSoonDocs > 0 ? "text-amber-600" : ""}`}>
              {expiredDocs + expiringSoonDocs}
            </p>
            {expiredDocs > 0 && (
              <p className="text-xs text-red-600">{expiredDocs} expired</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Defects</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{actualDefects}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Flights</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold">{departureRecords.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Progress Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{maintenanceCompliance}%</span>
                <Badge className={maintenanceCompliance >= 90 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                  {overdueMaintenanceCount} overdue
                </Badge>
              </div>
              <Progress value={maintenanceCompliance} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              FDTL Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{fdtlCompliance}%</span>
                <Badge className={fdtlCompliance >= 90 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                  {violationsCount} violations
                </Badge>
              </div>
              <Progress value={fdtlCompliance} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Document Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{docCompliance}%</span>
                <Badge className={docCompliance >= 90 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                  {expiredDocs} expired
                </Badge>
              </div>
              <Progress value={docCompliance} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet & FRB Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Fleet Status
            </CardTitle>
            <CardDescription>Current aircraft hours and cycles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Airframe Hours</p>
                <p className="text-xl font-bold">{totalFlightHours.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Airframe Cycles</p>
                <p className="text-xl font-bold">{totalCycles.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FRB Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              FRB Entry Status
            </CardTitle>
            <CardDescription>Flight record book completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Complete</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">{frbComplete}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Pending Review</span>
                </div>
                <Badge className="bg-amber-100 text-amber-800">{frbPending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Incomplete</span>
                </div>
                <Badge className="bg-red-100 text-red-800">{frbIncomplete}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Expiries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Upcoming Expiries (30 days)
          </CardTitle>
          <CardDescription>Documents and maintenance items expiring soon</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingExpiries.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="h-10 w-10 mx-auto text-emerald-500 mb-2" />
              <p className="text-sm text-muted-foreground">No items expiring within 30 days</p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {upcomingExpiries.slice(0, 8).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex-1 min-w-0 mr-2">
                    <Badge variant="outline" className="text-xs mb-1">{item.type}</Badge>
                    <p className="text-sm truncate">{item.name}</p>
                  </div>
                  <Badge className={item.daysUntil <= 7 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
                    {item.daysUntil}d
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
