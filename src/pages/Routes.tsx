import { useState, useMemo } from 'react'
import { List, Map as MapIcon, Search, MapPin, Clock, X } from 'lucide-react'
import TopBar from '../components/TopBar'
import { ROUTES, PASS_PLANS, generatePassCode } from '../utils/mockData'
import { useAuthStore } from '../store/authStore'
import { usePassStore } from '../store/passStore'
import { useWalletStore } from '../store/walletStore'
import { useNotificationStore } from '../store/notificationStore'
import type { Route } from '../types'
import { useNavigate } from 'react-router-dom'

type View = 'list' | 'map'

export default function Routes() {
  const [view, setView] = useState<View>('list')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Route | null>(null)
  const { isDarkMode } = useAuthStore()
  const dark = isDarkMode

  const filtered = useMemo(
    () => ROUTES.filter(r =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.from.toLowerCase().includes(query.toLowerCase()) ||
      r.to.toLowerCase().includes(query.toLowerCase())
    ), [query]
  )

  return (
    <div className={`min-h-dvh flex flex-col ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'} page-fade`}>
      <TopBar title="Routes" showBack />
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Routes</h2>
            <p className={`text-sm ${dark ? 'text-[#9CA3AF]' : 'text-gray-500'}`}>Find your daily route</p>
          </div>
          <div className={`flex border rounded-xl overflow-hidden ${dark ? 'border-[#2A2A2A] bg-[#1F1F1F]' : 'border-gray-200 bg-white shadow-sm'}`}>
            {(['list', 'map'] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                  view === v ? 'bg-[#121212] text-white' : dark ? 'text-[#9CA3AF]' : 'text-gray-500'
                }`}>
                {v === 'list' ? <List size={15} /> : <MapIcon size={15} />}
                {v === 'list' ? 'List' : 'Map'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search route, area, or destination…"
            className="w-full pl-10 pr-4 py-3.5 bg-[#1F1F1F] text-white placeholder-[#6B7280] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
              <X size={15} />
            </button>
          )}
        </div>

        {view === 'list'
          ? <RouteList routes={filtered} onSelect={setSelected} dark={dark} />
          : <RouteMapView />}
      </div>

      {selected && <BuyPassModal route={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function RouteList({ routes, onSelect, dark }: { routes: Route[]; onSelect: (r: Route) => void; dark: boolean }) {
  return (
    <div className="space-y-3">
      {routes.map(route => (
        <div key={route.id} className={`rounded-2xl p-4 ${dark ? 'bg-[#1F1F1F]' : 'bg-white shadow-sm'}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                <MapPin size={17} className="text-[#22C55E]" />
              </div>
              <div>
                <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{route.name}</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">{route.from} → {route.to}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={11} className="text-[#6B7280]" />
                  <span className="text-[#6B7280] text-xs">{route.duration} · {route.distance}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#22C55E] font-bold text-base">KES {route.price}</p>
              <p className="text-[#6B7280] text-xs">per trip</p>
            </div>
          </div>
          <button
            onClick={() => onSelect(route)}
            className="w-full text-[#22C55E] text-xs font-semibold py-2 rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/5"
          >
            Get Pass →
          </button>
        </div>
      ))}
      {routes.length === 0 && (
        <div className="text-center py-12">
          <MapPin size={32} className="mx-auto mb-2 text-[#3A3A3A]" />
          <p className="text-[#9CA3AF]">No routes found</p>
        </div>
      )}
    </div>
  )
}

function RouteMapView() {
  const [MapComp, setMapComp] = useState<React.ComponentType | null>(null)
  useState(() => {
    import('./RoutesMap').then(m => setMapComp(() => m.default))
  })
  if (!MapComp) return (
    <div className="h-[480px] bg-[#1F1F1F] rounded-2xl flex items-center justify-center">
      <p className="text-[#9CA3AF] text-sm">Loading map…</p>
    </div>
  )
  return <MapComp />
}

function BuyPassModal({ route, onClose }: { route: Route; onClose: () => void }) {
  const [plan, setPlan] = useState(PASS_PLANS[1])
  const { addPass } = usePassStore()
  const { balance, deduct } = useWalletStore()
  const { showToast } = useNotificationStore()
  const navigate = useNavigate()

  const price = route.price * plan.multiplier
  const canAfford = balance >= price

  const handleBuy = () => {
    if (!canAfford) { showToast('Insufficient balance. Top up your wallet.', 'error'); return }
    const now = Date.now()
    addPass({
      id: now.toString(),
      passCode: generatePassCode(),
      route: route.name,
      plan: plan.label as 'Daily' | 'Weekly' | 'Monthly',
      tripsLeft: plan.trips,
      totalTrips: plan.trips,
      validUntil: new Date(now + plan.multiplier * 24 * 60 * 60 * 1000).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }),
      isActive: true,
      price,
    })
    deduct(price, `${plan.label} Pass – ${route.name}`)
    showToast(`${plan.label} pass purchased! View your QR.`, 'success')
    onClose()
    navigate('/app/qr')
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={onClose}>
      <div className="w-full max-w-[430px] mx-auto bg-[#121212] rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-white font-bold text-lg">Buy Pass — {route.name}</h3>
          <button onClick={onClose} className="text-[#6B7280]"><X size={20} /></button>
        </div>

        <p className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2">Select Plan</p>
        <div className="grid grid-cols-3 gap-2 mb-5">
          {PASS_PLANS.map(p => (
            <button key={p.id} onClick={() => setPlan(p)}
              className={`py-3 rounded-xl border text-center transition-all ${
                plan.id === p.id ? 'border-[#22C55E] bg-[#22C55E]/5' : 'border-[#2A2A2A] bg-[#1F1F1F]'
              }`}>
              <p className="text-white text-sm font-bold">{p.label}</p>
              <p className="text-[#9CA3AF] text-xs">{p.trips} trips</p>
            </button>
          ))}
        </div>

        <div className={`rounded-xl p-4 mb-5 ${canAfford ? 'bg-[#22C55E]/5 border border-[#22C55E]/20' : 'bg-red-500/5 border border-red-500/20'}`}>
          <div className="flex justify-between text-sm">
            <span className="text-[#9CA3AF]">Price</span>
            <span className="text-white font-bold">KES {price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-[#9CA3AF]">Wallet balance</span>
            <span className={`font-medium ${canAfford ? 'text-[#22C55E]' : 'text-red-400'}`}>KES {balance.toLocaleString()}</span>
          </div>
        </div>

        <button onClick={handleBuy} disabled={!canAfford}
          className="w-full py-4 bg-[#22C55E] text-white font-semibold rounded-xl disabled:opacity-40">
          {canAfford ? `Confirm Purchase – KES ${price.toLocaleString()}` : 'Insufficient Balance'}
        </button>
        {!canAfford && (
          <button onClick={() => { onClose(); navigate('/app/wallet') }} className="w-full mt-2 py-3 text-[#22C55E] text-sm font-medium">
            Top Up Wallet
          </button>
        )}
      </div>
    </div>
  )
}
