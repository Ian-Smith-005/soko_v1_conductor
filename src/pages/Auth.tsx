import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'

type Step = 'login' | 'otp'
type Method = 'email' | 'phone'

export default function Auth() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { showToast } = useNotificationStore()
  const [step, setStep] = useState<Step>('login')
  const [method, setMethod] = useState<Method>('email')
  const [value, setValue] = useState('')
  const [valueError, setValueError] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const validate = () => {
    if (!value.trim()) { setValueError('This field is required'); return false }
    if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setValueError('Enter a valid email address'); return false
    }
    if (method === 'phone' && !/^0[17]\d{8}$/.test(value.replace(/\s/g, ''))) {
      setValueError('Enter a valid Kenyan phone number'); return false
    }
    setValueError(''); return true
  }

  const handleSendOTP = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setStep('otp')
    showToast(`OTP sent to ${value}`, 'success')
  }

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[index] = val; setOtp(next)
    if (val && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus()
  }

  const handleVerify = async () => {
    if (otp.join('').length < 6) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const name = method === 'email' ? value.split('@')[0] : 'Rider'
    login({
      id: Date.now().toString(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: method === 'email' ? value : '',
      phone: method === 'phone' ? value : undefined,
      loyaltyPoints: 0,
      totalTrips: 0,
      memberSince: new Date().toISOString(),
      emailVerified: method === 'email',
      phoneVerified: method === 'phone',
    })
    navigate('/app', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-[#0A0A0A] flex flex-col">
      {/* Brand header */}
      <div className="flex flex-col items-center pt-14 pb-10 px-6">
        <div className="w-24 h-24 rounded-full border-4 border-[#D4AF37] mb-6 overflow-hidden shadow-[0_0_24px_rgba(212,175,55,0.3)]">
          <img
            src="/soko-logo.jpeg"
            alt="Soko Transit"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-white font-heading tracking-wider">SOKO TRANSIT</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Move Smarter with Digital Bus Passes</p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-10">
        {step === 'login' ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome</h2>
            <p className="text-gray-500 text-sm mb-6">Sign in or create an account</p>

            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              {(['email', 'phone'] as Method[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setValue(''); setValueError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    method === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  {m === 'email' ? <Mail size={15} /> : <Phone size={15} />}
                  {m === 'email' ? 'Email' : 'Phone'}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              {method === 'email' ? 'Email address' : 'Phone number'}
            </label>
            <input
              type={method === 'email' ? 'email' : 'tel'}
              value={value}
              onChange={e => { setValue(e.target.value); setValueError('') }}
              placeholder={method === 'email' ? 'you@example.com' : '0712 345 678'}
              className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent mb-1 transition-all ${
                valueError ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {valueError && <p className="text-red-400 text-xs mb-3">{valueError}</p>}
            {!valueError && <div className="mb-6" />}

            <button
              onClick={handleSendOTP}
              disabled={loading || !value.trim()}
              className="w-full py-4 bg-[#22C55E] text-white font-semibold rounded-xl text-base disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending…
                </span>
              ) : 'Continue'}
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button className="w-full py-3.5 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-gray-700 font-medium mb-3 active:bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setStep('login')} className="flex items-center gap-1 text-[#22C55E] text-sm font-medium mb-6">
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Check your {method === 'email' ? 'inbox' : 'messages'}</h2>
            <p className="text-gray-500 text-sm mb-8">
              6-digit code sent to <span className="font-medium text-gray-700">{value}</span>
            </p>

            <div className="flex gap-3 justify-center mb-8">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 rounded-xl focus:outline-none transition-all"
                  style={{
                    color: digit ? '#22C55E' : '#9CA3AF',
                    borderColor: digit ? '#22C55E' : '#E5E7EB',
                    boxShadow: digit ? '0 0 0 3px rgba(34,197,94,0.12)' : 'none',
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length < 6}
              className="w-full py-4 bg-[#22C55E] text-white font-semibold rounded-xl text-base disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Verifying…
                </span>
              ) : 'Verify & Sign In'}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Didn't receive it?{' '}
              <button className="text-[#22C55E] font-medium" onClick={handleSendOTP}>Resend</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
