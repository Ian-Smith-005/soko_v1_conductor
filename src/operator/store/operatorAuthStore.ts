import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Operator } from '../types'

interface OperatorAuthState {
  operator: Operator | null
  isAuthenticated: boolean
  login: (operator: Operator) => void
  logout: () => void
  updateOperator: (data: Partial<Operator>) => void
}

export const useOperatorAuthStore = create<OperatorAuthState>()(
  persist(
    (set) => ({
      operator: null,
      isAuthenticated: false,
      login: (operator) => set({ operator, isAuthenticated: true }),
      logout: () => set({ operator: null, isAuthenticated: false }),
      updateOperator: (data) => set(state => ({
        operator: state.operator ? { ...state.operator, ...data } : null
      })),
    }),
    { name: 'soko-operator-auth' }
  )
)
