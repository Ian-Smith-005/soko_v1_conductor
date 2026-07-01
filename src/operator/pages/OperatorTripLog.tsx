import { useState } from 'react'
import { CheckCircle, XCircle, ClipboardList } from 'lucide-react'
import { useOperatorTripStore } from '../store/operatorTripStore'
import type { BoardingRecord } from '../types'

type FilterType = 'all' | 'verified' | 'declined'

function formatTime(epoch: number) {
  return new Date(epoch).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

export default function OperatorTripLog() {
  const { activeTrip } = useOperatorTripStore()
  const [filter, setFilter] = useState<FilterType>('all')

  const boardings: BoardingRecord[] = activeTrip?.boardings ?? []
  const filtered = boardings.filter(b => filter === 'all' || b.status === filter)
  const verified = boardings.filter(b => b.status === 'verified').length
  const declined = boardings.filter(b => b.status === 'declined').length

  const filterBg: Record<FilterType, string> = {
    all:      'bg-white text-gray-900',
    verified: 'bg-[#97C459] text-[#173404]',
    declined: 'bg-[#F0997B] text-[#3A0A00]',
  }

  return (
    <div className="min-h-dvh bg-[#0A0A0A]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 anim-fade-up">
        <h1 className="text-white text-xl font-bold tracking-tight">Trip Log</h1>
        <p className="text-[#6B7280] text-sm mt-0.5">
          {activeTrip ? `Trip #${activeTrip.tripNumber} · ${activeTrip.routeName}` : 'No active trip'}
        </p>
      </div>

      {/* Summary bar */}
      <div className="mx-5 mb-4 bg-[#141414] border border-[#1E1E1E] rounded-2xl px-5 py-4 flex items-center justify-between anim-fade-up" style={{ animationDelay: '0.05s' }}>
        {[
          { label: 'Total',    value: boardings.length, color: 'text-white' },
          { label: 'Verified', value: verified,          color: 'text-[#97C459]' },
          { label: 'Declined', value: declined,          color: 'text-[#F0997B]' },
        ].map(({ label, value, color }, i) => (
          <div key={label} className="flex flex-col items-center">
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-[#4B5563] text-xs mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mx-5 mb-4 flex gap-2 anim-fade-up" style={{ animationDelay: '0.08s' }}>
        {(['all', 'verified', 'declined'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-150 ${
              filter === f ? filterBg[f] : 'bg-[#141414] border border-[#1E1E1E] text-[#6B7280]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mx-5 flex flex-col gap-2 pb-8 stagger">
        {filtered.length === 0 ? (
          <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl py-12 flex flex-col items-center gap-3 anim-scale-in">
            <ClipboardList size={28} className="text-[#2A2A2A]" />
            <p className="text-[#3A3A3A] text-sm">No records{filter !== 'all' ? ` for "${filter}"` : ''}</p>
          </div>
        ) : (
          filtered.map((b, i) => (
            <div
              key={b.id}
              className="bg-[#141414] border border-[#1E1E1E] rounded-2xl px-4 py-3.5 flex items-start gap-3 anim-fade-up"
              style={{ animationDelay: `${Math.min(i * 0.03, 0.2)}s` }}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${b.status === 'verified' ? 'bg-[#97C459]/15' : 'bg-[#F0997B]/15'}`}>
                {b.status === 'verified'
                  ? <CheckCircle size={16} className="text-[#97C459]" />
                  : <XCircle size={16} className="text-[#F0997B]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{b.passType} pass</p>
                  <span className={`text-xs font-semibold ${b.status === 'verified' ? 'text-[#97C459]' : 'text-[#F0997B]'}`}>
                    {b.status === 'verified' ? 'Verified' : 'Declined'}
                  </span>
                </div>
                <p className="text-[#6B7280] text-xs mt-0.5">
                  {b.status === 'verified'
                    ? b.tripsLeftAfter !== null ? `${b.tripsLeftAfter} trips remaining` : 'Single trip · KES 250'
                    : b.declineReason}
                </p>
                <p className="text-[#3A3A3A] text-[11px] mt-1 font-mono truncate">{b.passengerCode}</p>
              </div>
              <p className="text-[#3A3A3A] text-xs flex-shrink-0 mt-0.5">{formatTime(b.timestamp)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
