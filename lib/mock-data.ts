export const AIRCRAFT_REG = "VT-CDP"

// Helper function to generate dates
const getDate = (daysFromNow: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split("T")[0]
}

// Maintenance Records
export interface MaintenanceRecord {
  id: string
  aircraftReg: string
  frbSheetNo: string
  date: string
  nextDueDate: string
  nextDueHrs: number
  nextDueCycles: number
  lastCrsNo: string
  lastCompletedDate: string
  lastCompletedHrs: number
  lastCompletedCycles: number
  componentDueDate: string
  componentDueHrs: number
  componentDueCycles: string
  componentName: string
}

export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "1",
    aircraftReg: AIRCRAFT_REG,
    frbSheetNo: "FRB-2024-001",
    date: getDate(-5),
    nextDueDate: getDate(25),
    nextDueHrs: 5200,
    nextDueCycles: 2600,
    lastCrsNo: "CRS-2024-089",
    lastCompletedDate: getDate(-30),
    lastCompletedHrs: 5000,
    lastCompletedCycles: 2500,
    componentDueDate: getDate(20),
    componentDueHrs: 5150,
    componentDueCycles: "2580",
    componentName: "Engine Oil Filter",
  },
  {
    id: "2",
    aircraftReg: AIRCRAFT_REG,
    frbSheetNo: "FRB-2024-002",
    date: getDate(-3),
    nextDueDate: getDate(85),
    nextDueHrs: 5400,
    nextDueCycles: 2700,
    lastCrsNo: "CRS-2024-090",
    lastCompletedDate: getDate(-15),
    lastCompletedHrs: 5050,
    lastCompletedCycles: 2525,
    componentDueDate: getDate(60),
    componentDueHrs: 5300,
    componentDueCycles: "2650",
    componentName: "Hydraulic Pump",
  },
]

// Crew Data
export interface CrewAssignment {
  id: string
  frbSheetNo: string
  date: string
  pilot: string
  coPilot: string
  thirdCrew: string
  cabinCrew: string
  onBoardAme: string
}

export const crewAssignments: CrewAssignment[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    pilot: "Capt. Rajesh Kumar",
    coPilot: "FO Amit Singh",
    thirdCrew: "",
    cabinCrew: "Priya Sharma, Neha Patel",
    onBoardAme: "Vikram Desai",
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-002",
    date: getDate(0),
    pilot: "Capt. Suresh Menon",
    coPilot: "FO Deepak Joshi",
    thirdCrew: "SO Rahul Verma",
    cabinCrew: "Anjali Gupta, Meera Iyer",
    onBoardAme: "Sanjay Reddy",
  },
]

// Crew Duty (FDTL)
export type DutyStatus =
  | "Duty"
  | "Leave"
  | "Miscellaneous"
  | "Off"
  | "Other Duty"
  | "Positioning"
  | "Post Duty"
  | "Rest"
  | "Standby"
  | "Training"
  | "Transportation"
  | "Traveled"
  | "Weekly Off"

export interface CrewDuty {
  id: string
  crewName: string
  dutyStatus: DutyStatus
  city: string
  rosterNumber: string
  date: string
  fromTime: string
  toTime: string
  duration: number
  isViolation: boolean
}

export const crewDuties: CrewDuty[] = [
  {
    id: "1",
    crewName: "Capt. Rajesh Kumar",
    dutyStatus: "Duty",
    city: "Mumbai",
    rosterNumber: "RST-001",
    date: getDate(-1),
    fromTime: "06:00",
    toTime: "18:00",
    duration: 12,
    isViolation: false,
  },
  {
    id: "2",
    crewName: "FO Amit Singh",
    dutyStatus: "Duty",
    city: "Delhi",
    rosterNumber: "RST-002",
    date: getDate(-1),
    fromTime: "05:00",
    toTime: "19:30",
    duration: 14.5,
    isViolation: true,
  },
  {
    id: "3",
    crewName: "Capt. Suresh Menon",
    dutyStatus: "Rest",
    city: "Bangalore",
    rosterNumber: "RST-003",
    date: getDate(0),
    fromTime: "00:00",
    toTime: "23:59",
    duration: 24,
    isViolation: false,
  },
]

// Crew Training & Documents
export interface CrewDocument {
  id: string
  crewName: string
  documentType: "License" | "Training"
  documentName: string
  issuedDate: string
  expiryDate: string
  isExpiringSoon: boolean
}

export const crewDocuments: CrewDocument[] = [
  {
    id: "1",
    crewName: "Capt. Rajesh Kumar",
    documentType: "License",
    documentName: "ATPL",
    issuedDate: getDate(-365),
    expiryDate: getDate(25),
    isExpiringSoon: true,
  },
  {
    id: "2",
    crewName: "FO Amit Singh",
    documentType: "Training",
    documentName: "CRM Training",
    issuedDate: getDate(-180),
    expiryDate: getDate(185),
    isExpiringSoon: false,
  },
  {
    id: "3",
    crewName: "Capt. Suresh Menon",
    documentType: "License",
    documentName: "Medical Certificate",
    issuedDate: getDate(-330),
    expiryDate: getDate(15),
    isExpiringSoon: true,
  },
]

// Fuel Records
export interface FuelRecord {
  id: string
  frbSheetNo: string
  date: string
  fuelVendor: string
  fuelPlannedForSector: number
  beforeFlightLHMain: number
  beforeFlightRHMain: number
  beforeFlightCenter: number
  beforeFlightAft: number
  beforeFlightTotal: number
  afterDepartureLHMain: number
  afterDepartureRHMain: number
  afterDepartureCenter: number
  afterDepartureAft: number
  afterDepartureTotal: number
  upliftedLitres: number
  upliftedReceiptNo: string
  upliftedName: string
  fuelBurned: number
}

export const fuelRecords: FuelRecord[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    fuelVendor: "Indian Oil Corporation",
    fuelPlannedForSector: 8500,
    beforeFlightLHMain: 2500,
    beforeFlightRHMain: 2500,
    beforeFlightCenter: 3000,
    beforeFlightAft: 1500,
    beforeFlightTotal: 9500,
    afterDepartureLHMain: 1800,
    afterDepartureRHMain: 1800,
    afterDepartureCenter: 2200,
    afterDepartureAft: 1100,
    afterDepartureTotal: 6900,
    upliftedLitres: 3500,
    upliftedReceiptNo: "IOC-2024-5678",
    upliftedName: "Ramesh Patel",
    fuelBurned: 2600,
  },
]

// Departure Details
export interface DepartureRecord {
  id: string
  frbSheetNo: string
  date: string
  placeOfDeparture: string
  placeOfArrival: string
  departureTime: string
  arrivalTime: string
  takeoffTime: string
  touchdownTime: string
  apuHrs: number
  apuCycles: number
  blockTime: string
  airTime: string
  flightType: string
}

export const departureRecords: DepartureRecord[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    placeOfDeparture: "VABB (Mumbai)",
    placeOfArrival: "VIDP (Delhi)",
    departureTime: "08:30",
    arrivalTime: "10:45",
    takeoffTime: "08:42",
    touchdownTime: "10:35",
    apuHrs: 1520,
    apuCycles: 890,
    blockTime: "02:15",
    airTime: "01:53",
    flightType: "Passenger",
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-002",
    date: getDate(0),
    placeOfDeparture: "VIDP (Delhi)",
    placeOfArrival: "VOBL (Bangalore)",
    departureTime: "14:00",
    arrivalTime: "16:45",
    takeoffTime: "14:15",
    touchdownTime: "16:30",
    apuHrs: 1522,
    apuCycles: 892,
    blockTime: "02:45",
    airTime: "02:15",
    flightType: "Passenger",
  },
]

// Engine Health
export interface EngineHealth {
  id: string
  frbSheetNo: string
  date: string
  engine: "LH" | "RH"
  timeUtc: string
  pressureAltitude: number
  ias: number
  sat: number
  epr: number
  lpN1: number
  itt: number
  hpN2: number
  fuelFlow: number
  oilTemp: number
  oilPressure: number
  evmLp: number
  evmHp: number
}

export const engineHealthRecords: EngineHealth[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    engine: "LH",
    timeUtc: "09:30",
    pressureAltitude: 35000,
    ias: 280,
    sat: -45,
    epr: 1.45,
    lpN1: 89.5,
    itt: 650,
    hpN2: 95.2,
    fuelFlow: 2800,
    oilTemp: 85,
    oilPressure: 55,
    evmLp: 0.5,
    evmHp: 0.3,
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    engine: "RH",
    timeUtc: "09:30",
    pressureAltitude: 35000,
    ias: 280,
    sat: -45,
    epr: 1.44,
    lpN1: 89.3,
    itt: 648,
    hpN2: 95.0,
    fuelFlow: 2790,
    oilTemp: 84,
    oilPressure: 54,
    evmLp: 0.4,
    evmHp: 0.3,
  },
]

// Defects & Observations
export interface DefectRecord {
  id: string
  frbSheetNo: string
  date: string
  defectDetails: string
  specialObservation: string
  enteredBy: string
  enteredByType: "Pilot" | "Certifying Staff"
  workOrderGenerated: boolean
  workOrderNo: string
}

export const defectRecords: DefectRecord[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    defectDetails: "Minor vibration noted in LH engine at high altitude cruise",
    specialObservation: "Engine parameters within limits, recommend inspection",
    enteredBy: "Capt. Rajesh Kumar",
    enteredByType: "Pilot",
    workOrderGenerated: true,
    workOrderNo: "WO-2024-045",
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-002",
    date: getDate(0),
    defectDetails: "NIL",
    specialObservation: "NIL",
    enteredBy: "Capt. Suresh Menon",
    enteredByType: "Pilot",
    workOrderGenerated: false,
    workOrderNo: "",
  },
]

// Work Orders
export interface WorkOrder {
  id: string
  workOrderNo: string
  frbSheetNo: string
  defectDescription: string
  status: "Open" | "In Progress" | "Closed"
  createdDate: string
  assignedTo: string
}

export const workOrders: WorkOrder[] = [
  {
    id: "1",
    workOrderNo: "WO-2024-045",
    frbSheetNo: "FRB-2024-001",
    defectDescription: "Minor vibration noted in LH engine at high altitude cruise",
    status: "In Progress",
    createdDate: getDate(-1),
    assignedTo: "Vikram Desai",
  },
  {
    id: "2",
    workOrderNo: "WO-2024-044",
    frbSheetNo: "FRB-2024-000",
    defectDescription: "Cabin pressure fluctuation during descent",
    status: "Closed",
    createdDate: getDate(-5),
    assignedTo: "Sanjay Reddy",
  },
  {
    id: "3",
    workOrderNo: "WO-2024-043",
    frbSheetNo: "FRB-2023-998",
    defectDescription: "Weather radar intermittent display issue",
    status: "Open",
    createdDate: getDate(-3),
    assignedTo: "Arun Mehta",
  },
]

// CRS Records
export interface CRSRecord {
  id: string
  crsNo: string
  workOrderRefNo: string
  frbSheetNo: string
  workDetails: string
  name: string
  date: string
  authNo: string
}

export const crsRecords: CRSRecord[] = [
  {
    id: "1",
    crsNo: "CRS-2024-091",
    workOrderRefNo: "WO-2024-044",
    frbSheetNo: "FRB-2024-000",
    workDetails: "Cabin pressure controller replaced and tested. System functional.",
    name: "Sanjay Reddy",
    date: getDate(-4),
    authNo: "AUTH-ENG-045",
  },
]

// Hours & Cycles
export interface HoursCycles {
  id: string
  frbSheetNo: string
  date: string
  totalBfHrs: number
  totalBfCycles: number
  totalCfHrs: number
  totalCfCycles: number
}

export const hoursCyclesRecords: HoursCycles[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    totalBfHrs: 5100,
    totalBfCycles: 2550,
    totalCfHrs: 5102,
    totalCfCycles: 2551,
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-002",
    date: getDate(0),
    totalBfHrs: 5102,
    totalBfCycles: 2551,
    totalCfHrs: 5104.5,
    totalCfCycles: 2552,
  },
]

// Oil Data
export interface OilData {
  id: string
  frbSheetNo: string
  date: string
  engine1Arrival: number
  engine1Uplifted: number
  engine1Total: number
  engine2Arrival: number
  engine2Uplifted: number
  engine2Total: number
  apuArrival: number
  apuUplifted: number
  apuTotal: number
}

export const oilDataRecords: OilData[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    engine1Arrival: 8.5,
    engine1Uplifted: 1.5,
    engine1Total: 10,
    engine2Arrival: 8.8,
    engine2Uplifted: 1.2,
    engine2Total: 10,
    apuArrival: 4.2,
    apuUplifted: 0.8,
    apuTotal: 5,
  },
]

// FRB Entries for Dashboard
export interface FRBEntry {
  id: string
  frbSheetNo: string
  date: string
  aircraftReg: string
  sector: string
  pilot: string
  status: "Complete" | "Pending Review" | "Incomplete"
}

export const frbEntries: FRBEntry[] = [
  {
    id: "1",
    frbSheetNo: "FRB-2024-002",
    date: getDate(0),
    aircraftReg: AIRCRAFT_REG,
    sector: "DEL-BLR",
    pilot: "Capt. Suresh Menon",
    status: "Pending Review",
  },
  {
    id: "2",
    frbSheetNo: "FRB-2024-001",
    date: getDate(-1),
    aircraftReg: AIRCRAFT_REG,
    sector: "BOM-DEL",
    pilot: "Capt. Rajesh Kumar",
    status: "Complete",
  },
  {
    id: "3",
    frbSheetNo: "FRB-2024-000",
    date: getDate(-2),
    aircraftReg: AIRCRAFT_REG,
    sector: "BLR-BOM",
    pilot: "Capt. Anand Rao",
    status: "Complete",
  },
  {
    id: "4",
    frbSheetNo: "FRB-2023-999",
    date: getDate(-3),
    aircraftReg: AIRCRAFT_REG,
    sector: "DEL-BLR",
    pilot: "Capt. Rajesh Kumar",
    status: "Complete",
  },
  {
    id: "5",
    frbSheetNo: "FRB-2023-998",
    date: getDate(-4),
    aircraftReg: AIRCRAFT_REG,
    sector: "BOM-DEL",
    pilot: "Capt. Suresh Menon",
    status: "Complete",
  },
]

// Duty Status Options
export const dutyStatusOptions: DutyStatus[] = [
  "Duty",
  "Leave",
  "Miscellaneous",
  "Off",
  "Other Duty",
  "Positioning",
  "Post Duty",
  "Rest",
  "Standby",
  "Training",
  "Transportation",
  "Traveled",
  "Weekly Off",
]

// Flight Types
export const flightTypes = ["Passenger", "Ferry", "Test Flight", "Training", "Other"]
