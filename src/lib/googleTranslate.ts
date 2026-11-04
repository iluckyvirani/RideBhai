export type AppLang = 'en' | 'hi';

/**
 * Returns current language from cookie or localStorage.
 */
export function getCurrentLanguage(): AppLang {
  if (typeof document === 'undefined') return 'en';

  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z]{2})/i);
  if (match && (match[1] === 'hi' || match[1] === 'en')) {
    return match[1] as AppLang;
  }

  const stored = localStorage.getItem('ridebhai_lang');
  if (stored === 'hi' || stored === 'en') {
    return stored as AppLang;
  }

  return 'en';
}

/**
 * Changes app language using Google Translate engine.
 */
export function setGoogleTranslateLanguage(targetLang: AppLang): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  localStorage.setItem('ridebhai_lang', targetLang);

  const cookieVal = `/en/${targetLang}`;
  const host = window.location.hostname;

  // Set googtrans cookie across possible subdomains and paths
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  document.cookie = `googtrans=${cookieVal}; path=/; domain=${host};`;

  if (host.includes('.')) {
    const parts = host.split('.');
    if (parts.length >= 2) {
      const rootDomain = '.' + parts.slice(-2).join('.');
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${rootDomain};`;
    }
  }

  // Trigger Google Translate select element if it has loaded
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (combo) {
    combo.value = targetLang;
    combo.dispatchEvent(new Event('change'));
  } else {
    // If widget hasn't attached yet, reload so the cookie takes effect on bootstrap
    window.location.reload();
  }
}

