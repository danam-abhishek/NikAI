import { useState, useEffect } from 'react'

export default function LaunchScreen({ 
  onLaunched 
}: { 
  onLaunched: () => void 
}) {

  const [launched, setLaunched] = useState(false)
  const [counting, setCounting] = useState(false)
  const [count, setCount] = useState(3)

  const handleLaunch = () => {
    setCounting(true)
    
    // Countdown 3...2...1...
    let c = 3
    const interval = setInterval(() => {
      c--
      setCount(c)
      if (c === 0) {
        clearInterval(interval)
        setLaunched(true)
        spawnFireworks()
        // Save to localStorage permanently
        localStorage.setItem('nikai_launched', 'true')
        // After 4 seconds go to site
        setTimeout(() => onLaunched(), 4000)
      }
    }, 800)
  }

  const spawnFireworks = () => {
    const colors = [
      '#E040FB','#9C6FE4','#4AE68A',
      '#F5A623','#FF6B6B','#00BFFF',
      '#FFD700','#FF69B4','#fff'
    ]

    // Multiple bursts
    for (let burst = 0; burst < 8; burst++) {
      setTimeout(() => {
        const x = 10 + Math.random() * 80
        const y = 10 + Math.random() * 60
        
        // Each burst = 20 particles
        for (let p = 0; p < 20; p++) {
          const el = document.createElement('div')
          const angle = (p / 20) * 360
          const distance = 80 + Math.random() * 120
          const size = 4 + Math.random() * 6
          const color = colors[Math.floor(Math.random()*colors.length)]
          const duration = 0.8 + Math.random() * 0.6
          
          el.style.cssText = `
            position: fixed;
            left: ${x}vw;
            top: ${y}vh;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${Math.random()>0.4?'50%':'2px'};
            z-index: 9999;
            pointer-events: none;
            box-shadow: 0 0 6px ${color};
            animation: firework ${duration}s ease-out forwards;
            --tx: ${Math.cos(angle*Math.PI/180)*distance}px;
            --ty: ${Math.sin(angle*Math.PI/180)*distance}px;
          `
          document.body.appendChild(el)
          setTimeout(() => el.remove(), duration * 1000 + 100)
        }
      }, burst * 300)
    }

    // Continuous rain confetti
    for (let i = 0; i < 150; i++) {
      setTimeout(() => {
        const el = document.createElement('div')
        const size = 5 + Math.random() * 8
        el.style.cssText = `
          position: fixed;
          left: ${Math.random()*100}vw;
          top: -20px;
          width: ${size}px;
          height: ${size}px;
          background: ${colors[Math.floor(Math.random()*colors.length)]};
          border-radius: ${Math.random()>0.5?'50%':'2px'};
          z-index: 9998;
          pointer-events: none;
          animation: confettiFall ${2+Math.random()*3}s linear forwards;
        `
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 5000)
      }, i * 30)
    }
  }

  // Congratulations screen
  if (launched) return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0A0A18',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      gap: '20px', padding: '24px', textAlign: 'center'
    }}>
      <div style={{
        fontSize: '80px',
        animation: 'rocketLaunch 1s ease forwards'
      }}>
        🚀
      </div>

      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(28px, 6vw, 48px)',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #E040FB, #9C6FE4, #4AE68A)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1.2,
        animation: 'fadeSlideUp 0.6s ease 0.3s both'
      }}>
        Congratulations! 🎉
      </div>

      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(18px, 4vw, 28px)',
        fontWeight: 700,
        color: '#F2F2FF',
        animation: 'fadeSlideUp 0.6s ease 0.5s both'
      }}>
        NikAI is officially LIVE! ✨
      </div>

      <div style={{
        fontSize: '15px',
        color: '#7A7A99',
        maxWidth: '400px',
        lineHeight: 1.8,
        animation: 'fadeSlideUp 0.6s ease 0.7s both'
      }}>
        Your AI is now running and ready to handle
        clinic operations automatically — 24/7.
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        fontSize: '28px',
        animation: 'fadeSlideUp 0.6s ease 0.9s both'
      }}>
        🎊 🎉 🚀 🎊 🎉
      </div>

      <style>{`
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
      `}</style>
    </div>
  )

  // Countdown screen
  if (counting) return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0A0A18',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(80px, 20vw, 160px)',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #E040FB, #9C6FE4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'countPulse 0.8s ease infinite',
        lineHeight: 1
      }}>
        {count === 0 ? '🚀' : count}
      </div>
      <div style={{
        fontSize: '16px', color: '#7A7A99',
        letterSpacing: '3px', textTransform: 'uppercase',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        {count > 0 ? 'Launching NikAI...' : 'LIFT OFF!'}
      </div>
      <style>{`
        @keyframes countPulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )

  // Launch button screen
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0A0A18',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexDirection: 'column',
      gap: '28px', padding: '24px', textAlign: 'center'
    }}>

      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 600px 400px at 30% 40%,
            rgba(224,64,251,0.08), transparent),
          radial-gradient(ellipse 500px 500px at 70% 60%,
            rgba(156,111,228,0.06), transparent)
        `
      }}/>

      {/* Dot grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(156,111,228,0.1) 1px, transparent 1px)',
        backgroundSize: '28px 28px'
      }}/>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(36px, 8vw, 56px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #E040FB, #9C6FE4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          NikAI
        </div>

        <div style={{
          fontSize: '13px', color: '#7A7A99',
          letterSpacing: '2px', textTransform: 'uppercase',
          marginBottom: '48px'
        }}>
          AI that runs your operations
        </div>

        {/* Big launch button */}
        <button
          onClick={handleLaunch}
          style={{
            position: 'relative',
            padding: 'clamp(18px,4vw,24px) clamp(40px,8vw,72px)',
            background: 'linear-gradient(135deg, #E040FB, #9C6FE4)',
            border: 'none',
            borderRadius: '100px',
            color: '#fff',
            fontSize: 'clamp(18px,4vw,24px)',
            fontWeight: 800,
            fontFamily: 'Syne, sans-serif',
            cursor: 'pointer',
            letterSpacing: '1px',
            boxShadow: `
              0 0 60px rgba(224,64,251,0.4),
              0 20px 60px rgba(224,64,251,0.3),
              inset 0 1px 0 rgba(255,255,255,0.2)
            `,
            transition: 'all 0.2s',
            animation: 'buttonPulse 2s ease-in-out infinite'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 0 80px rgba(224,64,251,0.6), 0 24px 80px rgba(224,64,251,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 0 60px rgba(224,64,251,0.4), 0 20px 60px rgba(224,64,251,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'scale(0.97)'
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
        >
          🚀 Launch NikAI
        </button>

        <div style={{
          fontSize: '13px', color: 'rgba(122,122,153,0.6)',
          marginTop: '20px'
        }}>
          Click to launch your AI platform
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  )
}
