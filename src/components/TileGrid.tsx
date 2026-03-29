import { motion } from "motion/react";

const TileGrid = () => (
  <div className="fixed inset-0 grid grid-cols-[repeat(auto-fill,120px)] grid-rows-[repeat(auto-fill,120px)] gap-1 p-1 opacity-60 pointer-events-none z-0 overflow-hidden">
    {[...Array(300)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: Math.random() * 0.8,
          duration: 0.5,
        }}
        className="relative w-[120px] h-[120px] rounded-[16px] border border-black/5 dark:border-white/10 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, 
            ${i % 10 < 3 ? "rgba(156,111,228,0.3)" : i % 10 < 7 ? "rgba(224,64,251,0.3)" : "rgba(255,107,107,0.3)"} 0%, 
            transparent 100%)`,
        }}
      >
        <span className="absolute top-2 right-2 text-[10px] opacity-40 text-black dark:text-white">✦</span>
      </motion.div>
    ))}
  </div>
);

export default TileGrid;
