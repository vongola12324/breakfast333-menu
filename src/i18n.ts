import { nextTick } from 'vue';
import { createI18n, I18n } from 'vue-i18n';

// Define the locale configuration interface
export interface LocaleConfig {
  key: string;
  text: string;
  json: string;
}

// Default locales configuration to use until the JSON file is loaded
const defaultLocalesConfig: LocaleConfig[] = [
  {
    "key": "zh_TW",
    "text": "中文(繁體)",
    "json": "public/locales/zh_TW.json"
  },
  {
    "key": "en_US",
    "text": "English",
    "json": "public/locales/en_US.json"
  }
];

// We'll load the locales configuration from the JSON file
let localesConfig: LocaleConfig[] = [...defaultLocalesConfig];
let localesLoaded = false;

// Function to load locales configuration
async function loadLocalesConfig(): Promise<LocaleConfig[]> {
  if (localesLoaded) {
    return localesConfig;
  }
  
  try {
    // Try different paths to find the locales.json file
    let response;
    
    // First try with base path
    response = await fetch('/locales.json');
    if (!response.ok) {
      // Then try with the base path from vite.config.ts
      response = await fetch('/breakfast333-menu/locales.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch locales.json: ${response.status} ${response.statusText}`);
      }
    }
    
    const config = await response.json();
    console.log('Locales configuration loaded successfully');
    localesLoaded = true;
    return config;
  } catch (e) {
    console.error('Failed to load locales configuration:', e);
    // Return default configuration if fetch fails
    return defaultLocalesConfig;
  }
}

// Initialize locales config
loadLocalesConfig().then(config => {
  localesConfig = config;
});

export async function getAvailableLocales() {
  // Ensure locales are loaded
  if (!localesLoaded) {
    localesConfig = await loadLocalesConfig();
  }
  
  return localesConfig.map((config) => {
    return {
      "key": config.key,
      "text": config.text
    };
  });
}

// Synchronous version for immediate use
export function getAvailableLocalesSync() {
  return localesConfig.map((config) => {
    return {
      "key": config.key,
      "text": config.text
    };
  });
}

export async function isLocaleSupported(locale: string) {
  // Ensure locales are loaded
  if (!localesLoaded) {
    localesConfig = await loadLocalesConfig();
  }
  
  return localesConfig.map((config) => config.key).includes(locale);
}

// Synchronous version for immediate use
export function isLocaleSupportedSync(locale: string) {
  return localesConfig.map((config) => config.key).includes(locale);
}

export async function setupI18n(options: { locale: string; fallbackLocale: string }) {
  // Ensure locales are loaded
  if (!localesLoaded) {
    localesConfig = await loadLocalesConfig();
  }
  
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
    if (!isLocaleSupportedSync(detectedLocale)) {
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
