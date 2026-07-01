import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction } from '../types'

interface WalletState {
  balance: number
  loyaltyPoints: number
  transactions: Transaction[]
  topUp: (amount: number, method: string) => void
  deduct: (amount: number, description: string) => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      balance: 0,
      loyaltyPoints: 0,
      transactions: [],

      topUp: (amount, method) =>
        set((state) => ({
          balance: state.balance + amount,
          loyaltyPoints: state.loyaltyPoints + Math.floor(amount / 10),
          transactions: [
            {
              id: Date.now().toString(),
              description: `${method} Top Up`,
              amount,
              type: 'credit',
              date: new Date().toLocaleString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              status: 'success',
            },
            ...state.transactions,
          ],
        })),

      deduct: (amount, description) =>
        set((state) => ({
          balance: Math.max(0, state.balance - amount),
          transactions: [
            {
              id: Date.now().toString(),
              description,
              amount,
              type: 'debit',
              date: new Date().toLocaleString('en-KE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              status: 'success',
            },
            ...state.transactions,
          ],
        })),
    }),
    { name: 'soko-wallet' }
  )
)
