import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showSubtitle?: boolean;
  variant?: 'icon' | 'full';
}

/**
 * Official SymbioMine AR Vector Icon Mark
 * High-definition, mathematically aligned with public/logo.svg.
 * Preserves exact official proportions, colors, and gradients.
 */
export const SymbioMineIconMark: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="85 20 330 250"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
  >
    <defs>
      <linearGradient id="symbioIconSunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="symbioIconHelmetDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <filter id="symbioIconShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.2"/>
      </filter>
    </defs>

    {/* Official Icon Group */}
    <g transform="translate(0, 10)">
      {/* 1. Background Sun / Orange Circle */}
      <circle cx="215" cy="175" r="82" fill="url(#symbioIconSunGlow)" />

      {/* 2. Dark Mountain Peaks with Base */}
      <path d="M 95 260 L 215 130 L 335 260 Z" fill="url(#symbioIconHelmetDark)" />

      {/* 3. Winding Path / Road through mountain (Crisp S-Curve) */}
      <path
        d="M 215 130 C 215 170, 175 195, 185 220 C 195 240, 240 245, 235 260 L 190 260 C 195 248, 160 238, 155 210 C 150 185, 205 160, 215 130 Z"
        fill="#FFFFFF"
      />

      {/* 4. Miner Hard Hat Dome & Ridge Accents */}
      <path d="M 120 120 C 120 45, 310 45, 310 120 Z" fill="url(#symbioIconHelmetDark)" />
      <path d="M 205 45 L 205 110 L 225 110 L 225 45 Z" fill="#334155" opacity="0.6" />
      <path d="M 165 58 C 160 75, 158 95, 158 115 L 170 115 C 170 98, 172 78, 177 62 Z" fill="#334155" opacity="0.4" />
      <path d="M 265 58 C 270 75, 272 95, 272 115 L 260 115 C 260 98, 258 78, 253 62 Z" fill="#334155" opacity="0.4" />

      {/* Helmet Brim */}
      <path d="M 105 120 C 105 112, 325 112, 325 120 C 325 138, 105 138, 105 120 Z" fill="#0F172A" />
      <path d="M 100 125 C 100 118, 330 118, 330 125 C 330 134, 100 134, 100 125 Z" fill="#1E293B" />

      {/* Miner Headlamp */}
      <circle cx="215" cy="98" r="30" fill="#0F172A" stroke="#334155" strokeWidth="4" />
      <circle cx="215" cy="98" r="22" fill="#FFFFFF" />
      <circle cx="215" cy="98" r="17" fill="url(#symbioIconSunGlow)" />
      <ellipse cx="211" cy="93" rx="5" ry="3" fill="#FFFFFF" opacity="0.7" />

      {/* 5. Smartphone AR Device Frame */}
      <g transform="translate(305, 75) rotate(7)">
        <rect x="0" y="0" width="92" height="152" rx="18" fill="#0F172A" stroke="#1E293B" strokeWidth="6" filter="url(#symbioIconShadow)" />
        <rect x="6" y="8" width="80" height="136" rx="12" fill="#0F172A" />
        <rect x="36" y="14" width="20" height="3" rx="1.5" fill="#475569" />

        {/* AR Viewfinder Reticle Corners */}
        <path d="M 22 46 L 14 46 L 14 54" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 70 46 L 78 46 L 78 54" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 22 96 L 14 96 L 14 88" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 70 96 L 78 96 L 78 88" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />

        <text x="46" y="77" fontFamily="'Oswald', 'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="28" fill="#F59E0B" textAnchor="middle" letterSpacing="1">AR</text>
      </g>
    </g>
  </svg>
);

/**
 * Full vertical vector lockup with logotype text.
 */
export const SymbioMineVectorLogo: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 500 420"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
  >
    <defs>
      <linearGradient id="appLogoSunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="appLogoHelmetDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <filter id="appLogoShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.15"/>
      </filter>
    </defs>

    {/* ICON GROUP */}
    <g transform="translate(0, 10)">
      <circle cx="215" cy="175" r="82" fill="url(#appLogoSunGlow)" />
      <path d="M 95 260 L 215 130 L 335 260 Z" fill="url(#appLogoHelmetDark)" />
      <path
        d="M 215 130 C 215 170, 175 195, 185 220 C 195 240, 240 245, 235 260 L 190 260 C 195 248, 160 238, 155 210 C 150 185, 205 160, 215 130 Z"
        fill="#FFFFFF"
      />
      <path d="M 120 120 C 120 45, 310 45, 310 120 Z" fill="url(#appLogoHelmetDark)" />
      <path d="M 205 45 L 205 110 L 225 110 L 225 45 Z" fill="#334155" opacity="0.6" />
      <path d="M 165 58 C 160 75, 158 95, 158 115 L 170 115 C 170 98, 172 78, 177 62 Z" fill="#334155" opacity="0.4" />
      <path d="M 265 58 C 270 75, 272 95, 272 115 L 260 115 C 260 98, 258 78, 253 62 Z" fill="#334155" opacity="0.4" />
      <path d="M 105 120 C 105 112, 325 112, 325 120 C 325 138, 105 138, 105 120 Z" fill="#0F172A" />
      <path d="M 100 125 C 100 118, 330 118, 330 125 C 330 134, 100 134, 100 125 Z" fill="#1E293B" />
      <circle cx="215" cy="98" r="30" fill="#0F172A" stroke="#334155" strokeWidth="4" />
      <circle cx="215" cy="98" r="22" fill="#FFFFFF" />
      <circle cx="215" cy="98" r="17" fill="url(#appLogoSunGlow)" />
      <ellipse cx="211" cy="93" rx="5" ry="3" fill="#FFFFFF" opacity="0.7" />

      <g transform="translate(305, 75) rotate(7)">
        <rect x="0" y="0" width="92" height="152" rx="18" fill="#0F172A" stroke="#1E293B" strokeWidth="6" filter="url(#appLogoShadow)" />
        <rect x="6" y="8" width="80" height="136" rx="12" fill="#0F172A" />
        <rect x="36" y="14" width="20" height="3" rx="1.5" fill="#475569" />
        <path d="M 22 46 L 14 46 L 14 54" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 70 46 L 78 46 L 78 54" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 22 96 L 14 96 L 14 88" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 70 96 L 78 96 L 78 88" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="46" y="77" fontFamily="'Oswald', 'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="28" fill="#F59E0B" textAnchor="middle" letterSpacing="1">AR</text>
      </g>
    </g>

    {/* Logotype */}
    <g transform="translate(15, 345)">
      <text x="0" y="32" fontFamily="'Oswald', 'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="48" fill="#0F172A" letterSpacing="-0.5">Symbio</text>
      <text x="180" y="32" fontFamily="'Oswald', 'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="48" fill="#F59E0B" letterSpacing="-0.5">Mine</text>

      <g transform="translate(325, -5)">
        <path d="M 0 10 L 0 0 L 10 0" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="square" />
        <path d="M 58 0 L 68 0 L 68 10" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="square" />
        <path d="M 0 34 L 0 44 L 10 44" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="square" />
        <path d="M 58 44 L 68 44 L 68 34" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="square" />
        <text x="34" y="32" fontFamily="'Oswald', 'JetBrains Mono', monospace" fontWeight="800" fontSize="32" fill="#0F172A" textAnchor="middle" letterSpacing="0.5">AR</text>
      </g>
    </g>
  </svg>
);

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  className = '',
  showSubtitle = false,
  variant = 'icon'
}) => {
  const { brandLogo, setIsBrandLogoModalOpen } = useApp();
  const [imgError, setImgError] = useState(false);

  // Precision proportions matching enterprise design system
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28'
  };

  const dim = sizeClasses[size] || sizeClasses.md;
  const isCustomUpload = brandLogo && !brandLogo.endsWith('.svg') && brandLogo.startsWith('data:image/');

  return (
    <div
      onClick={() => setIsBrandLogoModalOpen(true)}
      title="SymbioMine AR Official Brand Mark (Click to inspect official asset)"
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
    >
      {/* High-Contrast Container: clean white background with subtle border ensures helmet dome & phone are 100% visible at all zoom levels */}
      <div className={`relative ${dim} shrink-0 flex items-center justify-center rounded-xl p-1 bg-white border border-slate-200/90 shadow-2xs transition-all duration-200 group-hover:scale-105 group-hover:border-amber-400 group-hover:shadow-xs`}>
        {isCustomUpload && !imgError ? (
          <img
            src={brandLogo}
            alt="SymbioMine AR Official Logo"
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {variant === 'icon' ? <SymbioMineIconMark /> : <SymbioMineVectorLogo />}
          </div>
        )}
      </div>

      {showSubtitle && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black text-slate-900 text-sm tracking-tight font-sans">
              SymbioMine
            </span>
            <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-brand text-white font-bold uppercase tracking-wider">
              AR
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            Industrial Safety Operations
          </span>
        </div>
      )}
    </div>
  );
};
