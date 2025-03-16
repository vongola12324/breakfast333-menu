<template>
  <div 
    class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300
     hover:-translate-y-1 hover:shadow-lg"
  >
    <!-- Item image -->
    <div class="relative overflow-hidden">
      <!-- <img 
        :src="props.item.image" 
        :alt="props.item.name"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      > -->
      <div 
        v-if="props.item.vegetarian" 
        class="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded"
      >
        {{ t('Vegetarian') }}
      </div>
    </div>
    
    <!-- Item content -->
    <div class="p-3 sm:p-4 flex flex-col h-full">
      <h3 class="text-base sm:text-lg font-semibold text-primary mb-1">{{ props.item.name }}</h3>
      <p 
        v-if="props.item.description" 
        class="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 flex-grow"
      >
        {{ props.item.description }}
      </p>
      
      <!-- Price and category -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-auto">
        <span class="font-bold text-base sm:text-lg">
          NT${{ props.item.price.toFixed(0) }}
          <span v-if="props.item.priceLarge" class="text-xs sm:text-sm text-gray-500">
            / ${{ props.item.priceLarge.toFixed(0) }}
          </span>
        </span>
        <!-- <span class="bg-secondary text-gray-700 px-2 py-1 rounded-full text-xs inline-block">
          {{ props.item.category }}
        </span> -->
      </div>
      
      <!-- Takeout notice -->
      <div 
        v-if="props.item.takeoutBox" 
        class="mt-2 text-xs bg-yellow-100 text-gray-700 p-2 rounded"
      >
        {{ t('ANNONCEMENT_TAKEOUT_BOX', { takeout_box_price: 5 }) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { MenuItem } from '../store';

// Define props
const props = defineProps<{
  item: MenuItem
}>();

// Use i18n
const { t } = useI18n();
</script>
