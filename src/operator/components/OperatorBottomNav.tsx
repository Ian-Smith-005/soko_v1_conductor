import { NavLink, useLocation } from 'react-router-dom'
import { ScanLine, ListChecks, Route as RouteIcon, User } from 'lucide-react'
import { useEffect, useState } from 'react'

const tabs = [
  { path: '/dashboard', label: 'Scan',    Icon: ScanLine   },
  { path: '/trips',     label: 'Log',     Icon: ListChecks },
  { path: '/route',     label: 'Route',   Icon: RouteIcon  },
  { path: '/profile',   label: 'Profile', Icon: User       },
]

export default function OperatorBottomNav() {
  const location = useLocation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setMounted(true)) }, [])

  return (
    <nav
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0F0F0F]/95 backdrop-blur-md border-t border-[#1E1E1E] z-50 transition-transform duration-300 ${
        mounted ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-stretch justify-around gap-1 px-2 pt-2 pb-1 safe-pb">
        {tabs.map(({ path, label, Icon }, i) => {
          const isActive = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl relative transition-all duration-200 ${
                isActive
                  ? 'bg-[#97C459]/10 text-[#97C459]'
                  : 'text-[#6B7280] hover:text-[#9CA3AF]'
              }`}
              aria-label={label}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Proportional top indicator — spans the icon width, glowing */}
              <span
                className={`absolute top-0 left-1/2 -translate-x-1/2 h-[3px] rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-10 bg-[#97C459] nav-indicator'
                    : 'w-0 bg-transparent'
                }`}
              />
              <span
                className={`transition-all duration-200 ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              >
                {path === '/dashboard' && isActive ? (
                  <span className="relative flex">
                    <Icon size={20} />
                    <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#97C459]" />
                  </span>
                ) : (
                  <Icon size={20} />
                )}
              </span>
              <span
                className={`text-[10px] transition-all duration-200 ${
                  isActive ? 'font-bold text-[#97C459]' : 'font-medium text-[#6B7280]'
                }`}
              >
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
