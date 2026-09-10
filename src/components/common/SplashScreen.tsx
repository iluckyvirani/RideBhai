import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(false);
      setTimeout(onFinish, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FAF6EE] p-8 transition-opacity duration-300 ${
        animating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="w-full flex justify-end pt-2">
        <span className="text-[10px] uppercase font-bold text-[#F15A24] bg-[#FFF0EB] px-2.5 py-1 rounded-full border border-[#FFD8CB]">
          v1.0 Demo
        </span>
      </div>

      {/* Centered Logo with Animated Scale & Glow */}
      <div className="flex flex-col items-center justify-center text-center animate-scale-in">
        <div className="relative mb-4">
          <div className="absolute -inset-4 rounded-full bg-[#FF8A00]/20 blur-xl animate-pulse"></div>
          <Logo size="xl" showTagline={false} variant="icon-only" />
        </div>

        <h1 className="font-display text-3xl font-extrabold text-[#F15A24] tracking-tight">
          Ride<span className="text-[#1C1C1C]">bhai</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1C1C1C] mt-1 opacity-80">
          Full car & tours
        </p>

        <div className="mt-8 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#F15A24] animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#FF8A00] animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#E8380D] animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-center pb-4">
        <p className="text-[11px] font-medium text-[#6B6B6B]">
          Indian intercity marketplace
        </p>
        <p className="text-[10px] text-[#9E9E9E] mt-0.5">Hire a full car or tour. Chat or Deal with Ride Bhai.</p>
      </div>
    </div>
  );
};
