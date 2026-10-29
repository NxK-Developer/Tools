import React from 'react';

interface NxKLogoMarkProps {
  className?: string;
}

export function NxKLogoMark({ className = 'h-8 w-8' }: NxKLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${className} shrink-0 drop-shadow-xs transition-transform duration-150 group-hover:scale-105`}
    >
      <defs>
        <linearGradient id="nxk-bg-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="nxk-ribbon-left" x1="10" y1="8" x2="18" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="nxk-ribbon-diag" x1="12" y1="10" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#EFF6FF" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#nxk-bg-grad)" />
      <rect
        x="0.75"
        y="0.75"
        width="38.5"
        height="38.5"
        rx="10.25"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      {/* Stylised 3D Ribbon "N" matching mockup */}
      <path
        d="M11 29V11C11 9.89543 11.8954 9 13 9H14.5C15.3 9 16.02 9.48 16.34 10.2L24.5 26.5V11C24.5 9.89543 25.3954 9 26.5 9H27C28.1046 9 29 9.89543 29 11V29C29 30.1046 28.1046 31 27 31H25.5C24.7 31 23.98 30.52 23.66 29.8L15.5 13.5V29C15.5 30.1046 14.6046 31 13.5 31H13C11.8954 31 11 30.1046 11 29Z"
        fill="url(#nxk-ribbon-left)"
      />
      <path
        d="M14.2 9.4L26.2 30.2"
        stroke="url(#nxk-ribbon-diag)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

interface NxKLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function NxKLogo({ size = 'md', showText = true }: NxKLogoProps) {
  const dimensions =
    size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  const textSize =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base sm:text-lg';

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <NxKLogoMark className={dimensions} />
      {showText && (
        <span
          className={`${textSize} font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors`}
        >
          NxK Tools
        </span>
      )}
    </span>
  );
}
