<template>
  <div class="mt-4 sm:mt-6 lg:mt-8 relative">
    <!-- Category filters -->
    <div class="flex overflow-x-auto pb-2 mb-6 gap-2 scrollbar-thin scrollbar-thumb-gray-300
     scrollbar-track-transparent"
     >
      <button 
        v-for="category in categories" 
        :key="category"
        :class="[
          'px-3 py-2 md:px-4 rounded-full text-xs md:text-sm whitespace-nowrap border transition-colors flex-shrink-0',
          selectedCategory === category 
            ? 'bg-primary text-white border-primary' 
            : 'bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100'
        ]"
        @click="selectedCategory = category"
      >
        {{ translate(`CATEGORY_${category}`) }}
      </button>
    </div>

    <!-- Menu items grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <BreakfastMenuItem 
        v-for="item in translatedMenuItems" 
        :key="item.id"
        :item="item"
      />
    </div>
    
    <!-- Customization Modal -->
    <div 
      v-if="menuStore.showCustomizationModal && menuStore.selectedItemForCustomization" 
      class="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center"
      @click.self="menuStore.closeCustomizationModal()"
    >
      <div class="bg-white rounded-lg p-4 w-full max-w-md mx-4 border border-gray-200 shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-primary">
            {{ menuStore.selectedItemForCustomization ? translate(menuStore.selectedItemForCustomization.id) : '' }}
          </h3>
          <button 
            @click="menuStore.closeCustomizationModal()" 
            class="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Size Selection -->
        <div v-if="hasSizeOption" class="mb-4">
          <h4 class="font-medium mb-2">{{ translate('OPTION_SIZE', 'Size') }}</h4>
          <div class="flex space-x-2">
            <button 
              @click="selectedSize = 'MEDIUM_SIZE'" 
              :class="[
                'flex-1 py-2 px-3 rounded-md border transition-colors',
                selectedSize === 'MEDIUM_SIZE' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ translate('MEDIUM_SIZE') }}
            </button>
            <button 
              @click="selectedSize = 'LARGE_SIZE'" 
              :class="[
                'flex-1 py-2 px-3 rounded-md border transition-colors',
                selectedSize === 'LARGE_SIZE' 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ translate('LARGE_SIZE') }}
              <div class="text-sm" v-if="menuStore.selectedItemForCustomization && menuStore.selectedItemForCustomization.priceLarge">
                + NT${{ menuStore.selectedItemForCustomization.priceLarge.toFixed(0) }}
              </div>
            </button>
          </div>
        </div>
        
        <!-- Sweetness Selection -->
        <div v-if="hasSweetnessOption" class="mb-4">
          <h4 class="font-medium mb-2">{{ translate('OPTION_SWEETNESS') }}</h4>
          <div class="grid grid-cols-3 gap-2">
            <button 
              v-for="level in sweetnessLevels" 
              :key="level.value"
              @click="selectedSweetness = level.value" 
              :class="[
                'py-2 px-3 rounded-md border transition-colors text-center',
                selectedSweetness === level.value 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ translate(level.label) }}
            </button>
          </div>
        </div>
        
        <!-- Temperature Selection -->
        <div v-if="hasTemperatureOption" class="mb-4">
          <h4 class="font-medium mb-2">{{ translate('OPTION_TEMPERATURE') }}</h4>
          <div class="flex space-x-2">
            <button 
              v-for="temp in menuStore.selectedItemForCustomization?.temperature" 
              :key="temp"
              @click="selectedTemperature = temp" 
              :class="[
                'flex-1 py-2 px-3 rounded-md border transition-colors',
                selectedTemperature === temp 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ translate(temp) }}
            </button>
          </div>
        </div>
        
        <!-- Flavor Selection -->
        <div v-if="hasFlavorOptions" class="mb-4">
          <h4 class="font-medium mb-2 flex justify-between">
            <span>{{ translate('OPTION_FLAVORS') }}</span>
            <span class="text-sm text-gray-500">
              {{ selectedFlavors.length }} / {{ requiredFlavorCount }}
            </span>
          </h4>
          <div class="grid grid-cols-2 gap-2">
            <button 
              v-for="flavor in flavorOptions" 
              :key="flavor"
              @click="toggleFlavorSelection(flavor)" 
              :class="[
                'py-2 px-3 rounded-md border transition-colors text-center',
                selectedFlavors.includes(flavor) 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                selectedFlavors.length >= maxFlavorCount && !selectedFlavors.includes(flavor)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              ]"
              :disabled="selectedFlavors.length >= maxFlavorCount && !selectedFlavors.includes(flavor)"
            >
              {{ translate(flavor) }}
            </button>
          </div>
        </div>
        
        <!-- Add to Cart Button -->
        <button 
          @click="confirmAddToCart" 
          :disabled="!areAllRequiredOptionsSelected"
          :class="[
            'w-full font-bold py-3 rounded-md transition-all duration-300 mt-2',
            isAddingToCart 
              ? 'bg-green-500 scale-105 text-white' 
              : areAllRequiredOptionsSelected
                ? 'bg-primary hover:bg-primary/90 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ translate('BUTTON_ADD_CART') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useMenuStore, MenuItem } from '../store.ts';
import { useTranslation } from '../composables/useTranslation.ts';
import BreakfastMenuItem from './BreakfastMenuItem.vue';

// Use i18n
const { translate } = useTranslation();

// Use the menu store
const menuStore = useMenuStore();

// Customization options
const selectedSize = ref('');
const selectedSweetness = ref('');
const selectedTemperature = ref('');
const selectedFlavors = ref<string[]>([]);

// Button animation state
const isAddingToCart = ref(false);

// Computed properties from the store
const categories = computed(() => menuStore.categories);
const filteredMenuItems = computed(() => menuStore.filteredMenuItems);
const selectedCategory = computed({
  get: () => menuStore.selectedCategory,
  set: (value) => menuStore.setCategory(value)
});

// Computed properties to check if options are available
const hasSizeOption = computed(() => {
  return menuStore.selectedItemForCustomization?.priceLarge && 
         menuStore.selectedItemForCustomization.priceLarge > 0;
});

const hasSweetnessOption = computed(() => {
  return menuStore.selectedItemForCustomization?.sugar === true;
});

const hasTemperatureOption = computed(() => {
  return menuStore.selectedItemForCustomization?.temperature && 
         menuStore.selectedItemForCustomization.temperature.length > 0;
});

const hasFlavorOptions = computed(() => {
  return menuStore.selectedItemForCustomization?.flavors && 
         menuStore.selectedItemForCustomization.flavors.options?.length > 0;
});

const flavorOptions = computed(() => {
  return menuStore.selectedItemForCustomization?.flavors?.options || [];
});

const requiredFlavorCount = computed(() => {
  return menuStore.selectedItemForCustomization?.flavors?.min || 0;
});

const maxFlavorCount = computed(() => {
  return menuStore.selectedItemForCustomization?.flavors?.max || 0;
});

const isFlavorSelectionValid = computed(() => {
  if (!hasFlavorOptions.value) return true;
  
  const min = requiredFlavorCount.value;
  const max = maxFlavorCount.value;
  const selected = selectedFlavors.value.length;
  
  return selected >= min && selected <= max;
});

// Check if all required options are selected
const areAllRequiredOptionsSelected = computed(() => {
  // Check flavor selection if required
  if (hasFlavorOptions.value && !isFlavorSelectionValid.value) {
    return false;
  }
  
  // Check size selection if required
  if (hasSizeOption.value && !selectedSize.value) {
    return false;
  }
  
  // Check sweetness selection if required
  if (hasSweetnessOption.value && !selectedSweetness.value) {
    return false;
  }
  
  // Check temperature selection if required
  if (hasTemperatureOption.value && !selectedTemperature.value) {
    return false;
  }
  
  return true;
});

// Sweetness levels
const sweetnessLevels = [
  { value: 'SUGAR_ZERO', label: 'SUGAR_ZERO' },
  { value: 'SUGAR_HALF', label: 'SUGAR_HALF' },
  { value: 'SUGAR_NORMAL', label: 'SUGAR_NORMAL' },
];

// Watch for changes in the selected item
watch(() => menuStore.selectedItemForCustomization, (newItem) => {
  if (newItem) {
    // Reset selections
    selectedSize.value = 'MEDIUM_SIZE';
    selectedSweetness.value = 'SUGAR_NORMAL';
    selectedFlavors.value = [];
    
    // Set default temperature if available
    if (newItem.temperature && newItem.temperature.length > 0) {
      selectedTemperature.value = newItem.temperature[0];
    } else {
      selectedTemperature.value = '';
    }
  }
});

// Toggle flavor selection
const toggleFlavorSelection = (flavor: string) => {
  const index = selectedFlavors.value.indexOf(flavor);
  
  if (index === -1) {
    // If not selected and we haven't reached max, add it
    if (selectedFlavors.value.length < maxFlavorCount.value) {
      selectedFlavors.value.push(flavor);
    }
  } else {
    // If already selected, remove it
    selectedFlavors.value.splice(index, 1);
  }
};

// Confirm add to cart with selected options
const confirmAddToCart = () => {
  if (!menuStore.selectedItemForCustomization) return;
  
  // Check if all required options are selected
  if (!areAllRequiredOptionsSelected.value) {
    return; // Don't proceed if required options are not selected
  }
  
  // Start animation
  isAddingToCart.value = true;
  
  const isLargeSize = selectedSize.value === 'LARGE_SIZE';
  
  // Only pass sweetness if the item has that option
  const sweetness = hasSweetnessOption.value ? selectedSweetness.value : undefined;
  
  // Only pass temperature if the item has that option
  const temperature = hasTemperatureOption.value ? selectedTemperature.value : undefined;
  
  // Add to cart with all selected options
  menuStore.addToCart(
    menuStore.selectedItemForCustomization, 
    isLargeSize, 
    sweetness, 
    temperature,
    hasFlavorOptions.value ? selectedFlavors.value : []
  );
  
  // Reset animation and close the modal after a short delay
  setTimeout(() => {
    isAddingToCart.value = false;
    menuStore.closeCustomizationModal();
  }, 300);
};

// Set default category to first category when component is mounted
onMounted(() => {
  if (categories.value.length > 0) {
    selectedCategory.value = categories.value[0];
  }
});

// Translate menu items
const translatedMenuItems = computed(() => {
  return filteredMenuItems.value.map(item => ({
    ...item,
    name: translate(item.id),
    category: translate(`CATEGORY_${item.category}`),
  }));
});
</script>

<style>
/* Custom scrollbar for webkit browsers */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.scrollbar-track-transparent::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
