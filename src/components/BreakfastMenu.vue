<template>
  <div class="mt-4 sm:mt-6 lg:mt-8">
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useMenuStore } from '../store.ts';
import { useTranslation } from '../composables/useTranslation.ts';
import BreakfastMenuItem from './BreakfastMenuItem.vue';

// Use i18n
const { translate } = useTranslation();

// Use the menu store
const menuStore = useMenuStore();

// Computed properties from the store
const categories = computed(() => menuStore.categories);
const filteredMenuItems = computed(() => menuStore.filteredMenuItems);
const selectedCategory = computed({
  get: () => menuStore.selectedCategory,
  set: (value) => menuStore.setCategory(value)
});

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
    description: translate(`${item.id}_DESC`, '')
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
