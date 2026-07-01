import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Share2, Clock, Zap, ShoppingBag } from 'lucide-react'
import TopBar from '../components/TopBar'
import { usePassStore } from '../store/passStore'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { formatCountdown } from '../utils/mockData'

export default function QRPass() {
  const { activePass, activateQR } = usePassStore()
  const { isDarkMode } = useAuthStore()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const dark = isDarkMode

  const isQRExpired = activePass?.expiresAt ? Date.now() > activePass.expiresAt : false
  const isQRActive = activePass?.expiresAt && !isQRExpired

  // Countdown timer
  useEffect(() => {
    if (!activePass?.expiresAt) return
    const update = () => setTimeLeft(Math.max(0, activePass.expiresAt! - Date.now()))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [activePass?.expiresAt])

  // Draw QR
  useEffect(() => {
    if (!activePass || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, activePass.passCode, {
      width: 220, margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
    })
  }, [activePass])

  const handleCopy = async () => {
    if (!activePass) return
    await navigator.clipboard.writeText(activePass.passCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (!activePass) return
    if (navigator.share) {
      await navigator.share({ title: 'My Soko Transit Pass', text: `Pass Code: ${activePass.passCode}` })
    }
  }

  const handleActivate = () => {
    activateQR()
  }

  if (!activePass) {
    return (
      <div className={`min-h-dvh flex flex-col ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'}`}>
        <TopBar title="QR Pass" showBack />
        <div className="flex-1 flex items-center justify-center flex-col gap-4 px-6 text-center page-fade">
          <div className="w-20 h-20 bg-[#1F1F1F] rounded-3xl flex items-center justify-center">
            <Zap size={32} className="text-[#3A3A3A]" />
          </div>
          <p className="text-white font-semibold text-lg">No active pass</p>
          <p className="text-[#6B7280] text-sm">Purchase a pass to get your QR code</p>
          <button onClick={() => navigate('/app/routes')} className="mt-2 flex items-center gap-2 bg-[#22C55E] text-white font-semibold px-6 py-3.5 rounded-xl">
            <ShoppingBag size={16} /> Buy a Pass
          </button>
        </div>
      </div>
    )
  }

  const tripsPercent = Math.round((activePass.tripsLeft / activePass.totalTrips) * 100)
  const ringDashoffset = isQRActive ? (283 * (1 - timeLeft / 3600000)) : 283

  return (
    <div className={`min-h-dvh flex flex-col ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'} page-fade`}>
      <TopBar title="QR Pass" showBack />

      <div className="px-4 pt-6 flex flex-col items-center">
        <h2 className={`text-xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>My QR Pass</h2>
        <p className="text-[#9CA3AF] text-sm mb-5">Show this to the conductor when boarding</p>

        {/* QR Card */}
        <div className="w-full bg-[#1F1F1F] rounded-2xl overflow-hidden shadow-card-lg">
          <div className="p-6 flex flex-col items-center">

            {/* Countdown ring + QR */}
            <div className="relative">
              {isQRActive && (
                <svg className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]" viewBox="0 0 300 300">
                  <circle cx="150" cy="150" r="145" fill="none" stroke="#2A2A2A" strokeWidth="4" />
                  <circle
                    cx="150" cy="150" r="145" fill="none" stroke="#22C55E" strokeWidth="4"
                    strokeDasharray="283" strokeDashoffset={ringDashoffset}
                    strokeLinecap="round" transform="rotate(-90 150 150)"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
              )}

              <div className={`bg-white rounded-2xl p-4 relative ${isQRExpired ? 'opacity-40 grayscale' : ''}`}>
                <canvas ref={canvasRef} className="block" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow">
                    <img src="/soko-logo.jpeg" className="w-8 h-8 rounded-full object-cover" alt="logo" />
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown / Expired / Activate */}
            <div className="mt-5 text-center">
              {isQRExpired ? (
                <p className="text-red-400 text-sm font-medium">QR Expired — stored in pass history</p>
              ) : isQRActive ? (
                <div className="flex items-center gap-2 text-[#22C55E]">
                  <Clock size={15} />
                  <span className="font-mono font-bold text-lg">{formatCountdown(timeLeft)}</span>
                  <span className="text-sm">remaining</span>
                </div>
              ) : (
                <button
                  onClick={handleActivate}
                  className="bg-[#22C55E] text-white font-semibold px-6 py-2.5 rounded-xl text-sm active:scale-95 transition-transform"
                >
                  Activate QR (1 hour)
                </button>
              )}
            </div>

            <p className="text-[#6B7280] text-xs mt-3 font-mono tracking-wider">{activePass.passCode}</p>

            <div className="flex gap-3 mt-4">
              <button onClick={handleCopy} className="flex items-center gap-2 px-5 py-2.5 bg-[#2A2A2A] text-white text-sm font-medium rounded-xl active:scale-95 transition-transform">
                <Copy size={15} />{copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-5 py-2.5 bg-[#2A2A2A] text-white text-sm font-medium rounded-xl active:scale-95 transition-transform">
                <Share2 size={15} /> Share
              </button>
            </div>
          </div>

          {/* Tear line */}
          <div className="flex items-center px-2">
            <div className="w-5 h-5 rounded-full bg-[#0A0A0A]" />
            <div className="flex-1 border-t-2 border-dashed border-[#3A3A3A]" />
            <div className="w-5 h-5 rounded-full bg-[#0A0A0A]" />
          </div>

          {/* Pass details */}
          <div className="px-6 py-5 space-y-3.5">
            {[
              { label: 'Route', value: activePass.route },
              { label: 'Plan', value: activePass.plan },
              { label: 'Trips Left', value: `${activePass.tripsLeft} / ${activePass.totalTrips}`, green: true },
              { label: 'Valid Until', value: activePass.validUntil },
            ].map(({ label, value, green }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-[#6B7280] text-sm">{label}</span>
                <span className={`text-sm ${green ? 'text-[#22C55E] font-bold' : 'text-white'}`}>{value}</span>
              </div>
            ))}
            <div className="pt-1">
              <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
                <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${tripsPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="h-8" />
      </div>
    </div>
  )
}
