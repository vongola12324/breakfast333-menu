<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
    <header class="text-center mb-4 sm:mb-6 lg:mb-8">
      <LanguageSelector />
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
        {{ t('APP_TITLE', appTitle) }}
      </h1>
      <p class="text-base sm:text-lg md:text-xl text-lightText">
        {{ t('APP_TAGLINE', appTagLine) }}
      </p>
    </header>
    
    <main>
      <div v-if="menuStore.menuLoadError" class="bg-red-50 rounded-lg p-4 sm:p-6 lg:p-8 text-center my-4 sm:my-6">
        <h2 class="text-xl sm:text-2xl md:text-3xl text-red-600 font-bold mb-3 sm:mb-4">
          {{ t('ERROR_MENU_LOAD_TITLE', 'Menu Loading Error') }}
        </h2>
        <p class="text-gray-600 mb-4 sm:mb-6">
          {{ t('ERROR_MENU_LOAD_MESSAGE', 'We could not load the menu data. Please try again later.') }}
        </p>
        <button 
          @click="reloadPage" 
          class="bg-primary hover:bg-primary/90 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md
           w-full sm:w-auto transition-colors"
        >
          {{ t('RELOAD_PAGE', 'Reload Page') }}
        </button>
      </div>
      <BreakfastMenu v-else />
      <ShoppingCart />
    </main>
    
    <footer class="mt-6 sm:mt-8 lg:mt-10 text-center text-xs sm:text-sm text-lightText px-2 sm:px-4">
      <p v-html="t('ANNONCEMENT_OPEN_HOUR')" />
      <p class="mb-2">&copy; {{ new Date().getFullYear() }} Breakfast333. {{ t('ALL_RIGHTS_RESERVED', 'All rights reserved.') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BreakfastMenu from './components/BreakfastMenu.vue';
import LanguageSelector from './components/LanguageSelector.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import { useMenuStore } from './store';


const { t } = useI18n();
const menuStore = useMenuStore();

const appTitle = computed(() => menuStore.appTitle )
const appTagLine = computed(() => menuStore.appTagLine )

// Function to reload the page
const reloadPage = () => {
  window.location.reload();
};
</script>
