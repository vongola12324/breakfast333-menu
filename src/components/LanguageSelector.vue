<template>
  <div class="my-4 text-center sm:text-right">
    <select 
      v-model="currentLocale" 
      @change="changeLocale"
      class="w-full max-w-[180px] sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
      focus:ring-2 focus:ring-primary focus:border-primary text-base"
    >
      <option v-for="locale in availableLocales" :key="locale.key" :value="locale.key">
        {{ locale.text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAvailableLocalesSync } from '../i18n.ts';
import { useMenuStore } from '../store.ts';

// These must be at the top level of the setup function
const i18n = useI18n();
const menuStore = useMenuStore();
const currentLocale = ref(i18n.locale.value);

// Available locales - use the sync version to avoid async issues in the template
const availableLocales = computed(() => getAvailableLocalesSync());

// Change locale
async function changeLocale() {
  try {
    console.log(`Changing locale to ${currentLocale.value}...`);
    
    // Load locale messages if not loaded yet
    try {
      // Try different paths to find the locale file
      const response = await fetch(`locales/${currentLocale.value}.json`);      
      const messages = await response.json();
      console.debug(`Locale ${currentLocale.value} loaded successfully`);
      
      // Set locale message directly
      i18n.setLocaleMessage(currentLocale.value, messages);
      
      // Set language in Composition API mode
      // @ts-ignore - In Composition API mode, locale is a ref
      i18n.locale.value = currentLocale.value;
      
      // Set HTML lang attribute if in browser environment
      if (typeof document !== 'undefined') {
        document.querySelector('html')?.setAttribute('lang', currentLocale.value);
      }
      
      // Save the selected locale to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('breakfast333-locale', currentLocale.value);
      }
    } catch (e) {
      console.error(`Failed to load locale ${currentLocale.value}:`, e);
      return;
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
