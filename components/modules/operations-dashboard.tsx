"use client"

import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Calendar, Clock, Fuel, Wrench, FileText, Users, TrendingUp, Plane, CheckCircle } from "lucide-react"
import { AIRCRAFT_REG } from "@/lib/mock-data"

function getDaysUntil(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function getAlertLevel(days: number): "danger" | "warning" | "info" | "safe" {
  if (days <= 30) return "danger"
  if (days <= 60) return "warning"
  if (days <= 90) return "info"
  return "safe"
}

const alertColors = {
  danger: "bg-red-50 text-red-700 border-red-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  info: "bg-blue-50 text-blue-700 border-blue-100",
  safe: "bg-emerald-50 text-emerald-700 border-emerald-100",
}

export function OperationsDashboard() {
  const { maintenanceRecords, crewDuties, crewDocuments, fuelRecords, frbEntries } = useDataStore()

  // Upcoming maintenance
  const upcomingMaintenance = maintenanceRecords
    .map((m) => ({
      ...m,
      daysUntil: getDaysUntil(m.nextDueDate),
    }))
    .filter((m) => m.daysUntil <= 90)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  // Crew violations
  const crewViolations = crewDuties.filter((d) => d.isViolation)

  // Expiring documents
  const expiringDocs = crewDocuments
    .map((d) => ({
      ...d,
      daysUntil: getDaysUntil(d.expiryDate),
    }))
    .filter((d) => d.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  // Fuel summary
  const totalFuelBurned = fuelRecords.reduce((sum, f) => sum + f.fuelBurned, 0)
  const totalFuelUplifted = fuelRecords.reduce((sum, f) => sum + f.upliftedLitres, 0)

  // Last 5 FRB entries
  const recentEntries = frbEntries.slice(0, 5)
  
  // Calculate total flights
  const totalFlights = frbEntries.length
  const completeFlights = frbEntries.filter(e => e.status === "Complete").length

  return (
    <div className="space-y-6 scrollbar-thin">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Operations Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Flight operations overview and alerts for {AIRCRAFT_REG}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs px-3 py-1">
            <Plane className="h-3 w-3 mr-1.5" />
            {AIRCRAFT_REG}
          </Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-xs px-3 py-1">
            <CheckCircle className="h-3 w-3 mr-1.5" />
            Operational
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Flights</p>
                <p className="text-2xl font-semibold mt-1">{totalFlights}</p>
                <p className="text-xs text-muted-foreground mt-1">{completeFlights} completed</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Maintenance Due</p>
                <p className="text-2xl font-semibold mt-1">{upcomingMaintenance.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Within 90 days</p>
              </div>
              <div className={`p-2 rounded-lg ${upcomingMaintenance.length > 0 ? 'bg-amber-100' : 'bg-muted'}`}>
                <Wrench className={`h-4 w-4 ${upcomingMaintenance.length > 0 ? 'text-amber-600' : 'text-muted-foreground'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">FDTL Status</p>
                <p className="text-2xl font-semibold mt-1">{crewViolations.length}</p>
                <p className="text-xs text-muted-foreground mt-1">{crewViolations.length === 0 ? 'No violations' : 'Violations'}</p>
              </div>
              <div className={`p-2 rounded-lg ${crewViolations.length > 0 ? 'bg-red-100' : 'bg-emerald-100'}`}>
                <Users className={`h-4 w-4 ${crewViolations.length > 0 ? 'text-red-600' : 'text-emerald-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fuel Burned</p>
                <p className="text-2xl font-semibold mt-1">{totalFuelBurned.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{totalFuelUplifted.toLocaleString()} L uplifted</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Fuel className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Maintenance Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base font-medium">Upcoming Maintenance</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">{upcomingMaintenance.length} items</Badge>
            </div>
            <CardDescription className="text-xs">Scheduled maintenance within 90 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {upcomingMaintenance.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                <p className="text-sm">No maintenance due within 90 days</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-thin">
                {upcomingMaintenance.map((m) => {
                  const level = getAlertLevel(m.daysUntil)
                  return (
                    <div
                      key={m.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${alertColors[level]}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{m.frbSheetNo}</p>
                        <p className="text-xs opacity-75">Due: {m.nextDueDate}</p>
                      </div>
                      <Badge variant="outline" className={`shrink-0 ml-2 ${alertColors[level]}`}>
                        {m.daysUntil}d
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crew Duty Violations */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-4 w-4 ${crewViolations.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
                <CardTitle className="text-base font-medium">FDTL Compliance</CardTitle>
              </div>
              {crewViolations.length > 0 && (
                <Badge variant="destructive" className="text-xs">{crewViolations.length} violations</Badge>
              )}
            </div>
            <CardDescription className="text-xs">Flight duty time limitation status</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {crewViolations.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                <p className="text-sm">All crew within FDTL limits</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-thin">
                {crewViolations.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-red-50 border-red-100"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-red-700 truncate">{v.crewName}</p>
                      <p className="text-xs text-red-600/70">{v.date} | {v.city}</p>
                    </div>
                    <Badge variant="destructive" className="shrink-0 ml-2 text-xs">{v.duration}h</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring Documents */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`h-4 w-4 ${expiringDocs.length > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                <CardTitle className="text-base font-medium">Document Expiry</CardTitle>
              </div>
              {expiringDocs.length > 0 && (
                <Badge className="bg-amber-100 text-amber-700 text-xs">{expiringDocs.length} expiring</Badge>
              )}
            </div>
            <CardDescription className="text-xs">Licenses and training expiring within 30 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {expiringDocs.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                <p className="text-sm">No documents expiring soon</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-thin">
                {expiringDocs.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-amber-50 border-amber-100"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-amber-700 truncate">{d.crewName}</p>
                      <p className="text-xs text-amber-600/70 truncate">{d.documentName}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 shrink-0 ml-2 text-xs">{d.daysUntil}d</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent FRB Entries */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base font-medium">Recent FRB Entries</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">{recentEntries.length} entries</Badge>
            </div>
            <CardDescription className="text-xs">Latest flight record book entries</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs h-8">FRB No.</TableHead>
                    <TableHead className="text-xs h-8">Sector</TableHead>
                    <TableHead className="text-xs h-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEntries.map((entry) => (
                    <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-xs py-2">{entry.frbSheetNo}</TableCell>
                      <TableCell className="text-xs py-2">{entry.sector}</TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            entry.status === "Complete"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : entry.status === "Pending Review"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {entry.status}
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
    </div>
  )
}
