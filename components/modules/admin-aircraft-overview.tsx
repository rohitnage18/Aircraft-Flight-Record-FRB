"use client"

import { useDataStore } from "@/lib/data-store"
import { AIRCRAFT_REG } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plane,
  Clock,
  Gauge,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

export function AdminAircraftOverview() {
  const { hoursCyclesRecords, departureRecords, maintenanceRecords, oilDataRecords } = useDataStore()

  const latestHours = hoursCyclesRecords[hoursCyclesRecords.length - 1]
  const latestOil = oilDataRecords[oilDataRecords.length - 1]

  // Calculate statistics
  const totalFlightHours = latestHours?.totalCfHrs || 0
  const totalCycles = latestHours?.totalCfCycles || 0
  const totalFlights = departureRecords.length

  // Calculate total block time
  const totalBlockMinutes = departureRecords.reduce((sum, d) => {
    const [h, m] = d.blockTime.split(":").map(Number)
    return sum + h * 60 + m
  }, 0)
  const avgBlockTime = totalFlights > 0 ? Math.round(totalBlockMinutes / totalFlights) : 0

  // Maintenance status
  const getDaysUntil = (dateString: string): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(dateString)
    target.setHours(0, 0, 0, 0)
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const nextMaintenance = maintenanceRecords
    .map((m) => ({ ...m, daysUntil: getDaysUntil(m.nextDueDate) }))
    .sort((a, b) => a.daysUntil - b.daysUntil)[0]

  // Calculate aircraft availability (mock calculation based on no critical maintenance)
  const criticalMaintenance = maintenanceRecords.filter((m) => getDaysUntil(m.nextDueDate) <= 7).length
  const availabilityPercent = criticalMaintenance === 0 ? 100 : Math.max(0, 100 - criticalMaintenance * 20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Aircraft Overview</h1>
        <p className="text-sm text-muted-foreground">Fleet status and utilization summary</p>
      </div>

      {/* Aircraft Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl w-fit">
              <Plane className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl">{AIRCRAFT_REG}</CardTitle>
              <CardDescription className="text-sm">BOMBARDIER BD-700-1A10 Global 6000</CardDescription>
            </div>
            <Badge className={availabilityPercent === 100 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
              {availabilityPercent === 100 ? "Serviceable" : "Attention Required"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Aircraft Availability</span>
                <span className="font-medium">{availabilityPercent}%</span>
              </div>
              <Progress value={availabilityPercent} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="truncate">Total Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{totalFlightHours.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Airframe hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="truncate">Total Cycles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{totalCycles.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Landing cycles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="truncate">Total Flights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{totalFlights}</p>
            <p className="text-xs text-muted-foreground">Recorded flights</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="truncate">Avg Block Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{Math.floor(avgBlockTime / 60)}h {avgBlockTime % 60}m</p>
            <p className="text-xs text-muted-foreground">Per flight</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Next Scheduled Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextMaintenance ? (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="font-mono text-sm">{nextMaintenance.frbSheetNo}</span>
                  <Badge className={
                    nextMaintenance.daysUntil <= 30 
                      ? "bg-red-100 text-red-800" 
                      : nextMaintenance.daysUntil <= 60 
                      ? "bg-amber-100 text-amber-800" 
                      : "bg-emerald-100 text-emerald-800"
                  }>
                    {nextMaintenance.daysUntil} days
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Due: {nextMaintenance.nextDueDate}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming maintenance scheduled</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Engine Oil Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestOil ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Engine 1</p>
                    <p className="font-semibold">{latestOil.engine1OilAdded} qts added</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engine 2</p>
                    <p className="font-semibold">{latestOil.engine2OilAdded} qts added</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Last updated: {latestOil.date}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No oil data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
