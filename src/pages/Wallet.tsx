import { useState } from 'react'
import { CreditCard, Star, Phone, ArrowUpRight, ArrowDownLeft, X, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useWalletStore } from '../store/walletStore'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import type { PaymentGateway, PaymentStep, PaymentStatus } from '../types'

const GATEWAYS: { id: PaymentGateway; label: string; desc: string; color: string }[] = [
  { id: 'mpesa', label: 'M-Pesa', desc: 'Pay via Safaricom M-Pesa STK Push', color: '#00A651' },
  { id: 'stripe', label: 'Stripe / Card', desc: 'Visa, Mastercard, or bank card', color: '#635BFF' },
  { id: 'paypal', label: 'PayPal', desc: 'Pay with your PayPal account', color: '#003087' },
]

const presets = [100, 500, 1000, 2000, 5000]

export default function Wallet() {
  const { balance, loyaltyPoints, transactions, topUp } = useWalletStore()
  const { isDarkMode } = useAuthStore()
  const { showToast } = useNotificationStore()
  const [showTopUp, setShowTopUp] = useState(false)
  const [gateway, setGateway] = useState<PaymentGateway>('mpesa')
  const [amount, setAmount] = useState('')
  const [detail, setDetail] = useState('')
  const [step, setStep] = useState<PaymentStep>('select')
  const [status, setStatus] = useState<PaymentStatus>(null)
  const dark = isDarkMode

  const resetModal = () => {
    setShowTopUp(false); setStep('select'); setAmount(''); setDetail(''); setStatus(null)
  }

  const handlePay = async () => {
    const val = parseInt(amount)
    if (!val || val < 50) return
    setStep('processing')
    await new Promise(r => setTimeout(r, 2000))
    // Simulate 90% success
    const ok = Math.random() > 0.1
    setStatus(ok ? 'success' : 'failed')
    setStep('done')
    if (ok) {
      const gw = GATEWAYS.find(g => g.id === gateway)!
      topUp(val, gw.label)
      showToast(`KES ${val.toLocaleString()} added to wallet`, 'success')
    }
  }

  const tx = transactions

  return (
    <div className={`min-h-dvh flex flex-col ${dark ? 'bg-[#0A0A0A]' : 'bg-[#F3F4F6]'} page-fade`}>
      <TopBar title="Wallet" showBack />

      <div className="px-4 pt-5 space-y-4">
        {/* Balance Card */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a1a0a 100%)' }}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#22C55E]/10" />
          <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-[#D4AF37]/5" />

          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={15} className="text-[#9CA3AF]" />
            <span className="text-[#9CA3AF] text-sm">Wallet Balance</span>
          </div>
          <p className="text-white text-3xl font-bold mb-1">KES {balance.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mb-5">
            <Star size={14} className="text-[#FACC15]" fill="#FACC15" />
            <span className="text-[#9CA3AF] text-sm">{loyaltyPoints} loyalty points</span>
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-2 bg-[#22C55E] text-white font-semibold px-5 py-3 rounded-xl text-sm active:scale-95 transition-transform"
          >
            <Phone size={16} /> Top Up
          </button>
        </div>

        {/* Transactions */}
        <div>
          <h3 className={`font-bold text-base mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Transactions</h3>
          {tx.length === 0 ? (
            <div className={`rounded-2xl p-8 flex flex-col items-center ${dark ? 'bg-[#1F1F1F]' : 'bg-white'}`}>
              <CreditCard size={28} className="text-[#3A3A3A] mb-2" />
              <p className="text-[#9CA3AF] text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tx.map(t => (
                <div key={t.id} className={`rounded-2xl px-4 py-3.5 flex items-center gap-3 ${dark ? 'bg-[#1F1F1F]' : 'bg-white shadow-sm'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'credit' ? 'bg-green-500/10' : 'bg-orange-400/10'}`}>
                    {t.type === 'credit'
                      ? <ArrowDownLeft size={18} className="text-[#22C55E]" />
                      : <ArrowUpRight size={18} className="text-orange-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${dark ? 'text-white' : 'text-gray-900'}`}>{t.description}</p>
                    <p className="text-[#6B7280] text-xs mt-0.5">{t.date}</p>
                  </div>
                  <p className={`text-sm font-bold flex-shrink-0 ${t.type === 'credit' ? 'text-[#22C55E]' : dark ? 'text-white' : 'text-gray-700'}`}>
                    {t.type === 'debit' ? '-' : '+'}KES {t.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={resetModal}>
          <div
            className="w-full max-w-[430px] mx-auto bg-[#121212] rounded-t-3xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Step indicator */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#2A2A2A]">
              <div className="flex gap-2">
                {(['select', 'processing', 'done'] as PaymentStep[]).map((s, i) => (
                  <div key={s} className={`w-2 h-2 rounded-full transition-all ${step === s ? 'bg-[#22C55E] w-6' : steps_done(step, s) ? 'bg-[#22C55E]' : 'bg-[#3A3A3A]'}`} />
                ))}
              </div>
              <button onClick={resetModal} className="text-[#6B7280]"><X size={20} /></button>
            </div>

            <div className="px-6 py-5">
              {step === 'select' && (
                <>
                  <h3 className="text-white text-lg font-bold mb-4">Top Up Wallet</h3>

                  {/* Gateway selection */}
                  <p className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2">Payment Method</p>
                  <div className="space-y-2 mb-5">
                    {GATEWAYS.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setGateway(g.id)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                          gateway === g.id ? 'border-[#22C55E] bg-[#22C55E]/5' : 'border-[#2A2A2A] bg-[#1F1F1F]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: g.color + '22' }}>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-white text-sm font-medium">{g.label}</p>
                          <p className="text-[#6B7280] text-xs">{g.desc}</p>
                        </div>
                        {gateway === g.id && <CheckCircle size={16} className="text-[#22C55E]" />}
                      </button>
                    ))}
                  </div>

                  {/* Detail input */}
                  {gateway === 'mpesa' && (
                    <input
                      type="tel"
                      value={detail}
                      onChange={e => setDetail(e.target.value)}
                      placeholder="M-Pesa number (e.g. 0712345678)"
                      className="w-full px-4 py-3.5 bg-[#1F1F1F] border border-[#2A2A2A] text-white placeholder-[#6B7280] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] mb-4"
                    />
                  )}
                  {gateway === 'stripe' && (
                    <input
                      type="text"
                      value={detail}
                      onChange={e => setDetail(e.target.value)}
                      placeholder="Card number (test: 4242 4242 4242 4242)"
                      className="w-full px-4 py-3.5 bg-[#1F1F1F] border border-[#2A2A2A] text-white placeholder-[#6B7280] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] mb-4"
                    />
                  )}
                  {gateway === 'paypal' && (
                    <input
                      type="email"
                      value={detail}
                      onChange={e => setDetail(e.target.value)}
                      placeholder="PayPal email address"
                      className="w-full px-4 py-3.5 bg-[#1F1F1F] border border-[#2A2A2A] text-white placeholder-[#6B7280] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] mb-4"
                    />
                  )}

                  {/* Amount */}
                  <p className="text-[#9CA3AF] text-xs uppercase tracking-wider mb-2">Amount (KES)</p>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {presets.map(p => (
                      <button
                        key={p}
                        onClick={() => setAmount(String(p))}
                        className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                          amount === String(p) ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5' : 'border-[#2A2A2A] text-[#9CA3AF]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Or enter custom amount"
                    className="w-full px-4 py-3 bg-[#1F1F1F] border border-[#2A2A2A] text-white placeholder-[#6B7280] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] mb-5"
                  />

                  <button
                    onClick={handlePay}
                    disabled={!amount || parseInt(amount) < 50}
                    className="w-full py-4 bg-[#22C55E] text-white font-semibold rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    <ChevronRight size={16} />
                    Pay KES {parseInt(amount || '0').toLocaleString() || '–'}
                  </button>
                  <p className="text-center text-[#6B7280] text-xs mt-2">Minimum top-up: KES 50</p>
                </>
              )}

              {step === 'processing' && (
                <div className="py-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full animate-spin" />
                  <p className="text-white font-semibold">Processing Payment…</p>
                  <p className="text-[#9CA3AF] text-sm text-center">
                    {gateway === 'mpesa' ? 'Check your phone for the M-Pesa STK push' : 'Contacting payment gateway…'}
                  </p>
                </div>
              )}

              {step === 'done' && (
                <div className="py-8 flex flex-col items-center gap-4">
                  {status === 'success' ? (
                    <>
                      <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                        <CheckCircle size={36} className="text-[#22C55E]" />
                      </div>
                      <p className="text-white font-bold text-lg">Payment Successful!</p>
                      <p className="text-[#9CA3AF] text-sm">KES {parseInt(amount).toLocaleString()} added to your wallet</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                        <AlertCircle size={36} className="text-red-400" />
                      </div>
                      <p className="text-white font-bold text-lg">Payment Failed</p>
                      <p className="text-[#9CA3AF] text-sm">Please try again or use a different method</p>
                      <button
                        onClick={() => { setStep('select'); setStatus(null) }}
                        className="w-full py-3.5 border border-[#22C55E] text-[#22C55E] font-semibold rounded-xl"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                  <button onClick={resetModal} className="w-full py-3.5 bg-[#22C55E] text-white font-semibold rounded-xl mt-1">
                    {status === 'success' ? 'Done' : 'Close'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function steps_done(current: PaymentStep, target: PaymentStep): boolean {
  const order: PaymentStep[] = ['select', 'processing', 'done']
  return order.indexOf(current) > order.indexOf(target)
}
