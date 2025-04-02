<template>
  <div class="my-4 text-center sm:text-right relative">
    <button 
      @click="toggleDropdown"
      class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
      focus:ring-2 focus:ring-primary focus:border-primary text-base inline-flex items-center"
      aria-label="Select language"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span class="ml-1">{{ currentLocaleText }}</span>
    </button>
    
    <div v-if="isDropdownOpen" 
      class="absolute right-0 mt-1 w-full max-w-[180px] bg-white border border-gray-300 rounded-md shadow-lg z-10">
      <div 
        v-for="locale in availableLocales" 
        :key="locale.key" 
        @click="selectLocale(locale.key)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-center"
        :class="{ 'bg-gray-50': locale.key === currentLocale }"
      >
        {{ locale.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAvailableLocalesSync } from '../i18n.ts';
import { useMenuStore } from '../store.ts';

// These must be at the top level of the setup function
const i18n = useI18n();
const menuStore = useMenuStore();
const currentLocale = ref(i18n.locale.value);
const isDropdownOpen = ref(false);

// Available locales - use the sync version to avoid async issues in the template
const availableLocales = computed(() => getAvailableLocalesSync());

// Get the text for the current locale
const currentLocaleText = computed(() => {
  const locale = availableLocales.value.find(loc => loc.key === currentLocale.value);
  return locale ? locale.text : currentLocale.value;
});

// Toggle dropdown visibility
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

// Select a locale from the dropdown
function selectLocale(localeKey: string) {
  currentLocale.value = localeKey;
  changeLocale();
  isDropdownOpen.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    isDropdownOpen.value = false;
  }
}

// Add and remove event listener for clicks outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Change locale
async function changeLocale() {
  try {
    console.log(`Changing locale to ${currentLocale.value}...`);
    
    // Ensure zh_TW is loaded as fallback
    if (!i18n.availableLocales.includes('zh_TW')) {
      try {
        const zhResponse = await fetch(`locales/zh_TW.json`);
        const zhMessages = await zhResponse.json();
        console.debug(`Fallback locale zh_TW loaded successfully`);
        i18n.setLocaleMessage('zh_TW', zhMessages);
      } catch (e) {
        console.error(`Failed to load fallback locale zh_TW:`, e);
      }
    }
    
    // Load selected locale messages if not loaded yet and it's not zh_TW
    if (currentLocale.value !== 'zh_TW') {
      try {
        // Try different paths to find the locale file
        const response = await fetch(`locales/${currentLocale.value}.json`);      
        const messages = await response.json();
        console.debug(`Locale ${currentLocale.value} loaded successfully`);
        
        // Set locale message directly
        i18n.setLocaleMessage(currentLocale.value, messages);
      } catch (e) {
        console.error(`Failed to load locale ${currentLocale.value}:`, e);
        // If we can't load the selected locale, fall back to zh_TW
        currentLocale.value = 'zh_TW';
      }
    }
    
    // Set language in Composition API mode
    // @ts-ignore - In Composition API mode, locale is a ref
    i18n.locale.value = currentLocale.value;
    
    // Set HTML lang attribute if in browser environment
    if (typeof document !== 'undefined') {
      // Convert locale format from xx_YY to xx-YY for HTML lang attribute
      const htmlLang = currentLocale.value.replace('_', '-');
      document.querySelector('html')?.setAttribute('lang', htmlLang);
    }
    
    // Save the selected locale to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('breakfast333-locale', currentLocale.value);
    }
    
    // Reload menu data to update translations
    menuStore.processMenuData();
    
    console.debug(`Locale changed to ${currentLocale.value}`);
  } catch (error) {
    console.error(`Failed to change locale to ${currentLocale.value}:`, error);
  }
}

// Initialize
onMounted(async () => {
  // Set initial locale
  if (currentLocale.value !== 'en_US') {
    await changeLocale();
  }
});
</script>
