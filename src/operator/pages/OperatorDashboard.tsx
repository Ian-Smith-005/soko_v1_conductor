import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanLine, Bus, ChevronRight, CheckCircle, XCircle, AlertCircle, Play, Square } from 'lucide-react'
import { useOperatorAuthStore } from '../store/operatorAuthStore'
import { useOperatorTripStore } from '../store/operatorTripStore'
import Scanner from '../components/Scanner'
import type { BoardingRecord } from '../types'

function formatTime(epoch: number) {
  return new Date(epoch).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

function verifyPass(code: string): Omit<BoardingRecord, 'id' | 'timestamp'> {
  const isValid = code.startsWith('SOKO-') && code.length > 15
  const plans = ['Weekly', 'Daily', 'Monthly', 'Single'] as const
  const plan = plans[Math.floor(Math.random() * plans.length)]
  const tripsLeft = plan === 'Single' ? null : Math.floor(Math.random() * 13) + 1

  if (!isValid) return {
    passengerCode: code, passType: 'Single', amount: 0, tripsLeftAfter: null,
    status: 'declined', declineReason: 'Invalid or unrecognised pass code',
  }
  if (Math.random() < 0.1) return {
    passengerCode: code, passType: plan, amount: 0, tripsLeftAfter: null,
    status: 'declined', declineReason: 'Pass has expired',
  }
  return { passengerCode: code, passType: plan, amount: plan === 'Single' ? 250 : 0, tripsLeftAfter: tripsLeft, status: 'verified' }
}

// Animated counter
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value)
  const [flash, setFlash] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (value !== prev.current) {
      setFlash(true)
      setDisplay(value)
      prev.current = value
      setTimeout(() => setFlash(false), 500)
    }
  }, [value])

  return (
    <span className={`${className} transition-all duration-200 ${flash ? 'count-flash scale-110' : 'scale-100'} inline-block`}>
      {display}
    </span>
  )
}

export default function OperatorDashboard() {
  const navigate = useNavigate()
  const { operator } = useOperatorAuthStore()
  const { activeTrip, startTrip, endTrip, addBoarding } = useOperatorTripStore()
  const [showScanner, setShowScanner] = useState(false)
  const [lastResult, setLastResult] = useState<BoardingRecord | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [resultExiting, setResultExiting] = useState(false)

  const isOnDuty = !!(activeTrip && !activeTrip.endedAt)
  const verified = activeTrip?.boardings.filter(b => b.status === 'verified').length ?? 0
  const declined = activeTrip?.boardings.filter(b => b.status === 'declined').length ?? 0
  const collected = activeTrip?.boardings.filter(b => b.status === 'verified').reduce((s, b) => s + b.amount, 0) ?? 0
  const recent = activeTrip?.boardings.slice(0, 5) ?? []

  const handleScan = useCallback((code: string) => {
    setShowScanner(false)
    const result = verifyPass(code)
    addBoarding(result)
    const record: BoardingRecord = { ...result, id: Date.now().toString(), timestamp: Date.now() }
    setLastResult(record)
    setResultExiting(false)
    setShowResult(true)
    setTimeout(() => {
      setResultExiting(true)
      setTimeout(() => setShowResult(false), 300)
    }, 3500)
  }, [addBoarding])

  return (
    <div className="min-h-dvh bg-[#0A0A0A] pb-6">
      {/* Top bar */}
      <div className="px-5 pt-6 pb-4 flex items-start justify-between anim-fade-up">
        <div>
          <p className="text-[#6B7280] text-xs font-medium">{operator?.saccoName}</p>
          <h1 className="text-white text-xl font-bold mt-0.5 tracking-tight">{operator?.routeName}</h1>
        </div>
        <div className={`flex items-center gap-1.5 mt-1.5 px-3 py-1.5 rounded-full border transition-all ${
          isOnDuty ? 'bg-[#97C459]/10 border-[#97C459]/30' : 'bg-[#1F1F1F] border-[#2A2A2A]'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-[#97C459] animate-pulse' : 'bg-[#4B5563]'}`} />
          <span className={`text-xs font-semibold ${isOnDuty ? 'text-[#97C459]' : 'text-[#4B5563]'}`}>
            {isOnDuty ? 'On duty' : 'Off duty'}
          </span>
        </div>
      </div>

      {/* Trip card */}
      <div className="mx-5 mb-4 bg-[#141414] border border-[#1E1E1E] rounded-2xl p-4 flex items-center gap-3 anim-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="w-12 h-12 rounded-2xl bg-[#97C459] flex items-center justify-center flex-shrink-0">
          <Bus size={22} className="text-[#173404]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">{operator?.busPlate || 'No plate set'}</p>
          <p className="text-[#6B7280] text-xs mt-0.5">
            {isOnDuty
              ? `Trip #${activeTrip!.tripNumber} · started ${formatTime(activeTrip!.startedAt)}`
              : 'No active trip'}
          </p>
        </div>
        {isOnDuty ? (
          <button
            onClick={endTrip}
            className="flex items-center gap-1.5 text-xs text-[#F0997B] border border-[#F0997B]/30 bg-[#F0997B]/5 px-3 py-2 rounded-xl active:scale-95 transition-all"
          >
            <Square size={12} /> End trip
          </button>
        ) : (
          <button
            onClick={() => operator && startTrip(operator.busPlate, operator.routeName)}
            className="flex items-center gap-1.5 text-xs text-[#97C459] border border-[#97C459]/30 bg-[#97C459]/5 px-3 py-2 rounded-xl active:scale-95 transition-all"
          >
            <Play size={12} /> Start trip
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="mx-5 mb-5 grid grid-cols-3 gap-2.5 stagger">
        {[
          { label: 'Boarded',   value: verified,                       color: 'text-white' },
          { label: 'Collected', value: `KES ${collected.toLocaleString()}`, color: 'text-[#97C459]', small: true },
          { label: 'Declined',  value: declined,                       color: declined > 0 ? 'text-[#F0997B]' : 'text-[#4B5563]' },
        ].map(({ label, value, color, small }) => (
          <div key={label} className="bg-[#141414] border border-[#1E1E1E] rounded-2xl py-3.5 px-2 text-center anim-fade-up">
            <p className={`${small ? 'text-sm' : 'text-xl'} font-bold ${color}`}>
              {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
            </p>
            <p className="text-[#4B5563] text-[11px] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Scan button */}
      <div className="mx-5 mb-4 anim-fade-up" style={{ animationDelay: '0.15s' }}>
        <button
          onClick={() => setShowScanner(true)}
          disabled={!isOnDuty}
          className={`w-full font-bold rounded-2xl py-5 flex items-center justify-center gap-3 text-base transition-all active:scale-[0.97] ${
            isOnDuty
              ? 'bg-[#639922] text-white pulse-ring glow-green'
              : 'bg-[#1A1A1A] text-[#3A3A3A] border border-[#222]'
          }`}
        >
          <ScanLine size={24} />
          {isOnDuty ? 'Scan Passenger QR' : 'Start a trip to scan'}
        </button>
      </div>

      {/* Scan result toast */}
      {showResult && lastResult && (
        <div className={`mx-5 mb-4 rounded-2xl px-4 py-3.5 flex items-center gap-3 border ${
          lastResult.status === 'verified'
            ? 'bg-[#0d1f08] border-[#97C459]/25'
            : 'bg-[#1f0d08] border-[#F0997B]/25'
        } ${resultExiting ? 'anim-slide-down' : 'anim-slide-up'}`}>
          <div className="anim-bounce-in flex-shrink-0">
            {lastResult.status === 'verified'
              ? <CheckCircle size={22} className="text-[#97C459]" />
              : <XCircle size={22} className="text-[#F0997B]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${lastResult.status === 'verified' ? 'text-[#97C459]' : 'text-[#F0997B]'}`}>
              {lastResult.status === 'verified' ? 'Pass verified ✓' : 'Pass declined'}
            </p>
            <p className="text-[#6B7280] text-xs mt-0.5 truncate">
              {lastResult.status === 'verified'
                ? `${lastResult.passType} · ${lastResult.tripsLeftAfter !== null ? `${lastResult.tripsLeftAfter} trips left` : 'Single trip'}`
                : lastResult.declineReason}
            </p>
          </div>
        </div>
      )}

      {/* Recent boardings */}
      <div className="mx-5 mb-3 flex items-center justify-between anim-fade-up" style={{ animationDelay: '0.18s' }}>
        <p className="text-[#4B5563] text-[11px] font-semibold uppercase tracking-widest">Recent boardings</p>
        <button onClick={() => navigate('/trips')} className="flex items-center gap-0.5 text-[#97C459] text-xs font-medium">
          View all <ChevronRight size={13} />
        </button>
      </div>

      <div className="mx-5 flex flex-col gap-2 stagger">
        {recent.length === 0 ? (
          <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl py-10 flex flex-col items-center gap-2 anim-fade-up">
            <AlertCircle size={26} className="text-[#2A2A2A]" />
            <p className="text-[#3A3A3A] text-sm">No boardings yet this trip</p>
          </div>
        ) : (
          recent.map((b, i) => (
            <div key={b.id} className="bg-[#141414] border border-[#1E1E1E] rounded-2xl px-4 py-3 flex items-center gap-3 anim-fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${b.status === 'verified' ? 'bg-[#97C459]/15' : 'bg-[#F0997B]/15'}`}>
                {b.status === 'verified'
                  ? <CheckCircle size={16} className="text-[#97C459]" />
                  : <XCircle size={16} className="text-[#F0997B]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">
                  {b.status === 'verified'
                    ? `${b.passType} pass · ${b.tripsLeftAfter !== null ? `${b.tripsLeftAfter} left` : 'single'}`
                    : b.declineReason}
                </p>
                <p className="text-[#4B5563] text-xs mt-0.5">{formatTime(b.timestamp)}</p>
              </div>
              <span className={`text-xs font-semibold flex-shrink-0 ${b.status === 'verified' ? 'text-[#97C459]' : 'text-[#F0997B]'}`}>
                {b.status === 'verified' ? 'OK' : 'Denied'}
              </span>
            </div>
          ))
        )}
      </div>

      {showScanner && <Scanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  )
}
