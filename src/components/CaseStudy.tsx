import { motion } from "motion/react";
import { sectionVariants } from "@/lib/animations";

const metrics = [
  { value: "50%", label: "Drop in no-shows" },
  { value: "94%", label: "Confirmation rate" },
  { value: "30 days", label: "To see results" },
];

const CaseStudy = () => (
  <section
    id="case-study"
    className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-white border-t border-[rgba(156,111,228,0.08)] z-10"
  >
    <div className="mx-auto max-w-[1200px]">
      <motion.div
        className="rounded-[20px] p-8 md:p-12 border relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(224,64,251,0.04), rgba(156,111,228,0.06))",
          borderColor: "rgba(224,64,251,0.2)",
        }}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          {/* Left side — text */}
          <div className="flex-1">
            <h3 className="font-['Syne'] text-[clamp(22px,4vw,32px)] font-bold text-[#0D0D1F] mb-2 leading-tight">
              City Health Clinic cut no-shows by 50% in 30 days
            </h3>
            <p className="text-[#9C6FE4] font-medium text-sm mb-6">
              Dr. Priya Sharma, Mumbai
            </p>
            <p className="text-[#4A4A6A] text-[15px] leading-relaxed mb-8">
              "Before NikAI, we were losing 8-10 patients every night. Receptionists were overwhelmed. Within a week of going live, our appointment confirmations went from 65% to 94%. The WhatsApp reminders work better than calls."
            </p>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 text-[#E040FB] font-semibold text-sm hover:gap-3 transition-all duration-200"
            >
              Read the full story →
            </a>
          </div>

          {/* Right side — metric boxes */}
          <div className="flex flex-wrap justify-center lg:flex-col gap-3 sm:gap-4 shrink-0">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 sm:p-5 text-center min-w-[90px] sm:min-w-[120px] border border-[rgba(156,111,228,0.12)] shadow-[0_4px_16px_rgba(156,111,228,0.06)]"
              >
                <p className="font-['Syne'] text-[28px] font-bold text-[#E040FB] leading-none mb-1">
                  {m.value}
                </p>
                <p className="text-[11px] text-[#4A4A6A] uppercase tracking-wider font-medium">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CaseStudy;
