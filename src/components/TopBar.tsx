import { Bell, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showNotification?: boolean
}

export default function TopBar({ title, showBack = false, showNotification = false }: TopBarProps) {
  const navigate = useNavigate()
  const { isDarkMode } = useAuthStore()
  const { notifications } = useNotificationStore()
  const unread = notifications.filter(n => !n.read).length
  const dark = isDarkMode

  return (
    <div className={`flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40 ${
      dark ? 'bg-[#121212] border-[#2A2A2A]' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-1 font-medium text-sm min-h-[48px] pr-2 ${dark ? 'text-[#22C55E]' : 'text-[#22C55E]'}`}
            aria-label="Go back"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}
        {title && <h1 className={`text-base font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h1>}
      </div>
      {showNotification && (
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-10 h-10 bg-[#1F1F1F] rounded-xl flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-white" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#121212]" />
          )}
        </button>
      )}
    </div>
  )
}
