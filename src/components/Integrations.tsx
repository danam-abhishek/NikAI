import { motion } from "motion/react";
import { sectionVariants } from "@/lib/animations";

const integrations = [
  { name: "WhatsApp Business", icon: "💬", color: "#25D366" },
  { name: "Google Calendar", icon: "📅", color: "#4285F4" },
  { name: "Practo", icon: "🏥", color: "#9C6FE4" },
  { name: "Gmail", icon: "📧", color: "#EA4335" },
  { name: "Razorpay", icon: "💳", color: "#3395FF" },
  { name: "Zoho CRM", icon: "📊", color: "#E8792C" },
  { name: "Google Meet", icon: "🎥", color: "#00897B" },
  { name: "Your HMS", icon: "🖥️", color: "#6B6B8A" },
];

const Integrations = () => (
  <section
    id="integrations"
    className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-white border-t border-[rgba(156,111,228,0.08)] z-10"
  >
    <div className="mx-auto max-w-[1200px] relative z-10">
      <motion.div
        className="text-center mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] mb-4">
          Works with tools your clinic already uses
        </h2>
        <p className="text-[#4A4A6A] text-lg max-w-xl mx-auto">
          No migration. No disruption. Plug in and go.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {integrations.map((item, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-3 bg-white rounded-xl p-5 md:p-6 border transition-all duration-200 cursor-default hover:-translate-y-[3px]"
            style={{
              borderColor: "rgba(156,111,228,0.15)",
            }}
            whileHover={{
              borderColor: "rgba(224,64,251,0.4)",
              boxShadow: "0 8px 32px rgba(224,64,251,0.1)",
            }}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i * 0.05}
          >
            <span className="text-3xl md:text-4xl" role="img" aria-label={item.name}>
              {item.icon}
            </span>
            <span className="text-[13px] md:text-[14px] font-semibold text-[#0D0D1F] text-center">
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-[14px] text-[#4A4A6A]">
        <span className="text-[#E040FB] font-medium cursor-pointer hover:underline">
          + More integrations coming soon
        </span>
      </p>
    </div>
  </section>
);

export default Integrations;
