import { useState } from "react";
import { motion } from "motion/react";
import { sectionVariants } from "@/lib/animations";

const faqs = [
  {
    q: "Does NikAI really work on WhatsApp?",
    a: "Yes — 100%. No app download needed. Your patients already use WhatsApp daily. NikAI connects directly to your clinic's WhatsApp number and handles all conversations automatically. Setup takes under 10 minutes.",
  },
  {
    q: "What happens if a patient asks something NikAI doesn't understand?",
    a: "NikAI handles 95% of routine queries automatically — bookings, FAQs, directions, rescheduling. For complex questions it doesn't recognise, it politely tells the patient 'Let me connect you with our team' and flags it for your staff. Nothing falls through the cracks.",
  },
  {
    q: "Will it work for my specialty? I run a dental clinic.",
    a: "NikAI is trained for all clinic types — dental, dermatology, orthopaedics, diagnostics, gynaecology, general practice. We customise the AI's responses specifically for your clinic's services, doctors and timings during onboarding.",
  },
  {
    q: "What if I already use Practo or another software?",
    a: "NikAI works alongside your existing tools — it doesn't replace them. It handles patient communication on WhatsApp while your existing software manages records. No migration, no disruption.",
  },
  {
    q: "Is patient data safe and private?",
    a: "Completely. NikAI is built on enterprise-grade infrastructure. Patient conversations are encrypted. We never share or sell data. Fully compliant with Indian data protection standards.",
  },
  {
    q: "How long does setup take?",
    a: "Most clinics are live within 24 hours. Our team handles the entire setup — you just connect your WhatsApp and tell us your clinic details. No technical knowledge needed from your side.",
  },
  {
    q: "What if I want to cancel?",
    a: "No contracts, no lock-ins. Cancel anytime with one message to our team. We'll offboard you within 24 hours with zero friction. We'd rather earn your trust than trap you.",
  },
  {
    q: "Do you support Hindi and regional languages?",
    a: "Yes. NikAI understands Hindi, Hinglish, Telugu, Tamil and other regional languages. Patients can message in their preferred language and NikAI responds naturally in the same language.",
  },
];

const FAQItem = ({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) => (
  <div
    className="border-b"
    style={{ borderColor: "rgba(156,111,228,0.12)" }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 px-2 text-left cursor-pointer group"
    >
      <span
        className="text-[16px] font-semibold text-[#0D0D1F] transition-colors duration-200 group-hover:text-[#E040FB] pr-4"
      >
        {q}
      </span>
      <span
        className="text-[22px] font-light shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
        style={{ color: "#E040FB" }}
      >
        {isOpen ? "−" : "+"}
      </span>
    </button>
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        maxHeight: isOpen ? "500px" : "0px",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <p className="text-[14px] text-[#4A4A6A] leading-[1.8] pb-5 px-2">
        {a}
      </p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-[rgba(156,111,228,0.08)] z-10"
      style={{ background: "rgba(248,248,255,1)" }}
    >
      <div className="mx-auto max-w-[800px] relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] mb-4">
            Everything clinic owners ask before switching
          </h2>
          <p className="text-[#4A4A6A] text-lg max-w-xl mx-auto">
            Honest answers. No sales talk.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl border border-[rgba(156,111,228,0.12)] shadow-[0_4px_40px_rgba(156,111,228,0.08)] p-6 md:p-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
