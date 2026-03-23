"use client"

import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  ClipboardList,
  CheckCircle,
  Clock,
  Circle,
} from "lucide-react"

export function AdminDefectsWorkOrders() {
  const { defectRecords, workOrders } = useDataStore()

  // Filter out NIL defects
  const actualDefects = defectRecords.filter(
    (d) =>
      (d.defectDetails.toLowerCase() !== "nil" && d.defectDetails.trim() !== "") ||
      (d.specialObservation.toLowerCase() !== "nil" && d.specialObservation.trim() !== "")
  )

  // Work order statistics
  const openWO = workOrders.filter((wo) => wo.status === "Open")
  const inProgressWO = workOrders.filter((wo) => wo.status === "In Progress")
  const closedWO = workOrders.filter((wo) => wo.status === "Closed")

  const totalWO = workOrders.length
  const completionRate = totalWO > 0 ? Math.round((closedWO.length / totalWO) * 100) : 0

  // Defects with work orders
  const defectsWithWO = actualDefects.filter((d) => d.workOrderGenerated).length
  const defectsWithoutWO = actualDefects.filter((d) => !d.workOrderGenerated).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Defects & Work Orders</h1>
        <p className="text-sm text-muted-foreground">Defect tracking and work order management summary</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className={actualDefects.length > 0 ? "border-amber-200" : ""}>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 hidden sm:inline" />
              <span className="truncate">Total Defects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{actualDefects.length}</p>
            <p className="text-xs text-muted-foreground">Recorded defects</p>
          </CardContent>
        </Card>

        <Card className={openWO.length > 0 ? "border-red-200" : ""}>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Circle className="h-4 w-4 text-red-500 hidden sm:inline" />
              <span className="truncate">Open W/O</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className={`text-xl sm:text-2xl font-bold ${openWO.length > 0 ? "text-red-600" : ""}`}>{openWO.length}</p>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className={inProgressWO.length > 0 ? "border-amber-200" : ""}>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500 hidden sm:inline" />
              <span className="truncate">In Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className={`text-xl sm:text-2xl font-bold ${inProgressWO.length > 0 ? "text-amber-600" : ""}`}>{inProgressWO.length}</p>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 hidden sm:inline" />
              <span className="truncate">Closed W/O</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold text-emerald-600">{closedWO.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Order Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Work Order Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-3xl font-bold">{completionRate}%</span>
              <Badge className={completionRate >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                {closedWO.length} of {totalWO} completed
              </Badge>
            </div>
            <Progress value={completionRate} className="h-3" />
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Open</span>
                </div>
                <p className="text-xl font-bold">{openWO.length}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <p className="text-xl font-bold">{inProgressWO.length}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm">Closed</span>
                </div>
                <p className="text-xl font-bold">{closedWO.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Work Orders - Priority */}
      {openWO.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Open Work Orders - Requires Attention
            </CardTitle>
            <CardDescription>Work orders that need to be addressed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[600px] px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Order No.</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Defect Description</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openWO.map((wo) => (
                      <TableRow key={wo.id} className="bg-red-50/50">
                        <TableCell className="font-mono">{wo.workOrderNo}</TableCell>
                        <TableCell>{wo.createdDate}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="truncate">{wo.defectDescription}</p>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800">High</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">Open</Badge>
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

      {/* Defects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Defect Records</CardTitle>
          <CardDescription>All recorded defects and observations (excluding NIL entries)</CardDescription>
        </CardHeader>
        <CardContent>
          {actualDefects.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
              <p className="text-sm text-muted-foreground">No defects recorded</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[700px] px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>FRB Sheet</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Defect Details</TableHead>
                      <TableHead>Observation</TableHead>
                      <TableHead>Entered By</TableHead>
                      <TableHead>Work Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actualDefects.map((defect) => (
                      <TableRow key={defect.id}>
                        <TableCell className="font-mono text-sm">{defect.frbSheetNo}</TableCell>
                        <TableCell>{defect.date}</TableCell>
                        <TableCell className="max-w-[180px]">
                          <p className="whitespace-normal text-sm">{defect.defectDetails}</p>
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <p className="whitespace-normal text-sm text-muted-foreground">
                            {defect.specialObservation.toLowerCase() !== "nil" ? defect.specialObservation : "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{defect.enteredBy}</p>
                            <Badge variant="outline" className="text-xs">{defect.enteredByType}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {defect.workOrderGenerated ? (
                            <Badge className="bg-amber-100 text-amber-800">{defect.workOrderNo}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Work Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">All Work Orders</CardTitle>
          <CardDescription>Complete work order history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[700px] px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Work Order No.</TableHead>
                    <TableHead>FRB Sheet</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workOrders.map((wo) => (
                    <TableRow 
                      key={wo.id}
                      className={
                        wo.status === "Open" 
                          ? "bg-red-50/50" 
                          : wo.status === "In Progress" 
                          ? "bg-amber-50/50" 
                          : ""
                      }
                    >
                      <TableCell className="font-mono">{wo.workOrderNo}</TableCell>
                      <TableCell className="font-mono text-sm">{wo.frbSheetNo}</TableCell>
                      <TableCell>{wo.createdDate}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="truncate">{wo.defectDescription}</p>
                      </TableCell>
                      <TableCell>{wo.assignedTo}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            wo.status === "Open" 
                              ? "bg-red-100 text-red-800" 
                              : wo.status === "In Progress" 
                              ? "bg-amber-100 text-amber-800" 
                              : "bg-emerald-100 text-emerald-800"
                          }
                        >
                          {wo.status}
                        </Badge>
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
