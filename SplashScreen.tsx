import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PesikalamLogo } from './PesikalamLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Show splash for 2.2 seconds then smooth fade out
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 500); // 500ms fade transition
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#090b10] flex flex-col items-center justify-center transition-opacity duration-500 overflow-hidden ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute w-[360px] h-[360px] bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-pink-500/20 rounded-full blur-[110px] pointer-events-none animate-pulse" />

      {/* Main Logo & Badge */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Official Pesikalam Logo */}
        <div className="relative mb-4 animate-bounce">
          <PesikalamLogo size={180} />
          {/* Sparkles badge */}
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full p-1.5 shadow-lg shadow-pink-500/50 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/90 font-extrabold mt-3 flex items-center gap-2">
          <span>•</span> Namma Vibe, Namma Chat <span>•</span>
        </p>

        <p className="text-[11px] text-slate-500 font-medium mt-1">
          பேசிக்கலாம் • Connect with your circle
        </p>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <div className="w-28 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full animate-pulse w-full" />
        </div>
        <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
          Loading namma feed...
        </span>
      </div>
    </div>
  );
};
