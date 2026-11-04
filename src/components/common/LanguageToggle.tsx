import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import { getCurrentLanguage, setGoogleTranslateLanguage, AppLang } from '../../lib/googleTranslate';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const [lang, setLang] = useState<AppLang>('en');

  useEffect(() => {
    setLang(getCurrentLanguage());

    // Periodically poll cookie in case external translator changed it
    const timer = setInterval(() => {
      const current = getCurrentLanguage();
      setLang((prev) => (prev !== current ? current : prev));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const handleToggle = () => {
    const next: AppLang = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    setGoogleTranslateLanguage(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`notranslate inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#EBE5D8] text-xs font-extrabold text-[#1C1C1C] active-press shadow-xs hover:border-[#F15A24] transition-all shrink-0 ${className}`}
      title={lang === 'en' ? 'हिन्दी में बदलें (Switch to Hindi)' : 'Switch to English'}
    >
      <Languages className="w-3.5 h-3.5 text-[#F15A24]" />
      <span className="text-[11px] font-bold">
        {lang === 'en' ? 'हिन्दी' : 'English'}
      </span>
    </button>
  );
};

