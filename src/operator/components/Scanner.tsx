import { useEffect, useRef, useState } from 'react'
import { X, Keyboard, Camera, ScanLine } from 'lucide-react'

interface ScannerProps {
  onScan: (code: string) => void
  onClose: () => void
}

export default function Scanner({ onScan, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<{ stop: () => void; destroy: () => void } | null>(null)
  const [mode, setMode] = useState<'camera' | 'manual'>('camera')
  const [manualCode, setManualCode] = useState('')
  const [cameraError, setCameraError] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    if (mode !== 'camera' || !videoRef.current) return
    let cancelled = false

    import('qr-scanner').then(({ default: QrScanner }) => {
      if (cancelled || !videoRef.current) return
      const scanner = new QrScanner(
        videoRef.current,
        result => { scanner.stop(); onScan(typeof result === 'string' ? result : result.data) },
        { highlightScanRegion: true, highlightCodeOutline: true, preferredCamera: 'environment' }
      )
      scannerRef.current = scanner
      scanner.start().catch(() => setCameraError(true))
    }).catch(() => setCameraError(true))

    return () => {
      cancelled = true
      scannerRef.current?.stop()
      scannerRef.current?.destroy()
      scannerRef.current = null
    }
  }, [mode, onScan])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-5 pt-6 pb-4 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="flex items-center gap-2">
          <ScanLine size={18} className="text-[#97C459]" />
          <h2 className="text-white font-bold text-base">
            {mode === 'camera' ? 'Scan Passenger QR' : 'Enter Pass Code'}
          </h2>
        </div>
        <button
          onClick={handleClose}
          className="w-9 h-9 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full flex items-center justify-center active:scale-90 transition-transform"
        >
          <X size={17} className="text-white" />
        </button>
      </div>

      {mode === 'camera' ? (
        <>
          <div className={`flex-1 relative mx-5 rounded-3xl overflow-hidden bg-[#111] transition-all duration-400 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            {!cameraError ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                {/* Scan frame overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-52 h-52">
                    {/* Corner markers */}
                    {['top-0 left-0', 'top-0 right-0 rotate-90', 'bottom-0 right-0 rotate-180', 'bottom-0 left-0 -rotate-90'].map((pos, i) => (
                      <span key={i} className={`absolute ${pos} w-8 h-8 border-t-2 border-l-2 border-[#97C459] rounded-tl-sm`} />
                    ))}
                    {/* Scanning line */}
                    <div className="absolute inset-x-2 h-0.5 bg-[#97C459]/70 top-1/2 rounded-full" style={{ animation: 'scan 2s ease-in-out infinite' }} />
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
                  <Camera size={28} className="text-[#3A3A3A]" />
                </div>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  Camera unavailable. Check permissions or use manual entry.
                </p>
              </div>
            )}
          </div>

          <div className={`px-5 py-6 flex flex-col items-center gap-3 transition-all duration-300 delay-100 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <p className="text-[#6B7280] text-sm">Point camera at the passenger's QR code</p>
            <button
              onClick={() => setMode('manual')}
              className="flex items-center gap-2 text-[#97C459] text-sm font-semibold py-2 px-4 rounded-xl bg-[#97C459]/10 border border-[#97C459]/20"
            >
              <Keyboard size={15} /> Enter code manually
            </button>
          </div>
        </>
      ) : (
        <div className={`flex-1 flex flex-col px-5 pt-2 transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
          <label className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-2">Pass code</label>
          <input
            type="text"
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            placeholder="SOKO-XXXXXXXXXX-XXXXX"
            autoFocus
            className="w-full px-4 py-4 bg-[#141414] text-white placeholder-[#3A3A3A] rounded-xl text-sm font-mono border border-[#2A2A2A] focus:outline-none focus:border-[#639922] focus:ring-1 focus:ring-[#639922]/30 transition-all mb-4"
          />
          <button
            onClick={() => { if (manualCode.trim()) onScan(manualCode.trim()) }}
            disabled={!manualCode.trim()}
            className="w-full py-4 bg-[#639922] text-white font-bold rounded-2xl text-sm disabled:opacity-40 mb-3 active:scale-[0.98] transition-all"
          >
            Verify Pass
          </button>
          <button
            onClick={() => setMode('camera')}
            className="flex items-center justify-center gap-2 text-[#97C459] text-sm font-semibold py-3 rounded-xl bg-[#97C459]/5 border border-[#97C459]/15"
          >
            <Camera size={15} /> Use camera instead
          </button>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-48px); opacity: 0.4; }
          50%       { transform: translateY(48px);  opacity: 1; }
        }
      `}</style>
    </div>
  )
}
