import React, { useEffect, useState, useRef } from 'react';
import { Languages, ChevronDown, Check, X, Globe } from 'lucide-react';
import {
  getCurrentLanguage,
  setGoogleTranslateLanguage,
  SUPPORTED_LANGUAGES,
} from '../../lib/googleTranslate';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());

    const timer = setInterval(() => {
      const current = getCurrentLanguage();
      setCurrentLang((prev) => (prev !== current ? current : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
    setGoogleTranslateLanguage(code);
  };

  const currentObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div ref={containerRef} className={`relative inline-block notranslate ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="notranslate inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EBE5D8] text-xs font-extrabold text-[#1C1C1C] active-press shadow-xs hover:border-[#F15A24] transition-all shrink-0"
        title="Select Language / भाषा चुनें"
      >
        <Languages className="w-3.5 h-3.5 text-[#F15A24]" />
        <span className="text-[11px] font-extrabold">{currentObj.nativeName}</span>
        <ChevronDown
          className={`w-3 h-3 text-[#6B6B6B] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#F15A24]' : ''
          }`}
        />
      </button>

      {/* Language Selection Modal / Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="notranslate fixed sm:absolute bottom-0 sm:bottom-auto left-0 sm:left-auto right-0 sm:right-0 sm:top-full sm:mt-2 z-50 w-full sm:w-[320px] max-h-[85vh] sm:max-h-[420px] bg-white rounded-t-3xl sm:rounded-2xl border border-[#EBE5D8] shadow-2xl overflow-hidden flex flex-col animate-scale-up"
          >
            {/* Header */}
            <div className="p-3.5 px-4 bg-[#FAF6EE] border-b border-[#EBE5D8] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#F15A24]" />
                <h4 className="text-xs font-black text-[#1C1C1C] uppercase tracking-wider">
                  Select Language / भाषा चुनें
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full bg-white border border-[#EBE5D8] text-[#6B6B6B] hover:text-[#1C1C1C] flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Options Grid */}
            <div className="p-2 sm:p-2.5 overflow-y-auto grid grid-cols-2 gap-1.5 max-h-[340px]">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-1.5 active-press ${
                      isActive
                        ? 'bg-[#FFF0EB] border-[#F15A24] text-[#F15A24] font-black shadow-xs ring-1 ring-[#F15A24]/30'
                        : 'bg-white border-[#EBE5D8] hover:border-[#F15A24]/50 hover:bg-[#FAF6EE] text-[#1C1C1C]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate">{lang.nativeName}</p>
                      <p className="text-[10px] text-[#6B6B6B] font-semibold truncate">
                        {lang.name}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-4 h-4 rounded-full bg-[#F15A24] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
