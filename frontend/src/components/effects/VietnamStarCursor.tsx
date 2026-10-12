import React, { useEffect, useState, useRef } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  vx: number;
  vy: number;
}

interface VietnamStarCursorProps {
  enabled?: boolean;
}

export const VietnamStarCursor: React.FC<VietnamStarCursorProps> = ({ enabled = true }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isPointer, setIsPointer] = useState(false);
  const sparkleIdRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = 
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.onclick !== null ||
          window.getComputedStyle(target).cursor === 'pointer';
        setIsPointer(isClickable);
      }

      // Spawn subtle star sparkles
      if (Math.random() < 0.35) {
        const colors = ['#FEE75C', '#FCD34D', '#FFD700', '#FF0055', '#38BDF8'];
        const newSparkle: Sparkle = {
          id: sparkleIdRef.current++,
          x: e.clientX + (Math.random() * 12 - 6),
          y: e.clientY + (Math.random() * 12 - 6),
          size: 2 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          vx: (Math.random() - 0.5) * 20,
          vy: Math.random() * 15 + 5,
        };

        setSparkles((prev) => [...prev.slice(-16), newSparkle]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  // Update sparkle physics
  useEffect(() => {
    if (!enabled || sparkles.length === 0) return;

    const interval = setInterval(() => {
      setSparkles((prev) =>
        prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx * 0.05,
            y: s.y + s.vy * 0.05,
            alpha: s.alpha - 0.06,
            size: Math.max(0, s.size - 0.1),
          }))
          .filter((s) => s.alpha > 0)
      );
    }, 25);

    return () => clearInterval(interval);
  }, [enabled, sparkles.length]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Sparkles trail */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            opacity: s.alpha,
            boxShadow: `0 0 6px ${s.color}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Vietnam Golden Star Cursor */}
      <div
        className="fixed pointer-events-none transition-transform duration-75"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.3 : 1})`,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_0_8px_rgba(254,231,92,0.9)] animate-pulse"
        >
          {/* Vietnam Golden 5-Pointed Star */}
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill="#FEE75C"
            stroke="#DA251D"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Inner Highlight Star Core */}
          <polygon
            points="12,5 13.8,8.8 18,9.4 15,12.3 15.7,16.5 12,14.5 8.3,16.5 9,12.3 6,9.4 10.2,8.8"
            fill="#FFFBEB"
            opacity="0.85"
          />
        </svg>
      </div>
    </div>
  );
};
