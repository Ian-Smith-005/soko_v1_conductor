export interface User {
  id: string
  name: string
  email: string
  phone?: string
  mpesaNumber?: string
  loyaltyPoints: number
  totalTrips: number
  avatarUrl?: string
  memberSince?: string
  emailVerified?: boolean
  phoneVerified?: boolean
}

export interface Pass {
  id: string
  passCode: string
  route: string
  plan: 'Daily' | 'Weekly' | 'Monthly'
  tripsLeft: number
  totalTrips: number
  validUntil: string
  isActive: boolean
  price: number
  activatedAt?: number // epoch ms
  expiresAt?: number   // epoch ms (1hr from activation for QR validity)
}

export interface Route {
  id: string
  name: string
  from: string
  to: string
  duration: string
  distance: string
  price: number
  coordinates?: [number, number][]
}

export interface Transaction {
  id: string
  description: string
  amount: number
  type: 'credit' | 'debit'
  date: string
  status: 'success' | 'failed' | 'pending'
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning'
}

export type PaymentGateway = 'mpesa' | 'stripe' | 'paypal'
export type PaymentStep = 'select' | 'processing' | 'done'
export type PaymentStatus = 'success' | 'failed' | null
