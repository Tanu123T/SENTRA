import React from 'react';

interface SentraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

export const SentraLogo: React.FC<SentraLogoProps> = ({
  className = '',
  size = 'md',
  withText = true,
}) => {
  const sizeMap = {
    sm: { h: 18, w: 18, textClass: 'text-base', dotSize: 'w-1 h-1' },
    md: { h: 24, w: 24, textClass: 'text-xl', dotSize: 'w-1.5 h-1.5' },
    lg: { h: 32, w: 32, textClass: 'text-2xl', dotSize: 'w-2 h-2' },
    xl: { h: 42, w: 42, textClass: 'text-3xl', dotSize: 'w-2.5 h-2.5' },
  };

  const { h, w, textClass, dotSize } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact 3-Pillar Parallelogram Brand Icon from Figma Design */}
      <svg
        width={w}
        height={h}
        viewBox="0 0 60 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Left Bar (medium-low) */}
        <path
          d="M2 30C2 28.5 3 27.2 4.4 26.6L14 22.4C15.8 21.6 17.8 23 17.8 25V63C17.8 64.5 16.8 65.8 15.4 66.4L5.8 70.6C4 71.4 2 70 2 68V30Z"
          fill="#2563EB"
        />
        {/* Center Bar (tallest) */}
        <path
          d="M23 10C23 8.5 24 7.2 25.4 6.6L35 2.4C36.8 1.6 38.8 3 38.8 5V63C38.8 64.5 37.8 65.8 36.4 66.4L26.8 70.6C25 71.4 23 70 23 68V10Z"
          fill="#2563EB"
        />
        {/* Right Bar (high-medium) */}
        <path
          d="M44 16C44 14.5 45 13.2 46.4 12.6L56 8.4C57.8 7.6 59.8 9 59.8 11V44C59.8 45.5 58.8 46.8 57.4 47.4L47.8 51.6C46 52.4 44 51 44 49V16Z"
          fill="#2563EB"
        />
      </svg>

      {withText && (
        <div className="flex items-baseline tracking-tight">
          <span
            className={`font-black tracking-[0.06em] text-[#0F172A] ${textClass}`}
            style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
          >
            SENTRA
          </span>
          <span className={`ml-0.5 rounded-full bg-[#2563EB] inline-block ${dotSize}`} />
        </div>
      )}
    </div>
  );
};
