import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '../types'

interface NotificationState {
  notifications: Notification[]
  toasts: { id: string; message: string; type: 'success' | 'error' | 'info'; exiting?: boolean }[]
  addNotification: (n: Omit<Notification, 'id' | 'read'>) => void
  markAllRead: () => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  dismissToast: (id: string) => void
  unreadCount: () => number
}

const seed: Notification[] = [
  { id: '1', title: 'Welcome to Soko Transit!', message: 'Your account is ready. Buy a pass to start riding.', time: 'Just now', read: false, type: 'success' },
  { id: '2', title: 'Routes updated', message: 'CBD–Rongai schedule has changed. Check the Routes page.', time: '2h ago', read: false, type: 'info' },
]

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: seed,
      toasts: [],

      addNotification: (n) =>
        set((state) => ({
          notifications: [{ ...n, id: Date.now().toString(), read: false }, ...state.notifications],
        })),

      markAllRead: () =>
        set((state) => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) })),

      showToast: (message, type = 'info') => {
        const id = Date.now().toString()
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.map(t => t.id === id ? { ...t, exiting: true } : t) }))
          setTimeout(() => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })), 350)
        }, 3000)
      },

      dismissToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),

      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    { name: 'soko-notifications', partialize: (s) => ({ notifications: s.notifications }) }
  )
)
