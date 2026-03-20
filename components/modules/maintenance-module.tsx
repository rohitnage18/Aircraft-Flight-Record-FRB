"use client"

import { useState, useMemo } from "react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { AIRCRAFT_REG } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Wrench, Gauge } from "lucide-react"

// ────────────────────────────────────────
// Task Master (predefined tasks)
// ────────────────────────────────────────
const TASK_MASTER = [
  { taskNo: "72-31-02-201", task: "Replace", frequency: 10000, frequencyType: "Cycles" as const },
  { taskNo: "72-31-02-203", task: "Detailed Inspection", frequency: 10000, frequencyType: "Hours" as const },
  { taskNo: "72-40-00-203", task: "Special Detailed Inspection INITIAL", frequency: 3000, frequencyType: "Hours" as const },
  { taskNo: "72-40-00-204", task: "Special Detailed Inspection RECURRING", frequency: 1000, frequencyType: "Hours" as const },
  { taskNo: "72-31-02-300-010", task: "Touch Up", frequency: 3000, frequencyType: "Hours" as const },
  { taskNo: "73-12-01-201", task: "Discard", frequency: 1000, frequencyType: "Hours" as const },
]

type Component = "LH" | "RH" | "APU"

interface ScheduledMaintenanceEntry {
  id: string
  component: Component
  taskNo: string
  task: string
  taskDescription: string
  amtossNdtNo: string
  frequency: number
  frequencyType: "Hours" | "Cycles"
  partNo: string
  doneOn: number
  elapsedTime: number
  nextDue: number
  remaining: number
  remarks: string
}

// ────────────────────────────────────────
// Constants
// ────────────────────────────────────────
const ENGINE_CYCLES_SINCE_NEW = 1003

// ────────────────────────────────────────
// Initial dummy entries
// ────────────────────────────────────────
function buildInitialEntries(airframeHrs: number, airframeCycles: number): ScheduledMaintenanceEntry[] {
  return [
    {
      id: "sm-1",
      component: "LH",
      taskNo: "72-31-02-201",
      task: "Replace",
      taskDescription: "LH Engine turbine blade replacement",
      amtossNdtNo: "AMT-001",
      frequency: 10000,
      frequencyType: "Cycles",
      partNo: "PN-TBR-001",
      doneOn: 800,
      elapsedTime: ENGINE_CYCLES_SINCE_NEW - 800,
      nextDue: 800 + 10000,
      remaining: 10000 - (ENGINE_CYCLES_SINCE_NEW - 800),
      remarks: "Initial installation",
    },
    {
      id: "sm-2",
      component: "LH",
      taskNo: "72-31-02-203",
      task: "Detailed Inspection",
      taskDescription: "LH Engine borescope inspection",
      amtossNdtNo: "AMT-002",
      frequency: 10000,
      frequencyType: "Hours",
      partNo: "PN-BSI-001",
      doneOn: 4500,
      elapsedTime: airframeHrs - 4500,
      nextDue: 4500 + 10000,
      remaining: 10000 - (airframeHrs - 4500),
      remarks: "",
    },
    {
      id: "sm-3",
      component: "RH",
      taskNo: "72-40-00-204",
      task: "Special Detailed Inspection RECURRING",
      taskDescription: "RH Engine fan section detailed inspection",
      amtossNdtNo: "NDT-003",
      frequency: 1000,
      frequencyType: "Hours",
      partNo: "PN-FAN-RH-002",
      doneOn: 4200,
      elapsedTime: airframeHrs - 4200,
      nextDue: 4200 + 1000,
      remaining: 1000 - (airframeHrs - 4200),
      remarks: "Monitor closely",
    },
    {
      id: "sm-4",
      component: "APU",
      taskNo: "73-12-01-201",
      task: "Discard",
      taskDescription: "APU fuel nozzle discard and replace",
      amtossNdtNo: "AMT-004",
      frequency: 1000,
      frequencyType: "Hours",
      partNo: "PN-FN-APU-001",
      doneOn: 4800,
      elapsedTime: airframeHrs - 4800,
      nextDue: 4800 + 1000,
      remaining: 1000 - (airframeHrs - 4800),
      remarks: "",
    },
    {
      id: "sm-5",
      component: "RH",
      taskNo: "72-31-02-300-010",
      task: "Touch Up",
      taskDescription: "RH Engine cowling paint touch up",
      amtossNdtNo: "AMT-005",
      frequency: 3000,
      frequencyType: "Hours",
      partNo: "PN-CW-RH-003",
      doneOn: 3000,
      elapsedTime: airframeHrs - 3000,
      nextDue: 3000 + 3000,
      remaining: 3000 - (airframeHrs - 3000),
      remarks: "",
    },
  ]
}

// ────────────────────────────────────────
// Alerting helpers
// ────────────────────────────────────────
function getRemainingBadge(remaining: number, frequencyType: "Hours" | "Cycles") {
  if (remaining <= 0) {
    return <Badge variant="destructive">OVERDUE</Badge>
  }
  if (frequencyType === "Hours" && remaining <= 350) {
    return <Badge className="bg-amber-100 text-amber-800">Due Soon</Badge>
  }
  if (frequencyType === "Cycles" && remaining <= 500) {
    return <Badge className="bg-amber-100 text-amber-800">Due Soon</Badge>
  }
  return <Badge className="bg-emerald-100 text-emerald-800">OK</Badge>
}

function getRemainingCellClass(remaining: number, frequencyType: "Hours" | "Cycles") {
  if (remaining <= 0) return "text-destructive font-bold"
  if (frequencyType === "Hours" && remaining <= 350) return "text-amber-700 font-semibold"
  if (frequencyType === "Cycles" && remaining <= 500) return "text-amber-700 font-semibold"
  return "text-emerald-700 font-medium"
}

function getRowClass(remaining: number, frequencyType: "Hours" | "Cycles") {
  if (remaining <= 0) return "bg-red-50/60"
  if (frequencyType === "Hours" && remaining <= 350) return "bg-amber-50/60"
  if (frequencyType === "Cycles" && remaining <= 500) return "bg-amber-50/60"
  return ""
}

// ────────────────────────────────────────
// Component
// ────────────────────────────────────────
export function MaintenanceModule() {
  const { hoursCyclesRecords } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"

  // Derive airframe data from latest C/F record
  const latestHC = hoursCyclesRecords[hoursCyclesRecords.length - 1]
  const airframeHrsSinceNew = latestHC ? latestHC.totalCfHrs : 5104.5
  const airframeLandingsSinceNew = latestHC ? latestHC.totalCfCycles : 2552

  // Engine hours: user-initialized starting value with simulated counter
  const [engineHrsSinceNew, setEngineHrsSinceNew] = useState(4950)
  const [engineHrsInitialized, setEngineHrsInitialized] = useState(true)
  const [engineHrsInput, setEngineHrsInput] = useState("")

  const [entries, setEntries] = useState<ScheduledMaintenanceEntry[]>(() =>
    buildInitialEntries(airframeHrsSinceNew, airframeLandingsSinceNew)
  )

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    component: "LH" as Component,
    taskNo: "",
    taskDescription: "",
    amtossNdtNo: "",
    partNo: "",
    elapsedHours: "",
    elapsedMinutes: "",
    elapsedCycles: "",
    remarks: "",
  })

  // Derive selected task info
  const selectedTask = TASK_MASTER.find((t) => t.taskNo === formData.taskNo)

  // Calculate doneOn based on frequency type
  const doneOn = useMemo(() => {
    if (!selectedTask) return 0
    return selectedTask.frequencyType === "Hours" ? engineHrsSinceNew : ENGINE_CYCLES_SINCE_NEW
  }, [selectedTask, engineHrsSinceNew])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTask) return

    let elapsed = 0
    if (selectedTask.frequencyType === "Hours") {
      const hrs = Number(formData.elapsedHours) || 0
      const mins = Number(formData.elapsedMinutes) || 0
      elapsed = hrs + mins / 60
    } else {
      elapsed = Number(formData.elapsedCycles) || 0
    }

    const nextDue = doneOn + selectedTask.frequency
    const remaining = selectedTask.frequency - elapsed

    const newEntry: ScheduledMaintenanceEntry = {
      id: `sm-${Date.now()}`,
      component: formData.component,
      taskNo: selectedTask.taskNo,
      task: selectedTask.task,
      taskDescription: formData.taskDescription,
      amtossNdtNo: formData.amtossNdtNo,
      frequency: selectedTask.frequency,
      frequencyType: selectedTask.frequencyType,
      partNo: formData.partNo,
      doneOn,
      elapsedTime: elapsed,
      nextDue,
      remaining: remaining < 0 ? remaining : remaining,
      remarks: formData.remarks,
    }

    setEntries((prev) => [...prev, newEntry])
    setOpen(false)
    setFormData({
      component: "LH",
      taskNo: "",
      taskDescription: "",
      amtossNdtNo: "",
      partNo: "",
      elapsedHours: "",
      elapsedMinutes: "",
      elapsedCycles: "",
      remarks: "",
    })
  }

  // Component filter
  const [filterComponent, setFilterComponent] = useState<"ALL" | Component>("ALL")
  const filteredEntries = filterComponent === "ALL" ? entries : entries.filter((e) => e.component === filterComponent)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Scheduled Maintenance Status Register</h1>
          <p className="text-sm text-muted-foreground">
            Engine / APU Scheduled Maintenance - Aircraft {AIRCRAFT_REG}
          </p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}><Plus className="h-4 w-4 mr-2" />Add Task Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
              <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
                <DialogTitle className="text-lg">Add Scheduled Maintenance Entry</DialogTitle>
                <DialogDescription className="text-sm">Enter task details for Engine / APU maintenance tracking</DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Component + Task No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Component</Label>
                    <Select
                      value={formData.component}
                      onValueChange={(value: Component) => setFormData({ ...formData, component: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LH">LH Engine</SelectItem>
                        <SelectItem value="RH">RH Engine</SelectItem>
                        <SelectItem value="APU">APU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Task No.</Label>
                    <Select
                      value={formData.taskNo}
                      onValueChange={(value) => setFormData({ ...formData, taskNo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select task..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_MASTER.map((t) => (
                          <SelectItem key={t.taskNo} value={t.taskNo}>
                            {t.taskNo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Auto-filled task info */}
                {selectedTask && (
                  <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Task:</span>{" "}
                      <strong>{selectedTask.task}</strong>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Frequency:</span>{" "}
                      <strong>
                        {selectedTask.frequencyType === "Hours"
                          ? `${selectedTask.frequency.toLocaleString()}:00 Hours`
                          : `${selectedTask.frequency.toLocaleString()} Cycles`}
                      </strong>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Done On (Auto):</span>{" "}
                      <strong>
                        {doneOn.toLocaleString()}{" "}
                        {selectedTask.frequencyType === "Hours" ? "Hrs" : "Cyc"}
                      </strong>
                    </p>
                  </div>
                )}

                {/* Task Description + AMTOSS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Task Description</Label>
                    <Input
                      value={formData.taskDescription}
                      onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
                      placeholder="Describe maintenance task"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>AMTOSS / NDT No.</Label>
                    <Input
                      value={formData.amtossNdtNo}
                      onChange={(e) => setFormData({ ...formData, amtossNdtNo: e.target.value })}
                      placeholder="e.g., AMT-001"
                    />
                  </div>
                </div>

                {/* Part No */}
                <div className="space-y-2">
                  <Label>Part No.</Label>
                  <Input
                    value={formData.partNo}
                    onChange={(e) => setFormData({ ...formData, partNo: e.target.value })}
                    placeholder="e.g., PN-TBR-001"
                  />
                </div>

                {/* Elapsed Time */}
                {selectedTask && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm border-b pb-2">Elapsed Time</h4>
                    {selectedTask.frequencyType === "Hours" ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hours</Label>
                          <Input
                            type="number"
                            value={formData.elapsedHours}
                            onChange={(e) => setFormData({ ...formData, elapsedHours: e.target.value })}
                            placeholder="hh"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Minutes</Label>
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            value={formData.elapsedMinutes}
                            onChange={(e) => setFormData({ ...formData, elapsedMinutes: e.target.value })}
                            placeholder="mm"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Cycles</Label>
                        <Input
                          type="number"
                          value={formData.elapsedCycles}
                          onChange={(e) => setFormData({ ...formData, elapsedCycles: e.target.value })}
                          placeholder="Number of cycles"
                          required
                        />
                      </div>
                    )}

                    {/* Auto-calculated preview */}
                    {(() => {
                      let elapsed = 0
                      if (selectedTask.frequencyType === "Hours") {
                        elapsed = (Number(formData.elapsedHours) || 0) + (Number(formData.elapsedMinutes) || 0) / 60
                      } else {
                        elapsed = Number(formData.elapsedCycles) || 0
                      }
                      const nextDuePreview = doneOn + selectedTask.frequency
                      const remainingPreview = selectedTask.frequency - elapsed
                      return elapsed > 0 ? (
                        <div className="p-3 bg-muted/50 rounded-lg space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Next Due:</span>{" "}
                            <strong>
                              {nextDuePreview.toLocaleString()}{" "}
                              {selectedTask.frequencyType === "Hours" ? "Hrs" : "Cyc"}
                            </strong>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Remaining:</span>{" "}
                            <strong className={remainingPreview <= 0 ? "text-destructive" : ""}>
                              {remainingPreview <= 0
                                ? "--"
                                : `${remainingPreview.toLocaleString()} ${selectedTask.frequencyType === "Hours" ? "Hrs" : "Cyc"}`}
                            </strong>
                          </p>
                        </div>
                      ) : null
                    })()}
                  </div>
                )}

                {/* Remarks */}
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Optional remarks..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={!selectedTask}>
                    Save Entry
                  </Button>
                </div>
              </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Engine Hours Initialization (only shown if not yet initialized) */}
      {!engineHrsInitialized && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Initialize Engine Hours Since New
            </CardTitle>
            <CardDescription>Enter the starting engine hours value. This will auto-update going forward.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 items-end">
              <div className="space-y-2 flex-1 max-w-xs">
                <Label>Engine Hours Since New</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={engineHrsInput}
                  onChange={(e) => setEngineHrsInput(e.target.value)}
                  placeholder="e.g., 4950"
                />
              </div>
              <Button
                onClick={() => {
                  const val = Number(engineHrsInput)
                  if (val > 0) {
                    setEngineHrsSinceNew(val)
                    setEngineHrsInitialized(true)
                  }
                }}
                disabled={!engineHrsInput || Number(engineHrsInput) <= 0}
              >
                Initialize
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Source Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">Airframe Hrs (S/N)</p>
            <p className="text-lg sm:text-xl font-bold mt-1">{airframeHrsSinceNew.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">Airframe Landings (S/N)</p>
            <p className="text-lg sm:text-xl font-bold mt-1">{airframeLandingsSinceNew.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">Engine Hrs (S/N)</p>
            <p className="text-lg sm:text-xl font-bold mt-1">{engineHrsSinceNew.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <p className="text-xs text-muted-foreground">Engine Cycles (S/N)</p>
            <p className="text-lg sm:text-xl font-bold mt-1">{ENGINE_CYCLES_SINCE_NEW.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Component Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        {(["ALL", "LH", "RH", "APU"] as const).map((val) => (
          <Button
            key={val}
            size="sm"
            variant={filterComponent === val ? "default" : "outline"}
            onClick={() => setFilterComponent(val)}
            className="text-xs"
          >
            {val === "ALL" ? "All Components" : val === "APU" ? "APU" : `${val} Engine`}
          </Button>
        ))}
      </div>

      {/* Maintenance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Status Register
          </CardTitle>
          <CardDescription>
            {filteredEntries.length} task{filteredEntries.length !== 1 ? "s" : ""} displayed
            {filterComponent !== "ALL" && ` for ${filterComponent}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Comp.</TableHead>
                  <TableHead className="min-w-[140px]">Task No.</TableHead>
                  <TableHead className="min-w-[120px]">Task</TableHead>
                  <TableHead className="min-w-[160px]">Description</TableHead>
                  <TableHead>AMTOSS/NDT</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Part No.</TableHead>
                  <TableHead>Done On</TableHead>
                  <TableHead>Elapsed</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                      No maintenance entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} className={getRowClass(entry.remaining, entry.frequencyType)}>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            entry.component === "LH"
                              ? "border-blue-300 text-blue-700"
                              : entry.component === "RH"
                                ? "border-orange-300 text-orange-700"
                                : "border-purple-300 text-purple-700"
                          }
                        >
                          {entry.component}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{entry.taskNo}</TableCell>
                      <TableCell className="font-medium text-sm">{entry.task}</TableCell>
                      <TableCell className="text-sm max-w-[200px]">
                        <span className="line-clamp-2">{entry.taskDescription}</span>
                      </TableCell>
                      <TableCell className="text-xs">{entry.amtossNdtNo || "-"}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {entry.frequencyType === "Hours"
                          ? `${entry.frequency.toLocaleString()}:00 Hrs`
                          : `${entry.frequency.toLocaleString()} Cyc`}
                      </TableCell>
                      <TableCell className="text-xs font-mono">{entry.partNo || "-"}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {entry.doneOn.toLocaleString()}
                        <span className="text-muted-foreground text-xs ml-0.5">
                          {entry.frequencyType === "Hours" ? "h" : "c"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {entry.frequencyType === "Hours"
                          ? `${Math.floor(entry.elapsedTime)}:${String(Math.round((entry.elapsedTime % 1) * 60)).padStart(2, "0")}`
                          : entry.elapsedTime.toLocaleString()}
                        <span className="text-muted-foreground text-xs ml-0.5">
                          {entry.frequencyType === "Hours" ? "h" : "c"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {entry.nextDue.toLocaleString()}
                        <span className="text-muted-foreground text-xs ml-0.5">
                          {entry.frequencyType === "Hours" ? "h" : "c"}
                        </span>
                      </TableCell>
                      <TableCell className={getRemainingCellClass(entry.remaining, entry.frequencyType)}>
                        {entry.remaining <= 0
                          ? "--"
                          : entry.frequencyType === "Hours"
                            ? `${entry.remaining.toLocaleString()} Hrs`
                            : `${entry.remaining.toLocaleString()} Cyc`}
                      </TableCell>
                      <TableCell>{getRemainingBadge(entry.remaining, entry.frequencyType)}</TableCell>
                      <TableCell className="text-xs max-w-[120px]">
                        <span className="line-clamp-2">{entry.remarks || "-"}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>


    </div>
  )
}
