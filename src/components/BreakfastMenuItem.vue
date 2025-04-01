<template>
  <div 
    class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300
     hover:-translate-y-1 hover:shadow-lg relative"
  >
    <!-- Vegetarian ribbon -->
    <div 
      v-if="props.item.vegetarian" 
      class="vegetarian-ribbon"
      :title="t('Vegetarian')"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="leaf-icon" >
        <g id="SVGRepo_bgCarrier" stroke-width="0"/>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
        <g id="SVGRepo_iconCarrier">
          <path d="M14 10L4 20M20 7C20 12.5228 15.5228 17 10 17C9.08396 17 8.19669 16.8768 7.35385 16.6462C7.12317 15.8033 7 14.916 7 14C7 8.47715 11.4772 4 17 4C17.916 4 18.8033 4.12317 19.6462 4.35385C19.8768 5.19669 20 6.08396 20 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>
    </div>
    
    <!-- Item content -->
    <div class="p-3 sm:p-4 flex flex-col h-full">
      <h3 class="text-base sm:text-lg font-semibold text-primary mb-1">{{ props.item.name }}</h3>
      <p 
        v-if="props.item.description" 
        class="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-grow"
      >
        {{ t(props.item.description) }}
      </p>
      
      <!-- Price and add to cart -->
      <div class="mt-auto">
        <div class="flex justify-between items-center">
          <span class="font-bold text-base sm:text-lg">
            NT${{ props.item.price.toFixed(0) }}
          </span>
          <button 
            @click="selectItemForCustomization" 
            :class="[
              'p-2 rounded-full flex items-center justify-center transition-all duration-300',
              isAnimating 
                ? 'bg-green-500 scale-110 text-white' 
                : 'bg-primary text-white hover:bg-primary/90'
            ]"
            aria-label="Add to cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Takeout notice -->
      <div 
        v-if="props.item.takeoutBox" 
        class="mt-2 text-xs bg-yellow-100 text-gray-700 p-2 rounded"
      >
        {{ t('ANNONCEMENT_TAKEOUT_BOX', { takeout_box_price: takeoutBoxFee }) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { MenuItem, useMenuStore } from '../store';
import { ref, computed } from 'vue';

// Define props
const props = defineProps<{
  item: MenuItem
}>();

// Use i18n and store
const { t } = useI18n();
const menuStore = useMenuStore();
const takeoutBoxFee = computed(() => menuStore.takeoutBoxFee);

// Button animation state
const isAnimating = ref(false);

// Select item for customization
const selectItemForCustomization = () => {
  // Start animation
  isAnimating.value = true;
  
  // Call the store method to add to cart or show customization modal
  menuStore.selectItemForCustomization(props.item);
  
  // Reset animation after a short delay
  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
};
</script>

<style scoped>
.vegetarian-ribbon {
  position: absolute;
  top: -3px;
  right: -29px;
  background-color: #10b981; /* green-500 */
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.5rem;
  transform: rotate(37deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 20;
  width: 80px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.leaf-icon {
  width: 20px;
  height: 20px;
  color: white;
  transform: rotate(-37deg);

}

.vegetarian-ribbon::before,
.vegetarian-ribbon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: inherit;
  z-index: -1;
}

.vegetarian-ribbon::before {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 100%, 0 100%);
}
</style>
