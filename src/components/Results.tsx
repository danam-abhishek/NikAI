import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { sectionVariants } from "@/lib/animations";

const CountUp = ({ target, suffix = "", duration = 1800 }: { target: number; suffix?: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
};

const metrics = [
  { value: 3, suffix: "x", label: "more bookings per month", color: "text-primary" },
  { value: 90, suffix: "%", label: "drop in no-shows", color: "text-accent" },
  { value: 2, suffix: "hrs", label: "saved daily by staff", color: "text-primary" },
  { value: 0, suffix: "", label: "extra staff needed", color: "text-accent", prefix: "₹" },
];

const Results = () => (
  <section id="results" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-transparent border-t border-[rgba(156,111,228,0.08)] z-10" style={{ backgroundImage: "linear-gradient(135deg, rgba(224,64,251,0.04), rgba(156,111,228,0.06))" }}>
    {/* Shimmer overlay */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-black/5 to-transparent skew-x-[-25deg] animate-[shimmer_4s_infinite]" />
    </div>

    <div className="mx-auto max-w-[1200px] relative z-10">
      <motion.h2
        className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] text-center mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        Numbers that make clinic owners switch.
      </motion.h2>

      <motion.div
        className="p-6 sm:p-12 rounded-[24px] bg-white shadow-[0_4px_40px_rgba(156,111,228,0.08)] border border-[rgba(156,111,228,0.12)] relative overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 relative">
          {/* Divider lines */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-[rgba(156,111,228,0.15)]" />
          <div className="hidden md:block absolute left-0 right-0 top-1/2 h-px bg-[rgba(156,111,228,0.15)]" />

          {metrics.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center px-4 sm:px-8 ${
                i % 2 === 0 ? "md:pr-12" : "md:pl-12"
              }`}
            >
              <p className={`font-['Syne'] text-[clamp(48px,8vw,72px)] font-bold leading-none mb-3 ${
                i % 2 === 0 ? "text-primary" : "text-accent"
              } [text-shadow:0_0_40px_rgba(224,64,251,0.2)]`}>
                {m.prefix || ""}
                {m.value === 0 ? "0" : <CountUp target={m.value} suffix={m.suffix} />}
              </p>
              <p className="text-[#4A4A6A] text-sm uppercase tracking-widest font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default Results;
