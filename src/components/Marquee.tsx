import React from 'react';
import { Sparkles, Cpu, Code2, ShieldCheck, Zap } from 'lucide-react';

export const Marquee: React.FC = () => {
  const phrase = 'Innovation and Creativity in Tech';
  const repeatArray = Array(8).fill(phrase);

  return (
    <div
      aria-label="Continuous brand marquee"
      className="relative w-full overflow-hidden bg-[#101828] border-y border-[#155EEF]/30 py-4 select-none"
    >
      {/* Decorative gradient masks for soft edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#101828] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#101828] to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee items-center gap-8 whitespace-nowrap">
        {repeatArray.map((text, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-wider uppercase text-white flex items-center gap-3">
              <span className="text-[#155EEF] font-mono tracking-normal">/</span>
              <span>{text}</span>
            </span>
            {idx % 4 === 0 && <Sparkles className="w-4 h-4 text-[#E63946] shrink-0" />}
            {idx % 4 === 1 && <Cpu className="w-4 h-4 text-[#155EEF] shrink-0" />}
            {idx % 4 === 2 && <Zap className="w-4 h-4 text-[#E63946] shrink-0" />}
            {idx % 4 === 3 && <Code2 className="w-4 h-4 text-[#155EEF] shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
};
