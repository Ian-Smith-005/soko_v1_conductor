import { Bell, Check, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useNotificationStore } from '../store/notificationStore'
import { useAuthStore } from '../store/authStore'

export default function Notifications() {
  const { notifications, markAllRead } = useNotificationStore()
  const { isDarkMode } = useAuthStore()
  const dark = isDarkMode

  const icons = {
    success: <CheckCircle size={18} className="text-[#22C55E]" />,
    info: <Info size={18} className="text-[#D4AF37]" />,
    warning: <AlertTriangle size={18} className="text-orange-400" />,
  }

  return (
    <div className={`min-h-dvh ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'} page-fade`}>
      <TopBar title="Notifications" showBack />

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>Notifications</h2>
          {notifications.some(n => !n.read) && (
            <button onClick={markAllRead} className="flex items-center gap-1 text-[#22C55E] text-sm font-medium">
              <Check size={14} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className={`rounded-2xl p-12 flex flex-col items-center ${dark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
            <Bell size={32} className="text-[#3A3A3A] mb-3" />
            <p className={`font-medium ${dark ? 'text-white' : 'text-gray-700'}`}>All caught up</p>
            <p className="text-[#9CA3AF] text-sm mt-1">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <div key={n.id} className={`rounded-2xl px-4 py-4 flex gap-3 border-l-4 transition-all ${
                n.read
                  ? `border-transparent ${dark ? 'bg-[#1F1F1F]' : 'bg-white'}`
                  : `border-[#D4AF37] ${dark ? 'bg-[#1F1F1F]' : 'bg-white shadow-sm'}`
              }`}>
                <div className="mt-0.5 flex-shrink-0">{icons[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-[#9CA3AF] text-sm mt-0.5 leading-snug">{n.message}</p>
                  <p className="text-[#6B7280] text-xs mt-1.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
