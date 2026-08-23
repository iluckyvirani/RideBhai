import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Menu, X, Car, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface LandingNavProps {
  onOpenRiderApp: () => void;
  onOpenDriverApp: () => void;
  onOpenAdminPortal?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onOpenRiderApp,
  onOpenDriverApp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isRiderLoggedIn, isDriverLoggedIn } = useAppStore();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#EBE5D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size="md" showTagline={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('driver-benefits')}
              className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              For Drivers
            </button>
            <button
              onClick={() => scrollTo('earnings-calculator')}
              className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors flex items-center gap-1.5"
            >
              <span>Earnings</span>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#FFF0EB] text-[#F15A24] rounded-full border border-[#FFD8CB]">
                ₹50k/mo
              </span>
            </button>
            <button
              onClick={() => scrollTo('safety-trust')}
              className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              Safety & Verification
            </button>
            <button
              onClick={() => scrollTo('driver-registration')}
              className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              Driver Registration
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenDriverApp}
              className="px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-white hover:bg-[#FFF5F0] text-[#1C1C1C] border border-[#EBE5D8] shadow-xs hover:border-[#F15A24] transition-all flex items-center gap-2 active-press"
            >
              <Car className="w-4 h-4 text-[#F15A24]" />
              <span>{isDriverLoggedIn ? 'Driver Dashboard' : 'Register as Driver'}</span>
            </button>

            <button
              onClick={onOpenRiderApp}
              className="px-5 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#F15A24] to-[#FF7A45] shadow-md hover:shadow-lg transition-all flex items-center gap-2 active-press"
            >
              <span>{isRiderLoggedIn ? 'Open Rider App' : 'Search Rides'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenRiderApp}
              className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-white bg-[#F15A24] shadow-xs"
            >
              Search
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1C1C1C] bg-white border border-[#EBE5D8] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EBE5D8] px-4 pt-3 pb-6 space-y-3 animate-slide-down shadow-xl">
          <button
            onClick={() => scrollTo('how-it-works')}
            className="block w-full text-left py-2 text-xs font-extrabold text-[#1C1C1C]"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo('driver-benefits')}
            className="block w-full text-left py-2 text-xs font-extrabold text-[#1C1C1C]"
          >
            Driver Benefits & Boost
          </button>
          <button
            onClick={() => scrollTo('earnings-calculator')}
            className="block w-full text-left py-2 text-xs font-extrabold text-[#1C1C1C]"
          >
            Earnings Calculator
          </button>
          <button
            onClick={() => scrollTo('safety-trust')}
            className="block w-full text-left py-2 text-xs font-extrabold text-[#1C1C1C]"
          >
            Safety & Verification
          </button>
          <button
            onClick={() => scrollTo('driver-registration')}
            className="block w-full text-left py-2 text-xs font-extrabold text-[#1C1C1C]"
          >
            How Driver Can Register
          </button>

          <div className="pt-3 border-t border-[#F2ECE1] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRiderApp();
              }}
              className="w-full py-3 bg-[#F15A24] text-white text-xs font-extrabold rounded-2xl shadow-sm text-center"
            >
              Search & Book Rides
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDriverApp();
              }}
              className="w-full py-3 bg-[#FAF6EE] text-[#1C1C1C] border border-[#EBE5D8] text-xs font-extrabold rounded-2xl text-center flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4 text-[#F15A24]" />
              <span>Register as Driver / Driver Center</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
