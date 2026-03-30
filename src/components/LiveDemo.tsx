import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Phone, MoreVertical, Loader2 } from "lucide-react";
import { sectionVariants } from "@/lib/animations";

/* ─── Webhook Config ─── */
const N8N_WEBHOOK_URL = "https://n8n.srv1296860.hstgr.cloud/webhook-test/9e499f97-ad6b-4bfe-8e66-4ca10c664bf4";

/* ─── Language config ─── */
interface LangConfig {
  label: string;
  greeting: string;
}

const LANGUAGES: Record<string, LangConfig> = {
  en: {
    label: "English",
    greeting:
      "👋 Hi! I'm NikAI. I can help you book appointments, check timings, or answer questions about your clinic. Type anything to start!",
  },
  hi: {
    label: "Hindi",
    greeting:
      "👋 नमस्ते! मैं NikAI हूँ। मैं आपका अपॉइंटमेंट बुक करने या क्लिनिक के बारे में जानकारी देने में मदद कर सकता हूँ!",
  },
  te: {
    label: "Telugu",
    greeting:
      "👋 నమస్కారం! నేను NikAI. మీకు అపాయింట్‌మెంట్ బుక్ చేయడంలో లేదా క్లినిక్ సమాచారం ఇవ్వడంలో నేను సహాయపడతాను!",
  },
  te_roman: {
    label: "Telugu (Roman)",
    greeting:
      "👋 Namaskaram! Nenu NikAI. Meeku appointment book cheyadamlo leda clinic info ivvadamlo nenu help chestanu!",
  },
  ta: {
    label: "Tamil",
    greeting:
      "👋 வணக்கம்! நான் NikAI. உங்கள் அப்பாயிண்ட்மென்ட் புக் செய்ய அல்லது கிளினிக் தகவலை வழங்க நான் உங்களுக்கு உதவ முடியும்!",
  },
  hinglish: {
    label: "Hinglish",
    greeting:
      "👋 Hey! Main NikAI hoon. Aapka appointment book karne ya clinic ke baare mein poochne mein main help kar sakta hoon!",
  },
};

/* ─── Scenario buttons ─── */
interface Scenario {
  emoji: string;
  label: string;
  message: string;
}

const SCENARIOS: Scenario[] = [
  { emoji: "📅", label: "Book appointment", message: "I want to book an appointment" },
  { emoji: "🕐", label: "Ask timings", message: "What are your clinic timings?" },
  { emoji: "❌", label: "Cancel", message: "I want to cancel my appointment" },
  { emoji: "🔔", label: "Reminder", message: "Set a reminder" },
];

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

/* ─── Time helper ─── */
function getTimeString(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/* ─── Typing indicator ─── */
const TypingIndicator = () => (
  <div className="wa-typing-indicator">
    <div className="wa-typing-dot" style={{ animationDelay: "0s" }} />
    <div className="wa-typing-dot" style={{ animationDelay: "0.2s" }} />
    <div className="wa-typing-dot" style={{ animationDelay: "0.4s" }} />
  </div>
);

/* ─── Robot Mascot ─── */
const NikRobot = ({ isSpinning, antennaGlow }: { isSpinning: boolean; antennaGlow: boolean }) => {
  return (
    <motion.div
      className="nik-robot-wrap"
      animate={{ 
        rotate: isSpinning ? 720 : 0,
        y: [0, -4, 0]
      }}
      transition={{ 
        rotate: { duration: 0.8, ease: "easeInOut" },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <motion.circle 
          cx="32" cy="8" r="4" 
          fill={antennaGlow ? "#FF4081" : "#E040FB"}
          animate={antennaGlow ? { scale: [1, 1.4, 1], opacity: [1, 0.8, 1] } : {}}
          transition={antennaGlow ? { duration: 0.2, repeat: 2 } : {}}
        />
        <rect x="30" y="12" width="4" height="6" fill="#9C6FE4" />
        
        {/* Head */}
        <rect x="16" y="18" width="32" height="24" rx="8" fill="#FFFFFF" stroke="#9C6FE4" strokeWidth="2" />
        
        {/* Eyes */}
        <circle cx="24" cy="30" r="3" fill="#0D0D1F" />
        <circle cx="40" cy="30" r="3" fill="#0D0D1F" />
        <motion.rect 
          x="22" y="28" width="4" height="1" fill="#4AE68A" 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Body */}
        <rect x="18" y="44" width="28" height="18" rx="4" fill="#F0F0F0" stroke="#9C6FE4" strokeWidth="2" />
        <rect x="24" y="48" width="16" height="4" rx="2" fill="#4AE68A" opacity="0.6" />
      </svg>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */
const LiveDemo = () => {
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Once-per-visit session ID
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  
  const [activeLang, setActiveLang] = useState("en");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: LANGUAGES.en.greeting,
      timestamp: getTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [antennaGlow, setAntennaGlow] = useState(false);
  const [showRobotBubble, setShowRobotBubble] = useState(true);
  const [robotText, setRobotText] = useState("Hi! I'm Nik.");

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  /* ─── Robot Behavior ─── */
  const triggerCelebration = useCallback(() => {
    setIsSpinning(true);
    setAntennaGlow(true);
    setTimeout(() => setIsSpinning(false), 800);
    setTimeout(() => setAntennaGlow(false), 600);
  }, []);

  /* ─── Switch language ─── */
  const switchLanguage = (langKey: string) => {
    setActiveLang(langKey);
    setMessages([
      {
        id: `welcome-${langKey}-${Date.now()}`,
        sender: "bot",
        text: LANGUAGES[langKey].greeting,
        timestamp: getTimeString(),
      },
    ]);
    setInput("");
    setIsLoading(false);
    setRobotText(`Switched to ${LANGUAGES[langKey].label}!`);
    setTimeout(() => setRobotText("How can I help?"), 3000);
  };

  /* ─── Send message (n8n Bridge) ─── */
  const sendMessage = async (text?: string) => {
    const userMessage = (text || input).trim();
    if (!userMessage || isLoading) return;

    // 1. Show user message
    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userMessage,
      timestamp: getTimeString(),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Fetch with 30s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
          language: activeLang,
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Webhook failed");

      const data = await response.json();
      const botReply = data.reply || data.output || data.message || "I'm listening but have nothing to say 😅";

      // 3. Show bot reply
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          timestamp: getTimeString(),
        },
      ]);

      // 4. Update robot speech bubble
      setRobotText("Got it! 😊");
      if (botReply.includes("✅ Booked") || botReply.includes("Confirmed")) {
        triggerCelebration();
        setRobotText("Booked! 🎉");
      }
      setTimeout(() => setRobotText("Ask me anything!"), 5000);

    } catch (err) {
      console.error("n8n error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "bot",
          text: "Connection issue. Please try again 🙏",
          timestamp: getTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section id="demo" className="wa-demo-section">
      <div className="wa-demo-container">
        {/* Section heading */}
        <motion.div
          className="wa-demo-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="wa-demo-live-badge">
            <span className="wa-demo-live-dot-wrap">
              <span className="wa-demo-live-dot-ping" />
              <span className="wa-demo-live-dot" />
            </span>
            <span className="wa-demo-live-text">Live chat — connect to n8n</span>
          </div>
          <h2 className="wa-demo-title">Try NikAI live</h2>
          <p className="wa-demo-subtitle">
            Chat with our AI assistant — powered by n8n.
          </p>
        </motion.div>

        {/* Mascot + Phone Layout */}
        <div className="wa-demo-layout">
          {/* Robot Mascot Column */}
          <div className="nik-mascot-col">
            <AnimatePresence>
              {showRobotBubble && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="nik-robot-bubble"
                >
                  {robotText}
                  <div className="nik-bubble-arrow" />
                </motion.div>
              )}
            </AnimatePresence>
            <NikRobot isSpinning={isSpinning} antennaGlow={antennaGlow} />
          </div>

          {/* Phone frame */}
          <motion.div
            className="wa-phone-frame"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            {/* WhatsApp header */}
            <div className="wa-header">
              <div className="wa-header-left">
                <div className="wa-avatar">
                  <span className="wa-avatar-text">N</span>
                </div>
                <div className="wa-header-info">
                  <span className="wa-header-name">NikAI Assistant</span>
                  <span className="wa-header-status">
                    <span className="wa-online-dot" />
                    Online
                  </span>
                </div>
              </div>
              <div className="wa-header-actions">
                <Phone size={18} color="#fff" />
                <MoreVertical size={18} color="#fff" />
              </div>
            </div>

            {/* Chat area */}
              <div 
                ref={chatRef} 
                className="wa-chat-area"
                style={{
                  height: '400px',
                  minHeight: '400px',
                  maxHeight: '400px',
                  overflowY: 'scroll',
                  overflowX: 'hidden',
                  overscrollBehavior: 'contain',
                  position: 'relative'
                }}
              >
                <AnimatePresence>
                  {messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`wa-message ${isUser ? "wa-message-sent" : "wa-message-received"}`}
                      >
                        <div className={`wa-bubble-tail ${isUser ? "wa-tail-sent" : "wa-tail-received"}`} />
                        <div className="wa-message-text">{msg.text}</div>
                        <div className="wa-message-meta">
                          <span className="wa-message-time">{msg.timestamp}</span>
                          {isUser && <span className="wa-tick">✓✓</span>}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {isLoading && (
                  <div className="wa-message wa-message-received">
                    <div className="wa-bubble-tail wa-tail-received" />
                    <TypingIndicator />
                  </div>
                )}
              </div>

            {/* Input bar */}
            <div className="wa-input-bar">
              <div className="wa-input-wrap">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  disabled={isLoading}
                  onFocus={() => {
                    setTimeout(() => {
                      if (chatRef.current) {
                        chatRef.current.scrollTop = chatRef.current.scrollHeight;
                      }
                    }, 300);
                  }}
                  className="wa-input"
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="wa-send-btn"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} color="#fff" /> : <Send size={20} color="#fff" />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="wa-controls">
          <div className="wa-lang-row">
            {Object.entries(LANGUAGES).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => switchLanguage(key)}
                className={`wa-lang-pill ${activeLang === key ? "wa-lang-active" : ""}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="wa-scenario-row">
            {SCENARIOS.map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.message)}
                disabled={isLoading}
                className="wa-scenario-btn"
              >
                <span className="wa-scenario-emoji">{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .wa-demo-section {
          padding: 80px 16px;
          background: #fafafa;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .wa-demo-container {
          max-width: 1000px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .wa-demo-heading { text-align: center; margin-bottom: 48px; }
        .wa-demo-live-badge { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; }
        .wa-demo-live-dot-wrap { position: relative; width: 10px; height: 10px; }
        .wa-demo-live-dot-ping { position: absolute; width:100%; height:100%; border-radius:50%; background:#22c55e; animation:ping 1.5s infinite; }
        .wa-demo-live-dot { position: relative; width:10px; height:10px; border-radius:50%; background:#22c55e; }
        @keyframes ping { 75%, 100% { transform: scale(2.5); opacity: 0; } }
        .wa-demo-live-text { font-size: 14px; font-weight: 600; color: #22c55e; text-transform: uppercase; letter-spacing: 1px; }
        .wa-demo-title { font-size: 42px; font-weight: 700; color: #0D0D1F; margin-bottom: 8px; }
        .wa-demo-subtitle { font-size: 18px; color: #4A4A6A; opacity: 0.8; }

        .wa-demo-layout {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 40px;
          margin-bottom: 40px;
        }

        /* Mascot */
        .nik-mascot-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 120px;
          pointer-events: none;
          z-index: 100;
        }
        .nik-robot-bubble {
          background: #FFFFFF;
          border: 2px solid #9C6FE4;
          padding: 8px 16px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 600;
          color: #0D0D1F;
          margin-bottom: 12px;
          white-space: nowrap;
          position: relative;
          box-shadow: 0 4px 12px rgba(156,111,228,0.15);
          pointer-events: auto;
        }
        .nik-bubble-arrow {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #9C6FE4;
        }

        .wa-phone-frame {
          width: 100%;
          max-width: 380px;
          height: 600px;
          background: #ECE5DD;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          border: 8px solid #333;
          position: relative;
        }
        .wa-header { background: #075E54; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
        .wa-header-left { display: flex; align-items: center; gap: 12px; }
        .wa-avatar { width: 36px; height: 36px; border-radius: 50%; background: #9C6FE4; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; }
        .wa-header-name { display: block; color: #fff; font-weight: 600; font-size: 15px; }
        .wa-header-status { display: flex; align-items: center; gap: 4px; color: rgba(255,255,255,0.8); font-size: 11px; }
        .wa-online-dot { width: 6px; height: 6px; background: #25D366; border-radius: 50%; }
        .wa-header-actions { display: flex; gap: 16px; }

        .wa-chat-area { 
          flex: 1; 
          height: 400px;
          min-height: 400px;
          max-height: 400px;
          padding: 16px; 
          overflow-y: scroll; 
          overflow-x: hidden;
          overflow-anchor: auto;
          overscroll-behavior: contain;
          position: relative;
          display: flex; 
          flex-direction: column; 
          gap: 8px; 
        }
        .wa-message { max-width: 80%; padding: 8px 12px; border-radius: 12px; font-size: 14px; position: relative; line-height: 1.4; }
        .wa-message-received { align-self: flex-start; background: #fff; border-top-left-radius: 2px; }
        .wa-message-sent { align-self: flex-end; background: #DCF8C6; border-top-right-radius: 2px; }
        .wa-message-meta { display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 4px; font-size: 10px; color: rgba(0,0,0,0.4); }
        .wa-tick { color: #34B7F1; font-weight: 700; }

        .wa-input-bar { padding: 12px; background: #F0F0F0; display: flex; gap: 8px; align-items: center; }
        .wa-input-wrap { flex: 1; background: #fff; border-radius: 24px; padding: 8px 16px; }
        .wa-input { border: none; outline: none; width: 100%; font-size: 15px; position: relative; }
        .wa-send-btn { width: 44px; height: 44px; background: #075E54; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; }
        .wa-send-btn:hover { transform: scale(1.05); }

        .wa-controls { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .wa-lang-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .wa-lang-pill { padding: 6px 16px; border-radius: 20px; border: 1px solid #ddd; background: #fff; font-size: 13px; cursor: pointer; }
        .wa-lang-active { background: #075E54; color: #fff; border-color: #075E54; }
        .wa-scenario-row { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .wa-scenario-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 12px; background: rgba(156,111,228,0.1); border: 1px solid rgba(156,111,228,0.2); color: #9C6FE4; font-size: 13px; font-weight: 600; cursor: pointer; }

        @media (max-width: 768px) {
          .wa-demo-layout { flex-direction: column; align-items: center; gap: 20px; }
          .nik-mascot-col { order: -1; width: 100%; }
          .wa-demo-title { font-size: 32px; }
        }
      `}</style>
    </section>
  );
};

export default LiveDemo;
