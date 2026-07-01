import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TripSession, BoardingRecord } from '../types'

interface OperatorTripState {
  activeTrip: TripSession | null
  startTrip: (busPlate: string, routeName: string) => void
  endTrip: () => void
  addBoarding: (boarding: Omit<BoardingRecord, 'id' | 'timestamp'>) => void
}

const tripNumberToday = () => {
  const today = new Date().toDateString()
  const key = 'soko-trip-count-' + today
  const count = parseInt(localStorage.getItem(key) || '0', 10) + 1
  localStorage.setItem(key, String(count))
  return count
}

export const useOperatorTripStore = create<OperatorTripState>()(
  persist(
    (set) => ({
      activeTrip: null,

      startTrip: (busPlate, routeName) =>
        set({
          activeTrip: {
            id: Date.now().toString(),
            busPlate,
            routeName,
            startedAt: Date.now(),
            endedAt: null,
            tripNumber: tripNumberToday(),
            boardings: [],
          },
        }),

      endTrip: () =>
        set((state) => ({
          activeTrip: state.activeTrip
            ? { ...state.activeTrip, endedAt: Date.now() }
            : null,
        })),

      addBoarding: (boarding) =>
        set((state) => {
          if (!state.activeTrip) return state
          const record: BoardingRecord = {
            ...boarding,
            id: Date.now().toString(),
            timestamp: Date.now(),
          }
          return {
            activeTrip: {
              ...state.activeTrip,
              boardings: [record, ...state.activeTrip.boardings],
            },
          }
        }),
    }),
    { name: 'soko-operator-trip' }
  )
)
