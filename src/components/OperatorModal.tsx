import { Bus, ExternalLink, X } from 'lucide-react'

interface Props { onClose: () => void }

export default function OperatorModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center px-6" onClick={onClose}>
      <div className="bg-[#1F1F1F] rounded-3xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center">
            <Bus size={22} className="text-[#D4AF37]" />
          </div>
          <button onClick={onClose} className="text-[#6B7280]"><X size={20} /></button>
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Operator / Conductor Access</h3>
        <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
          Conductor and operator access is available on a separate platform. Visit the link below to continue.
        </p>
        <a
          href="https://conductor.sokotransit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0A0A0A] font-bold py-3.5 rounded-xl"
        >
          <ExternalLink size={16} />
          conductor.sokotransit.com
        </a>
        <button onClick={onClose} className="w-full mt-3 py-3 text-[#9CA3AF] text-sm">Dismiss</button>
      </div>
    </div>
  )
}
