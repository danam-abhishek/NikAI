import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import nikaiLogo from "@/assets/nikai-logo.png";
import MagneticButton from "./MagneticButton";

// ── Live Clinics Counter ─────────────────────────────────
const LiveClinicsCounter = () => {
  const [count, setCount] = useState(() => Math.floor(Math.random() * (58 - 42 + 1)) + 42);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = useCallback(() => {
    const delay = (Math.random() * 4 + 4) * 1000; // 4–8s
    timerRef.current = setTimeout(() => {
      setCount(prev => prev >= 58 ? 42 : prev + 1);
      scheduleNext();
    }, delay);
  }, []);

  useEffect(() => {
    scheduleNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scheduleNext]);

  return (
    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-[20px] select-none"
      style={{
        background: 'rgba(74,230,138,0.08)',
        border: '0.5px solid rgba(74,230,138,0.3)',
      }}
    >
      <span
        className="inline-block w-[6px] h-[6px] rounded-full"
        style={{
          background: '#4AE68A',
          animation: 'clinicDotPulse 2s ease-in-out infinite',
        }}
      />
      <span style={{ fontSize: '12px', color: '#4AE68A', fontWeight: 600, whiteSpace: 'nowrap' }}>
        {count} clinics active
      </span>
    </div>
  );
};

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 border-b border-[rgba(29,29,29,0.08)]"
            : "bg-transparent"
        } backdrop-blur-md`}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <img
            src={nikaiLogo}
            alt="NikAI"
            className="h-8 sm:h-10 shrink-0"
          />
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  activeSection === link.href.slice(1)
                    ? "text-[#0A0A18] font-bold"
                    : "text-[#373a46] opacity-60 hover:opacity-100 hover:text-[#0A0A18]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <LiveClinicsCounter />
          <div className="hidden md:flex items-center gap-3">
            <MagneticButton>
              <a
                href="#cta"
                className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-medium text-primary-foreground hover:scale-[1.03] active:scale-[0.97] transition-transform"
              >
                Book a Demo
              </a>
            </MagneticButton>
          </div>
          <button
            className="md:hidden text-[#0A0A18] min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-white/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-2xl font-bold text-[#0A0A18] min-h-[44px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <MagneticButton>
            <a
              href="#cta"
              className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-lg font-medium text-primary-foreground min-h-[44px]"
              onClick={() => setMobileOpen(false)}
            >
              Book a Demo
            </a>
          </MagneticButton>
        </motion.div>
      )}

    </>
  );
};

export default Navbar;
