"use client"

import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Fuel,
  PlaneTakeoff,
  Clock,
  TrendingUp,
  MapPin,
} from "lucide-react"

export function AdminFlightFuelSummary() {
  const { departureRecords, fuelRecords, frbEntries } = useDataStore()

  // Flight statistics
  const totalFlights = departureRecords.length
  const totalBlockMinutes = departureRecords.reduce((sum, d) => {
    const [h, m] = d.blockTime.split(":").map(Number)
    return sum + h * 60 + m
  }, 0)
  const totalAirMinutes = departureRecords.reduce((sum, d) => {
    const [h, m] = d.airTime.split(":").map(Number)
    return sum + h * 60 + m
  }, 0)

  // Fuel statistics
  const totalFuelBurned = fuelRecords.reduce((sum, f) => sum + f.fuelBurned, 0)
  const totalFuelUplifted = fuelRecords.reduce((sum, f) => sum + f.upliftedLitres, 0)
  const avgFuelBurned = fuelRecords.length > 0 ? Math.round(totalFuelBurned / fuelRecords.length) : 0

  // Flight type breakdown
  const flightTypeCount = departureRecords.reduce((acc, d) => {
    acc[d.flightType] = (acc[d.flightType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Sector analysis
  const sectorCount = departureRecords.reduce((acc, d) => {
    const sector = `${d.placeOfDeparture} - ${d.placeOfArrival}`
    acc[sector] = (acc[sector] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topSectors = Object.entries(sectorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Recent flights
  const recentFlights = departureRecords.slice(0, 10)

  // FRB status summary
  const frbComplete = frbEntries.filter((e) => e.status === "Complete").length
  const frbPending = frbEntries.filter((e) => e.status === "Pending Review").length
  const frbIncomplete = frbEntries.filter((e) => e.status === "Incomplete").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Flight & Fuel Summary</h1>
        <p className="text-sm text-muted-foreground">Flight operations and fuel consumption analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <PlaneTakeoff className="h-4 w-4 text-muted-foreground hidden sm:inline" />
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
              <span className="truncate">Total Block Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{Math.floor(totalBlockMinutes / 60)}h {totalBlockMinutes % 60}m</p>
            <p className="text-xs text-muted-foreground">Chocks-to-chocks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Fuel className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="truncate">Fuel Burned</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{totalFuelBurned.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total lbs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="truncate">Avg Fuel/Flight</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{avgFuelBurned.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Lbs per flight</p>
          </CardContent>
        </Card>
      </div>

      {/* FRB Status & Flight Types */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">FRB Entry Status</CardTitle>
            <CardDescription>Flight record book completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Complete</span>
                <Badge className="bg-emerald-100 text-emerald-800">{frbComplete}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Review</span>
                <Badge className="bg-amber-100 text-amber-800">{frbPending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Incomplete</span>
                <Badge className="bg-red-100 text-red-800">{frbIncomplete}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Flight Types</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(flightTypeCount).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm">{type}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
              {Object.keys(flightTypeCount).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No flight data</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Sectors
            </CardTitle>
            <CardDescription>Most frequent routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSectors.map(([sector, count], i) => (
                <div key={sector} className="flex items-center justify-between">
                  <span className="text-sm truncate flex-1 mr-2">
                    <span className="text-muted-foreground mr-2">#{i + 1}</span>
                    {sector}
                  </span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {topSectors.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No sector data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Flights Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Recent Flight Records</CardTitle>
          <CardDescription>Latest departure and arrival details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[700px] px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FRB Sheet</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Block Time</TableHead>
                    <TableHead>Air Time</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFlights.map((flight) => (
                    <TableRow key={flight.id}>
                      <TableCell className="font-mono text-sm">{flight.frbSheetNo}</TableCell>
                      <TableCell>{flight.date}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span>{flight.placeOfDeparture}</span>
                          <span className="text-muted-foreground mx-1">→</span>
                          <span>{flight.placeOfArrival}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{flight.blockTime}</TableCell>
                      <TableCell>{flight.airTime}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{flight.flightType}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fuel Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Fuel Records Summary</CardTitle>
          <CardDescription>Fuel consumption and uplift history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[600px] px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>FRB Sheet</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Before (lbs)</TableHead>
                    <TableHead>After (lbs)</TableHead>
                    <TableHead>Burned (lbs)</TableHead>
                    <TableHead>Uplifted (L)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fuelRecords.slice(0, 10).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">{record.frbSheetNo}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.fuelVendor}</TableCell>
                      <TableCell>{record.beforeFlightTotal.toLocaleString()}</TableCell>
                      <TableCell>{record.afterDepartureTotal.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">{record.fuelBurned.toLocaleString()}</TableCell>
                      <TableCell>{record.upliftedLitres.toLocaleString()}</TableCell>
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
