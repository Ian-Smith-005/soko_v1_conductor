import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Pass } from '../types'

interface PassState {
  activePass: Pass | null
  passes: Pass[]
  setActivePass: (pass: Pass | null) => void
  addPass: (pass: Pass) => void
  activateQR: () => void
}

export const usePassStore = create<PassState>()(
  persist(
    (set) => ({
      activePass: null,
      passes: [],
      setActivePass: (pass) => set({ activePass: pass }),
      addPass: (pass) =>
        set((state) => ({ passes: [...state.passes, pass], activePass: pass })),
      activateQR: () =>
        set((state) => {
          if (!state.activePass) return state
          const now = Date.now()
          const updated = { ...state.activePass, activatedAt: now, expiresAt: now + 60 * 60 * 1000 }
          return { activePass: updated, passes: state.passes.map(p => p.id === updated.id ? updated : p) }
        }),
    }),
    { name: 'soko-passes' }
  )
)
