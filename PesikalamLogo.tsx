import React from 'react';

interface PesikalamLogoProps {
  size?: number | string;
  className?: string;
  showSubtitle?: boolean;
}

export const PesikalamLogo: React.FC<PesikalamLogoProps> = ({
  size = 120,
  className = '',
  showSubtitle = true,
}) => {
  return (
    <div
      className={`relative select-none inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          {/* Outer Border Neon Gradients */}
          <linearGradient id="neonCyanRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#00a8ff" />
            <stop offset="100%" stopColor="#7928ca" />
          </linearGradient>

          <linearGradient id="neonOrangeRing" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff7b00" />
            <stop offset="50%" stopColor="#ff5100" />
            <stop offset="100%" stopColor="#ff007a" />
          </linearGradient>

          <radialGradient id="badgeBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#101e3b" />
            <stop offset="70%" stopColor="#0a1224" />
            <stop offset="100%" stopColor="#050a14" />
          </radialGradient>

          {/* Letter Gradient */}
          <linearGradient id="textGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#ffdf00" />
            <stop offset="70%" stopColor="#ff7b00" />
            <stop offset="100%" stopColor="#e63900" />
          </linearGradient>

          <linearGradient id="handBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#0072ff" />
          </linearGradient>

          <linearGradient id="handOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#ff4500" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Outer Circular Ring Backdrops */}
        <circle
          cx="250"
          cy="250"
          r="238"
          stroke="url(#neonCyanRing)"
          strokeWidth="10"
          filter="url(#neonGlow)"
          opacity="0.85"
        />
        <circle
          cx="250"
          cy="250"
          r="238"
          stroke="url(#neonOrangeRing)"
          strokeWidth="10"
          strokeDasharray="400 350"
          strokeDashoffset="120"
          filter="url(#neonGlow)"
        />

        {/* Inner thin accent ring */}
        <circle
          cx="250"
          cy="250"
          r="224"
          stroke="#00f2fe"
          strokeWidth="3"
          opacity="0.5"
        />
        <circle
          cx="250"
          cy="250"
          r="224"
          stroke="#ff5e00"
          strokeWidth="3"
          strokeDasharray="250 500"
          strokeDashoffset="80"
          opacity="0.8"
        />

        {/* 2. Main Badge Disc */}
        <circle cx="250" cy="250" r="220" fill="url(#badgeBg)" />

        {/* Tech/Network Nodes Background Lines */}
        <g opacity="0.18" stroke="#00f2fe" strokeWidth="1.5">
          <line x1="80" y1="180" x2="160" y2="130" />
          <line x1="160" y1="130" x2="220" y2="90" />
          <line x1="220" y1="90" x2="330" y2="100" />
          <line x1="330" y1="100" x2="410" y2="160" />
          <line x1="80" y1="180" x2="110" y2="290" />
          <line x1="410" y1="160" x2="420" y2="280" />
          <circle cx="80" cy="180" r="4" fill="#00f2fe" />
          <circle cx="160" cy="130" r="4" fill="#00f2fe" />
          <circle cx="220" cy="90" r="4" fill="#ff7b00" />
          <circle cx="330" cy="100" r="4" fill="#00f2fe" />
          <circle cx="410" cy="160" r="4" fill="#ff7b00" />
        </g>

        {/* 3. Central Speech Bubble Pair & Handshake */}
        <g transform="translate(10, -10)">
          {/* Left Speech Bubble (Yellow/Orange outline with cyan letter 'பே') */}
          <path
            d="M 180 130 C 145 130 130 155 130 185 C 130 205 142 225 160 235 L 140 260 L 195 242 C 205 244 218 243 230 238 C 215 220 215 170 200 145 C 195 135 188 130 180 130 Z"
            fill="#091326"
            stroke="#ffaa00"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Tamil Letter 'பே' in glowing cyan */}
          <text
            x="165"
            y="205"
            fontFamily="Arial, 'Noto Sans Tamil', sans-serif"
            fontSize="54"
            fontWeight="bold"
            fill="#00f2fe"
            textAnchor="middle"
            filter="url(#neonGlow)"
          >
            பே
          </text>

          {/* Right Speech Bubble (Cyan outline with exclamation '!') */}
          <path
            d="M 300 130 C 335 130 360 155 360 185 C 360 205 348 225 330 235 L 350 260 L 295 242 C 285 244 272 243 260 238 C 275 220 275 170 290 145 C 295 135 298 130 300 130 Z"
            fill="#091326"
            stroke="#00f2fe"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Exclamation '!' in gold */}
          <text
            x="320"
            y="205"
            fontFamily="Arial, sans-serif"
            fontSize="58"
            fontWeight="900"
            fill="#ffb300"
            textAnchor="middle"
          >
            !
          </text>

          {/* Connected Handshake Emblem in Center */}
          <g transform="translate(180, 165)">
            {/* Cyan Upper Hand */}
            <path
              d="M 15 20 C 35 5 70 5 90 25 L 80 45 C 65 32 40 32 25 45 Z"
              fill="url(#handBlueGrad)"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Orange Lower Hand (Gripping) */}
            <path
              d="M 25 55 C 45 68 75 65 95 45 L 85 28 C 70 42 45 42 30 28 Z"
              fill="url(#handOrangeGrad)"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Interlocking fingers */}
            <rect x="35" y="32" width="10" height="18" rx="4" fill="#ff7b00" />
            <rect x="48" y="34" width="10" height="18" rx="4" fill="#ff9900" />
            <rect x="61" y="36" width="10" height="18" rx="4" fill="#ffbb00" />
            <rect x="74" y="38" width="10" height="18" rx="4" fill="#00d4ff" />
          </g>
        </g>

        {/* 4. Tamil Branding: "பேசிக்கலாம்" */}
        <text
          x="250"
          y="318"
          fontFamily="'Noto Sans Tamil', 'Plus Jakarta Sans', sans-serif"
          fontSize="54"
          fontWeight="900"
          fill="url(#textGoldGrad)"
          stroke="#ffffff"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          textAnchor="middle"
          letterSpacing="2"
        >
          பேசிக்கலாம்
        </text>

        {/* 5. English Branding: "PESIKALAM" */}
        <text
          x="250"
          y="384"
          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
          fontSize="48"
          fontWeight="950"
          fill="url(#textGoldGrad)"
          stroke="#ffffff"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          textAnchor="middle"
          letterSpacing="3"
        >
          PESIKALAM
        </text>

        {/* 6. Subtitle Tagline: "MASS CHATTING APP" */}
        {showSubtitle && (
          <text
            x="250"
            y="424"
            fontFamily="'Outfit', sans-serif"
            fontSize="18"
            fontWeight="800"
            fill="#00f2fe"
            textAnchor="middle"
            letterSpacing="4"
            opacity="0.95"
          >
            MASS CHATTING APP
          </text>
        )}
      </svg>
    </div>
  );
};
