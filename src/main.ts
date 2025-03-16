import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import { setupI18n, loadLocaleMessages } from "./i18n.ts";
import { useMenuStore } from "./store.ts";

// Create Pinia store
const pinia = createPinia();

// Setup i18n
const i18n = setupI18n({
  locale: 'en_US',
  fallbackLocale: 'en_US',
});

// Create Vue app
const app = createApp(App);

// Add Pinia store and i18n
app.use(pinia);
app.use(i18n);

// Mount the app immediately
app.mount("#app");

// Load menu data and locale messages
async function setupApp() {
  try {
    // Load initial locale messages
    console.log('Loading initial locale messages...');
    const i18nInstance = i18n.global;
    const currentLocale = i18nInstance.locale.value;
    
    try {
      await loadLocaleMessages(i18n, currentLocale);
    } catch (e) {
      console.error(`Failed to load initial locale ${currentLocale}:`, e);
    }
    
    // Load menu data
    console.log('Loading menu data...');
    let menuData;
    
    try {
      // Try different paths to find the menu.json file
      let menuResponse;
      
      // First try with base path
      menuResponse = await fetch('/menu.json');
      if (!menuResponse.ok) {
        // Then try with the base path from vite.config.ts
        menuResponse = await fetch('/breakfast333-menu/menu.json');
        if (!menuResponse.ok) {
          throw new Error(`Failed to fetch menu: ${menuResponse.status} ${menuResponse.statusText}`);
        }
      }
      
      menuData = await menuResponse.json();
      console.log('Menu loaded successfully');
    } catch (e) {
      console.error('Failed to load menu.json:', e);
      // Set error state in the store
      const menuStore = useMenuStore();
      menuStore.setMenuLoadError(true);
      throw e; // Re-throw to stop further processing
    }
    
    // Initialize store with menu data
    console.log('Initializing menu store...');
    const menuStore = useMenuStore();
    menuStore.initializeMenu(menuData);
    
    console.log('Setup complete!');
  } catch (error) {
    console.error('Error setting up app:', error);
  }
}

// Start setup process
setupApp();
