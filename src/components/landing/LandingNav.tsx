import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { Menu, X, ChevronRight } from 'lucide-react';
import { LanguageToggle } from '../common/LanguageToggle';
import { useAppStore } from '../../store/useAppStore';

interface LandingNavProps {
  onOpenRiderApp: () => void;
  onOpenDriverApp: () => void;
  onOpenAgencyPortal?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenCars?: () => void;
  onOpenTours?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onOpenRiderApp,
  onOpenCars,
  onOpenTours,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, currentUser } = useAppStore();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    window.location.hash = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const cta = isLoggedIn && currentUser?.profileCompleted ? 'Open app' : 'Login';

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#EBE5D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-3 min-h-[68px] sm:min-h-[88px] py-2.5 sm:py-3">
          <a
            href="#home"
            className="cursor-pointer shrink-0"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'home';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* Compact logo on phones/tablets, full logo from desktop up */}
            <span className="min-[360px]:hidden">
              <Logo size="sm" showTagline={false} variant="icon-only" />
            </span>
            <span className="hidden min-[360px]:inline-flex lg:hidden">
              <Logo size="sm" showTagline={false} />
            </span>
            <span className="hidden lg:inline-flex">
              <Logo size="md" showTagline={true} />
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-4 lg:gap-6">
            <a
              href="#cars"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenCars) onOpenCars();
                else window.location.hash = 'cars';
              }}
              className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              Cars
            </a>
            <a
              href="#tours"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenTours) onOpenTours();
                else window.location.hash = 'tours';
              }}
              className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              Tours
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('how-it-works');
              }}
              className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              How it works
            </a>
            <a
              href="#for-partners"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('for-partners');
              }}
              className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              For users
            </a>
            <a
              href="#partner-packages"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('partner-packages');
              }}
              className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              Plans
            </a>
            <a
              href="#safety-trust"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('safety-trust');
              }}
              className="text-sm font-extrabold text-[#6B6B6B] hover:text-[#F15A24] transition-colors"
            >
              Safety
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageToggle />
            <button
              type="button"
              onClick={onOpenRiderApp}
              className="inline-flex max-w-[120px] sm:max-w-none items-center justify-center gap-1.5 whitespace-nowrap rounded-xl sm:rounded-2xl px-3 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-base font-extrabold text-white bg-gradient-to-r from-[#F15A24] to-[#FF7A45] shadow-lg hover:shadow-xl active-press sm:min-w-[148px]"
            >
              <span className="truncate">{cta}</span>
              <ChevronRight className="hidden sm:block w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-[#1C1C1C] bg-white border border-[#EBE5D8]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EBE5D8] px-4 pt-3 pb-6 space-y-2 shadow-xl max-h-[calc(100dvh-68px)] overflow-y-auto">
          <a
            href="#cars"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              if (onOpenCars) onOpenCars();
              else window.location.hash = 'cars';
            }}
            className="block w-full py-2 text-sm font-extrabold text-[#1C1C1C] hover:text-[#F15A24]"
          >
            Cars
          </a>
          <a
            href="#tours"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              if (onOpenTours) onOpenTours();
              else window.location.hash = 'tours';
            }}
            className="block w-full py-2 text-sm font-extrabold text-[#1C1C1C] hover:text-[#F15A24]"
          >
            Tours
          </a>
          {[
            ['how-it-works', 'How it works'],
            ['for-partners', 'For users'],
            ['partner-packages', 'Plans'],
            ['safety-trust', 'Safety'],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(id);
              }}
              className="block w-full py-2 text-sm font-extrabold text-[#1C1C1C] hover:text-[#F15A24]"
            >
              {label}
            </a>
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
