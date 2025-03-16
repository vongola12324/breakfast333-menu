import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./style.css";
import { setupI18n, loadLocaleMessages } from "./i18n.ts";
import { useMenuStore } from "./store.ts";

// Create Pinia store
const pinia = createPinia();

// Create Vue app
const app = createApp(App);

// Add Pinia store
app.use(pinia);

// Initialize app asynchronously
async function initApp() {
  try {
    // Setup i18n (now async)
    const i18n = await setupI18n({
      locale: 'en_US',
      fallbackLocale: 'en_US',
    });
    
    // Add i18n to app
    app.use(i18n);
    
    // Mount the app
    app.mount("#app");
    
    return { i18n };
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
}

// Start initialization
initApp().then(({ i18n }) => {
  // Continue with setup after app is mounted
  setupApp(i18n);
}).catch(error => {
  console.error('App initialization failed:', error);
});

// Load menu data and locale messages
async function setupApp(i18n: any) {
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

// The setupApp function is now called from the initApp().then() callback above
