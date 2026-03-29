import { motion } from "motion/react";
import { sectionVariants } from "@/lib/animations";

const rows = [
  { feature: "Available 24/7", traditional: "Only office hours", nikai: "Always on" },
  { feature: "Replies in seconds", traditional: "Hours or missed", nikai: "Under 60s" },
  { feature: "Auto-books calendar", traditional: "Manual entry", nikai: "Automatic" },
  { feature: "Sends reminders", traditional: "Staff must call", nikai: "Automated" },
  { feature: "Works on WhatsApp", traditional: "Separate app", nikai: "Native" },
  { feature: "No-show follow-up", traditional: "Forgotten", nikai: "Auto re-engage" },
  { feature: "Understands Hindi", traditional: "English only", nikai: "Hindi + regional" },
  { feature: "Setup time", traditional: "Weeks", nikai: "Under 24hrs" },
  { feature: "Extra staff needed", traditional: "Yes", nikai: "Zero" },
];

const Comparison = () => (
  <section
    id="comparison"
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
          Why clinic owners choose NikAI over others
        </h2>
        <p className="text-[#4A4A6A] text-lg max-w-xl mx-auto">
          Not just another automation tool.
        </p>
      </motion.div>

      <motion.div
        className="overflow-x-auto rounded-2xl border border-[rgba(156,111,228,0.12)] shadow-[0_4px_40px_rgba(156,111,228,0.08)]"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr style={{ background: "rgba(224,64,251,0.06)" }}>
              <th className="text-left px-6 py-4 text-[14px] font-semibold text-[#0D0D1F] border-b border-[rgba(156,111,228,0.12)]">
                Feature
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-semibold text-[#6B6B8A] border-b border-[rgba(156,111,228,0.12)]">
                Traditional Methods
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-bold text-[#E040FB] border-b border-[rgba(156,111,228,0.12)]">
                NikAI
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{ background: i % 2 === 0 ? "#ffffff" : "rgba(248,248,255,1)" }}
                className="transition-colors"
              >
                <td className="px-6 py-4 text-[14px] font-medium text-[#0D0D1F] border-b border-[rgba(156,111,228,0.06)]">
                  {row.feature}
                </td>
                <td className="px-6 py-4 text-[14px] text-[#6B6B8A] border-b border-[rgba(156,111,228,0.06)]">
                  <span className="text-[#FF6B6B] font-bold mr-2">✗</span>
                  {row.traditional}
                </td>
                <td className="px-6 py-4 text-[14px] text-[#0D0D1F] font-medium border-b border-[rgba(156,111,228,0.06)]">
                  <span className="text-[#4AE68A] font-bold mr-2">✓</span>
                  {row.nikai}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  </section>
);

export default Comparison;
