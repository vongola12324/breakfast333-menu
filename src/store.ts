import { defineStore } from 'pinia';

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
  sugar?: boolean;
  temperature?: string[];
  flavors?: {
    min: number;
    max: number;
    options: string[];
  };
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  size?: string;
  sweetness?: string;
  temperature?: string;
  selectedFlavors?: string[];
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
      sugar?: boolean;
      temperature?: string[];
      flavors?: {
        min: number;
        max: number;
        options: string[];
      };
    }
  }
}

export type OrderType = 'takeout' | 'eat-inside';

export const useMenuStore = defineStore('menu', {
  state: () => ({
    appTitle: "",
    appTagLine: "",
    rawMenu: {} as MenuData,
    menuItems: [] as MenuItem[],
    selectedCategory: '',
    menuLoadError: false,
    cart: [] as CartItem[],
    selectedItemForCustomization: null as MenuItem | null,
    displayCustomizationModal: false,
    orderType: 'takeout' as OrderType,
    takeoutBoxFee: 10 // Default value
  }),
  
  getters: {
    categories: (state) => {
      const uniqueCategories = new Set<string>();
      state.menuItems.forEach(item => uniqueCategories.add(item.category));
      return Array.from(uniqueCategories);
    },
    
    filteredMenuItems: (state) => {
      return state.menuItems.filter(item => item.category === state.selectedCategory);
    },
    
    cartItems: (state) => {
      return state.cart;
    },
    
    cartItemCount: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => {
        // Calculate base price based on size
        const price = item.size == 'LARGE_SIZE' && item.menuItem.priceLarge 
          ? item.menuItem.price + item.menuItem.priceLarge 
          : item.menuItem.price;
        
        // Add takeout box fee if applicable
        const takeoutFee = (state.orderType === 'takeout' && item.menuItem.takeoutBox) ? state.takeoutBoxFee : 0;
        
        return total + ((price + takeoutFee) * item.quantity);
      }, 0);
    }
  },
  
  actions: {
    setAppConfig(title: string, tagline: string) {
      this.appTitle = title;
      this.appTagLine = tagline;
    },

    setTakeoutBoxFee(fee: number) {
      this.takeoutBoxFee = fee;
    },
    
    setCategory(category: string) {
      this.selectedCategory = category;
    },
    
    hasCustomizationOptions(item: MenuItem): boolean {
      // Check if the item has any customization options
      const hasSizeOption = item.priceLarge && item.priceLarge > 0;
      const hasSweetnessOption = item.sugar === true;
      const hasTemperatureOption = item.temperature && item.temperature.length > 0;
      const hasFlavorOptions = item.flavors && item.flavors.options?.length > 0;
      
      return Boolean(hasSizeOption || hasSweetnessOption || hasTemperatureOption || hasFlavorOptions);
    },
    
    showCustomizationModal(item: MenuItem) {
      this.selectedItemForCustomization = item;
      this.displayCustomizationModal = true;
    },

    closeCustomizationModal() {
      this.displayCustomizationModal = false;
      this.selectedItemForCustomization = null;
    },
    
    addToCart(menuItem: MenuItem, size: string = '', sweetness: string = '', temperature: string = '', selectedFlavors: string[] = []) {
      // Check if the item is already in the cart with the same customizations
      const existingItemIndex = this.cart.findIndex(
        item => item.menuItem.id === menuItem.id && 
               item.size === size &&
               item.sweetness === sweetness &&
               item.temperature === temperature &&
               JSON.stringify(item.selectedFlavors) === JSON.stringify(selectedFlavors)
      );
      
      if (existingItemIndex !== -1) {
        // If the item is already in the cart with the same options, increase the quantity
        this.cart[existingItemIndex].quantity += 1;
      } else {
        // Otherwise, add a new item to the cart
        this.cart.push({
          menuItem,
          quantity: 1,
          size,
          sweetness,
          temperature,
          selectedFlavors
        });
      }
    },
    
    removeFromCart(index: number) {
      this.cart.splice(index, 1);
    },
    
    updateCartItemQuantity(index: number, quantity: number) {
      if (quantity <= 0) {
        this.removeFromCart(index);
      } else {
        this.cart[index].quantity = quantity;
      }
    },
    
    clearCart() {
      this.cart = [];
    },
    
    setMenuLoadError(hasError: boolean) {
      this.menuLoadError = hasError;
    },
    
    setOrderType(type: OrderType) {
      this.orderType = type;
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
              priceLarge: item.priceLarge > 0 ? item.priceLarge : undefined,
              sugar: item.sugar,
              temperature: item.temperature,
              flavors: item.flavors
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
