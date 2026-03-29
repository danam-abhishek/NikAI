import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Phone, MoreVertical } from "lucide-react";
import { sectionVariants } from "@/lib/animations";

/* ─── Webhook URL from env ─── */
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string;

/* ─── Persistent chat id ─── */
const CHAT_ID_KEY = "nikai_chat_id";
function getOrCreateChatId(): string {
  let chatId = localStorage.getItem(CHAT_ID_KEY);
  if (!chatId) {
    chatId = crypto.randomUUID();
    localStorage.setItem(CHAT_ID_KEY, chatId);
  }
  return chatId;
}

/* ─── Language config ─── */
interface LangConfig {
  label: string;
  greeting: string;
}

const LANGUAGES: Record<string, LangConfig> = {
  en: {
    label: "English",
    greeting:
      "👋 Hi! I'm the NikAI Assistant. How can I help you today? You can book an appointment, check timings, or ask me anything about your clinic!",
  },
  hi: {
    label: "Hindi",
    greeting:
      "👋 नमस्ते! मैं NikAI असिस्टेंट हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ? आप अपॉइंटमेंट बुक कर सकते हैं, टाइमिंग पूछ सकते हैं, या क्लिनिक के बारे में कुछ भी पूछ सकते हैं!",
  },
  te: {
    label: "Telugu",
    greeting:
      "👋 నమస్కారం! నేను NikAI అసిస్టెంట్. ఈ రోజు మీకు ఎలా సహాయం చేయగలను? మీరు అపాయింట్‌మెంట్ బుక్ చేసుకోవచ్చు, టైమింగ్స్ అడగవచ్చు!",
  },
  te_roman: {
    label: "Telugu (Roman)",
    greeting:
      "👋 Namaskaram! Nenu NikAI Assistant. Ee roju meeku ela sahayam cheyagalanu? Meeru appointment book cheskovachu, timings adagavachu!",
  },
  ta: {
    label: "Tamil",
    greeting:
      "👋 வணக்கம்! நான் NikAI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? நீங்கள் அப்பாயிண்ட்மென்ட் புக் செய்யலாம், நேரங்களைக் கேட்கலாம்!",
  },
  hinglish: {
    label: "Hinglish",
    greeting:
      "👋 Hey! Main NikAI Assistant hoon. Aaj main aapki kaise help kar sakta hoon? Aap appointment book kar sakte ho, timings pooch sakte ho, ya clinic ke baare mein kuch bhi pooch sakte ho!",
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
  { emoji: "🔔", label: "Reminder", message: "Set a reminder for my next appointment" },
];

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface BotReply {
  text: string;
}

/* ─── Time helper ─── */
function getTimeString(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/* ─── Parse bot reply ─── */
function parseBotReply(data: unknown): BotReply {
  if (typeof data === "string") return { text: data };
  if (data && typeof data === "object") {
    const obj = (Array.isArray(data) && data.length > 0 ? data[0] : data) as Record<string, unknown>;
    const textFields = ["output", "message", "text", "response"];
    for (const field of textFields) {
      if (typeof obj[field] === "string" && obj[field]) {
        return { text: obj[field] as string };
      }
    }
    return { text: JSON.stringify(data) };
  }
  return { text: "Sorry, I couldn't process that. Please try again." };
}

async function parseWebhookResponse(response: Response): Promise<BotReply> {
  const ct = response.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return parseBotReply(await response.json());
  }
  return { text: await response.text() };
}

/* ─── Typing indicator ─── */
const TypingIndicator = () => (
  <div className="wa-typing-indicator">
    <div className="wa-typing-dot" style={{ animationDelay: "0s" }} />
    <div className="wa-typing-dot" style={{ animationDelay: "0.2s" }} />
    <div className="wa-typing-dot" style={{ animationDelay: "0.4s" }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */
const LiveDemo = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ─── Switch language ─── */
  const switchLanguage = (langKey: string) => {
    setActiveLang(langKey);
    // Reset chat id so we get a fresh conversation
    localStorage.removeItem(CHAT_ID_KEY);
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
  };

  /* ─── Send text to webhook ─── */
  const sendTextToWebhook = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          chatId: getOrCreateChatId(),
          type: "text",
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const reply = await parseWebhookResponse(response);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: reply.text,
          timestamp: getTimeString(),
        },
      ]);
    } catch (err) {
      console.error("Webhook error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "bot",
          text: "⚠️ Couldn't reach the server. Please make sure the n8n workflow is active and try again.",
          timestamp: getTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  /* ─── Send message ─── */
  const sendMessage = async (text?: string) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: trimmed,
        timestamp: getTimeString(),
      },
    ]);
    setInput("");
    await sendTextToWebhook(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ─── Scenario click ─── */
  const handleScenario = (scenario: Scenario) => {
    sendMessage(scenario.message);
  };

  return (
    <section
      id="demo"
      className="wa-demo-section"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(224,64,251,0.03) 0%, rgba(156,111,228,0.05) 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="wa-demo-glow"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(224,64,251,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="wa-demo-container" ref={sectionRef}>
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
            <span className="wa-demo-live-text">Live chat — powered by AI</span>
          </div>
          <h2 className="wa-demo-title">Try NikAI live</h2>
          <p className="wa-demo-subtitle">
            Chat with our AI assistant right here — just like WhatsApp.
          </p>
        </motion.div>

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
          <div className="wa-chat-area">
            <AnimatePresence>
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`wa-message ${isUser ? "wa-message-sent" : "wa-message-received"}`}
                  >
                    {/* Bubble tail */}
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

            <div ref={chatEndRef} />
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
                className="wa-input"
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="wa-send-btn"
              aria-label="Send message"
            >
              <Send size={20} color="#fff" />
            </button>
          </div>
        </motion.div>

        {/* Language selector */}
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

        {/* Scenario buttons */}
        <div className="wa-scenario-row">
          {SCENARIOS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleScenario(s)}
              disabled={isLoading}
              className="wa-scenario-btn"
            >
              <span className="wa-scenario-emoji">{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inline styles for WhatsApp UI */}
      <style>{`
        /* ─── Bouncing dots ─── */
        @keyframes wa-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .wa-typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 0;
        }
        .wa-typing-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #999;
          animation: wa-bounce 1.4s infinite;
        }

        /* ─── Section ─── */
        .wa-demo-section {
          padding: 48px 16px 60px;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(156,111,228,0.08);
          z-index: 10;
        }
        @media (min-width: 640px) {
          .wa-demo-section { padding: 96px 24px; }
        }
        .wa-demo-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 800px; height: 800px;
          border-radius: 50%;
          pointer-events: none;
        }
        .wa-demo-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        /* ─── Heading ─── */
        .wa-demo-heading {
          text-align: center;
          margin-bottom: 40px;
        }
        .wa-demo-live-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .wa-demo-live-dot-wrap {
          position: relative;
          display: flex;
          width: 10px; height: 10px;
        }
        .wa-demo-live-dot-ping {
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 50%;
          background: #4ade80;
          opacity: 0.75;
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .wa-demo-live-dot {
          position: relative;
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #22c55e;
        }
        .wa-demo-live-text {
          font-size: 13px;
          font-weight: 500;
          color: #16a34a;
        }
        .wa-demo-title {
          font-family: 'Geist', sans-serif;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 600;
          color: #0D0D1F;
          margin-bottom: 16px;
        }
        .wa-demo-subtitle {
          color: #4A4A6A;
          font-size: 18px;
          max-width: 520px;
          margin: 0 auto;
        }

        /* ─── Phone frame ─── */
        .wa-phone-frame {
          max-width: 420px;
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 25px 60px rgba(0,0,0,0.18),
            0 8px 20px rgba(0,0,0,0.1),
            0 0 0 1px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          background: #ECE5DD;
          position: relative;
        }

        /* ─── WhatsApp header ─── */
        .wa-header {
          background: #075E54;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .wa-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .wa-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #25D366, #128C7E);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wa-avatar-text {
          color: #fff;
          font-weight: 700;
          font-size: 18px;
          font-family: 'Geist', sans-serif;
        }
        .wa-header-info {
          display: flex;
          flex-direction: column;
        }
        .wa-header-name {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.2;
          font-family: 'Geist', sans-serif;
        }
        .wa-header-status {
          color: rgba(255,255,255,0.8);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .wa-online-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #25D366;
          display: inline-block;
        }
        .wa-header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* ─── Chat area ─── */
        .wa-chat-area {
          flex: 1;
          min-height: 340px;
          max-height: 420px;
          overflow-y: auto;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background-color: #ECE5DD;
          background-image:
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5beb5' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .wa-chat-area::-webkit-scrollbar { width: 5px; }
        .wa-chat-area::-webkit-scrollbar-track { background: transparent; }
        .wa-chat-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }

        /* ─── Messages ─── */
        .wa-message {
          max-width: 82%;
          padding: 7px 10px 4px;
          font-size: 14px;
          line-height: 1.45;
          position: relative;
          word-wrap: break-word;
        }
        .wa-message-received {
          align-self: flex-start;
          background: #FFFFFF;
          border-radius: 0 8px 8px 8px;
          box-shadow: 0 1px 1px rgba(0,0,0,0.08);
        }
        .wa-message-sent {
          align-self: flex-end;
          background: #DCF8C6;
          border-radius: 8px 0 8px 8px;
          box-shadow: 0 1px 1px rgba(0,0,0,0.08);
        }
        .wa-message-text {
          color: #111B21;
          white-space: pre-wrap;
          margin-bottom: 2px;
        }
        .wa-message-meta {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin-top: 2px;
        }
        .wa-message-time {
          font-size: 11px;
          color: rgba(0,0,0,0.4);
        }
        .wa-tick {
          font-size: 13px;
          color: #53BDEB;
          font-weight: 600;
          letter-spacing: -3px;
          margin-left: 1px;
        }

        /* ─── Bubble tails ─── */
        .wa-bubble-tail {
          position: absolute;
          top: 0;
          width: 12px; height: 12px;
        }
        .wa-tail-received {
          left: -7px;
          clip-path: polygon(100% 0, 0 0, 100% 100%);
          background: #FFFFFF;
        }
        .wa-tail-sent {
          right: -7px;
          clip-path: polygon(0 0, 100% 0, 0 100%);
          background: #DCF8C6;
        }

        /* ─── Input bar ─── */
        .wa-input-bar {
          padding: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F0F0F0;
        }
        .wa-input-wrap {
          flex: 1;
          background: #FFFFFF;
          border-radius: 24px;
          overflow: hidden;
        }
        .wa-input {
          width: 100%;
          padding: 10px 18px;
          border: none;
          outline: none;
          font-size: 15px;
          color: #111B21;
          background: transparent;
          font-family: inherit;
        }
        .wa-input::placeholder {
          color: #999;
        }
        .wa-input:disabled {
          opacity: 0.5;
        }
        .wa-send-btn {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: #075E54;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.15s, background 0.2s;
        }
        .wa-send-btn:hover:not(:disabled) {
          background: #128C7E;
          transform: scale(1.05);
        }
        .wa-send-btn:active:not(:disabled) {
          transform: scale(0.95);
        }
        .wa-send-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* ─── Language pills ─── */
        .wa-lang-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 28px;
        }
        .wa-lang-pill {
          padding: 8px 20px;
          border-radius: 100px;
          border: 1.5px solid #d1d5db;
          background: #fff;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Geist', sans-serif;
        }
        .wa-lang-pill:hover {
          border-color: #25D366;
          color: #075E54;
          background: rgba(37,211,102,0.06);
        }
        .wa-lang-active {
          background: #075E54 !important;
          border-color: #075E54 !important;
          color: #fff !important;
        }

        /* ─── Scenario buttons ─── */
        .wa-scenario-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 16px;
        }
        .wa-scenario-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 12px;
          border: 1.5px solid rgba(7,94,84,0.15);
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(8px);
          font-size: 13px;
          font-weight: 500;
          color: #075E54;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Geist', sans-serif;
        }
        .wa-scenario-btn:hover:not(:disabled) {
          background: #075E54;
          color: #fff;
          border-color: #075E54;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(7,94,84,0.25);
        }
        .wa-scenario-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .wa-scenario-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .wa-scenario-emoji {
          font-size: 16px;
        }

        /* ─── Mobile adjustments ─── */
        @media (max-width: 480px) {
          .wa-phone-frame {
            border-radius: 16px;
            margin: 0 -4px;
          }
          .wa-chat-area {
            min-height: 280px;
            max-height: 360px;
          }
          .wa-demo-subtitle {
            font-size: 15px;
          }
          .wa-lang-pill {
            padding: 6px 14px;
            font-size: 12px;
          }
          .wa-scenario-btn {
            padding: 8px 14px;
            font-size: 12px;
          }
        }
      `}</style>
    </section>
  );
};

export default LiveDemo;
