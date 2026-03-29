import { motion } from "motion/react";
import { Star, CheckCircle } from "lucide-react";
import { sectionVariants } from "@/lib/animations";
import TiltCard from "./TiltCard";

const testimonials = [
  {
    quote: "NikAI reduced our no-shows by 50% in the first month. The WhatsApp reminders are exactly what our patients needed.",
    initials: "PS", name: "Dr. Priya Sharma", title: "Director, City Health Clinic, Mumbai",
  },
  {
    quote: "Setting up was surprisingly easy. We were live in a day, and the support team was there every step of the way.",
    initials: "RK", name: "Rajesh Kumar", title: "Operations Manager, Bangalore",
  },
  {
    quote: "Finally, a system that understands how we work. No more manual follow-ups, no more missed appointments.",
    initials: "AP", name: "Dr. Amit Patel", title: "Founder, LifeCare Diagnostics, Delhi",
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-[rgba(156,111,228,0.08)] z-10" style={{ backgroundColor: "rgba(248,248,255,1)" }}>
    {/* Right-side light glow */}
    <div className="absolute top-1/2 -right-[10%] -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
    
    <div className="mx-auto max-w-[1200px] relative z-10">
      <motion.div
        className="text-center mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] mb-4">
          Built with operators, for operators
        </h2>
        <p className="text-[#4A4A6A] text-lg max-w-xl mx-auto">
          Hear from clinics that transformed their operations with NikAI.
        </p>
      </motion.div>

      <p className="text-center text-[12px] text-[#4AE68A] font-medium mb-8">
        ● Verified clinic owners — real results, not actors
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <TiltCard
            key={i}
            innerClassName="p-7 bg-white border-[0.5px] border-[rgba(156,111,228,0.12)] shadow-[0_4px_24px_rgba(156,111,228,0.08)] hover:border-[rgba(224,64,251,0.25)] hover:shadow-[0_8px_40px_rgba(224,64,251,0.12)] transition-all duration-300"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.1}
          >
            <div className="">
              <div className="flex mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                ))}
              </div>
              <p className="text-[#4A4A6A] mb-6 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#0D0D1F] text-sm">{t.name}</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-xs text-[#6B6B8A]">{t.title}</p>
                </div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
