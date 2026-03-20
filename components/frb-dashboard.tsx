"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { SidebarNav, type TabId } from "./sidebar-nav"
import { MainHeader } from "./main-header"
// Operations modules
import { OperationsDashboard } from "./modules/operations-dashboard"
import { CrewAssignmentModule } from "./modules/crew-assignment-module"
import { CrewDutyModule } from "./modules/crew-duty-module"
import { CrewDocumentsModule } from "./modules/crew-documents-module"
import { FuelModule } from "./modules/fuel-module"
import { PreDepartureModule } from "./modules/pre-departure-module"
import { DepartureModule } from "./modules/departure-module"
import { ReportsModule } from "./modules/reports-module"
// Engineering modules
import { OilDataModule } from "./modules/oil-data-module"
import { EngineHealthModule } from "./modules/engine-health-module"
import { HeightParametersModule } from "./modules/height-parameters-module"
import { AntiIceModule } from "./modules/anti-ice-module"
import { MaintenanceModule } from "./modules/maintenance-module"
import { DefectsModule } from "./modules/defects-module"
import { WorkOrdersModule } from "./modules/work-orders-module"
import { CRSModule } from "./modules/crs-module"
import { HoursCyclesModule } from "./modules/hours-cycles-module"
// Admin modules
import { AdminDashboard } from "./modules/admin-dashboard"
import { AdminAircraftOverview } from "./modules/admin-aircraft-overview"
import { AdminMaintenanceCompliance } from "./modules/admin-maintenance-compliance"
import { AdminCrewCompliance } from "./modules/admin-crew-compliance"
import { AdminFlightFuelSummary } from "./modules/admin-flight-fuel"
import { AdminDefectsWorkOrders } from "./modules/admin-defects-workorders"
import { AdminDocumentsExpiry } from "./modules/admin-documents-expiry"
import { ProfilePage } from "./profile-page"
import { SettingsPage } from "./settings-page"

export function FRBDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>("ops-dashboard")

  useEffect(() => {
    if (user) {
      if (user.role === "operations") {
        setActiveTab("ops-dashboard")
      } else if (user.role === "engineering") {
        setActiveTab("eng-oil-quantity")
      } else if (user.role === "admin") {
        setActiveTab("admin-dashboard")
      }
    }
  }, [user])

  const renderContent = () => {
    switch (activeTab) {
      // Account
      case "profile":
        return <ProfilePage />
      case "settings":
        return <SettingsPage />
      // Operations
      case "ops-dashboard":
        return <OperationsDashboard />
      case "crew-assignment":
        return <CrewAssignmentModule />
      case "crew-duty":
        return <CrewDutyModule />
      case "crew-documents":
        return <CrewDocumentsModule />
      case "fuel":
        return <FuelModule />
      case "pre-departure":
        return <PreDepartureModule />
      case "departure":
        return <DepartureModule />
      case "reports":
        return <ReportsModule />
      // Engineering - Engine Health
      case "eng-oil-quantity":
        return <OilDataModule />
      case "eng-parameters":
        return <EngineHealthModule />
      // Engineering - Aircraft Maintenance
      case "eng-height-params":
        return <HeightParametersModule />
      case "eng-anti-ice":
        return <AntiIceModule />
      case "eng-scheduled-maintenance":
        return <MaintenanceModule />
      // Engineering - Other
      case "defects":
        return <DefectsModule />
      case "work-orders":
        return <WorkOrdersModule />
      case "crs":
        return <CRSModule />
      case "hours-cycles":
        return <HoursCyclesModule />
      // Admin
      case "admin-dashboard":
        return <AdminDashboard />
      case "admin-aircraft":
        return <AdminAircraftOverview />
      case "admin-maintenance":
        return <AdminMaintenanceCompliance />
      case "admin-crew":
        return <AdminCrewCompliance />
      case "admin-flight-fuel":
        return <AdminFlightFuelSummary />
      case "admin-defects-wo":
        return <AdminDefectsWorkOrders />
      case "admin-documents":
        return <AdminDocumentsExpiry />
      default:
        return <OperationsDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <MainHeader
          onProfile={() => setActiveTab("profile")}
          onSettings={() => setActiveTab("settings")}
        />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto scrollbar-thin">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
