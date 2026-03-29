import { motion } from "motion/react";
import { Linkedin, Instagram, Users, HeartHandshake, Sparkles } from "lucide-react";
import { sectionVariants } from "@/lib/animations";
import TiltCard from "./TiltCard";
import founderPhoto from "@/assets/jhon-abhishek.jpg";

const whyColumns = [
  { icon: Users, title: "Clinics were losing patients", desc: "67% of patients who get no reply book a competitor within 1 hour." },
  { icon: HeartHandshake, title: "Staff burned out on admin", desc: "Receptionists spending 2 hours on repeat questions — that's not patient care." },
  { icon: Sparkles, title: "AI should be for everyone", desc: "Enterprise clinics had AI. Small clinics had nothing. NikAI changes that." },
];

const Team = () => (
  <section id="about" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-transparent border-t border-[rgba(156,111,228,0.08)] z-10" style={{ backgroundImage: "linear-gradient(180deg, rgba(156,111,228,0.04) 0%, #ffffff 60%)" }}>
    {/* Centered light glow background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

    <div className="mx-auto max-w-[1200px] relative z-10">
      <motion.div
        className="text-center mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] mb-4">
          Built by someone who saw the problem firsthand.
        </h2>
        <p className="text-[#4A4A6A] text-lg max-w-2xl mx-auto">
          NikAI was born from visiting clinics across Hyderabad and seeing doctors lose patients every night — just because nobody could reply after 6pm.
        </p>
      </motion.div>

      {/* Founder card - Horizontal */}
      <TiltCard
        className="mx-auto max-w-4xl mb-20"
        innerClassName="p-5 sm:p-10 bg-white border border-[rgba(156,111,228,0.15)] group hover:shadow-[0_16px_64px_rgba(224,64,251,0.15)] shadow-[0_8px_48px_rgba(224,64,251,0.08)] transition-all duration-500 overflow-hidden relative"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="">
          {/* Card shine effect - builtin TiltCard shine is better for mouse follow, but we keep this for visual depth */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />
          
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 relative z-10">
              <div className="relative shrink-0" style={{ outline: "3px solid #E040FB", outlineOffset: "4px", borderRadius: "50%" }}>
                <div className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full p-1 bg-gradient-to-br from-primary via-accent to-primary">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                     <img src={founderPhoto} alt="Jhon Abhishek Simha" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-[10px] font-black px-3 py-1 rounded-full text-white tracking-widest uppercase">FOUNDER</div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h3 className="font-['Syne'] text-xl sm:text-3xl font-bold text-[#0D0D1F] mb-1">Jhon Abhishek Simha</h3>
                <p className="text-primary font-medium text-sm mb-6">Founder & CEO, NikAI</p>
                <p className="text-[#4A4A6A] text-[15px] leading-relaxed mb-8">
                  "I spent weeks visiting clinics across India before writing a single line of code. Every doctor I met had the same problem — patients messaging after hours with no reply, staff drowning in WhatsApp, appointments lost to competitors. NikAI is my answer to that."
                </p>
              <div className="flex justify-center md:justify-start gap-4">
                <button className="p-2.5 rounded-xl border border-[rgba(29,29,29,0.1)] text-[#4A4A6A] hover:text-primary hover:border-primary/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-w-[44px] min-h-[44px]">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl border border-[rgba(29,29,29,0.1)] text-[#4A4A6A] hover:text-primary hover:border-primary/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-w-[44px] min-h-[44px]">
                  <Instagram className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[13px] text-[#6B6B8A] mt-4 flex items-center gap-1 justify-center md:justify-start">
                📍 Hyderabad, India
              </p>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Why columns */}
      <div className="grid md:grid-cols-3 gap-8 mb-24">
        {whyColumns.map((col, i) => {
          const Icon = col.icon;
          return (
            <TiltCard
              key={i}
              innerClassName="relative p-8 bg-[rgba(248,248,255,1)] border border-[rgba(156,111,228,0.15)] transition-transform hover:-translate-y-2 overflow-hidden"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
            >
              <div className="">
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: i === 0 ? "#E040FB" : i === 1 ? "#9C6FE4" : "linear-gradient(to right, #E040FB, #9C6FE4)" }} />
                
                {/* background number */}
                <span className="absolute top-4 right-6 text-7xl font-black text-[#0A0A18]/[0.02] leading-none pointer-events-none">
                  0{i + 1}
                </span>
                
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-['Geist'] text-lg font-bold text-[#0D0D1F] mb-3">{col.title}</h3>
                <p className="text-sm text-[#4A4A6A] leading-relaxed">{col.desc}</p>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Hiring / Email */}
      <motion.div
        className="text-center p-6 sm:p-12 rounded-[24px] border-[0.5px] border-[rgba(156,111,228,0.15)] bg-[#F8F8FF]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <p className="text-[#0D0D1F] text-lg mb-4">Join us building the future of clinic operations in India.</p>
        <a href="mailto:hello@nikai.ai" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-bold text-xl">
          hello@nikai.ai <Sparkles className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
  </section>
);

export default Team;
