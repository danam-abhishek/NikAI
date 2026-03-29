import { motion } from "motion/react";
import { X } from "lucide-react";
import { sectionVariants } from "@/lib/animations";
import TiltCard from "./TiltCard";

const problems = [
  { title: "Missed messages after hours", desc: "Patients message at 11pm and get no reply. They book your competitor by morning." },
  { title: "Manual appointment booking", desc: "Staff spend 2+ hours daily on calls and WhatsApp messages that AI can handle instantly." },
  { title: "No-show epidemic", desc: "30% of appointments are missed with no reminder system. Each no-show costs ₹800–₹3,000." },
  { title: "Forgotten follow-ups", desc: "Patients who needed a second visit never come back because nobody followed up." },
  { title: "Zero visibility into operations", desc: "No dashboard, no data, no idea which staff or time slots are most effective." },
];

const Problems = () => (
  <section id="problems" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-transparent border-t border-[rgba(156,111,228,0.08)] z-10">
    {/* Left-side red-pink glow */}
    <div className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, rgba(224,64,251,0.04) 0%, transparent 70%)" }} />

    <div className="mx-auto max-w-[1200px] relative z-10">
      <motion.div
        className="text-center mb-10 sm:mb-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-[rgba(224,64,251,0.08)] border border-[rgba(224,64,251,0.2)] text-[11px] font-bold text-[#E040FB] uppercase tracking-[2px] mb-6">
          THE REAL COST
        </span>
        <h2 className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] mb-4">
          Operations shouldn't be this hard.
        </h2>
        <p className="text-[#4A4A6A] text-lg max-w-2xl mx-auto">
          Every day, clinics lose time, money and patients to problems that AI has already solved.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[1fr_400px] gap-8 md:gap-20 items-center">
        <div className="flex flex-col gap-2">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              className="group flex gap-6 p-6 transition-all duration-300 border-l-4 border-transparent hover:border-[#E040FB] hover:bg-[rgba(224,64,251,0.03)]"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.08}
            >
              <div className="flex-1">
                <h3 className="font-['Geist'] text-lg font-bold text-[#0D0D1F] mb-1 group-hover:text-destructive transition-colors">{p.title}</h3>
                <p className="text-sm text-[#4A4A6A] leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <TiltCard
          innerClassName="relative flex flex-col items-center text-center p-6 sm:p-12 rounded-[20px] bg-white border border-[rgba(156,111,228,0.12)] shadow-[0_20px_60px_rgba(224,64,251,0.12)]"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.3}
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <span className="font-['Syne'] text-[clamp(60px,20vw,120px)] font-bold text-primary leading-none animate-pulse blur-[2px] opacity-50 absolute inset-0">30%</span>
              <span className="font-['Syne'] text-[clamp(60px,20vw,120px)] font-bold text-primary leading-none relative z-10 [filter:drop-shadow(0_0_20px_rgba(224,64,251,0.4))]">30%</span>
            </div>
            
            <p className="text-[#0D0D1F] font-semibold mt-4 mb-8">Average revenue lost to operational inefficiency</p>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-accent/10 rounded-full mb-8 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "30%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="h-full bg-gradient-to-r from-primary to-accent" 
              />
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
              <p className="text-sm text-amber-400 font-medium tracking-tight">₹18,000/month average for a small clinic</p>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  </section>
);

export default Problems;
