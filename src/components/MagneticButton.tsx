import { ReactNode, useEffect, useRef } from 'react';

export default function MagneticButton({ children, className = '' }: { children: ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isInside = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      const radius = 80;
      const maxDisplacement = 8;

      if (distance < radius) {
        isInside = true;
        // Calculate offset based on distance from center
        const x = (distanceX / radius) * maxDisplacement;
        const y = (distanceY / radius) * maxDisplacement;
        
        el.style.transition = 'transform 0.1s linear';
        el.style.transform = `translate(${x}px, ${y}px)`;
      } else if (isInside) {
        isInside = false;
        el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = 'translate(0px, 0px)';
      }
    };

    const handleMouseLeave = () => {
      isInside = false;
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translate(0px, 0px)';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`inline-block relative z-50 ${className}`}>
      {children}
    </div>
  );
}
