import { MapPin, Clock, Navigation, TrendingUp, Banknote } from 'lucide-react'
import { useOperatorAuthStore } from '../store/operatorAuthStore'
import { useOperatorTripStore } from '../store/operatorTripStore'
import { ROUTES } from '../../utils/mockData'

export default function OperatorRoute() {
  const { operator } = useOperatorAuthStore()
  const { activeTrip } = useOperatorTripStore()
  const route = ROUTES.find(r => r.id === operator?.routeId)

  const boarded  = activeTrip?.boardings.filter(b => b.status === 'verified').length ?? 0
  const declined = activeTrip?.boardings.filter(b => b.status === 'declined').length ?? 0
  const collected = activeTrip?.boardings.filter(b => b.status === 'verified').reduce((s, b) => s + b.amount, 0) ?? 0
  const rate = (boarded + declined) > 0 ? Math.round((boarded / (boarded + declined)) * 100) : null

  const details = [
    { Icon: MapPin,     label: 'From',     value: route?.from     ?? '—' },
    { Icon: MapPin,     label: 'To',       value: route?.to       ?? '—' },
    { Icon: Clock,      label: 'Duration', value: route?.duration ?? '—' },
    { Icon: Navigation, label: 'Distance', value: route?.distance ?? '—' },
  ]

  const fares = [
    { plan: 'Single trip',  fare: route?.price ?? 0 },
    { plan: 'Daily pass',   fare: (route?.price ?? 0) * 2 },
    { plan: 'Weekly pass',  fare: (route?.price ?? 0) * 6 },
    { plan: 'Monthly pass', fare: (route?.price ?? 0) * 22 },
  ]

  return (
    <div className="min-h-dvh bg-[#0A0A0A]">
      <div className="px-5 pt-6 pb-4 anim-fade-up">
        <h1 className="text-white text-xl font-bold tracking-tight">My Route</h1>
        <p className="text-[#6B7280] text-sm mt-0.5">{operator?.saccoName}</p>
      </div>

      {/* Route card */}
      <div className="mx-5 mb-4 bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5 anim-fade-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#F6DA61]/12 border border-[#F6DA61]/25 flex items-center justify-center">
            <Navigation size={20} className="text-[#F6DA61]" />
          </div>
          <div>
            <p className="text-white font-bold">{route?.name ?? operator?.routeName}</p>
            <p className="text-[#6B7280] text-xs mt-0.5">Assigned route</p>
          </div>
        </div>

        <div className="space-y-3.5 stagger">
          {details.map(({ Icon, label, value }, i) => (
            <div key={label} className="flex items-center gap-3 anim-slide-right" style={{ animationDelay: `${0.06 + i * 0.04}s` }}>
              <Icon size={14} className="text-[#3A3A3A] flex-shrink-0" />
              <span className="text-[#4B5563] text-sm w-20 flex-shrink-0">{label}</span>
              <span className="text-white text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 mb-4 anim-fade-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-[#4B5563] text-[11px] font-semibold uppercase tracking-widest mb-3">Today's performance</p>
        <div className="grid grid-cols-2 gap-2.5 stagger">
          {[
            { value: String(boarded),               label: 'Passengers boarded', color: 'text-white' },
            { value: `KES ${collected.toLocaleString()}`, label: 'Single-trip collected', color: 'text-[#97C459]' },
            { value: String(activeTrip?.tripNumber ?? 0), label: 'Trips run today', color: 'text-white' },
            { value: rate !== null ? `${rate}%` : '—',  label: 'Pass success rate', color: 'text-[#97C459]' },
          ].map(({ value, label, color }, i) => (
            <div key={label} className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-4 anim-fade-up" style={{ animationDelay: `${0.12 + i * 0.04}s` }}>
              <div className="flex items-center gap-1.5 mb-1">
                {i === 3 && <TrendingUp size={13} className="text-[#97C459]" />}
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
              <p className="text-[#4B5563] text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fares */}
      <div className="mx-5 mb-8 bg-[#141414] border border-[#1E1E1E] rounded-2xl p-4 anim-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Banknote size={16} className="text-[#6B7280]" />
          <p className="text-white text-sm font-semibold">Fares on this route</p>
        </div>
        <div className="space-y-3 stagger">
          {fares.map(({ plan, fare }, i) => (
            <div key={plan} className="flex justify-between items-center anim-slide-right" style={{ animationDelay: `${0.22 + i * 0.04}s` }}>
              <span className="text-[#6B7280] text-sm">{plan}</span>
              <span className="text-[#97C459] text-sm font-semibold">KES {fare.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
