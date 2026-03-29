import { motion } from "motion/react";
import { CalendarClock, MessageCircle, Phone, BarChart3, Puzzle, Globe } from "lucide-react";
import { sectionVariants } from "@/lib/animations";
import TiltCard from "./TiltCard";

const features = [
  { icon: CalendarClock, title: "Smart Scheduling & Reminders", desc: "Automated appointment booking and timely reminders that reduce no-shows by up to 90%." },
  { icon: MessageCircle, title: "WhatsApp-First Automation", desc: "Meet your patients where they are. Automated messages, confirmations, and follow-ups." },
  { icon: Phone, title: "AI-Assisted Calling", desc: "Handle routine calls automatically. Free your staff for what matters.", badge: "Pro" },
  { icon: BarChart3, title: "Operations Dashboard", desc: "Real-time visibility into appointments, staff performance, and daily metrics." },
  { icon: Puzzle, title: "Works With Your Systems", desc: "No migration required. NikAI integrates with your existing tools and workflows." },
  { icon: Globe, title: "Built for Indian Clinics", desc: "Works on 2G. WhatsApp-native. Understands Hindi and regional languages. Made in India." },
];

const Features = () => (
  <section id="features" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-white border-t border-[rgba(156,111,228,0.08)] z-10">
    {/* Faint diagonal texture */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
      style={{ backgroundImage: "linear-gradient(45deg, #fff 25%, transparent 25%, transparent 50%, #fff 50%, #fff 75%, transparent 75%, transparent)" , backgroundSize: "4px 4px" }} />
    
    {/* Top-right purple glow */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at top right, rgba(156,111,228,0.05) 0%, transparent 60%)" }} />

    <div className="mx-auto max-w-[1200px] relative z-10">
      <motion.div
        className="text-center mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] mb-4">
          Everything you need to run smoothly
        </h2>
        <p className="text-[#4A4A6A] text-lg max-w-xl mx-auto">
          Simple tools that work together to automate your daily operations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TiltCard
          className="md:col-span-2"
          innerClassName="group p-8 border-[0.5px] border-[rgba(156,111,228,0.15)] hover:border-[rgba(224,64,251,0.3)] hover:shadow-[0_8px_32px_rgba(224,64,251,0.1)] transition-all duration-300 relative overflow-hidden"
          innerStyle={{ background: "linear-gradient(135deg, rgba(224,64,251,0.05), rgba(156,111,228,0.08))" }}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-['Geist'] text-2xl font-bold text-[#0D0D1F] mb-3">WhatsApp Automation</h3>
            <p className="text-[#4A4A6A] mb-8 max-w-md">Meet your patients where they are. Automated messages, confirmations, and follow-ups with natural language understanding.</p>
            
            {/* Mini chat preview */}
            <div className="mt-auto bg-background/50 border border-accent/10 rounded-xl p-4 self-start w-full max-w-[300px] scale-90 origin-bottom-left">
              <div className="flex flex-col gap-2 text-xs">
                <div className="bg-primary/10 self-start p-2 rounded-lg rounded-tl-none">Hello! I'd like to book an appointment.</div>
                <div className="bg-primary self-end p-2 rounded-lg rounded-tr-none text-white">Sure! We have slots tomorrow at 10am or 2pm. Which works for you?</div>
              </div>
            </div>
          </div>
        </TiltCard>

        <TiltCard
          className="md:row-span-2"
          innerClassName="group p-8 border-[0.5px] border-[rgba(156,111,228,0.15)] hover:border-[rgba(224,64,251,0.3)] hover:shadow-[0_8px_32px_rgba(224,64,251,0.1)] transition-all duration-300 flex flex-col"
          innerStyle={{ background: "rgba(156,111,228,0.05)" }}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <CalendarClock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-['Geist'] text-xl font-bold text-[#0D0D1F] mb-3">Smart Scheduling</h3>
            <p className="text-[#4A4A6A] text-sm flex-1">Automated booking and reminders that reduce no-shows by 90%. Handles cancellations and rescheduling instantly.</p>
            
            {/* Mini calendar view */}
            <div className="mt-8 grid grid-cols-7 gap-1 opacity-40">
              {[...Array(21)].map((_, i) => (
                <div key={i} className={`h-6 rounded-sm ${i % 7 === 2 ? "bg-primary" : "bg-white/5"}`} />
              ))}
            </div>
          </div>
        </TiltCard>

        <TiltCard
          innerClassName="group p-8 bg-[#F8F8FF] border-[0.5px] border-[rgba(156,111,228,0.15)] hover:border-[rgba(224,64,251,0.3)] hover:shadow-[0_8px_32px_rgba(224,64,251,0.1)] transition-all duration-300"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-['Geist'] font-bold text-[#0D0D1F] mb-2">Operations Dashboard</h3>
            <p className="text-xs text-[#4A4A6A] mb-4">Real-time visibility into staff performance and daily metrics.</p>
            {/* Sparkline */}
            <div className="h-10 w-full flex items-end gap-1 opacity-30">
              {[40, 70, 45, 90, 65, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </TiltCard>

        <TiltCard
          innerClassName="group p-8 bg-[#F8F8FF] border-[0.5px] border-[rgba(156,111,228,0.15)] hover:border-[rgba(224,64,251,0.3)] hover:shadow-[0_8px_32px_rgba(224,64,251,0.1)] transition-all duration-300"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Puzzle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-['Geist'] font-bold text-[#0D0D1F] mb-2">Easy Integrations</h3>
            <p className="text-xs text-[#4A4A6A]">NikAI works with your existing HMS and tools seamlessly.</p>
            <div className="mt-4 flex gap-2">
              <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-[#4A4A6A]">Practo</div>
              <div className="px-2 py-1 rounded bg-white/5 text-[10px] text-[#4A4A6A]">HMS</div>
            </div>
          </div>
        </TiltCard>

        <TiltCard
          className="md:col-span-2"
          innerClassName="group p-8 bg-[#F8F8FF] border-[0.5px] border-[rgba(156,111,228,0.15)] hover:border-[rgba(224,64,251,0.3)] hover:shadow-[0_8px_32px_rgba(224,64,251,0.1)] transition-all duration-300"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-['Geist'] text-xl font-bold text-[#0D0D1F] mb-1">Built for Indian Clinics</h3>
              <p className="text-[#4A4A6A] text-sm">Understands Hindi & Hinglish. Optimized for 2G networks.</p>
            </div>
            <div className="hidden md:flex gap-2 ml-auto">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] text-primary font-bold">BHASHINI AI</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-[10px] text-primary font-bold">UPI ENABLED</span>
            </div>
          </div>
        </TiltCard>

        <TiltCard
          innerClassName="group p-8 bg-[#F8F8FF] border-[0.5px] border-[rgba(156,111,228,0.15)] hover:border-[rgba(224,64,251,0.3)] hover:shadow-[0_8px_32px_rgba(224,64,251,0.1)] transition-all duration-300"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded italic">PRO</span>
            </div>
            <h3 className="font-['Geist'] font-bold text-[#0D0D1F] mb-2">AI-Assisted Calling</h3>
            <p className="text-xs text-[#4A4A6A]">Handle routine calls automatically with human-like voice AI.</p>
          </div>
        </TiltCard>
      </div>
    </div>
  </section>
);

export default Features;
