"use client"

import { useState } from "react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Users } from "lucide-react"

export function CrewAssignmentModule() {
  const { crewAssignments, addCrewAssignment } = useDataStore()
  const { user } = useAuth()
  const isReadOnly = user?.role === "admin"
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    frbSheetNo: "",
    date: new Date().toISOString().split("T")[0],
    pilot: "",
    coPilot: "",
    thirdCrew: "",
    cabinCrew: "",
    onBoardAme: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCrewAssignment(formData)
    setOpen(false)
    setFormData({
      frbSheetNo: "",
      date: new Date().toISOString().split("T")[0],
      pilot: "",
      coPilot: "",
      thirdCrew: "",
      cabinCrew: "",
      onBoardAme: "",
    })
  }

  return (
    <div className="space-y-6 scrollbar-thin">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Crew Assignment</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage flight crew assignments linked to FRB sheets</p>
        </div>
        {!isReadOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" className="h-9" />}><Plus className="h-4 w-4 mr-2" />Add Entry
                                    </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0">
              <DialogHeader className="px-6 pt-6 pb-2">
                <DialogTitle className="text-lg">Add Crew Assignment</DialogTitle>
                <DialogDescription className="text-sm">Assign crew members to a flight</DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>FRB Sheet No.</Label>
                    <Input
                      value={formData.frbSheetNo}
                      onChange={(e) => setFormData({ ...formData, frbSheetNo: e.target.value })}
                      placeholder="FRB-2024-XXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Pilot in Command</Label>
                  <Input
                    value={formData.pilot}
                    onChange={(e) => setFormData({ ...formData, pilot: e.target.value })}
                    placeholder="Captain name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Co-Pilot</Label>
                  <Input
                    value={formData.coPilot}
                    onChange={(e) => setFormData({ ...formData, coPilot: e.target.value })}
                    placeholder="First Officer name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Third Crew (if any)</Label>
                  <Input
                    value={formData.thirdCrew}
                    onChange={(e) => setFormData({ ...formData, thirdCrew: e.target.value })}
                    placeholder="Second Officer name (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cabin Crew</Label>
                  <Input
                    value={formData.cabinCrew}
                    onChange={(e) => setFormData({ ...formData, cabinCrew: e.target.value })}
                    placeholder="Cabin crew names (comma separated)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>On-Board AME</Label>
                  <Input
                    value={formData.onBoardAme}
                    onChange={(e) => setFormData({ ...formData, onBoardAme: e.target.value })}
                    placeholder="Aircraft Maintenance Engineer"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">Save Assignment</Button>
                </div>
              </form>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium">Crew Assignments</CardTitle>
          </div>
          <CardDescription className="text-xs">Flight crew roster linked to FRB sheets</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs h-9">FRB Sheet</TableHead>
                  <TableHead className="text-xs h-9">Date</TableHead>
                  <TableHead className="text-xs h-9">Pilot</TableHead>
                  <TableHead className="text-xs h-9">Co-Pilot</TableHead>
                  <TableHead className="text-xs h-9">Third Crew</TableHead>
                  <TableHead className="text-xs h-9">Cabin Crew</TableHead>
                  <TableHead className="text-xs h-9">On-Board AME</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crewAssignments.map((assignment) => (
                  <TableRow key={assignment.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs py-2.5">{assignment.frbSheetNo}</TableCell>
                    <TableCell className="text-xs py-2.5">{assignment.date}</TableCell>
                    <TableCell className="font-medium text-xs py-2.5">{assignment.pilot}</TableCell>
                    <TableCell className="text-xs py-2.5">{assignment.coPilot}</TableCell>
                    <TableCell className="text-xs py-2.5">{assignment.thirdCrew || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs py-2.5">{assignment.cabinCrew}</TableCell>
                    <TableCell className="text-xs py-2.5">{assignment.onBoardAme || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
