export interface Operator {
  id: string
  pin: string
  saccoName: string
  routeId: string
  routeName: string
  busPlate: string
  conductorName: string
}

export interface BoardingRecord {
  id: string
  passengerCode: string
  passType: 'Daily' | 'Weekly' | 'Monthly' | 'Single'
  amount: number
  tripsLeftAfter: number | null
  status: 'verified' | 'declined'
  declineReason?: string
  timestamp: number // epoch ms
}

export interface TripSession {
  id: string
  busPlate: string
  routeName: string
  startedAt: number
  endedAt: number | null
  tripNumber: number
  boardings: BoardingRecord[]
}

export interface OperatorRoute {
  id: string
  name: string
}
