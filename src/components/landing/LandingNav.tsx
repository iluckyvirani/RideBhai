import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface LandingNavProps {
  onOpenRiderApp: () => void;
  onOpenDriverApp: () => void;
  onOpenAgencyPortal?: () => void;
  onOpenAdminPortal?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onOpenRiderApp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, currentUser } = useAppStore();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const cta = isLoggedIn && currentUser?.profileCompleted ? 'Open app' : 'Login';

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#EBE5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 min-h-[88px] py-3">
          <div className="cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size="md" showTagline={true} />
          </div>

          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            <button onClick={() => scrollTo('how-it-works')} className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              How it works
            </button>
            <button onClick={() => scrollTo('browse-india')} className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              Cars & tours
            </button>
            <button onClick={() => scrollTo('for-partners')} className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              For users
            </button>
            <button onClick={() => scrollTo('partner-packages')} className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              Plans
            </button>
            <button onClick={() => scrollTo('safety-trust')} className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24]">
              Safety
            </button>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenRiderApp}
              className="inline-flex items-center justify-center gap-2 min-w-[128px] sm:min-w-[148px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-[#F15A24] to-[#FF7A45] shadow-lg hover:shadow-xl active-press"
            >
              <span>{cta}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 rounded-2xl text-[#1C1C1C] bg-white border border-[#EBE5D8]"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EBE5D8] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {[
            ['how-it-works', 'How it works'],
            ['browse-india', 'Cars & tours'],
            ['for-partners', 'For users'],
            ['partner-packages', 'Plans'],
            ['safety-trust', 'Safety'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left py-2.5 text-sm font-extrabold text-[#1C1C1C]">
              {label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#F2ECE1]">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRiderApp();
              }}
              className="w-full py-4 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white text-base font-extrabold rounded-2xl inline-flex items-center justify-center gap-2 shadow-lg"
            >
              {cta}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
