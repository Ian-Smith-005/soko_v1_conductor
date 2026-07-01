import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isDarkMode: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
  toggleDarkMode: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDarkMode: true,

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.isDarkMode
          if (next) {
            document.getElementById('root')?.classList.add('light-mode')
            document.body.classList.add('light-mode')
          } else {
            document.getElementById('root')?.classList.remove('light-mode')
            document.body.classList.remove('light-mode')
          }
          return { isDarkMode: next }
        }),
    }),
    { name: 'soko-auth' }
  )
)
