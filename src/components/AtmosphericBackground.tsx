import React from 'react';

export function AtmosphericBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Top atmospheric sky glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[1140px] rounded-full opacity-65 dark:opacity-35 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.30) 0%, rgba(147, 197, 253, 0.14) 55%, transparent 80%)',
        }}
      />

      {/* Right atmospheric mountain-inspired light beam */}
      <div
        className="absolute top-12 right-[-6%] h-[440px] w-[560px] rounded-full opacity-55 dark:opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, rgba(96, 165, 250, 0.28) 0%, transparent 72%)',
        }}
      />

      {/* Layered Mountain Silhouette SVG (inspired by the attached mockup backdrop) */}
      <svg
        viewBox="0 0 1440 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 top-0 h-[580px] w-full opacity-80 dark:opacity-35"
      >
        <defs>
          <linearGradient id="mtn-far" x1="720" y1="80" x2="720" y2="540" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="mtn-mid" x1="950" y1="120" x2="950" y2="560" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="mtn-ridge" x1="360" y1="170" x2="360" y2="560" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Distant mountain range */}
        <path
          d="M-60 440L180 220L390 345L660 140L920 305L1190 95L1500 335V580H-60V440Z"
          fill="url(#mtn-far)"
        />
        {/* Mid-ground alpine peaks */}
        <path
          d="M220 480L530 230L790 385L1080 155L1360 355L1520 265V580H220V480Z"
          fill="url(#mtn-mid)"
        />
        {/* Crisp snow ridge highlights */}
        <path
          d="M660 140L790 385M1190 95L1080 310M1080 155L1220 355"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        {/* Soft foreground mist ridge */}
        <path
          d="M-80 490L210 305L510 445L840 275L1160 425L1490 285V580H-80V490Z"
          fill="url(#mtn-ridge)"
        />
      </svg>
    </div>
  );
}
