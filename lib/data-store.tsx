"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  maintenanceRecords as initialMaintenance,
  crewAssignments as initialCrewAssignments,
  crewDuties as initialCrewDuties,
  crewDocuments as initialCrewDocuments,
  fuelRecords as initialFuelRecords,
  departureRecords as initialDepartureRecords,
  engineHealthRecords as initialEngineHealth,
  defectRecords as initialDefects,
  workOrders as initialWorkOrders,
  crsRecords as initialCRS,
  hoursCyclesRecords as initialHoursCycles,
  oilDataRecords as initialOilData,
  frbEntries as initialFRBEntries,
  type MaintenanceRecord,
  type CrewAssignment,
  type CrewDuty,
  type CrewDocument,
  type FuelRecord,
  type DepartureRecord,
  type EngineHealth,
  type DefectRecord,
  type WorkOrder,
  type CRSRecord,
  type HoursCycles,
  type OilData,
  type FRBEntry,
} from "./mock-data"

interface DataStoreContextType {
  // Maintenance
  maintenanceRecords: MaintenanceRecord[]
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, "id">) => void
  
  // Crew Assignments
  crewAssignments: CrewAssignment[]
  addCrewAssignment: (record: Omit<CrewAssignment, "id">) => void
  
  // Crew Duties
  crewDuties: CrewDuty[]
  addCrewDuty: (record: Omit<CrewDuty, "id">) => void
  
  // Crew Documents
  crewDocuments: CrewDocument[]
  addCrewDocument: (record: Omit<CrewDocument, "id">) => void
  
  // Fuel Records
  fuelRecords: FuelRecord[]
  addFuelRecord: (record: Omit<FuelRecord, "id">) => void
  
  // Departure Records
  departureRecords: DepartureRecord[]
  addDepartureRecord: (record: Omit<DepartureRecord, "id">) => void
  
  // Engine Health
  engineHealthRecords: EngineHealth[]
  addEngineHealthRecord: (record: Omit<EngineHealth, "id">) => void
  
  // Defects
  defectRecords: DefectRecord[]
  addDefectRecord: (record: Omit<DefectRecord, "id">) => void
  
  // Work Orders
  workOrders: WorkOrder[]
  addWorkOrder: (record: Omit<WorkOrder, "id">) => void
  updateWorkOrderStatus: (id: string, status: WorkOrder["status"]) => void
  
  // CRS Records
  crsRecords: CRSRecord[]
  addCRSRecord: (record: Omit<CRSRecord, "id">) => void
  
  // Hours & Cycles
  hoursCyclesRecords: HoursCycles[]
  addHoursCyclesRecord: (record: Omit<HoursCycles, "id">) => void
  
  // Oil Data
  oilDataRecords: OilData[]
  addOilDataRecord: (record: Omit<OilData, "id">) => void
  
  // FRB Entries
  frbEntries: FRBEntry[]
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(initialMaintenance)
  const [crewAssignments, setCrewAssignments] = useState<CrewAssignment[]>(initialCrewAssignments)
  const [crewDuties, setCrewDuties] = useState<CrewDuty[]>(initialCrewDuties)
  const [crewDocuments, setCrewDocuments] = useState<CrewDocument[]>(initialCrewDocuments)
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>(initialFuelRecords)
  const [departureRecords, setDepartureRecords] = useState<DepartureRecord[]>(initialDepartureRecords)
  const [engineHealthRecords, setEngineHealthRecords] = useState<EngineHealth[]>(initialEngineHealth)
  const [defectRecords, setDefectRecords] = useState<DefectRecord[]>(initialDefects)
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders)
  const [crsRecords, setCRSRecords] = useState<CRSRecord[]>(initialCRS)
  const [hoursCyclesRecords, setHoursCyclesRecords] = useState<HoursCycles[]>(initialHoursCycles)
  const [oilDataRecords, setOilDataRecords] = useState<OilData[]>(initialOilData)
  const [frbEntries] = useState<FRBEntry[]>(initialFRBEntries)

  const addMaintenanceRecord = (record: Omit<MaintenanceRecord, "id">) => {
    setMaintenanceRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addCrewAssignment = (record: Omit<CrewAssignment, "id">) => {
    setCrewAssignments((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addCrewDuty = (record: Omit<CrewDuty, "id">) => {
    setCrewDuties((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addCrewDocument = (record: Omit<CrewDocument, "id">) => {
    setCrewDocuments((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addFuelRecord = (record: Omit<FuelRecord, "id">) => {
    setFuelRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addDepartureRecord = (record: Omit<DepartureRecord, "id">) => {
    setDepartureRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addEngineHealthRecord = (record: Omit<EngineHealth, "id">) => {
    setEngineHealthRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addDefectRecord = (record: Omit<DefectRecord, "id">) => {
    setDefectRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addWorkOrder = (record: Omit<WorkOrder, "id">) => {
    setWorkOrders((prev) => [...prev, { ...record, id: generateId() }])
  }

  const updateWorkOrderStatus = (id: string, status: WorkOrder["status"]) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, status } : wo))
    )
  }

  const addCRSRecord = (record: Omit<CRSRecord, "id">) => {
    setCRSRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addHoursCyclesRecord = (record: Omit<HoursCycles, "id">) => {
    setHoursCyclesRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  const addOilDataRecord = (record: Omit<OilData, "id">) => {
    setOilDataRecords((prev) => [...prev, { ...record, id: generateId() }])
  }

  return (
    <DataStoreContext.Provider
      value={{
        maintenanceRecords,
        addMaintenanceRecord,
        crewAssignments,
        addCrewAssignment,
        crewDuties,
        addCrewDuty,
        crewDocuments,
        addCrewDocument,
        fuelRecords,
        addFuelRecord,
        departureRecords,
        addDepartureRecord,
        engineHealthRecords,
        addEngineHealthRecord,
        defectRecords,
        addDefectRecord,
        workOrders,
        addWorkOrder,
        updateWorkOrderStatus,
        crsRecords,
        addCRSRecord,
        hoursCyclesRecords,
        addHoursCyclesRecord,
        oilDataRecords,
        addOilDataRecord,
        frbEntries,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  )
}

export function useDataStore() {
  const context = useContext(DataStoreContext)
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider")
  }
  return context
}
