"use client"

import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  GraduationCap,
  FileText,
} from "lucide-react"

function getDaysUntil(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function AdminCrewCompliance() {
  const { crewDuties, crewDocuments, crewAssignments } = useDataStore()

  // FDTL Analysis
  const totalDuties = crewDuties.length
  const violationsCount = crewDuties.filter((d) => d.isViolation).length
  const fdtlCompliance = totalDuties > 0 ? Math.round(((totalDuties - violationsCount) / totalDuties) * 100) : 100

  // Document Analysis
  const documentsWithDays = crewDocuments.map((d) => ({
    ...d,
    daysUntil: getDaysUntil(d.expiryDate),
  }))

  const expiredDocs = documentsWithDays.filter((d) => d.daysUntil <= 0).length
  const expiringSoon = documentsWithDays.filter((d) => d.daysUntil > 0 && d.daysUntil <= 30).length
  const validDocs = documentsWithDays.filter((d) => d.daysUntil > 30).length
  const docCompliance = crewDocuments.length > 0 
    ? Math.round(((crewDocuments.length - expiredDocs) / crewDocuments.length) * 100) 
    : 100

  // Get unique crew members
  const uniqueCrew = [...new Set(crewAssignments.map((c) => c.crewName))]

  // FDTL violations detail
  const violations = crewDuties.filter((d) => d.isViolation)

  // Expiring/expired documents
  const criticalDocs = documentsWithDays
    .filter((d) => d.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Crew & Training Compliance</h1>
        <p className="text-sm text-muted-foreground">FDTL compliance and training documentation status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              <span className="truncate">Total Crew</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className="text-xl sm:text-2xl font-bold">{uniqueCrew.length}</p>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card className={violationsCount > 0 ? "border-red-200" : ""}>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 hidden sm:inline ${violationsCount > 0 ? "text-red-500" : "text-muted-foreground"}`} />
              <span className="truncate">FDTL Violations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className={`text-xl sm:text-2xl font-bold ${violationsCount > 0 ? "text-red-600" : ""}`}>{violationsCount}</p>
            <p className="text-xs text-muted-foreground">Recorded violations</p>
          </CardContent>
        </Card>

        <Card className={expiredDocs > 0 ? "border-red-200" : ""}>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <FileText className={`h-4 w-4 hidden sm:inline ${expiredDocs > 0 ? "text-red-500" : "text-muted-foreground"}`} />
              <span className="truncate">Expired Docs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className={`text-xl sm:text-2xl font-bold ${expiredDocs > 0 ? "text-red-600" : ""}`}>{expiredDocs}</p>
            <p className="text-xs text-muted-foreground">Need renewal</p>
          </CardContent>
        </Card>

        <Card className={expiringSoon > 0 ? "border-amber-200" : ""}>
          <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
              <Clock className={`h-4 w-4 hidden sm:inline ${expiringSoon > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
              <span className="truncate">Expiring Soon</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <p className={`text-xl sm:text-2xl font-bold ${expiringSoon > 0 ? "text-amber-600" : ""}`}>{expiringSoon}</p>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Progress */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              FDTL Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{fdtlCompliance}%</span>
                <Badge className={fdtlCompliance >= 90 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                  {violationsCount} violations
                </Badge>
              </div>
              <Progress value={fdtlCompliance} className="h-2" />
              <p className="text-xs text-muted-foreground">{totalDuties} total duty records analyzed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Document Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{docCompliance}%</span>
                <Badge className={docCompliance >= 90 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}>
                  {validDocs} valid
                </Badge>
              </div>
              <Progress value={docCompliance} className="h-2" />
              <p className="text-xs text-muted-foreground">{crewDocuments.length} total documents tracked</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Violations Table */}
      {violations.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              FDTL Violations
            </CardTitle>
            <CardDescription>Flight duty time limitation violations requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[500px] px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crew Member</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {violations.map((v) => (
                      <TableRow key={v.id} className="bg-red-50/50">
                        <TableCell className="font-medium">{v.crewName}</TableCell>
                        <TableCell>{v.date}</TableCell>
                        <TableCell>{v.city}</TableCell>
                        <TableCell>{v.duration}h</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Violation</Badge>
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

      {/* Expiring Documents */}
      <Card className={criticalDocs.length > 0 ? "border-amber-200" : ""}>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            Document Expiry Tracker
          </CardTitle>
          <CardDescription>Licenses and training documents expiring within 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {criticalDocs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
              <p className="text-sm text-muted-foreground">All documents valid for more than 30 days</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[600px] px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crew Member</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criticalDocs.map((doc) => (
                      <TableRow 
                        key={doc.id} 
                        className={doc.daysUntil <= 0 ? "bg-red-50" : "bg-amber-50/50"}
                      >
                        <TableCell className="font-medium">{doc.crewName}</TableCell>
                        <TableCell>{doc.documentName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.documentType}</Badge>
                        </TableCell>
                        <TableCell>{doc.expiryDate}</TableCell>
                        <TableCell>
                          {doc.daysUntil <= 0 ? (
                            <Badge className="bg-red-100 text-red-800">Expired</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">{doc.daysUntil}d left</Badge>
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
    </div>
  )
}
