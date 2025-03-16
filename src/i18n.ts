import { nextTick } from 'vue';
import { createI18n, I18n } from 'vue-i18n';

// Import locales configuration
const localesConfig = [
  {
    "key": "zh_TW",
    "text": "中文(繁體)",
    "json": "public/locales/zh_TW.json"
  },
  {
    "key": "en_US",
    "text": "English",
    "json": "public/locales/en_US.json"
  },
  {
    "key": "jp_ja",
    "text": "日本語",
    "json": "public/locales/jp_ja.json"
  },
  {
    "key": "ko_KR",
    "text": "한국어",
    "json": "public/locales/ko_KR.json"
  }
];

export function getAvailableLocales() {
  return localesConfig.map((config) => {
    return {
      "key": config.key,
      "text": config.text
    };
  })
}

export function isLocaleSupported(locale: string) {
  return localesConfig.map((config) => config.key).includes(locale);
}

export function setupI18n(options: { locale: string; fallbackLocale: string }) {
  // Try to get the saved locale from localStorage
  let savedLocale = '';
  if (typeof window !== 'undefined' && window.localStorage) {
    savedLocale = localStorage.getItem('breakfast333-locale') || '';
  }
  
  // Try to detect the browser language if no saved locale
  let detectedLocale = '';
  if (!savedLocale && typeof navigator !== 'undefined') {
    // Get browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    // Map browser language to our supported locales
    if (browserLang.startsWith('zh')) {
      detectedLocale = 'zh_TW';
    } else if (browserLang.startsWith('ja')) {
      detectedLocale = 'jp_ja';
    } else if (browserLang.startsWith('ko')) {
      detectedLocale = 'ko_KR';
    }
    
    // Only use detected locale if it's in our supported locales
    if (!isLocaleSupported(detectedLocale)) {
      detectedLocale = 'zh_TW';
    }
  }
  
  // Use saved locale, detected locale, or default locale
  const initialLocale = savedLocale || detectedLocale || options.locale;
  
  const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: initialLocale,
    fallbackLocale: options.fallbackLocale,
    messages: {},
  });
  
  setI18nLanguage(i18n, initialLocale);
  return i18n;
}

export function setI18nLanguage(i18n: I18n, locale: string) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    // @ts-ignore - In Composition API mode, locale is a ref
    i18n.global.locale.value = locale;
  }
  
  // Set HTML lang attribute if in browser environment
  if (typeof document !== 'undefined') {
    document.querySelector('html')?.setAttribute('lang', locale);
  }
}

export async function loadLocaleMessages(i18n: I18n, locale: string) {
  try {
    // Load locale messages with dynamic import
    let messages;
    
    try {
      // Try different paths to find the locale file
      let response;
      
      // First try with base path
      response = await fetch(`/locales/${locale}.json`);
      if (!response.ok) {
        // Then try with the base path from vite.config.ts
        response = await fetch(`/breakfast333-menu/locales/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch locale ${locale}: ${response.status} ${response.statusText}`);
        }
      }
      
      messages = await response.json();
      console.log(`Locale ${locale} loaded successfully`);
    } catch (e) {
      console.error(`Failed to load locale ${locale}:`, e);
      // Return without setting locale message
      return;
    }

    // Set locale message
    i18n.global.setLocaleMessage(locale, messages);

    return nextTick();
  } catch (error) {
    console.error(`Failed to load locale: ${locale}`, error);
  }
}
