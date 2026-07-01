import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import ToastContainer from './Toast'
import AIChat from './AIChat'
import { useAuthStore } from '../store/authStore'

export default function Layout() {
  const { isDarkMode } = useAuthStore()
  return (
    <div className={`flex flex-col min-h-dvh ${isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'}`}>
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <BottomNav />
      <ToastContainer />
      <AIChat />
    </div>
  )
}
