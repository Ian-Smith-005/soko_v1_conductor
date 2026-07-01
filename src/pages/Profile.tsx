import { useState, useRef } from 'react'
import { User, Star, MapPin, Phone, Mail, Shield, LogOut, Trash2, ChevronRight, Camera, Moon, Sun, MessageSquare, Building2, CheckCircle } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '../store/notificationStore'

type SupportTab = 'developer' | 'company'

export default function Profile() {
  const { user, updateUser, logout, isDarkMode, toggleDarkMode } = useAuthStore()
  const { showToast } = useNotificationStore()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [mpesa, setMpesa] = useState(user?.mpesaNumber ?? '')
  const [avatar, setAvatar] = useState(user?.avatarUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [supportTab, setSupportTab] = useState<SupportTab>('developer')
  const [showDelete, setShowDelete] = useState(false)
  const dark = isDarkMode

  const memberSince = user?.memberSince
    ? (() => {
        const d = new Date(user.memberSince)
        const now = new Date()
        const months = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth()
        if (months === 0) return 'Joined this month'
        if (months < 12) return `Member for ${months} month${months > 1 ? 's' : ''}`
        const years = Math.floor(months / 12)
        return `Member for ${years} year${years > 1 ? 's' : ''}`
      })()
    : 'New member'

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    updateUser({ name, email, phone, mpesaNumber: mpesa, avatarUrl: avatar })
    setSaving(false)
    showToast('Profile saved', 'success')
  }

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      setAvatar(url)
      updateUser({ avatarUrl: url })
      showToast('Profile picture updated', 'success')
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    logout()
    navigate('/auth', { replace: true })
  }

  const bg = dark ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'
  const cardBg = dark ? 'bg-[#1F1F1F]' : 'bg-white'
  const text = dark ? 'text-white' : 'text-gray-900'
  const subtext = dark ? 'text-[#9CA3AF]' : 'text-gray-500'
  const inputCls = dark
    ? 'bg-[#2A2A2A] border-[#3A3A3A] text-white placeholder-[#6B7280]'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'

  return (
    <div className={`min-h-dvh ${bg} page-fade`}>
      <TopBar title="Profile" showBack />

      <div className="px-4 pt-6 space-y-4">
        {/* Avatar + info */}
        <div className="flex flex-col items-center pb-2">
          <div className="relative mb-3">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37]" />
            ) : (
              <div className="w-24 h-24 bg-[#22C55E]/10 rounded-full flex items-center justify-center border-4 border-[#D4AF37]">
                <User size={40} className="text-[#22C55E]" />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center border-2 border-[#0A0A0A]"
            >
              <Camera size={14} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          </div>
          <h2 className={`text-xl font-bold ${text}`}>{user?.name ?? 'Guest'}</h2>
          <p className={`text-sm mt-0.5 ${subtext}`}>{user?.email}</p>
          <p className="text-[#D4AF37] text-xs mt-1">{memberSince}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-[#FACC15]" fill="#FACC15" />
              <span className={`text-sm ${subtext}`}>{user?.loyaltyPoints ?? 0} pts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#22C55E]" />
              <span className={`text-sm ${subtext}`}>{user?.totalTrips ?? 0} trips</span>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className={`${cardBg} rounded-2xl p-5 space-y-4`}>
          <h3 className={`font-semibold text-sm ${text}`}>Account Details</h3>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${subtext}`}>Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${inputCls}`} />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${subtext}`}>
              Email {user?.emailVerified && <span className="text-[#22C55E] ml-1">✓ Verified</span>}
            </label>
            <div className="flex gap-2">
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com"
                className={`flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${inputCls}`} />
              {!user?.emailVerified && (
                <button className="px-3 py-3 bg-[#22C55E]/10 text-[#22C55E] rounded-xl text-xs font-medium">Verify</button>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${subtext}`}>
              Phone {user?.phoneVerified && <span className="text-[#22C55E] ml-1">✓ Verified</span>}
            </label>
            <div className="flex gap-2">
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="0712 345 678"
                className={`flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${inputCls}`} />
              {!user?.phoneVerified && (
                <button className="px-3 py-3 bg-[#22C55E]/10 text-[#22C55E] rounded-xl text-xs font-medium">Verify</button>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${subtext}`}>M-Pesa Number</label>
            <input value={mpesa} onChange={e => setMpesa(e.target.value)} type="tel" placeholder="e.g. 0712345678"
              className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${inputCls}`} />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-[#22C55E] text-white font-semibold rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            ) : <>
              <CheckCircle size={16} /> Save Changes
            </>}
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={`w-full ${cardBg} rounded-2xl px-5 py-4 flex items-center gap-3`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-[#D4AF37]/10' : 'bg-gray-100'}`}>
            {dark ? <Moon size={18} className="text-[#D4AF37]" /> : <Sun size={18} className="text-orange-400" />}
          </div>
          <div className="flex-1 text-left">
            <p className={`font-medium text-sm ${text}`}>{dark ? 'Dark Mode' : 'Light Mode'}</p>
            <p className={`text-xs ${subtext}`}>Tap to switch</p>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${dark ? 'bg-[#22C55E]' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>

        {/* Support Section */}
        <div className={`${cardBg} rounded-2xl overflow-hidden`}>
          <div className="px-5 pt-4 pb-3 border-b border-[dark ? '#2A2A2A' : '#E5E7EB']">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={16} className="text-[#9CA3AF]" />
              <h3 className={`font-semibold text-sm ${text}`}>Support</h3>
            </div>
            <div className="flex bg-[#2A2A2A] rounded-xl p-1">
              {(['developer', 'company'] as SupportTab[]).map(t => (
                <button key={t} onClick={() => setSupportTab(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    supportTab === t ? 'bg-[#1F1F1F] text-white shadow' : 'text-[#9CA3AF]'
                  }`}>
                  {t === 'developer' ? 'Developer Support' : 'Company Manager'}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 space-y-2">
            {supportTab === 'developer' ? (
              <>
                <p className="text-[#9CA3AF] text-xs mb-3">Technical issues, bugs, or feature requests</p>
                {[
                  { icon: <Mail size={15} />, label: 'dev@sokotransit.com', action: () => {} },
                  { icon: <Phone size={15} />, label: '+254 700 000 001', action: () => {} },
                ].map(({ icon, label, action }) => (
                  <button key={label} onClick={action} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2A2A2A]">
                    <span className="text-[#9CA3AF]">{icon}</span>
                    <span className="text-white text-sm">{label}</span>
                  </button>
                ))}
              </>
            ) : (
              <>
                <p className="text-[#9CA3AF] text-xs mb-3">Contact the Soko Transit company manager</p>
                {[
                  { icon: <Mail size={15} />, label: 'manager@sokotransit.com', href: 'mailto:manager@sokotransit.com' },
                  { icon: <Phone size={15} />, label: '+254 700 000 002', href: 'tel:+254700000002' },
                  { icon: <Building2 size={15} />, label: 'WhatsApp Business', href: 'https://wa.me/254700000002' },
                ].map(({ icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2A2A2A]">
                    <span className="text-[#9CA3AF]">{icon}</span>
                    <span className="text-white text-sm">{label}</span>
                    <ChevronRight size={14} className="text-[#6B7280] ml-auto" />
                  </a>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Security */}
        <button className={`w-full ${cardBg} rounded-2xl px-5 py-4 flex items-center gap-3`}>
          <div className="w-10 h-10 bg-[#121212] rounded-xl flex items-center justify-center">
            <Shield size={18} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1 text-left">
            <p className={`font-medium text-sm ${text}`}>Account Security</p>
            <p className={`text-xs ${subtext}`}>Verification & privacy</p>
          </div>
          <ChevronRight size={16} className="text-[#6B7280]" />
        </button>

        {/* Logout */}
        <button onClick={handleLogout}
          className={`w-full ${cardBg} border border-red-500/20 rounded-2xl py-4 flex items-center justify-center gap-2 text-red-400 font-semibold text-sm active:opacity-80`}>
          <LogOut size={16} /> Log Out
        </button>

        {/* Delete */}
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="w-full flex items-center justify-center gap-2 text-[#6B7280] text-sm py-2">
            <Trash2 size={15} /> Delete Account
          </button>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
            <p className="text-red-400 text-sm font-medium mb-3">This action is permanent and cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 bg-[#2A2A2A] text-white rounded-xl text-sm">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">Delete</button>
            </div>
          </div>
        )}

        <p className="text-center text-[#6B7280] text-xs pb-4">Soko Transit v2.0 · Move Smarter.</p>
      </div>
    </div>
  )
}
