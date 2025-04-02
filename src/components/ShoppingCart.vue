<template>
  <div class="shopping-cart">
    <!-- Cart toggle button with item count badge -->
    <button 
      @click="isCartOpen = !isCartOpen" 
      class="fixed bottom-4 right-4 z-40 bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors"
      aria-label="Shopping Cart"
    >
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span 
          v-if="cartItemCount > 0" 
          class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
        >
          {{ cartItemCount }}
        </span>
      </div>
    </button>

    <!-- Cart panel -->
    <div 
      v-if="isCartOpen" 
      class="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex justify-end"
      @click.self="isCartOpen = false"
    >
      <div class="bg-white w-full max-w-md h-full overflow-y-auto p-4 flex flex-col border border-gray-200 shadow-lg">
        <!-- Cart header -->
        <div class="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 class="text-xl font-bold text-primary">{{ t('YOUR_ORDER') }}</h2>
          <button 
            @click="isCartOpen = false" 
            class="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Empty cart message -->
        <div v-if="cartItems.length === 0" class="flex-grow flex flex-col items-center justify-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-lg">{{ t('CART_EMPTY', 'Your cart is empty') }}</p>
        </div>

        <!-- Cart items -->
        <div v-else class="flex-grow">
          <div 
            v-for="(item, index) in cartItems" 
            :key="`${item.menuItem.id}-${item.size || ''}-${item.sweetness || ''}-${item.temperature || ''}-${item.selectedFlavors ? item.selectedFlavors.join('-') : ''}`"
            class="py-3 border-b flex justify-between items-start"
          >
            <div class="flex-grow pr-4">
              <h3 class="font-semibold text-primary">{{ t(item.menuItem.id) }}</h3>
              <div class="text-sm text-gray-500">
                <p class="customization-item">
                  <!-- Size option -->
                  <span v-if="item.size">
                    {{ t(item.size) }}
                  </span>
                  <!-- Sweetness option -->
                  <span v-if="item.sweetness">
                    {{ t(item.sweetness) }}
                  </span>
                  
                  <!-- Temperature option -->
                  <span v-if="item.temperature">
                    {{ t(item.temperature) }}
                  </span>
                  
                  <!-- Flavor options -->
                  <span v-if="item.selectedFlavors && item.selectedFlavors.length > 0">
                    {{ item.selectedFlavors.map(flavor => t(flavor)).join(', ') }}
                  </span>
                </p>
              </div>
              <div class="mt-1 flex items-center">
                <button 
                  @click="decrementQuantity(index)" 
                  class="text-gray-500 hover:text-primary"
                  aria-label="Decrease quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="mx-2 min-w-[1.5rem] text-center">{{ item.quantity }}</span>
                <button 
                  @click="incrementQuantity(index)" 
                  class="text-gray-500 hover:text-primary"
                  aria-label="Increase quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <div class="text-right">
                <span class="font-medium">
                  NT${{ getItemPrice(item).toFixed(0) }}
                </span>
                <span v-if="hasTakeoutBoxFee(item)" class="text-xs text-gray-500 block">
                  ({{ t('INCLUDES_TAKEOUT_FEE') }})
                </span>
              </div>
              <button 
                @click="removeItem(index)" 
                class="text-red-500 hover:text-red-700 text-sm mt-1"
                aria-label="Remove item"
              >
                {{ t('REMOVE') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cart footer -->
        <div v-if="cartItems.length > 0" class="mt-4 pt-2 border-t">
          <div class="flex justify-between mb-2">
            <span>{{ t('TOTAL_PRICE') }}</span>
            <span class="font-medium">NT${{ cartTotal.toFixed(0) }}</span>
          </div>
          <div v-if="orderType === 'takeout'" class="text-sm text-gray-500 mb-2">
            {{ t('TAKEOUT_BOX_NOTE', { takeout_box_price: takeoutBoxFee }) }}
          </div>
          
          <!-- Order Type Selection -->
          <div class="my-4">
            <p class="font-medium mb-2">{{ t('ORDER_TYPE', 'Order Type') }}</p>
            <div class="flex gap-2">
              <button 
                @click="setOrderType('takeout')" 
                class="flex-1 py-2 px-4 rounded-md border transition-colors"
                :class="orderType === 'takeout' ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-100'"
              >
                {{ t('TAKE_OUT', 'Takeout') }}
              </button>
              <button 
                @click="setOrderType('eat-inside')" 
                class="flex-1 py-2 px-4 rounded-md border transition-colors"
                :class="orderType === 'eat-inside' ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-100'"
              >
                {{ t('DINE_IN', 'Eat Inside') }}
              </button>
            </div>
          </div>
          
          <button 
            @click="checkout" 
            class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-md transition-colors mt-4"
          >
            {{ t('CONFIRM_ORDER') }}
          </button>
          <button 
            @click="clearCart" 
            class="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-md hover:bg-gray-100 transition-colors mt-2"
          >
            {{ t('CLEAR_CART') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Checkout Modal (Fullscreen) -->
  <div 
    v-if="showCheckoutModal" 
    class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 w-full h-full max-w-full max-h-full overflow-y-auto">
      <div class="max-w-4xl mx-auto h-full flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8 pb-4 border-b">
          <h2 class="text-3xl font-bold text-primary">
            {{ t('YOUR_ORDER') }}
          </h2>
          <button 
            @click="showCheckoutModal = false" 
            class="text-gray-500 hover:text-gray-700 p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Cart Items in Chinese -->
        <div class="flex-grow mb-8">
          <h3 class="text-xl font-semibold mb-4">{{ t('CHECKOUT_HINT') }}</h3>
          <div class="bg-gray-50 px-6 py-3 rounded-lg">
            <ul class="space-y-2 divide-y divide-gray-200">
              <li v-for="item in cartItems" :key="`modal-${item.menuItem.id}`" class="flex justify-between pt-1 pb-2">
                <div>
                  <!-- Always display in Chinese -->
                  <span class="text-lg font-semibold text-primary">{{ t(item.menuItem.id, {}, {locale: 'zh-TW'}) }}</span>
                  <div class="text-gray-600 mt-1">
                    <p class="customization-item">
                      <!-- Size option -->
                      <span v-if="item.size">
                        {{ t(item.size, {}, {locale: 'zh-TW'}) }}
                      </span>
                      
                      <!-- Sweetness option -->
                      <span v-if="item.sweetness">
                        {{ t(item.sweetness, {}, {locale: 'zh-TW'}) }}
                      </span>
                      
                      <!-- Temperature option -->
                      <span v-if="item.temperature">
                        {{ t(item.temperature, {}, {locale: 'zh-TW'}) }}
                      </span>
                      
                      <!-- Flavor options -->
                      <span v-if="item.selectedFlavors && item.selectedFlavors.length > 0">
                        {{ item.selectedFlavors.map(flavor => t(flavor, {}, {locale: 'zh-TW'})).join(', ') }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg">x{{ item.quantity }}</div>
                  <div class="font-medium">
                    <span v-if="hasTakeoutBoxFee(item)" class="text-sm text-gray-500">
                      ({{ t('INCLUDES_TAKEOUT_FEE', {}, {locale: 'zh-TW'}) }})
                    </span>
                    <span class="text-lg">NT${{ getItemPrice(item).toFixed(0) }}</span>
                  </div>
                  
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Order Type -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-2">{{ t('ORDER_TYPE', {}, {locale: 'zh-TW'}) }}</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-lg font-medium">
              {{ orderType === 'takeout' ? t('TAKE_OUT', {}, {locale: 'zh-TW'}) : t('DINE_IN', {}, {locale: 'zh-TW'}) }}
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="border-t pt-6 mt-auto">
          <div class="flex justify-between text-xl font-bold mb-2">
            <span>{{ t('TOTAL_PRICE', {}, {locale: 'zh-TW'}) }}(Total)</span>
            <span>NT${{ cartTotal.toFixed(0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMenuStore, CartItem, OrderType } from '../store';
import { useTranslation } from '../composables/useTranslation.ts';

const { t } = useI18n();
const menuStore = useMenuStore();

// Cart state
const isCartOpen = ref(false);
const showCheckoutModal = ref(false);

// Computed properties from the store
const cartItems = computed(() => menuStore.cartItems);
const cartItemCount = computed(() => menuStore.cartItemCount);
const cartTotal = computed(() => menuStore.cartTotal);
const orderType = computed(() => menuStore.orderType);

// Order type actions
const setOrderType = (type: OrderType) => {
  menuStore.setOrderType(type);
};

// Get takeout box fee from the store
const takeoutBoxFee = computed(() => menuStore.takeoutBoxFee);

// Helper function to get the price of an item
const getItemPrice = (item: CartItem) => {
  const basePrice = item.menuItem.price;
  const extraPrice = item.size === 'LARGE_SIZE' && item.menuItem.priceLarge ? item.menuItem.priceLarge : 0;
  const takeoutFee = (orderType.value === 'takeout' && item.menuItem.takeoutBox) ? takeoutBoxFee.value : 0;
  return ((basePrice + extraPrice + takeoutFee) * item.quantity);
};

// Helper function to check if an item has a takeout box fee
const hasTakeoutBoxFee = (item: CartItem) => {
  return orderType.value === 'takeout' && item.menuItem.takeoutBox;
};

// Cart actions
const incrementQuantity = (index: number) => {
  menuStore.updateCartItemQuantity(index, cartItems.value[index].quantity + 1);
};

const decrementQuantity = (index: number) => {
  if (cartItems.value[index].quantity > 1) {
    menuStore.updateCartItemQuantity(index, cartItems.value[index].quantity - 1);
  } else {
    menuStore.removeFromCart(index);
  }
};

const removeItem = (index: number) => {
  menuStore.removeFromCart(index);
};

const clearCart = () => {
  menuStore.clearCart();
};

const checkout = () => {
  // Show the checkout modal and close the cart
  showCheckoutModal.value = true;
  isCartOpen.value = false;
};
</script>

<style>
p.customization-item span::after {
  content: " / ";
}
p.customization-item span:last-child::after {
  content: "";
}
</style>