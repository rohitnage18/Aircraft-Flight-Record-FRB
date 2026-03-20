"use client"

import { useState, useMemo, useCallback } from "react"
import { useDataStore } from "@/lib/data-store"
import { AIRCRAFT_REG } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Download,
  Calendar,
  Fuel,
  Clock,
  AlertTriangle,
  Filter,
  FileDown,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react"

type ReportType = "fuel" | "fdtl"

function getDefaultRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return {
    from: start.toISOString().split("T")[0],
    to: end.toISOString().split("T")[0],
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function ReportsModule() {
  const { fuelRecords, crewDuties } = useDataStore()

  const defaults = getDefaultRange()
  const [dateFrom, setDateFrom] = useState(defaults.from)
  const [dateTo, setDateTo] = useState(defaults.to)
  const [activeReport, setActiveReport] = useState<ReportType>("fuel")
  const [quickRange, setQuickRange] = useState("this-month")

  const applyQuickRange = (range: string) => {
    setQuickRange(range)
    const now = new Date()
    let from: Date
    let to: Date = now

    switch (range) {
      case "today": {
        from = new Date(now)
        break
      }
      case "last-7": {
        from = new Date(now)
        from.setDate(from.getDate() - 7)
        break
      }
      case "this-month": {
        from = new Date(now.getFullYear(), now.getMonth(), 1)
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      }
      case "last-month": {
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        to = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      }
      case "last-90": {
        from = new Date(now)
        from.setDate(from.getDate() - 90)
        break
      }
      default:
        return
    }

    setDateFrom(from.toISOString().split("T")[0])
    setDateTo(to.toISOString().split("T")[0])
  }

  const inRange = (date: string) => date >= dateFrom && date <= dateTo

  const filteredFuel = useMemo(() => fuelRecords.filter((r) => inRange(r.date)), [fuelRecords, dateFrom, dateTo])
  const filteredFDTL = useMemo(() => crewDuties.filter((r) => inRange(r.date)), [crewDuties, dateFrom, dateTo])

  const fuelSummary = useMemo(() => {
    const totalUplifted = filteredFuel.reduce((s, r) => s + r.upliftedLitres, 0)
    const totalBurned = filteredFuel.reduce((s, r) => s + r.fuelBurned, 0)
    const totalPlanned = filteredFuel.reduce((s, r) => s + r.fuelPlannedForSector, 0)
    return { totalUplifted, totalBurned, totalPlanned, count: filteredFuel.length }
  }, [filteredFuel])

  const fdtlSummary = useMemo(() => {
    const totalDutyHours = filteredFDTL.reduce((s, r) => s + r.duration, 0)
    const violations = filteredFDTL.filter((r) => r.isViolation).length
    const crewCount = new Set(filteredFDTL.map((r) => r.crewName)).size
    return { totalDutyHours, violations, crewCount, count: filteredFDTL.length }
  }, [filteredFDTL])

  const reportLabel = activeReport === "fuel" ? "Fuel Report" : "FDTL Report"

  // ---------- CSV Export ----------
  const exportCSV = useCallback(() => {
    let csvContent = ""
    const reportTitle = activeReport === "fuel" ? "Fuel Report" : "FDTL Report"
    csvContent += `${reportTitle} - ${AIRCRAFT_REG}\n`
    csvContent += `Period: ${formatDate(dateFrom)} to ${formatDate(dateTo)}\n\n`

    if (activeReport === "fuel") {
      csvContent += "FRB Sheet,Date,Vendor,Planned (L),Before Flight Total (L),Uplifted (L),After Departure Total (L),Burned (L),Receipt No\n"
      for (const r of filteredFuel) {
        csvContent += `${r.frbSheetNo},${r.date},${r.fuelVendor},${r.fuelPlannedForSector},${r.beforeFlightTotal},${r.upliftedLitres},${r.afterDepartureTotal},${r.fuelBurned},${r.upliftedReceiptNo}\n`
      }
      csvContent += `\nTotals,,,"${fuelSummary.totalPlanned}","${filteredFuel.reduce((s, r) => s + r.beforeFlightTotal, 0)}","${fuelSummary.totalUplifted}","${filteredFuel.reduce((s, r) => s + r.afterDepartureTotal, 0)}","${fuelSummary.totalBurned}",\n`
    } else {
      csvContent += "Crew Name,Duty Status,City,Roster No,Date,From,To,Duration (h),FDTL Status\n"
      for (const r of filteredFDTL) {
        csvContent += `${r.crewName},${r.dutyStatus},${r.city},${r.rosterNumber},${r.date},${r.fromTime},${r.toTime},${r.duration},${r.isViolation ? "VIOLATION" : "OK"}\n`
      }
      csvContent += `\nSummary\nTotal Records,${fdtlSummary.count}\nTotal Duty Hours,${fdtlSummary.totalDutyHours.toFixed(1)}\nCrew Members,${fdtlSummary.crewCount}\nViolations,${fdtlSummary.violations}\n`
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${reportTitle.replace(/ /g, "_")}_${AIRCRAFT_REG}_${dateFrom}_to_${dateTo}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [activeReport, filteredFuel, filteredFDTL, fuelSummary, fdtlSummary, dateFrom, dateTo])

  // ---------- PDF Export ----------
  const exportPDF = useCallback(() => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    let tableHTML = ""

    if (activeReport === "fuel") {
      tableHTML = `
        <table>
          <thead>
            <tr>
              <th>FRB Sheet</th>
              <th>Date</th>
              <th>Vendor</th>
              <th style="text-align:right">Planned (L)</th>
              <th style="text-align:right">Before Flight (L)</th>
              <th style="text-align:right">Uplifted (L)</th>
              <th style="text-align:right">After Dep (L)</th>
              <th style="text-align:right">Burned (L)</th>
              <th>Receipt No</th>
            </tr>
          </thead>
          <tbody>
            ${filteredFuel
              .map(
                (r) => `
              <tr>
                <td style="font-family:monospace;font-size:12px">${r.frbSheetNo}</td>
                <td style="white-space:nowrap">${formatDate(r.date)}</td>
                <td>${r.fuelVendor}</td>
                <td style="text-align:right">${r.fuelPlannedForSector.toLocaleString()}</td>
                <td style="text-align:right">${r.beforeFlightTotal.toLocaleString()}</td>
                <td style="text-align:right;font-weight:600">${r.upliftedLitres.toLocaleString()}</td>
                <td style="text-align:right">${r.afterDepartureTotal.toLocaleString()}</td>
                <td style="text-align:right;font-weight:600">${r.fuelBurned.toLocaleString()}</td>
                <td style="font-family:monospace;font-size:12px">${r.upliftedReceiptNo}</td>
              </tr>`
              )
              .join("")}
            <tr style="background:#f5f5f4;font-weight:700">
              <td colspan="3">Totals</td>
              <td style="text-align:right">${fuelSummary.totalPlanned.toLocaleString()}</td>
              <td style="text-align:right">${filteredFuel.reduce((s, r) => s + r.beforeFlightTotal, 0).toLocaleString()}</td>
              <td style="text-align:right">${fuelSummary.totalUplifted.toLocaleString()}</td>
              <td style="text-align:right">${filteredFuel.reduce((s, r) => s + r.afterDepartureTotal, 0).toLocaleString()}</td>
              <td style="text-align:right">${fuelSummary.totalBurned.toLocaleString()}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="summary-box">
          <div class="summary-item"><span>Total Records</span><strong>${fuelSummary.count}</strong></div>
          <div class="summary-item"><span>Total Uplifted</span><strong>${fuelSummary.totalUplifted.toLocaleString()} L</strong></div>
          <div class="summary-item"><span>Total Burned</span><strong>${fuelSummary.totalBurned.toLocaleString()} L</strong></div>
          <div class="summary-item"><span>Total Planned</span><strong>${fuelSummary.totalPlanned.toLocaleString()} L</strong></div>
        </div>
      `
    } else {
      tableHTML = `
        <table>
          <thead>
            <tr>
              <th>Crew Name</th>
              <th>Status</th>
              <th>City</th>
              <th>Roster</th>
              <th>Date</th>
              <th>From - To</th>
              <th style="text-align:right">Duration</th>
              <th>FDTL</th>
            </tr>
          </thead>
          <tbody>
            ${filteredFDTL
              .map(
                (r) => `
              <tr style="${r.isViolation ? "background:#fef2f2" : ""}">
                <td style="font-weight:500">${r.crewName}</td>
                <td>${r.dutyStatus}</td>
                <td>${r.city}</td>
                <td style="font-family:monospace;font-size:12px">${r.rosterNumber}</td>
                <td style="white-space:nowrap">${formatDate(r.date)}</td>
                <td style="white-space:nowrap">${r.fromTime} - ${r.toTime}</td>
                <td style="text-align:right">${r.duration}h</td>
                <td style="font-weight:600;color:${r.isViolation ? "#dc2626" : "#16a34a"}">${r.isViolation ? "VIOLATION" : "OK"}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <div class="summary-box">
          <div class="summary-item"><span>Total Records</span><strong>${fdtlSummary.count}</strong></div>
          <div class="summary-item"><span>Total Duty Hours</span><strong>${fdtlSummary.totalDutyHours.toFixed(1)} h</strong></div>
          <div class="summary-item"><span>Crew Members</span><strong>${fdtlSummary.crewCount}</strong></div>
          <div class="summary-item"><span>Violations</span><strong style="color:${fdtlSummary.violations > 0 ? "#dc2626" : "inherit"}">${fdtlSummary.violations}</strong></div>
        </div>
      `
    }

    const reportTitle = activeReport === "fuel" ? "Fuel Report" : "FDTL Report"

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle} - ${AIRCRAFT_REG}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 40px; color: #1a1a1a; font-size: 13px; }
          .header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #78512b; }
          .header img { height: 48px; width: auto; }
          .header-text h1 { font-size: 18px; font-weight: 700; color: #78512b; }
          .header-text p { font-size: 12px; color: #666; margin-top: 2px; }
          .meta { display: flex; gap: 24px; margin-bottom: 20px; font-size: 12px; color: #555; }
          .meta span { font-weight: 600; color: #1a1a1a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
          th { background: #f8f5f1; color: #78512b; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; border-bottom: 2px solid #e5ddd4; }
          td { padding: 7px 10px; border-bottom: 1px solid #eee; }
          tr:hover { background: #faf9f7; }
          .summary-box { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px; }
          .summary-item { background: #f8f5f1; border: 1px solid #e5ddd4; border-radius: 6px; padding: 12px 16px; min-width: 140px; }
          .summary-item span { display: block; font-size: 11px; color: #78512b; text-transform: uppercase; letter-spacing: 0.3px; }
          .summary-item strong { display: block; font-size: 18px; margin-top: 4px; }
          .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 11px; color: #999; text-align: center; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/images/pa-logo.jpg" alt="Poonawalla Aviation" />
          <div class="header-text">
            <h1>${reportTitle}</h1>
            <p>Poonawalla Aviation Pvt Ltd - Flight Operations Platform</p>
          </div>
        </div>
        <div class="meta">
          <div>Aircraft: <span>${AIRCRAFT_REG}</span></div>
          <div>Period: <span>${formatDate(dateFrom)} - ${formatDate(dateTo)}</span></div>
          <div>Generated: <span>${formatDate(new Date().toISOString().split("T")[0])}</span></div>
        </div>
        ${tableHTML}
        <div class="footer">
          This report was generated by Poonawalla Aviation Flight Operations Platform. Confidential - For Internal Use Only.
        </div>
      </body>
      </html>
    `)

    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }, [activeReport, filteredFuel, filteredFDTL, fuelSummary, fdtlSummary, dateFrom, dateTo])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export reports for {AIRCRAFT_REG}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button className="gap-2" />}><Download className="h-4 w-4" />Export
                                <ChevronDown className="h-3 w-3" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportCSV} className="gap-2 cursor-pointer">
              <FileSpreadsheet className="h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF} className="gap-2 cursor-pointer">
              <FileDown className="h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
            {/* Report Type Dropdown */}
            <div className="space-y-2 w-full sm:w-auto">
              <Label className="text-sm">Report Type</Label>
              <Select value={activeReport} onValueChange={(v) => setActiveReport(v as ReportType)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fuel">
                    <span className="flex items-center gap-2">
                      <Fuel className="h-3.5 w-3.5" />
                      Fuel Report
                    </span>
                  </SelectItem>
                  <SelectItem value="fdtl">
                    <span className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      FDTL Report
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider for desktop */}
            <div className="hidden sm:block h-9 w-px bg-border" />

            {/* Quick Range */}
            <div className="space-y-2 w-full sm:w-auto">
              <Label className="text-sm">Quick Range</Label>
              <Select value={quickRange} onValueChange={applyQuickRange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last-7">Last 7 Days</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-90">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2 w-full sm:w-auto">
              <Label className="text-sm">From Date</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setQuickRange("custom")
                }}
                className="w-full sm:w-[170px]"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2 w-full sm:w-auto">
              <Label className="text-sm">To Date</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setQuickRange("custom")
                }}
                className="w-full sm:w-[170px]"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Showing {reportLabel} from {formatDate(dateFrom)} to {formatDate(dateTo)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ---- FUEL REPORT ---- */}
      {activeReport === "fuel" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryCard title="Records" value={fuelSummary.count.toString()} />
            <SummaryCard title="Total Uplifted" value={`${fuelSummary.totalUplifted.toLocaleString()} L`} />
            <SummaryCard title="Total Burned" value={`${fuelSummary.totalBurned.toLocaleString()} L`} />
            <SummaryCard title="Total Planned" value={`${fuelSummary.totalPlanned.toLocaleString()} L`} />
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Fuel className="h-4 w-4" />
                Fuel Records
              </CardTitle>
              <CardDescription>
                {filteredFuel.length} record{filteredFuel.length !== 1 && "s"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFuel.length === 0 ? (
                <EmptyState label="No fuel records found for the selected period." />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>FRB Sheet</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead className="text-right">Planned (L)</TableHead>
                        <TableHead className="text-right">Before Flight (L)</TableHead>
                        <TableHead className="text-right">Uplifted (L)</TableHead>
                        <TableHead className="text-right">After Dep (L)</TableHead>
                        <TableHead className="text-right">Burned (L)</TableHead>
                        <TableHead>Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFuel.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-sm">{r.frbSheetNo}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(r.date)}</TableCell>
                          <TableCell>{r.fuelVendor}</TableCell>
                          <TableCell className="text-right">{r.fuelPlannedForSector.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{r.beforeFlightTotal.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">{r.upliftedLitres.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{r.afterDepartureTotal.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">{r.fuelBurned.toLocaleString()}</TableCell>
                          <TableCell className="font-mono text-sm">{r.upliftedReceiptNo}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell colSpan={3}>Totals</TableCell>
                        <TableCell className="text-right">{fuelSummary.totalPlanned.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {filteredFuel.reduce((s, r) => s + r.beforeFlightTotal, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">{fuelSummary.totalUplifted.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {filteredFuel.reduce((s, r) => s + r.afterDepartureTotal, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">{fuelSummary.totalBurned.toLocaleString()}</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ---- FDTL REPORT ---- */}
      {activeReport === "fdtl" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <SummaryCard title="Records" value={fdtlSummary.count.toString()} />
            <SummaryCard title="Total Duty Hours" value={`${fdtlSummary.totalDutyHours.toFixed(1)} h`} />
            <SummaryCard title="Crew Members" value={fdtlSummary.crewCount.toString()} />
            <SummaryCard
              title="Violations"
              value={fdtlSummary.violations.toString()}
              variant={fdtlSummary.violations > 0 ? "danger" : "default"}
            />
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                FDTL Records
              </CardTitle>
              <CardDescription>
                {filteredFDTL.length} record{filteredFDTL.length !== 1 && "s"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFDTL.length === 0 ? (
                <EmptyState label="No FDTL records found for the selected period." />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Crew Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Roster</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>From - To</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                        <TableHead>FDTL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFDTL.map((r) => (
                        <TableRow key={r.id} className={r.isViolation ? "bg-destructive/5" : ""}>
                          <TableCell className="font-medium">{r.crewName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{r.dutyStatus}</Badge>
                          </TableCell>
                          <TableCell>{r.city}</TableCell>
                          <TableCell className="font-mono text-sm">{r.rosterNumber}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(r.date)}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {r.fromTime} - {r.toTime}
                          </TableCell>
                          <TableCell className="text-right">{r.duration}h</TableCell>
                          <TableCell>
                            {r.isViolation ? (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Violation
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-100 text-emerald-800">OK</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

/* ---- Helper Components ---- */

function SummaryCard({
  title,
  value,
  variant = "default",
}: {
  title: string
  value: string
  variant?: "default" | "danger"
}) {
  return (
    <Card className={variant === "danger" && value !== "0" ? "border-destructive/50 bg-destructive/5" : ""}>
      <CardContent className="p-3 sm:p-4">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p
          className={`text-lg sm:text-xl font-bold mt-1 ${
            variant === "danger" && value !== "0" ? "text-destructive" : ""
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
      <p>{label}</p>
    </div>
  )
}
