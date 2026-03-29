import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from "motion/react";

interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  innerStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

/**
 * Simplified TiltCard that no longer tilts.
 * We keep the structure to avoid breaking existing component implementations.
 */
export default function TiltCard({ children, className = '', innerClassName = '', innerStyle, style, ...props }: TiltCardProps) {
  return (
    <motion.div 
      className={className} 
      style={style}
      {...props}
    >
      <div 
        className={`w-full h-full relative rounded-[inherit] ${innerClassName}`}
        style={innerStyle}
      >
        {children}
      </div>
    </motion.div>
  );
}
