import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Menu, X, Car, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface LandingNavProps {
  onOpenRiderApp: () => void;
  onOpenDriverApp: () => void;
  onOpenAgencyPortal?: () => void;
  onOpenAdminPortal?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onOpenRiderApp,
  onOpenDriverApp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isRiderLoggedIn, isPartnerLoggedIn, isDriverLoggedIn, isAgencyLoggedIn } = useAppStore();
  const partnerIn = isPartnerLoggedIn || isDriverLoggedIn || isAgencyLoggedIn;

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#EBE5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size="md" showTagline={true} />
          </div>

          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            <button onClick={() => scrollTo('how-it-works')} className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              How it works
            </button>
            <button onClick={() => scrollTo('browse-india')} className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              Cars & tours
            </button>
            <button onClick={() => scrollTo('for-partners')} className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              For partners
            </button>
            <button onClick={() => scrollTo('partner-packages')} className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              Posting plans
            </button>
            <button onClick={() => scrollTo('safety-trust')} className="text-xs font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              Safety
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={onOpenDriverApp}
              className="px-3.5 py-2 rounded-2xl text-xs font-extrabold bg-white hover:bg-[#FFF5F0] text-[#1C1C1C] border border-[#EBE5D8] hover:border-[#F15A24] flex items-center gap-1.5 active-press"
            >
              <Car className="w-3.5 h-3.5 text-[#F15A24]" />
              <span>{partnerIn ? 'Partner dashboard' : 'Become a Partner'}</span>
            </button>
            <button
              onClick={onOpenRiderApp}
              className="px-4 py-2 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-[#F15A24] to-[#FF7A45] shadow-md flex items-center gap-1.5 active-press"
            >
              <span>{isRiderLoggedIn ? 'Browse cars' : 'Find a car'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={onOpenRiderApp} className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-white bg-[#F15A24]">
              Find
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1C1C1C] bg-white border border-[#EBE5D8]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EBE5D8] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {[
            ['how-it-works', 'How it works'],
            ['browse-india', 'Cars & tours'],
            ['for-partners', 'For partners'],
            ['partner-packages', 'Posting plans'],
            ['safety-trust', 'Safety'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left py-2 text-xs font-extrabold text-[#1C1C1C]">
              {label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#F2ECE1] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRiderApp();
              }}
              className="w-full py-3 bg-[#F15A24] text-white text-xs font-extrabold rounded-2xl"
            >
              Find a car
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDriverApp();
              }}
              className="w-full py-3 bg-[#FAF6EE] text-[#1C1C1C] border border-[#EBE5D8] text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4 text-[#F15A24]" />
              {partnerIn ? 'Partner dashboard' : 'Become a Partner'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
