import { useNavigate } from 'react-router-dom'
import { Bell, CreditCard, QrCode, MapPin, Clock, Star, Bus, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { usePassStore } from '../store/passStore'
import { useWalletStore } from '../store/walletStore'
import { useNotificationStore } from '../store/notificationStore'
import { getGreeting } from '../utils/mockData'


export default function Home() {
  const navigate = useNavigate()
  const { user, isDarkMode } = useAuthStore()
  const { activePass } = usePassStore()
  const { balance, loyaltyPoints } = useWalletStore()
  const { notifications } = useNotificationStore()
  const unread = notifications.filter(n => !n.read).length

  const dark = isDarkMode

  const progressPercent = activePass
    ? Math.round((activePass.tripsLeft / activePass.totalTrips) * 100)
    : 0

  const quickActions = [
    { label: 'Buy Pass', Icon: CreditCard, color: dark ? 'bg-[#1F1F1F]' : 'bg-green-50', iconColor: 'text-[#22C55E]', path: '/routes' },
    { label: 'My QR', Icon: QrCode, color: dark ? 'bg-[#1F1F1F]' : 'bg-blue-50', iconColor: 'text-blue-400', path: '/qr' },
    { label: 'Routes', Icon: MapPin, color: dark ? 'bg-[#1F1F1F]' : 'bg-orange-50', iconColor: 'text-orange-400', path: '/routes' },
    { label: 'History', Icon: Clock, color: dark ? 'bg-[#1F1F1F]' : 'bg-purple-50', iconColor: 'text-purple-400', path: '/wallet' },
  ]

  return (
    <div className={`min-h-dvh ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'} page-fade`}>
      {/* Fixed top bar */}
      <div className={`sticky top-0 z-40 px-5 pt-4 pb-4 flex items-center justify-between ${dark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <img src="/soko-logo.jpeg" alt="Soko" className="w-9 h-9 rounded-full border-2 border-[#D4AF37] object-cover" />
          <div>
            <p className={`text-xs ${dark ? 'text-[#9CA3AF]' : 'text-gray-500'}`}>{getGreeting()}</p>
            <h1 className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              {user?.name ?? 'Guest'} 👋
            </h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/app/notifications')}
          className="relative w-11 h-11 bg-[#1F1F1F] rounded-xl flex items-center justify-center shadow-md"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-white" />
          {unread > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1F1F1F]" />
          )}
        </button>
      </div>

      <div className="px-4 pt-2 space-y-4">
        {/* Active Pass Card */}
        {activePass ? (
          <div
            className="rounded-2xl p-5 cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0f2010 100%)' }}
            onClick={() => navigate('/app/qr')}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#22C55E]/20 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-[#22C55E]" />
              </div>
              <div>
                <p className="text-[#9CA3AF] text-xs">{activePass.plan} Pass</p>
                <p className="text-white font-bold text-sm">{activePass.route}</p>
              </div>
              <span className="ml-auto text-xs bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-full font-medium">Active</span>
            </div>
            <div className="mb-3">
              <span className="text-[#22C55E] text-4xl font-bold">{activePass.tripsLeft}</span>
              <span className="text-[#9CA3AF] text-sm ml-1">/ {activePass.totalTrips} trips left</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#9CA3AF] text-xs">Tap to view QR</span>
              <span className="text-[#9CA3AF] text-xs">Valid until {activePass.validUntil}</span>
            </div>
            <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
              <div className="h-full bg-[#22C55E] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-5 bg-[#1F1F1F] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform border border-[#D4AF37]/20"
            onClick={() => navigate('/app/routes')}
          >
            <div>
              <p className="text-[#9CA3AF] text-sm">No active pass</p>
              <p className="text-white font-semibold mt-1">Get your first pass →</p>
            </div>
            <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-white" />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(({ label, Icon, color, iconColor, path }) => (
            <button key={label} onClick={() => navigate(path)} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-transform border ${dark ? 'border-[#2A2A2A]' : 'border-transparent'}`}>
                <Icon size={22} className={iconColor} />
              </div>
              <span className={`text-xs font-medium ${dark ? 'text-[#9CA3AF]' : 'text-gray-600'}`}>{label}</span>
            </button>
          ))}
        </div>

        {/* Wallet Card */}
        <div className="bg-[#1F1F1F] rounded-2xl p-5 border border-[#D4AF37]/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-[#9CA3AF]" />
              <span className="text-[#9CA3AF] text-sm">Wallet Balance</span>
            </div>
            <button onClick={() => navigate('/app/wallet')} className="text-[#22C55E] text-sm font-semibold">+ Top Up</button>
          </div>
          <p className="text-white text-2xl font-bold">KES {balance.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Star size={14} className="text-[#FACC15]" fill="#FACC15" />
            <span className="text-[#9CA3AF] text-sm">{loyaltyPoints} loyalty points</span>
          </div>
        </div>

        {/* Recent Trips */}
        <div>
          <h2 className={`font-bold text-base mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Recent Trips</h2>
          <div className={`rounded-2xl p-8 flex flex-col items-center justify-center ${dark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${dark ? 'bg-[#2A2A2A]' : 'bg-gray-100'}`}>
              <MapPin size={24} className={dark ? 'text-[#3A3A3A]' : 'text-gray-400'} />
            </div>
            <p className={`font-medium ${dark ? 'text-white' : 'text-gray-700'}`}>No trips yet</p>
            <p className={`text-sm text-center mt-1 ${dark ? 'text-[#6B7280]' : 'text-gray-400'}`}>Your trip history appears here</p>
          </div>
        </div>

        {/* Operator Login */}
        <button
          onClick={() => navigate('/operator')}
          className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium border ${
            dark ? 'bg-[#1F1F1F] border-[#2A2A2A] text-[#9CA3AF]' : 'bg-white border-gray-200 text-gray-500'
          }`}
        >
          <Bus size={16} />
          Operator / Conductor Login
        </button>

        <div className="h-4" />
      </div>


    </div>
  )
}
