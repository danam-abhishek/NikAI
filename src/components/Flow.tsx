import { motion } from "motion/react";
import { MessageSquare, Cpu, CalendarCheck, Bell, CreditCard } from "lucide-react";
import { sectionVariants } from "@/lib/animations";

const steps = [
  { icon: MessageSquare, label: "Lead", desc: "Patient messages via WhatsApp", timing: "Instant" },
  { icon: Cpu, label: "AI Processes", desc: "NikAI understands intent", timing: "< 2 seconds" },
  { icon: CalendarCheck, label: "Calendar", desc: "Slot found & booked", timing: "Auto-checked" },
  { icon: Bell, label: "Follow-up", desc: "Reminders sent automatically", timing: "Scheduled" },
  { icon: CreditCard, label: "Payment", desc: "Collection handled", timing: "Collected" },
];

const Flow = () => (
  <section id="flow" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-[rgba(156,111,228,0.08)] z-10" style={{ backgroundImage: "linear-gradient(180deg, #ffffff 0%, rgba(156,111,228,0.04) 50%, #ffffff 100%)" }}>
    {/* Dot grid pattern */}
    <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
      style={{ backgroundImage: "radial-gradient(hsl(262 65% 66%) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
    
    <div className="mx-auto max-w-[1200px] relative z-10">
      <motion.h2
        className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] text-center mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        From first message to confirmed booking — fully automated.
      </motion.h2>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#E040FB] to-[#9C6FE4] opacity-50">
          <div
            className="absolute top-[-3px] w-3 h-3 rounded-full bg-primary"
            style={{
              boxShadow: "0 0 12px hsl(293 96% 62% / 0.6)",
              animation: "travel 2.5s ease-in-out infinite",
            }}
          />
        </div>

        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              className="relative z-10 flex flex-col items-center text-center w-full md:w-1/5"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
            >
              <div
                className="w-20 h-20 rounded-full bg-white border border-[rgba(156,111,228,0.12)] shadow-[0_8px_24px_rgba(224,64,251,0.15)] flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110"
                style={{
                  animation: `pulse-glow 3s ease-in-out infinite ${i * 0.5}s`,
                }}
              >
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-['Geist'] font-bold text-[#0D0D1F] mb-1 text-lg">{step.label}</h3>
              <p className="text-sm text-[#4A4A6A] font-medium">{step.desc}</p>
              <span className="text-[11px] text-[#9C6FE4] font-medium mt-1 block">{step.timing}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default Flow;
