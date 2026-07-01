import { NavLink } from 'react-router-dom'
import { Home, MapPin, QrCode, Wallet, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const tabs = [
  { path: '/app', label: 'Home', Icon: Home },
  { path: '/app/routes', label: 'Routes', Icon: MapPin },
  { path: '/app/qr', label: 'QR Pass', Icon: QrCode },
  { path: '/app/wallet', label: 'Wallet', Icon: Wallet },
  { path: '/app/profile', label: 'Profile', Icon: User },
]

export default function BottomNav() {
  const { isDarkMode } = useAuthStore()
  const dark = isDarkMode

  return (
    <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 ${dark ? 'bg-[#121212] border-t border-[#2A2A2A]' : 'bg-white border-t border-gray-200'}`}>
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/app'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[48px] ${
                isActive ? 'text-[#22C55E]' : dark ? 'text-[#6B7280]' : 'text-gray-400'
              }`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                {path === '/app/qr' ? (
                  <span className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#22C55E]' : ''}`}>
                    <Icon size={20} className={isActive ? 'text-white' : dark ? 'text-[#6B7280]' : 'text-gray-400'} />
                  </span>
                ) : (
                  <Icon size={20} />
                )}
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
