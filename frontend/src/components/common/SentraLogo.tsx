import React from 'react';

interface SentraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  variant?: 'waveform' | 'isometric';
}

export const SentraLogo: React.FC<SentraLogoProps> = ({
  className = '',
  size = 'md',
  withText = true,
  variant = 'waveform',
}) => {
  const sizeMap = {
    sm: { iconH: 20, iconW: 22, textClass: 'text-base', dotSize: 'w-1 h-1' },
    md: { iconH: 26, iconW: 28, textClass: 'text-xl', dotSize: 'w-1.5 h-1.5' },
    lg: { iconH: 34, iconW: 36, textClass: 'text-2xl', dotSize: 'w-2 h-2' },
    xl: { iconH: 44, iconW: 48, textClass: 'text-3xl', dotSize: 'w-2.5 h-2.5' },
  };

  const { iconH, iconW, textClass, dotSize } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {variant === 'waveform' ? (
        // 4-Bar Waveform Icon as seen on Figma Make Operational Overview
        <svg
          width={iconW}
          height={iconH}
          viewBox="0 0 32 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          {/* Bar 1 - Leftmost short */}
          <rect x="2" y="10" width="4.5" height="12" rx="2.25" fill="#38BDF8" />
          {/* Bar 2 - Tallest royal blue */}
          <rect x="9.5" y="2" width="5" height="26" rx="2.5" fill="#1D4ED8" />
          {/* Bar 3 - High royal blue */}
          <rect x="17.5" y="6" width="5" height="22" rx="2.5" fill="#2563EB" />
          {/* Bar 4 - Rightmost medium cyan */}
          <rect x="25.5" y="12" width="4.5" height="14" rx="2.25" fill="#0EA5E9" />
        </svg>
      ) : (
        // Isometric Cross Sensor Icon from SENTRA Logo System
        <svg
          width={iconW}
          height={iconH}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path d="M12 4L22 10V22L12 16V4Z" fill="#1D4ED8" />
          <path d="M22 10L32 16V28L22 22V10Z" fill="#6366F1" />
          <path d="M12 16L22 22V34L12 28V16Z" fill="#3B82F6" />
          <rect x="2" y="18" width="6" height="6" rx="1.5" fill="#06B6D4" />
          <rect x="32" y="18" width="6" height="6" rx="1.5" fill="#84CC16" />
        </svg>
      )}

      {withText && (
        <div className="flex items-baseline tracking-tight">
          <span className={`font-black text-slate-900 tracking-[0.06em] ${textClass}`}>
            SENTRA
          </span>
          <span className={`ml-0.5 rounded-full bg-blue-600 inline-block ${dotSize}`} />
        </div>
      )}
    </div>
  );
};
