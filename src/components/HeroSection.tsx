import { motion } from "motion/react";
import React from "react";
import MagneticButton from "./MagneticButton";

const HeroSection = () => {
  const getAnimation = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center bg-white overflow-hidden">
      {/* Background Video Layer */}
      <div className="absolute inset-x-0 top-0 h-screen pointer-events-none z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover [transform:scaleY(-1)]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[1200px] px-4 sm:px-6 pt-[140px] sm:pt-[200px] md:pt-[290px] flex flex-col gap-6 sm:gap-[32px] items-center text-center">
        {/* Main Heading */}
        <motion.h1
          className="font-['Geist'] font-medium tracking-[-0.04em] text-[clamp(36px,10vw,80px)] leading-[1.1] text-[#0D0D1F]"
          {...getAnimation(0)}
        >
          AI that runs your{" "}
          <br className="hidden md:block" />
          <span className="font-['Instrument_Serif'] italic text-[clamp(44px,12vw,100px)] text-[#E040FB]">
            operations.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="font-['Geist'] text-[clamp(14px,4vw,18px)] text-[#373a46] opacity-80 max-w-[554px] mx-auto leading-relaxed px-2"
          {...getAnimation(0.15)}
        >
          Connect your WhatsApp. NikAI handles bookings, reminders, follow-ups and patient replies — 24 hours a day, automatically.
        </motion.p>

        {/* Interactive Components: Buttons Container */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 bg-[#fcfcfc] rounded-[40px] p-2 border border-[rgba(29,29,29,0.08)] shadow-[0px_10px_40px_5px_rgba(194,194,194,0.25)]"
          {...getAnimation(0.3)}
        >
          <MagneticButton>
            <a
              href="#cta"
              className="rounded-[32px] bg-gradient-to-b from-[#2a2a3e] to-[#0A0A18] px-8 py-3.5 text-sm font-semibold text-white hover:scale-[1.03] active:scale-[0.97] transition-all min-h-[44px] flex items-center justify-center shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)]"
            >
              Book a Demo →
            </a>
          </MagneticButton>
          <MagneticButton>
            <a
              href="#pricing"
              className="rounded-[32px] bg-transparent border border-[rgba(156,111,228,0.5)] px-8 py-3.5 text-sm font-semibold text-[#9C6FE4] hover:bg-[rgba(156,111,228,0.05)] transition-colors min-h-[44px] flex items-center justify-center"
            >
              Start Free Trial
            </a>
          </MagneticButton>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="flex flex-col items-center gap-3 mt-2"
          {...getAnimation(0.45)}
        >
          <div className="flex -space-x-3">
            {["CC", "MD", "LH", "SC", "PD"].map((initials, i) => (
              <div key={i} className="flex items-center justify-center w-[38px] h-[38px] rounded-full border-2 border-white bg-gradient-to-br from-[#e040fb]/20 to-[#9c6fe4]/20 text-[#0A0A18] text-[11px] font-bold shadow-sm">
                {initials}
              </div>
            ))}
          </div>
          <div className="text-[13px] text-[#373a46] opacity-80 font-medium">
            <span className="text-[#E040FB] mr-1 tracking-widest text-[14px]">★★★★★</span> Trusted by 50+ clinics across India
          </div>
        </motion.div>

        {/* Stat Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-4"
          {...getAnimation(0.6)}
        >
          {[
            "0 → Booked in 60s",
            "90% fewer no-shows",
            "24/7 AI replies"
          ].map((stat, i) => (
            <div 
              key={i} 
              className="rounded-full bg-[rgba(224,64,251,0.08)] border-[0.5px] border-[rgba(224,64,251,0.2)] px-4 py-2 text-[14px] font-medium text-[#0A0A18]"
            >
              {stat}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
