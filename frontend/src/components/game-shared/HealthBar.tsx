import React from 'react';
import { Heart } from 'lucide-react';

interface HealthBarProps {
  hp: number;
  maxHp: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ hp, maxHp }) => {
  return (
    <div className="flex items-center gap-1.5 bg-[#161F30]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-500/20 shadow-md">
      <span className="text-xs text-red-400 font-bold tracking-wider mr-1">HP:</span>
      {Array.from({ length: maxHp }).map((_, idx) => (
        <Heart
          key={idx}
          className={`w-5 h-5 transition-transform duration-300 ${
            idx < hp
              ? 'text-red-500 fill-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] scale-100'
              : 'text-gray-600 scale-90'
          }`}
        />
      ))}
    </div>
  );
};
