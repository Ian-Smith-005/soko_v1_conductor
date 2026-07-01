import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useNotificationStore } from '../store/notificationStore'

export default function ToastContainer() {
  const { toasts, dismissToast } = useNotificationStore()

  const icons = {
    success: <CheckCircle size={17} className="text-[#22C55E] flex-shrink-0" />,
    error: <XCircle size={17} className="text-red-400 flex-shrink-0" />,
    info: <Info size={17} className="text-[#D4AF37] flex-shrink-0" />,
  }

  const borders = { success: 'border-[#22C55E]/40', error: 'border-red-400/40', info: 'border-[#D4AF37]/40' }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[380px] z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 bg-[#1F1F1F] border ${borders[t.type]} rounded-2xl px-4 py-3.5 shadow-xl pointer-events-auto ${t.exiting ? 'toast-exit' : 'toast-enter'}`}
        >
          {icons[t.type]}
          <p className="text-white text-sm flex-1 leading-snug">{t.message}</p>
          <button onClick={() => dismissToast(t.id)} className="text-[#6B7280] hover:text-white ml-1">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
