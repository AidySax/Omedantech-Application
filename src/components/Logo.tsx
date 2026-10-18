import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', showSlogan = false, className = '' }) => {
  const isDarkBg = variant === 'light'; // light text for dark backgrounds

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Tech-inspired OmedanTech geometric mark */}
      <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Outer tech circuit hexagon */}
          <rect x="2" y="2" width="36" height="36" rx="8" fill="#101828" stroke="#155EEF" strokeWidth="2" />
          {/* Dynamic Red Tech Chevron / Accent */}
          <path d="M11 27L20 12L29 27" stroke="#155EEF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 22H25" stroke="#E63946" strokeWidth="2.5" strokeLinecap="round" />
          {/* Innovation Center Node */}
          <circle cx="20" cy="18" r="2.5" fill="#E63946" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`text-xl font-extrabold tracking-tight font-sans ${isDarkBg ? 'text-white' : 'text-[#101828]'}`}>
            Omedan<span className="text-[#155EEF]">Tech</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] ml-0.5 inline-block" />
        </div>
        {showSlogan && (
          <span className={`text-[10px] tracking-wider uppercase font-semibold ${isDarkBg ? 'text-blue-200/80' : 'text-[#E63946]'}`}>
            Innovate. Build. Scale.
          </span>
        )}
      </div>
    </Link>
  );
};
