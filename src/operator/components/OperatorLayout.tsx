import { Outlet, useLocation } from 'react-router-dom'
import OperatorBottomNav from './OperatorBottomNav'
import { useEffect, useState } from 'react'

export default function OperatorLayout() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  // Re-trigger animation on route change
  useEffect(() => {
    setVisible(false)
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-dvh bg-[#0A0A0A]">
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <div key={location.pathname} className={visible ? 'anim-fade-up' : 'opacity-0'}>
          <Outlet />
        </div>
      </main>
      <OperatorBottomNav />
    </div>
  )
}
