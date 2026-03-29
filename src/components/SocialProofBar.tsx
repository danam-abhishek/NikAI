import { motion } from "motion/react";
import { sectionVariants } from "@/lib/animations";

const mediaLogos = ["YourStory", "Inc42", "The Hindu Business Line", "Startup India"];

const SocialProofBar = () => (
  <div className="w-full bg-white border-t border-b py-4 relative z-10" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
    <motion.div
      className="mx-auto max-w-[1200px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <span className="text-[12px] text-[#6B6B8A] font-medium tracking-wide">As featured in:</span>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {mediaLogos.map((name) => (
          <span
            key={name}
            className="px-4 py-1.5 rounded-full bg-[rgba(0,0,0,0.03)] text-[12px] font-semibold text-[#6B6B8A] tracking-wide border border-[rgba(0,0,0,0.04)] select-none"
          >
            {name}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);

export default SocialProofBar;
