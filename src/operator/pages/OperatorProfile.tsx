import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bus, LogOut, ChevronRight, Shield, Bell, CheckCircle } from 'lucide-react'
import { useOperatorAuthStore } from '../store/operatorAuthStore'
import { useOperatorTripStore } from '../store/operatorTripStore'

export default function OperatorProfile() {
  const navigate = useNavigate()
  const { operator, logout, updateOperator } = useOperatorAuthStore()
  const { activeTrip } = useOperatorTripStore()
  const [busPlate, setBusPlate] = useState(operator?.busPlate ?? '')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const totalBoardings = activeTrip?.boardings.filter(b => b.status === 'verified').length ?? 0

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    updateOperator({ busPlate })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-[#0A0A0A]">
      <div className="px-5 pt-6 pb-4 anim-fade-up">
        <h1 className="text-white text-xl font-bold tracking-tight">Profile</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center pb-6 px-5 anim-scale-in" style={{ animationDelay: '0.05s' }}>
        <div className="w-24 h-24 rounded-3xl bg-[#97C459] flex items-center justify-center mb-4 glow-green">
         <img src="/icons/icon-192.png" alt="Logo" srcset="" />
        </div>
        <p className="text-white text-xl font-bold tracking-tight">{operator?.saccoName ?? '—'}</p>
        <p className="text-[#6B7280] text-sm mt-1">{operator?.routeName}</p>
        <div className="flex items-center gap-8 mt-5">
          <div className="text-center">
            <p className="text-white text-xl font-bold">{activeTrip?.tripNumber ?? 0}</p>
            <p className="text-[#4B5563] text-xs mt-0.5">Trips today</p>
          </div>
          <div className="w-px h-10 bg-[#1E1E1E]" />
          <div className="text-center">
            <p className="text-[#97C459] text-xl font-bold">{totalBoardings}</p>
            <p className="text-[#4B5563] text-xs mt-0.5">Passengers</p>
          </div>
        </div>
      </div>

      {/* Bus plate */}
      <div className="mx-5 mb-3 bg-[#141414] border border-[#1E1E1E] rounded-2xl p-5 anim-fade-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-3">Bus plate number</p>
        <input
          type="text"
          value={busPlate}
          onChange={e => setBusPlate(e.target.value.toUpperCase())}
          placeholder="e.g. KCB 442T"
          className="w-full px-4 py-3.5 bg-[#0A0A0A] text-white placeholder-[#3A3A3A] rounded-xl text-sm font-mono tracking-widest border border-[#2A2A2A] focus:outline-none focus:border-[#639922] focus:ring-1 focus:ring-[#639922]/30 transition-all mb-3"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3.5 font-semibold rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
            saved ? 'bg-[#97C459]/10 text-[#97C459] border border-[#97C459]/30' : 'bg-[#639922] text-white'
          }`}
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full spin" /> Saving…</>
          ) : saved ? (
            <><CheckCircle size={15} /> Saved</>
          ) : 'Update plate'}
        </button>
      </div>

      {/* Settings */}
      <div className="mx-5 mb-3 bg-[#141414] border border-[#1E1E1E] rounded-2xl overflow-hidden anim-fade-up" style={{ animationDelay: '0.12s' }}>
        {[
          { Icon: Shield, label: 'Change operator PIN',  sub: 'Update your 4–6 digit PIN' },
          { Icon: Bell,   label: 'Notifications',         sub: 'Manage alert preferences' },
        ].map(({ Icon, label, sub }, i) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-5 py-4 border-b border-[#1A1A1A] last:border-0 active:bg-[#1A1A1A] transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
              <Icon size={16} className="text-[#6B7280]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-sm">{label}</p>
              <p className="text-[#4B5563] text-xs mt-0.5">{sub}</p>
            </div>
            <ChevronRight size={15} className="text-[#3A3A3A]" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-5 mb-4 anim-fade-up" style={{ animationDelay: '0.15s' }}>
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#141414] border border-[#F0997B]/20 text-[#F0997B] font-semibold rounded-2xl text-sm active:scale-[0.98] transition-all"
          >
            <LogOut size={16} /> Sign out
          </button>
        ) : (
          <div className="bg-[#1f0a05] border border-[#F0997B]/20 rounded-2xl p-4 anim-scale-in">
            <p className="text-[#F0997B] text-sm font-medium text-center mb-3">Sign out of conductor dashboard?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-xl text-sm font-medium">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-3 bg-[#F0997B] text-[#1a0500] rounded-xl text-sm font-bold">Sign out</button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[#2A2A2A] text-xs pb-6 anim-fade-in">Soko Transit Conductor · v1.0</p>
    </div>
  )
}
