import { motion } from "motion/react";

const Marquee = () => {
  const content = "50+ clinics across India ✦ 10,000+ appointments booked ✦ 99% uptime ✦ Works on 2G ✦ WhatsApp-native ✦ Live in 24 hours ✦ No credit card required ✦ Built in India ✦ ";
  
  return (
    <div className="w-full overflow-hidden bg-[rgba(224,64,251,0.06)] border-y border-[rgba(224,64,251,0.12)] py-3 relative z-10">
      {/* Faded edges mask left+right */}
      <div className="absolute inset-0 z-10 pointer-events-none [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]" />
      
      <motion.div
        className="flex whitespace-nowrap text-[13px] font-medium text-[rgba(224,64,251,0.8)]"
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="px-4">
            {content}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
