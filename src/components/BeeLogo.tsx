import React from 'react';

interface BeeLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export const BeeLogo: React.FC<BeeLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  textColor = 'text-emerald-950'
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-600 p-1.5 shadow-md shadow-amber-500/20"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Hexagon Honeycomb Background */}
          <polygon
            points="32,4 56,18 56,46 32,60 8,46 8,18"
            fill="#ffffff"
            fillOpacity="0.2"
          />
          {/* Left Wing (Leaf shaped) */}
          <path
            d="M 28 26 C 22 14, 12 18, 16 29 C 18 34, 25 33, 28 29"
            fill="#a7f3d0"
            stroke="#047857"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right Wing (Leaf shaped) */}
          <path
            d="M 36 26 C 42 14, 52 18, 48 29 C 46 34, 39 33, 36 29"
            fill="#a7f3d0"
            stroke="#047857"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Bee Body Oval */}
          <ellipse
            cx="32"
            cy="36"
            rx="14"
            ry="17"
            fill="#f59e0b"
            stroke="#1f2937"
            strokeWidth="2.5"
          />
          {/* Stripes */}
          <path
            d="M 19 32 Q 32 35 45 32"
            stroke="#1f2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 19 40 Q 32 43 45 40"
            stroke="#1f2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 23 48 Q 32 51 41 48"
            stroke="#1f2937"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Stinger */}
          <polygon points="32,53 30,58 34,58" fill="#1f2937" />
          {/* Bee Head */}
          <circle cx="32" cy="22" r="7.5" fill="#1f2937" />
          {/* Eyes */}
          <circle cx="30" cy="21" r="1.5" fill="#ffffff" />
          <circle cx="34" cy="21" r="1.5" fill="#ffffff" />
          {/* Antennae */}
          <path
            d="M 29 16 Q 24 10 20 12"
            stroke="#1f2937"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="12" r="1.8" fill="#10b981" />
          <path
            d="M 35 16 Q 40 10 44 12"
            stroke="#1f2937"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="44" cy="12" r="1.8" fill="#10b981" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className={`text-xl font-extrabold tracking-tight ${textColor}`}>
              Eco<span className="text-amber-600">Acción</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
              RD
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-800/80 tracking-normal hidden sm:inline">
            Tu voz informa, nuestras acciones transforman
          </span>
        </div>
      )}
    </div>
  );
};
