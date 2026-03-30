import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/* ─── Constants ─── */

const STORAGE_KEY = 'nikai_launch_unlocked';
const LOCKS_KEY = 'nikai_locks_state';

const MEMBERS = ['Member 1', 'Member 2', 'Member 3'];

const SUCCESS_MSGS = [
  'Member 1 unlocked — launch sequence initiated!',
  'Member 2 unlocked — almost there!',
  'Member 3 unlocked — initiating launch! 🚀',
];

const LOCK_COLS = ['lock1', 'lock2', 'lock3'] as const;

/* ─── Types ─── */

interface LockRow {
  id: number;
  lock1: boolean;
  lock2: boolean;
  lock3: boolean;
  launched: boolean;
  updated_at: string;
}

/* ─── WebAuthn biometric helper ─── */

async function requestBiometric(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    throw new Error('NOT_SUPPORTED');
  }

  const available =
    await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  if (!available) {
    throw new Error('NOT_SUPPORTED');
  }

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);

  const userId = new Uint8Array(16);
  crypto.getRandomValues(userId);

  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'NikAI Launch', id: window.location.hostname },
        user: {
          id: userId,
          name: `nikai-member-${Date.now()}`,
          displayName: 'NikAI Member',
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'discouraged',
        },
        timeout: 60000,
        attestation: 'none',
      },
    });
    return !!credential;
  } catch (err: any) {
    if (err.name === 'NotAllowedError') return false;
    throw err;
  }
}

/* ─── Component ─── */

export default function LaunchUnlock({
  onUnlocked,
}: {
  onUnlocked: () => void;
}) {
  const [unlocked, setUnlocked] = useState([false, false, false]);
  const [errors, setErrors] = useState<(string | null)[]>([null, null, null]);
  const [shaking, setShaking] = useState([false, false, false]);
  const [authenticating, setAuthenticating] = useState([false, false, false]);
  const [celebrating, setCelebrating] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const confettiFired = useRef(false);

  /* ─── 1. Initial load: ALWAYS fetch from Supabase (primary source) ─── */
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      console.log('[NikAI] LaunchUnlock: Initializing...');
      console.log('[NikAI] LaunchUnlock: Supabase configured:', isSupabaseConfigured);

      // PRIMARY SOURCE: Supabase database
      if (isSupabaseConfigured) {
        try {
          console.log('[NikAI] LaunchUnlock: Fetching lock state from Supabase...');
          const { data, error } = await supabase
            .from('launch_status')
            .select('*')
            .eq('id', 1)
            .single();

          console.log('[NikAI] LaunchUnlock: Supabase response:', {
            data,
            error: error?.message,
          });

          if (cancelled) return;

          if (data && !error) {
            const row = data as LockRow;
            const state = [row.lock1, row.lock2, row.lock3];
            const allTrue = state.every(Boolean);

            console.log('[NikAI] LaunchUnlock: Lock state from DB:', {
              lock1: row.lock1,
              lock2: row.lock2,
              lock3: row.lock3,
              launched: row.launched,
            });

            setUnlocked(state);
            localStorage.setItem(LOCKS_KEY, JSON.stringify(state));

            // All 3 locks true → ensure launched=true and celebrate
            if (allTrue || row.launched) {
              // Auto-fix: if all locks true but launched wasn't set
              if (allTrue && !row.launched) {
                console.log('[NikAI] LaunchUnlock: All locks true but launched=false → fixing...');
                await supabase
                  .from('launch_status')
                  .update({ launched: true, updated_at: new Date().toISOString() })
                  .eq('id', 1);
              }

              console.log('[NikAI] LaunchUnlock: Launched → showing celebration');
              localStorage.setItem(STORAGE_KEY, 'true');
              setCelebrating(true);
              if (!confettiFired.current) {
                confettiFired.current = true;
                setTimeout(() => spawnConfetti(), 300);
              }
              setSyncing(false);
              return;
            }

            setSyncing(false);
            return;
          }
        } catch (err) {
          console.error('[NikAI] LaunchUnlock: Supabase fetch failed:', err);
        }
      }

      // FALLBACK: localStorage only if Supabase is unavailable
      if (!cancelled) {
        console.log('[NikAI] LaunchUnlock: Falling back to localStorage');
        const saved = localStorage.getItem(LOCKS_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            console.log('[NikAI] LaunchUnlock: localStorage state:', parsed);
            setUnlocked(parsed);
          } catch { /* ignore */ }
        }
        setSyncing(false);
      }
    };

    init();
    return () => { cancelled = true; };
  }, [onUnlocked]);

  /* ─── 2. Real-time listener for cross-device sync ─── */
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    console.log('[NikAI] LaunchUnlock: Setting up realtime listener...');

    const channel = supabase
      .channel('launch_realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'launch_status',
          filter: 'id=eq.1',
        },
        (payload) => {
          const d = payload.new as LockRow;
          const state = [d.lock1, d.lock2, d.lock3];

          console.log('[NikAI] LaunchUnlock: Realtime update received:', {
            lock1: d.lock1,
            lock2: d.lock2,
            lock3: d.lock3,
            launched: d.launched,
          });

          setUnlocked(state);
          localStorage.setItem(LOCKS_KEY, JSON.stringify(state));

          if (d.launched) {
            setCelebrating(true);
            localStorage.setItem(STORAGE_KEY, 'true');
            if (!confettiFired.current) {
              confettiFired.current = true;
              spawnConfetti();
            }
          }
        },
      )
      .subscribe((status) => {
        console.log('[NikAI] LaunchUnlock: Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ─── 3. Biometric unlock handler ─── */
  const handleUnlock = async (i: number) => {
    if (unlocked[i] || authenticating[i]) return;

    setAuthenticating((p) => { const n = [...p]; n[i] = true; return n; });
    setErrors((p) => { const n = [...p]; n[i] = null; return n; });

    try {
      const success = await requestBiometric();

      if (success) {
        console.log(`[NikAI] LaunchUnlock: Lock ${i + 1} biometric verified ✓`);

        const next = [...unlocked];
        next[i] = true;
        setUnlocked(next);
        localStorage.setItem(LOCKS_KEY, JSON.stringify(next));

        const allDone = next.every(Boolean);

        // Update Supabase (primary)
        if (isSupabaseConfigured) {
          const update: Record<string, boolean | string> = {
            [LOCK_COLS[i]]: true,
            updated_at: new Date().toISOString(),
          };
          if (allDone) update.launched = true;

          console.log(`[NikAI] LaunchUnlock: Updating Supabase:`, update);

          const { error } = await supabase
            .from('launch_status')
            .update(update)
            .eq('id', 1);

          if (error) {
            console.error('[NikAI] LaunchUnlock: Supabase update error:', error.message);
          } else {
            console.log('[NikAI] LaunchUnlock: Supabase updated successfully');
          }
        }

        if (allDone) {
          setTimeout(() => {
            setCelebrating(true);
            localStorage.setItem(STORAGE_KEY, 'true');
            if (!confettiFired.current) {
              confettiFired.current = true;
              spawnConfetti();
            }
          }, 600);
        }
      } else {
        triggerError(i, 'Authentication cancelled. Try again.');
      }
    } catch (err: any) {
      if (err.message === 'NOT_SUPPORTED') {
        triggerError(
          i,
          'Biometric authentication is not supported on this device. Please use a device with fingerprint or Face ID.',
        );
      } else {
        triggerError(i, 'Authentication failed. Please try again.');
      }
    } finally {
      setAuthenticating((p) => { const n = [...p]; n[i] = false; return n; });
    }
  };

  const triggerError = (i: number, msg: string) => {
    setErrors((p) => { const n = [...p]; n[i] = msg; return n; });
    setShaking((p) => { const n = [...p]; n[i] = true; return n; });
    setTimeout(() => {
      setShaking((p) => { const n = [...p]; n[i] = false; return n; });
    }, 600);
    setTimeout(() => {
      setErrors((p) => { const n = [...p]; n[i] = null; return n; });
    }, 4000);
  };

  /* ─── 4. Confetti ─── */
  const spawnConfetti = useCallback(() => {
    const colors = ['#E040FB', '#9C6FE4', '#4AE68A', '#F5A623', '#FF6B6B', '#fff'];
    for (let k = 0; k < 120; k++) {
      setTimeout(() => {
        const el = document.createElement('div');
        const size = 6 + Math.random() * 8;
        el.style.cssText = `
          position:fixed;
          left:${Math.random() * 100}vw;
          top:-10px;
          width:${size}px;
          height:${size}px;
          background:${colors[Math.floor(Math.random() * colors.length)]};
          border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
          z-index:9999;
          pointer-events:none;
          animation:confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }, k * 20);
    }
  }, []);

  /* ─── Derived state ─── */
  const count = unlocked.filter(Boolean).length;
  const progress = (count / 3) * 100;

  /* ─── Celebration screen ─── */
  if (celebrating) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,10,24,0.97)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column',
        gap: '20px', padding: '24px', textAlign: 'center',
        animation: 'fadeIn 0.5s ease',
      }}>
        <div style={{ fontSize: '64px' }}>🚀</div>
        <h1 style={{
          fontFamily: 'Syne,sans-serif',
          fontSize: 'clamp(24px,5vw,36px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg,#E040FB,#9C6FE4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.3,
        }}>
          Congratulations! 🎉
        </h1>
        <p style={{
          fontSize: '15px', color: '#7A7A99',
          maxWidth: '400px', lineHeight: 1.7,
        }}>
          Your NikAI has just launched successfully 🎉<br />
          All 3 members have unlocked the system.<br />
          NikAI is live and ready to run clinic operations.
        </p>
        <button
          onClick={onUnlocked}
          style={{
            padding: '14px 36px',
            background: 'linear-gradient(135deg,#E040FB,#9C6FE4)',
            border: 'none', borderRadius: '30px', color: '#fff',
            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Syne,sans-serif', marginTop: '8px',
            boxShadow: '0 8px 32px rgba(224,64,251,0.3)',
          }}
        >
          Enter NikAI →
        </button>
      </div>
    );
  }

  /* ─── Main lock screen ─── */
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0A0A18',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px',
      overflowY: 'auto',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0,
        background: `
          radial-gradient(ellipse 700px 500px at 20% 50%,
            rgba(224,64,251,0.07),transparent),
          radial-gradient(ellipse 500px 500px at 80% 30%,
            rgba(156,111,228,0.05),transparent)
        `,
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '480px',
        position: 'relative', zIndex: 1,
        textAlign: 'center',
      }}>

        {/* Logo */}
        <div style={{
          fontFamily: 'Syne,sans-serif', fontSize: '30px',
          fontWeight: 800, marginBottom: '6px',
          background: 'linear-gradient(135deg,#E040FB,#9C6FE4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>NikAI</div>

        <div style={{
          fontSize: '12px', color: '#7A7A99',
          marginBottom: '28px', letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}>
          🔐 Launch Sequence — {syncing ? 'Syncing...' : '3 Member Unlock Required'}
        </div>

        {/* Progress bar */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px', height: '6px',
          marginBottom: '8px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: '20px',
            background: 'linear-gradient(90deg,#E040FB,#9C6FE4)',
            width: progress + '%',
            transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </div>
        <div style={{
          fontSize: '12px', color: '#7A7A99', marginBottom: '24px',
        }}>
          {count} of 3 members unlocked
        </div>

        {/* Lock cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: unlocked[i]
                  ? 'rgba(74,230,138,0.04)'
                  : 'rgba(255,255,255,0.03)',
                border: `0.5px solid ${unlocked[i]
                  ? 'rgba(74,230,138,0.4)'
                  : 'rgba(156,111,228,0.2)'}`,
                borderRadius: '16px', padding: '18px 20px',
                transition: 'all 0.4s ease',
                animation: shaking[i] ? 'shake 0.4s ease' : 'none',
                textAlign: 'left',
              }}
            >
              {/* Header row */}
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '12px', marginBottom: unlocked[i] ? '0' : '14px',
              }}>
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '12px', fontSize: '20px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                  background: unlocked[i]
                    ? 'rgba(74,230,138,0.15)'
                    : 'rgba(156,111,228,0.1)',
                  border: `0.5px solid ${unlocked[i]
                    ? 'rgba(74,230,138,0.4)'
                    : 'rgba(156,111,228,0.3)'}`,
                  transition: 'all 0.4s',
                }}>
                  {unlocked[i] ? '🔓' : '🔒'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: 600, color: '#F2F2FF',
                  }}>
                    {MEMBERS[i]}
                  </div>
                </div>

                <div style={{
                  fontSize: '10px', fontWeight: 600,
                  padding: '3px 10px', borderRadius: '20px',
                  letterSpacing: '0.5px',
                  background: unlocked[i]
                    ? 'rgba(74,230,138,0.1)'
                    : 'rgba(224,64,251,0.1)',
                  color: unlocked[i] ? '#4AE68A' : '#E040FB',
                  border: `0.5px solid ${unlocked[i]
                    ? 'rgba(74,230,138,0.3)'
                    : 'rgba(224,64,251,0.3)'}`,
                }}>
                  {unlocked[i] ? 'UNLOCKED' : 'LOCKED'}
                </div>
              </div>

              {/* Unlock button or success message */}
              {unlocked[i] ? (
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: '8px', fontSize: '13px',
                  color: '#4AE68A', fontWeight: 500,
                  marginTop: '4px',
                }}>
                  ✅ {SUCCESS_MSGS[i]}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => handleUnlock(i)}
                    disabled={syncing || authenticating[i]}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      background: authenticating[i]
                        ? 'rgba(156,111,228,0.3)'
                        : 'linear-gradient(135deg,#E040FB,#9C6FE4)',
                      border: 'none', borderRadius: '12px',
                      color: '#fff', fontSize: '14px', fontWeight: 600,
                      cursor: (syncing || authenticating[i]) ? 'not-allowed' : 'pointer',
                      fontFamily: 'DM Sans,sans-serif',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px',
                      opacity: syncing ? 0.5 : 1,
                      boxShadow: authenticating[i]
                        ? 'none'
                        : '0 4px 16px rgba(224,64,251,0.25)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {authenticating[i] ? (
                      <>
                        <span style={{
                          display: 'inline-block', width: '16px', height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff', borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '16px' }}>🔐</span>
                        Unlock with Biometrics
                      </>
                    )}
                  </button>

                  {errors[i] && (
                    <div style={{
                      fontSize: '12px', color: '#FF6B6B',
                      marginTop: '8px',
                      animation: 'fadeIn 0.3s ease',
                    }}>
                      ❌ {errors[i]}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          fontSize: '11px', color: 'rgba(122,122,153,0.5)',
          marginTop: '20px',
        }}>
          Authenticate with fingerprint or Face ID to unlock
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
        @keyframes fadeIn {
          from{opacity:0}to{opacity:1}
        }
        @keyframes confettiFall {
          0%{transform:translateY(-20px) rotate(0deg);opacity:1}
          100%{transform:translateY(100vh) rotate(720deg);opacity:0}
        }
        @keyframes spin {
          to{transform:rotate(360deg)}
        }
      `}</style>
    </div>
  );
}
