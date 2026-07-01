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
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#111111] border-t border-[#222222] z-50 transition-transform duration-300 ${
        mounted ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-pb">
        {tabs.map(({ path, label, Icon }, i) => {
          const isActive = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[52px] relative"
              aria-label={label}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span
                className={`transition-all duration-200 ${isActive ? 'text-[#97C459]' : 'text-[#4B5563]'}`}
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
              <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-[#97C459]' : 'text-[#4B5563]'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#97C459] anim-scale-in" />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
