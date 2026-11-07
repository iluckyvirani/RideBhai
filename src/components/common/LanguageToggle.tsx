import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Languages, ChevronDown, Check, X, Globe } from 'lucide-react';
import {
  getCurrentLanguage,
  setGoogleTranslateLanguage,
  SUPPORTED_LANGUAGES,
} from '../../lib/googleTranslate';

interface LanguageToggleProps {
  className?: string;
  /** Always render the compact icon + code trigger, ignoring the sm: breakpoint.
   * Use this wherever the component sits inside a narrow, fixed-width shell
   * (e.g. the phone-mockup app header) — that container can be narrow even on
   * a wide desktop viewport, so viewport-based sm: classes pick the wrong size. */
  compact?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '', compact = false }) => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopPanelRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());

    const timer = setInterval(() => {
      const current = getCurrentLanguage();
      setCurrentLang((prev) => (prev !== current ? current : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  // Close on outside click / Escape. The mobile sheet lives in a portal, so it
  // needs its own ref (containerRef no longer contains it).
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        desktopPanelRef.current?.contains(target) ||
        mobilePanelRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Lock page scroll only while the mobile bottom-sheet is open.
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 639px)').matches) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
    setGoogleTranslateLanguage(code);
  };

  const currentObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const header = (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#EBE5D8] bg-[#FAF6EE] px-4 py-3.5">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-[#F15A24]" />
        <h4 className="text-xs font-black uppercase tracking-wider text-[#1C1C1C]">
          Select Language / भाषा चुनें
        </h4>
      </div>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#EBE5D8] bg-white text-[#6B6B6B] transition-colors hover:text-[#1C1C1C]"
        aria-label="Close language menu"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  const options = (
    <div
      role="listbox"
      aria-label="Languages"
      className="grid grid-cols-2 gap-1.5 p-2 sm:p-2.5"
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = lang.code === currentLang;
        return (
          <button
            key={lang.code}
            type="button"
            role="option"
            aria-selected={isActive}
            onClick={() => handleSelect(lang.code)}
            className={`active-press flex items-center justify-between gap-1.5 rounded-xl border p-2.5 text-left transition-all ${
              isActive
                ? 'border-[#F15A24] bg-[#FFF0EB] font-black text-[#F15A24] shadow-xs ring-1 ring-[#F15A24]/30'
                : 'border-[#EBE5D8] bg-white text-[#1C1C1C] hover:border-[#F15A24]/50 hover:bg-[#FAF6EE]'
            }`}
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-black">{lang.nativeName}</p>
              <p className="truncate text-[10px] font-semibold text-[#6B6B6B]">{lang.name}</p>
            </div>
            {isActive && (
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F15A24] text-white">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={containerRef} className={`notranslate relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`notranslate active-press inline-flex shrink-0 items-center gap-1 rounded-full border border-[#EBE5D8] bg-white px-2.5 py-1.5 text-xs font-extrabold text-[#1C1C1C] shadow-xs transition-all hover:border-[#F15A24] ${
          compact ? '' : 'sm:gap-1.5 sm:px-3'
        }`}
        title="Select Language / भाषा चुनें"
      >
        <Languages className="h-3.5 w-3.5 shrink-0 text-[#F15A24]" />
        <span className={`text-[10px] font-black uppercase tracking-wide ${compact ? '' : 'sm:hidden'}`}>
          {currentObj.code}
        </span>
        {!compact && (
          <span className="hidden max-w-[72px] truncate text-[11px] font-extrabold sm:inline">
            {currentObj.nativeName}
          </span>
        )}
        <ChevronDown
          className={`h-3 w-3 shrink-0 text-[#6B6B6B] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#F15A24]' : ''
          }`}
        />
      </button>

      {/* Desktop dropdown — anchored to the trigger */}
      {isOpen && (
        <div
          ref={desktopPanelRef}
          className="notranslate animate-scale-in absolute right-0 top-full z-50 mt-2 hidden max-h-[420px] w-[320px] flex-col overflow-hidden rounded-2xl border border-[#EBE5D8] bg-white shadow-2xl sm:flex"
        >
          {header}
          <div className="min-h-0 overflow-y-auto">{options}</div>
        </div>
      )}

      {/* Mobile bottom sheet — rendered in a portal so sticky/backdrop-blur
          headers cannot act as its containing block or clip it. */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="notranslate fixed inset-0 z-[130] sm:hidden">
            <div
              className="animate-fade-in absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />
            <div
              ref={mobilePanelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Select language"
              className="animate-slide-up pb-safe absolute inset-x-0 bottom-0 flex max-h-[80vh] flex-col overflow-hidden rounded-t-3xl border-t border-[#EBE5D8] bg-white shadow-2xl"
            >
              {header}
              <div className="min-h-0 flex-1 overflow-y-auto">{options}</div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
