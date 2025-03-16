import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Create a global state to store the i18n instance
const globalI18n = ref<any>(null);

export function useTranslation() {
  // Get the i18n instance
  const i18n = useI18n();
  
  // Store the i18n instance in the global state
  globalI18n.value = i18n;
  
  // Function to translate a key
  const translate = (key: string, defaultValue: string = key) => {
    if (!key) return defaultValue;
    
    try {
      // Use the i18n instance to translate the key
      // The key should be the exact key from the locale file
      // For example: CATEGORY_EGG_CREPE, ITEM_EGG_CREPE_CLASSIC, etc.
      return i18n.t(key);
    } catch (e) {
      console.error(`Failed to translate key: ${key}`, e);
      
      // Fallback: format the key to be more readable
      if (key.startsWith('CATEGORY_')) {
        return key.replace('CATEGORY_', '');
      } else if (key.startsWith('ITEM_')) {
        return key.replace(/^ITEM_[^_]+_/, '').replace(/_/g, ' ');
      } else {
        return defaultValue;
      }
    }
  };
  
  return {
    translate,
    i18n
  };
}

// Export a function to get the global i18n instance
export function getGlobalI18n() {
  return globalI18n.value;
}
