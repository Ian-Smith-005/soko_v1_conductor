import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus, ScanLine, Eye, EyeOff, Bus, ChevronRight } from 'lucide-react'
import { useOperatorAuthStore } from '../store/operatorAuthStore'
import { ROUTES } from '../../utils/mockData'

type Tab = 'signin' | 'register'

export default function OperatorAuth() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useOperatorAuthStore()
  const [tab, setTab] = useState<Tab>('signin')
  const [mounted, setMounted] = useState(false)

  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [saccoName, setSaccoName] = useState('')
  const [routeId, setRouteId] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) { navigate('/dashboard', { replace: true }); return }
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [isAuthenticated, navigate])

  const handleSignIn = async () => {
    if (pin.length < 4) { setError('PIN must be at least 4 digits'); return }
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 750))
    setLoading(false)
    login({ id: '1', pin, saccoName: 'Nairobi Express SACCO', routeId: '1', routeName: 'CBD – JKIA', busPlate: 'KCB 442T', conductorName: 'Operator' })
    navigate('/dashboard', { replace: true })
  }

  const handleRegister = async () => {
    if (!saccoName.trim() || !routeId) return
    setRegLoading(true)
    await new Promise(r => setTimeout(r, 750))
    const route = ROUTES.find(r => r.id === routeId)
    login({ id: Date.now().toString(), pin: '0000', saccoName, routeId, routeName: route?.name ?? '', busPlate: '', conductorName: 'Operator' })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-[#0A0A0A] flex flex-col px-5 py-10 overflow-hidden">

      {/* Logo */}
      <div className={`flex flex-col items-center mb-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="w-20 h-20 rounded-3xl bg-[#97C459] flex items-center justify-center mb-4 glow-green">
          <Bus size={36} className="text-[#173404]" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Soko Transit</h1>
        <p className="text-[#6B7280] text-sm mt-1">Conductor Platform</p>
      </div>

      {/* Tab switcher */}
      <div
        className={`flex bg-[#1A1A1A] rounded-2xl p-1 mb-5 border border-[#222] transition-all duration-500 delay-75 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {(['signin', 'register'] as Tab[]).map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === t ? 'bg-[#97C459] text-[#173404] shadow-sm' : 'text-[#6B7280]'
            }`}
          >
            {i === 0 ? <LogIn size={14} /> : <UserPlus size={14} />}
            {i === 0 ? 'Sign In' : 'Register'}
          </button>
        ))}
      </div>

      {/* Card */}
      <div
        className={`bg-[#141414] border border-[#222] rounded-3xl p-6 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {tab === 'signin' ? (
          <div className="anim-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <ScanLine size={18} className="text-[#97C459]" />
              <h2 className="text-base font-bold text-white">Operator Sign In</h2>
            </div>
            <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
              Enter your operator PIN to access the boarding dashboard.
            </p>

            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              Operator PIN
            </label>
            <div className="relative mb-2">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, '')); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                placeholder="● ● ● ● ● ●"
                maxLength={6}
                className="w-full px-4 py-4 pr-12 bg-[#0A0A0A] text-white placeholder-[#3A3A3A] rounded-xl text-lg tracking-[0.4em] font-bold border border-[#2A2A2A] focus:outline-none focus:border-[#639922] focus:ring-1 focus:ring-[#639922]/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPin(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors"
              >
                {showPin ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {error && <p className="text-[#F0997B] text-xs mb-3 pl-1">{error}</p>}
            {!error && <div className="mb-5" />}

            <button
              onClick={handleSignIn}
              disabled={loading || pin.length < 4}
              className="w-full py-4 bg-[#97C459] text-[#173404] font-bold rounded-2xl text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] glow-green"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-[#173404]/30 border-t-[#173404] rounded-full spin" /> Signing in…</>
              ) : (
                <><ScanLine size={16} /> Open Dashboard</>
              )}
            </button>
          </div>
        ) : (
          <div className="anim-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <UserPlus size={18} className="text-[#97C459]" />
              <h2 className="text-base font-bold text-white">Register as Conductor</h2>
            </div>
            <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
              Select your SACCO and assigned route to begin.
            </p>

            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              SACCO / Company Name
            </label>
            <input
              type="text"
              value={saccoName}
              onChange={e => setSaccoName(e.target.value)}
              placeholder="e.g. Nairobi Express SACCO"
              className="w-full px-4 py-3.5 bg-[#0A0A0A] text-white placeholder-[#3A3A3A] rounded-xl text-sm border border-[#2A2A2A] focus:outline-none focus:border-[#639922] focus:ring-1 focus:ring-[#639922]/40 transition-all mb-4"
            />

            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              Assigned Route
            </label>
            <select
              value={routeId}
              onChange={e => setRouteId(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0A0A0A] text-white rounded-xl text-sm border border-[#2A2A2A] focus:outline-none focus:border-[#639922] mb-6 appearance-none"
            >
              <option value="">Select a route…</option>
              {ROUTES.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <button
              onClick={handleRegister}
              disabled={regLoading || !saccoName.trim() || !routeId}
              className="w-full py-4 bg-[#97C459] text-[#173404] font-bold rounded-2xl text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {regLoading ? (
                <><span className="w-4 h-4 border-2 border-[#173404]/30 border-t-[#173404] rounded-full spin" /> Setting up…</>
              ) : (
                <>Register & Open Dashboard <ChevronRight size={15} /></>
              )}
            </button>
          </div>
        )}
      </div>

      <p className={`text-center text-[#4B5563] text-xs mt-8 transition-all duration-500 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        Soko Transit Conductor Platform · v1.0
      </p>
    </div>
  )
}
