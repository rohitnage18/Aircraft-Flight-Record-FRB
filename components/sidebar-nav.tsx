"use client"

import { useState, type ReactNode } from "react"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plane,
  LayoutDashboard,
  Wrench,
  Users,
  Fuel,
  PlaneTakeoff,
  Gauge,
  AlertTriangle,
  FileText,
  Clock,
  Droplet,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Menu,
  Shield,
  ClipboardList,
  GraduationCap,
  CalendarClock,
  X,
  ClipboardCheck,
  Thermometer,
  Snowflake,
  Ruler,
} from "lucide-react"

export type TabId =
  // Operations tabs
  | "ops-dashboard"
  | "crew-assignment"
  | "crew-duty"
  | "crew-documents"
  | "fuel"
  | "pre-departure"
  | "departure"
  | "reports"
  // Engineering tabs
  | "eng-oil-quantity"
  | "eng-parameters"
  | "eng-height-params"
  | "eng-anti-ice"
  | "eng-scheduled-maintenance"
  | "defects"
  | "work-orders"
  | "crs"
  | "hours-cycles"
  // Admin tabs
  | "admin-dashboard"
  | "admin-aircraft"
  | "admin-maintenance"
  | "admin-crew"
  | "admin-flight-fuel"
  | "admin-defects-wo"
  | "admin-documents"
  // Account tabs (triggered from the header dropdown)
  | "profile"
  | "settings"

interface NavItem {
  id: TabId
  label: string
  icon: ReactNode
  roles: UserRole[]
  category: string
}

const opsNavItems: NavItem[] = [
  { id: "ops-dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, roles: ["operations"], category: "Operations" },
  { id: "crew-assignment", label: "Crew Data", icon: <Users className="h-4 w-4" />, roles: ["operations"], category: "Crew" },
  { id: "crew-duty", label: "Crew Duty (FDTL)", icon: <Clock className="h-4 w-4" />, roles: ["operations"], category: "Crew" },
  { id: "crew-documents", label: "Training / Documents", icon: <GraduationCap className="h-4 w-4" />, roles: ["operations"], category: "Crew" },
  { id: "fuel", label: "Fuel Monitoring", icon: <Fuel className="h-4 w-4" />, roles: ["operations"], category: "Fuel" },
  { id: "pre-departure", label: "Pre-Departure Status", icon: <ClipboardCheck className="h-4 w-4" />, roles: ["operations"], category: "Departure" },
  { id: "departure", label: "Flights", icon: <PlaneTakeoff className="h-4 w-4" />, roles: ["operations"], category: "Departure" },
  { id: "reports", label: "Reports", icon: <FileText className="h-4 w-4" />, roles: ["operations"], category: "Reports" },
]

const engNavItems: NavItem[] = [
  { id: "eng-oil-quantity", label: "Oil Quantity", icon: <Droplet className="h-4 w-4" />, roles: ["engineering"], category: "Engine Health" },
  { id: "eng-parameters", label: "Parameters", icon: <Gauge className="h-4 w-4" />, roles: ["engineering"], category: "Engine Health" },
  { id: "eng-height-params", label: "Height Parameters", icon: <Ruler className="h-4 w-4" />, roles: ["engineering"], category: "Aircraft Maintenance" },
  { id: "eng-anti-ice", label: "Anti Ice Record", icon: <Snowflake className="h-4 w-4" />, roles: ["engineering"], category: "Aircraft Maintenance" },
  { id: "eng-scheduled-maintenance", label: "Scheduled Maintenance", icon: <Wrench className="h-4 w-4" />, roles: ["engineering"], category: "Aircraft Maintenance" },
  { id: "defects", label: "Defects & Observations", icon: <AlertTriangle className="h-4 w-4" />, roles: ["engineering"], category: "General" },
  { id: "work-orders", label: "Work Orders", icon: <ClipboardList className="h-4 w-4" />, roles: ["engineering"], category: "General" },
  { id: "crs", label: "Releases (CRS)", icon: <CheckCircle className="h-4 w-4" />, roles: ["engineering"], category: "General" },
  { id: "hours-cycles", label: "Hours & Cycles", icon: <Clock className="h-4 w-4" />, roles: ["engineering"], category: "General" },
]

const adminNavItems: NavItem[] = [
  { id: "admin-dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, roles: ["admin"], category: "Overview" },
  { id: "admin-aircraft", label: "Aircraft Overview", icon: <Plane className="h-4 w-4" />, roles: ["admin"], category: "Fleet" },
  { id: "admin-maintenance", label: "Maintenance & Compliance", icon: <Shield className="h-4 w-4" />, roles: ["admin"], category: "Compliance" },
  { id: "admin-crew", label: "Crew & Training", icon: <GraduationCap className="h-4 w-4" />, roles: ["admin"], category: "Compliance" },
  { id: "admin-flight-fuel", label: "Flight & Fuel Summary", icon: <Fuel className="h-4 w-4" />, roles: ["admin"], category: "Operations" },
  { id: "admin-defects-wo", label: "Defects & Work Orders", icon: <ClipboardList className="h-4 w-4" />, roles: ["admin"], category: "Engineering" },
  { id: "admin-documents", label: "Documents & Expiry", icon: <CalendarClock className="h-4 w-4" />, roles: ["admin"], category: "Documents" },
]

interface SidebarNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  let navItems: NavItem[]
  if (user.role === "admin") {
    navItems = adminNavItems
  } else if (user.role === "engineering") {
    navItems = engNavItems
  } else {
    navItems = opsNavItems
  }

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role))

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, NavItem[]>)

  const NavContent = () => (
    <>
      <div className={cn(
          "relative flex items-center justify-center border-b border-border/50 h-14",
          collapsed ? "px-2" : "px-4"
        )}>
        <img
          src="/images/xenvolt-logo.jpg"
          alt="Xenvolt"
          className={cn(
            "object-contain mix-blend-multiply",
            collapsed ? "h-9 w-9" : "h-11 w-full max-w-[200px]"
          )}
        />
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 py-2">
        <div className={cn("space-y-4", collapsed ? "px-2" : "px-3")}>
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              {!collapsed && (
                <h3 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {category}
                </h3>
              )}
              <div className="space-y-0.5">
                {items.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-9 font-normal transition-colors",
                      collapsed && "justify-center px-2",
                      activeTab === item.id 
                        ? "bg-primary/10 text-primary font-medium border-l-2 border-primary rounded-l-none" 
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => {
                      onTabChange(item.id)
                      setMobileOpen(false)
                    }}
                  >
                    {item.icon}
                    {!collapsed && <span className="truncate text-sm">{item.label}</span>}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      
    </>
  )

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen bg-card border-r border-border/50 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <NavContent />
      </aside>
    </>
  )
}
