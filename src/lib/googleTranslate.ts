export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
];

export type AppLang = string;

/**
 * Returns current language from cookie or localStorage.
 */
export function getCurrentLanguage(): string {
  if (typeof document === 'undefined') return 'en';

  // 1. Check googtrans cookie
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z]{2})/i);
  if (match && match[1]) {
    const code = match[1].toLowerCase();
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      return code;
    }
  }

  // 2. Check localStorage
  const stored = localStorage.getItem('ridebhai_lang');
  if (stored) {
    const code = stored.toLowerCase();
    if (SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      return code;
    }
  }

  return 'en';
}

/**
 * Changes app language using Google Translate engine.
 */
export function setGoogleTranslateLanguage(targetLang: string): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  localStorage.setItem('ridebhai_lang', targetLang);

  const host = window.location.hostname;
  const domainParts = host.split('.');
  const rootDomain = domainParts.length >= 2 ? '.' + domainParts.slice(-2).join('.') : '';

  if (targetLang === 'en') {
    // Clear cookies to restore original English
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
    if (rootDomain) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
    }
  } else {
    const cookieVal = `/en/${targetLang}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${host};`;
    if (rootDomain) {
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${rootDomain};`;
    }
  }

  // Trigger Google Translate select element if it has loaded
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (combo) {
    combo.value = targetLang;
    combo.dispatchEvent(new Event('change'));

    // If restoring English and combo wasn't reset
    if (targetLang === 'en' && combo.value !== 'en') {
      const opt = Array.from(combo.options).find(
        (o) => o.value === 'en' || o.value === '' || o.text.toLowerCase().includes('english')
      );
      if (opt) {
        combo.value = opt.value;
        combo.dispatchEvent(new Event('change'));
      } else {
        window.location.reload();
      }
    }
  } else {
    // If widget hasn't attached yet, reload so the cookie takes effect on bootstrap
    window.location.reload();
  }
}
