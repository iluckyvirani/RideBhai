import React, { useState } from 'react';
import { ArrowRight, Car, Shield, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface OnboardingViewProps {
  onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Car className="w-12 h-12 text-[#F15A24]" />,
      title: 'Share Rides, Split Costs',
      subtitle: 'Travel between cities comfortably at 70% cheaper than trains or taxis with verified co-travelers.',
      badge: 'Smart Mobility',
    },
    {
      icon: <Shield className="w-12 h-12 text-[#2E9E5B]" />,
      title: 'Verified & Safe Travel',
      subtitle: 'Govt ID-verified drivers and riders, SOS emergency contacts, and live boarding OTP verification.',
      badge: '100% Safe',
    },
    {
      icon: <Sparkles className="w-12 h-12 text-[#FF8A00]" />,
      title: 'Driver Boost Packages',
      subtitle: 'Drivers get instant top ranking and direct rider inquiries with our premier boost subscriptions.',
      badge: 'Driver Pro',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#FAF6EE] p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2">
        <Logo size="sm" showTagline={false} />
        <button
          onClick={onComplete}
          className="text-xs font-bold text-[#6B6B6B] hover:text-[#1C1C1C] px-3 py-1.5 rounded-full hover:bg-black/5 active-press"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="my-auto py-8 text-center flex flex-col items-center animate-fade-in key={currentSlide}">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-card border border-[#EBE5D8] flex items-center justify-center mb-6">
          {slides[currentSlide].icon}
        </div>

        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F15A24] bg-[#FFF0EB] px-3 py-1 rounded-full border border-[#FFD8CB] mb-3">
          {slides[currentSlide].badge}
        </span>

        <h2 className="text-2xl font-extrabold text-[#1C1C1C] max-w-xs leading-tight font-display">
          {slides[currentSlide].title}
        </h2>

        <p className="text-xs text-[#6B6B6B] max-w-xs mt-3 leading-relaxed">
          {slides[currentSlide].subtitle}
        </p>

        {/* Indicators */}
        <div className="flex items-center gap-2 mt-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-[#F15A24]' : 'w-2 bg-[#E0D9CB]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-3 pb-4">
        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl brand-gradient text-white font-bold text-sm shadow-md active-press flex items-center justify-center gap-2 hover:opacity-95"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[10px] text-center text-[#6B6B6B]">
          By continuing, you accept Ridebhai terms and safety guidelines.
        </p>
      </div>
    </div>
  );
};
