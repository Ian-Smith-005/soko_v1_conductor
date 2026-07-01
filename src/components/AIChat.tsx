import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

interface Msg { role: 'user' | 'bot'; text: string }

const BOT_RESPONSES: Record<string, string> = {
  balance: 'You can check your wallet balance on the Wallet tab. Tap the + button to top up via M-Pesa, Stripe, or PayPal.',
  pass: 'Passes are available as Daily (2 trips), Weekly (14 trips), or Monthly (60 trips). Go to Routes → pick a route → Get Pass.',
  qr: 'Your QR code is valid for 1 hour after activation. Show it to the conductor when boarding. After expiry it moves to pass history.',
  route: 'We serve 8 routes across Nairobi including CBD–JKIA, CBD–Thika, CBD–Rongai and more. Open the Routes tab to explore.',
  mpesa: 'To top up via M-Pesa, go to Wallet → Top Up → select M-Pesa → enter your phone number and amount. You\'ll get a prompt on your phone.',
  trip: 'Your trip history is shown on the Home screen. Each time your QR is scanned, a trip is recorded.',
  help: 'I can help with: passes, routes, wallet top-up, QR codes, and account settings. What do you need?',
  thanks: 'Happy to help! Safe travels on Soko Transit 🚌',
}

function getReply(msg: string): string {
  const m = msg.toLowerCase()
  for (const [key, reply] of Object.entries(BOT_RESPONSES)) {
    if (m.includes(key)) return reply
  }
  if (m.includes('hello') || m.includes('hi') || m.includes('hey')) return 'Hey there! I\'m Soko AI. Ask me anything about your passes, wallet, or routes.'
  if (m.includes('fare') || m.includes('price') || m.includes('cost')) return 'Fares range from KES 50 (short routes) to KES 250 (CBD–JKIA). Check the Routes tab for specific pricing.'
  if (m.includes('cancel') || m.includes('refund')) return 'For refunds or cancellations, please email support@sokotransit.com. Response within 24 hours.'
  if (m.includes('operator') || m.includes('conductor')) return 'Operator and conductor access is on a separate platform. Visit conductor.sokotransit.com to continue.'
  return 'I\'m not sure about that yet — you can email support@sokotransit.com or try rephrasing. I understand: pass, route, wallet, QR, M-Pesa, trip.'
}

export default function AIChat() {
  const { isDarkMode } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: 'Hi! I\'m Soko AI 🚌 Ask me about passes, routes, or your wallet.' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = () => {
    const txt = input.trim()
    if (!txt) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: txt }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { role: 'bot', text: getReply(txt) }])
    }, 800 + Math.random() * 400)
  }

  const dark = isDarkMode

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-xl z-50 active:scale-95 transition-transform"
        aria-label="Open AI Chat"
      >
        <MessageCircle size={24} className="text-[#0A0A0A]" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 z-[90] flex flex-col" style={{ maxWidth: 430, margin: '0 auto' }}>
          <div className="flex-1" onClick={() => setOpen(false)} />
          <div className={`rounded-t-3xl shadow-2xl flex flex-col ${dark ? 'bg-[#121212]' : 'bg-white'}`} style={{ maxHeight: '70vh' }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2A2A2A]">
              <div className="w-9 h-9 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                <Bot size={18} className="text-[#0A0A0A]" />
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>Soko AI</p>
                <p className="text-[#22C55E] text-xs">● Online</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#6B7280]"><X size={20} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#22C55E] text-white rounded-br-sm'
                      : dark ? 'bg-[#1F1F1F] text-white rounded-bl-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${dark ? 'bg-[#1F1F1F]' : 'bg-gray-100'} flex gap-1`}>
                    {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: `${i*150}ms` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className={`flex items-center gap-3 px-4 py-3 border-t ${dark ? 'border-[#2A2A2A]' : 'border-gray-200'}`}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about passes, routes…"
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                  dark ? 'bg-[#1F1F1F] text-white placeholder-[#6B7280]' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center disabled:opacity-40"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
