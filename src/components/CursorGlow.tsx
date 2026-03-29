import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

const CursorGlow = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Spring animations for smoothness
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const lagPos = {
    x: useSpring(0, springConfig),
    y: useSpring(0, springConfig),
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      lagPos.x.set(e.clientX - 200);
      lagPos.y.set(e.clientY - 200);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("button, a, [role='button']"));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleHover);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleHover);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* 400px glow circle with lag */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          left: lagPos.x,
          top: lagPos.y,
          background: "radial-gradient(circle, rgba(224,64,251,0.08) 0%, transparent 70%)",
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 0.5,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      />

      {/* 6px dot with 0ms lag */}
      <div
        className="absolute w-1.5 h-1.5 bg-white rounded-full mix-blend-difference"
        style={{
          left: mousePos.x - 3,
          top: mousePos.y - 3,
          transition: "transform 0.1s ease-out",
          transform: isHovering ? "scale(2.5)" : "scale(1)",
        }}
      />
    </div>
  );
};

export default CursorGlow;
