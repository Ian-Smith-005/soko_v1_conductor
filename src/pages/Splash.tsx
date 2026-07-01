import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Session-level flag — resets every time the browser tab is opened fresh.
// Does NOT persist to localStorage so splash always plays on launch.
let _splashDone = false

export default function Splash() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [progress, setProgress] = useState(0)

  const goNext = () => {
    if (_splashDone) return
    _splashDone = true
    navigate(isAuthenticated ? '/app' : '/auth', { replace: true })
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Start loading the video immediately
    video.load()

    const onCanPlay = () => setVideoReady(true)
    const onEnded = () => goNext()
    const onError = () => setVideoError(true)

    video.addEventListener('canplaythrough', onCanPlay)
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)

    // Hard cap: if video hasn't ended within 15s, move on anyway
    const hardCap = setTimeout(goNext, 15000)

    return () => {
      video.removeEventListener('canplaythrough', onCanPlay)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      clearTimeout(hardCap)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Once video is buffered enough, play it
  useEffect(() => {
    if (videoReady && videoRef.current) {
      videoRef.current.play().catch(() => setVideoError(true))
    }
  }, [videoReady])

  // Fallback progress animation (only shown when video errors)
  useEffect(() => {
    if (!videoError) return
    const DURATION = 3000
    const start = Date.now()
    const interval = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(interval)
        goNext()
      }
    }, 30)
    return () => clearInterval(interval)
  }, [videoError]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-50 overflow-hidden">
      {/* Video — always in DOM so it starts loading immediately */}
      <video
        ref={videoRef}
        src="/loading.mp4"
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          videoReady && !videoError ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'
        }`}
        muted
        playsInline
        preload="auto"
        onError={() => setVideoError(true)}
      />

      {/* Fallback — shown while video is loading or if it errors */}
      {(!videoReady || videoError) && (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <div className="relative mb-8">
            <div className="w-36 h-36 rounded-full border-4 border-[#D4AF37] overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.35)]">
              <img
                src="/soko-logo.jpeg"
                alt="Soko Transit"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/40 animate-ping"
              style={{ animationDuration: '2s' }}
            />
          </div>

          <h1 className="text-3xl font-bold text-white font-heading tracking-widest mb-2">
            SOKO TRANSIT
          </h1>
          <p className="text-[#9CA3AF] text-sm tracking-widest mb-16">
            Move Smarter.
          </p>

          <div className="w-52 h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] rounded-full"
              style={{ width: `${videoError ? progress : 30}%`, transition: videoError ? 'none' : 'width 1s ease' }}
            />
          </div>

          <p className="text-[#6B7280] text-xs mt-4 tracking-wider">
            {videoError ? 'Loading…' : 'Preparing your experience…'}
          </p>
        </div>
      )}
    </div>
  )
}
