import { motion } from "motion/react";
import { sectionVariants } from "@/lib/animations";
import nikaiLogo from "@/assets/nikai-logo.png";
import MagneticButton from "./MagneticButton";

const FinalCTA = () => (
  <section id="cta" className="py-16 sm:py-32 px-4 sm:px-6 relative overflow-hidden bg-transparent border-t border-[rgba(156,111,228,0.08)] z-10" style={{ backgroundImage: "linear-gradient(135deg, rgba(224,64,251,0.06) 0%, rgba(156,111,228,0.08) 50%, rgba(224,64,251,0.06) 100%)" }}>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none blur-[80px]" style={{ backgroundColor: "rgba(224,64,251,0.08)" }} />
    <motion.div
      className="relative mx-auto max-w-[800px] text-center"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2 className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] mb-4 flex items-center justify-center gap-3 flex-wrap">
        See <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">NikAI</span> in action.
      </h2>
      <p className="text-[#4A4A6A] text-lg mb-8 max-w-xl mx-auto">
        Book a 15-minute demo and see how NikAI can transform your operations. No commitment, no pressure.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <MagneticButton>
          <a
            href="#"
            className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 text-sm font-semibold text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-[44px]"
          >
            Book a Demo →
          </a>
        </MagneticButton>
        <a
          href="mailto:hello@nikai.ai"
          className="text-[#4A4A6A] hover:text-[#0D0D1F] transition-all text-sm min-h-[44px] flex items-center"
        >
          Or email us at hello@nikai.ai
        </a>
      </div>
    </motion.div>
  </section>
);

export default FinalCTA;
