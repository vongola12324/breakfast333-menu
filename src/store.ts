import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n'


export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  vegetarian: boolean;
  takeoutBox: boolean;
  priceLarge?: number;
}

export interface MenuData {
  [category: string]: {
    [itemId: string]: {
      id: string;
      price: number;
      priceLarge: number;
      takeoutBox: boolean;
      vegetarian: boolean;
      description: boolean;
    }
  }
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    rawMenu: {} as MenuData,
    menuItems: [] as MenuItem[],
    selectedCategory: '',
    menuLoadError: false
  }),
  
  getters: {
    categories: (state) => {
      const uniqueCategories = new Set<string>();
      state.menuItems.forEach(item => uniqueCategories.add(item.category));
      return Array.from(uniqueCategories);
    },
    
    filteredMenuItems: (state) => {
      return state.menuItems.filter(item => item.category === state.selectedCategory);
    }
  },
  
  actions: {
    setCategory(category: string) {
      this.selectedCategory = category;
    },
    
    setMenuLoadError(hasError: boolean) {
      this.menuLoadError = hasError;
    },
    
    initializeMenu(menuData: MenuData) {
      this.rawMenu = menuData;
      this.processMenuData();
    },
    
    processMenuData() {
      try {
        console.debug('Processing menu data...');
        const items: MenuItem[] = [];
        
        // Process each category
        for (const categoryKey in this.rawMenu) {
          console.debug(`Processing category: ${categoryKey}`);
          const categoryItems = this.rawMenu[categoryKey];
          
          // Extract the category name without the prefix
          // This will be used for filtering
          const categoryName = categoryKey.replace('CATEGORY_', '');
          const colorHex = this.getColorForCategory(categoryKey);
          
          // Process each item in the category
          for (const itemKey in categoryItems) {
            console.debug(`Processing item: ${itemKey}`);
            const item = categoryItems[itemKey];
            
            const imageUrl = `https://placehold.co/400x300/${colorHex}/333?text=${encodeURIComponent(itemKey)}`;
            
            items.push({
              id: itemKey,
              name: itemKey,
              description: item.description ? `${itemKey}_DESC` : undefined,
              price: item.price,
              category: categoryName,
              image: imageUrl,
              vegetarian: item.vegetarian,
              takeoutBox: item.takeoutBox,
              priceLarge: item.priceLarge > 0 ? item.priceLarge : undefined
            });
            if (this.selectedCategory === '') {
              this.setCategory(categoryName);
            }
          }
        }
        
        console.debug(`Processed ${items.length} menu items`);
        this.menuItems = items;
      } catch (error) {
        console.error('Error processing menu data:', error);
      }
    },
    
    // Helper method to translate keys using the current locale
    translateKey(key: string, defaultValue: string = key): string {
      const i18n = useI18n();
      try {
        // Try to use the i18n instance to translate the key
        // Since we can't directly access the i18n instance here,
        // we'll use a workaround to check if the key exists in the locale files
        
        // First, try to get the translation from the window object
        // This is a workaround since we can't directly use useI18n() in a store
        const translations = i18n.messages.value;
        let currentLocale = document.querySelector('html')?.getAttribute('lang') || 'zh_TW';
        if (translations) {
          if (!(currentLocale in translations)) {
            currentLocale = 'zh_TW';
          }
          if (translations[currentLocale][key]) {
            return translations[currentLocale][key];
          }
        }
        // If not found, use the formatted key as fallback
        if (key.startsWith('CATEGORY_')) {
          return key.replace('CATEGORY_', '');
        } else if (key.startsWith('ITEM_')) {
          return key.replace(/^ITEM_[^_]+_/, '').replace(/_/g, ' ');
        } else {
          return defaultValue;
        }
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
    },
    
    // Helper method to get a color for each category
    getColorForCategory(category: string): string {
      // Generate a hash from the category string
      let hash = 0;
      for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Convert the hash to a pastel color
      // We'll use HSL color model to ensure visually pleasing colors
      // Hue: 0-360 (full color spectrum)
      // Saturation: 60-80% (colorful but not too intense)
      // Lightness: 75-85% (light/pastel but not too pale)
      const hue = Math.abs(hash) % 360;
      const saturation = 60 + (Math.abs(hash) % 20); // 60-80%
      const lightness = 75 + (Math.abs(hash) % 10);  // 75-85%
      
      // Convert HSL to hex
      const h = hue / 360;
      const s = saturation / 100;
      const l = lightness / 100;
      
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      // Convert to hex
      const toHex = (x: number) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      return `${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  }
});
