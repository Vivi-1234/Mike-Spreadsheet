<template>
  <header class="header sticky top-0 z-30">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="text-xl font-bold tracking-tighter truncate">Mike's Spreadsheet</router-link>
        
        <!-- Desktop Navigation -->
        <div v-if="showNav" class="hidden md:flex items-center gap-8 flex-1 justify-end">
          <nav class="flex items-center space-x-8">
            <router-link to="/products" class="nav-link" :class="{ 'nav-link-active': isActive('/products') }">Products</router-link>
            <router-link to="/bestsellers" class="nav-link" :class="{ 'nav-link-active': isActive('/bestsellers') }">Bestsellers</router-link>
            
            <!-- Brands Dropdown -->
            <div class="relative nav-link" ref="brandsDropdown" :class="{ 'nav-link-active': currentBrand !== 'all' }">
              <button @click.stop="toggleBrandsMenu" class="flex items-center">
                Brands
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 ml-1">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div v-show="brandsMenuOpen" class="absolute right-0 mt-2 w-52 bg-bg-surface rounded-lg shadow-lg z-50 ring-1 ring-black ring-opacity-5 p-2 space-y-1" style="background-color: var(--bg-surface); border: 1px solid var(--border-color); box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);">
                <a @click="handleAllBrands" class="brand-option block px-4 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-white rounded-md cursor-pointer">All Brands</a>
                <router-link v-for="brand in brands" :key="brand.id" :to="`/products?brand=${brand.id}`" @click="closeBrandsMenu" class="brand-option block px-4 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-white rounded-md">
                  {{ brand.name }}
                </router-link>
              </div>
            </div>
            
            <router-link to="/how-to-buy" class="nav-link" :class="{ 'nav-link-active': isActive('/how-to-buy') }">How-to-buy</router-link>
          </nav>
          <div v-if="showDiscountCode" id="discount-code-box" @click="copyDiscountCode" class="flex">
            <span id="discount-text" class="text-sm text-text-secondary">Shipping Code: <span class="font-bold text-text-primary">Mike</span></span>
            <span id="copy-icon-container" class="ml-3 bg-accent-red text-white p-2 rounded-full">
              <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
          </div>
        </div>
        
        <!-- Mobile Menu Button -->
        <div v-if="showNav" class="md:hidden">
          <button @click="toggleMobileMenu" class="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Menu -->
  <div v-if="showNav">
    <div v-show="mobileMenuOpen" @click="closeMobileMenu" class="fixed inset-0 bg-black/50 z-40"></div>
    <div class="fixed top-0 right-0 h-full w-64 bg-[#181818] shadow-lg z-50 p-6 transform transition-transform" :class="{ 'translate-x-full': !mobileMenuOpen, 'translate-x-0': mobileMenuOpen }">
      <button @click="closeMobileMenu" class="absolute top-4 right-4 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <nav class="mt-12 flex flex-col space-y-4">
        <router-link to="/products" @click="closeMobileMenu" class="nav-link text-lg font-medium">Products</router-link>
        <router-link to="/bestsellers" @click="closeMobileMenu" class="nav-link text-lg font-medium">Bestsellers</router-link>
        
        <!-- Mobile Brands Dropdown -->
        <div class="relative w-full">
          <button @click.stop="toggleMobileBrandsMenu" class="nav-link text-lg font-medium flex justify-between items-center w-full">
            Brands
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div v-show="mobileBrandsMenuOpen" class="mt-2 pl-4 space-y-2">
            <a @click="handleAllBrandsMobile" class="block py-2 text-lg text-text-secondary hover:text-white cursor-pointer">All Brands</a>
            <router-link v-for="brand in brands" :key="brand.id" :to="`/products?brand=${brand.id}`" @click="closeMobileMenu" class="block py-2 text-lg text-text-secondary hover:text-white">
              {{ brand.name }}
            </router-link>
          </div>
        </div>
        
        <router-link to="/how-to-buy" @click="closeMobileMenu" class="nav-link text-lg font-medium">How-to-buy</router-link>
      </nav>
      <div v-if="showDiscountCode" class="mt-6 pt-6 border-t border-border-color">
        <div @click="copyDiscountCode" class="bg-bg-surface border border-border-color rounded-full p-3 flex items-center justify-between cursor-pointer transition-all hover:border-accent-red hover:bg-opacity-90">
          <span class="text-sm text-text-secondary flex-1">Shipping Code: <span class="font-bold text-text-primary">Mike</span></span>
          <span class="bg-accent-red text-white p-2 rounded-full ml-2">
            <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'
import { getCachedData, setCachedData } from '@/utils/cache'

const props = defineProps({
  showNav: {
    type: Boolean,
    default: true
  },
  showDiscountCode: {
    type: Boolean,
    default: true
  }
})

const route = useRoute()
const router = useRouter()
const brands = ref([])
const brandsMenuOpen = ref(false)
const mobileBrandsMenuOpen = ref(false)
const mobileMenuOpen = ref(false)
const copied = ref(false)
const brandsDropdown = ref(null)

const currentBrand = computed(() => {
  return route.query.brand || 'all'
})

const isActive = (path) => {
  return route.path === path
}

const toggleBrandsMenu = () => {
  brandsMenuOpen.value = !brandsMenuOpen.value
}

const closeBrandsMenu = () => {
  brandsMenuOpen.value = false
}

const handleAllBrands = () => {
  closeBrandsMenu()
  router.push('/products')
}

const handleAllBrandsMobile = () => {
  closeMobileMenu()
  router.push('/products')
}

const toggleMobileBrandsMenu = () => {
  mobileBrandsMenuOpen.value = !mobileBrandsMenuOpen.value
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  mobileBrandsMenuOpen.value = false
}

const copyDiscountCode = async () => {
  try {
    await navigator.clipboard.writeText('Mike')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const handleClickOutside = (e) => {
  if (brandsDropdown.value && !brandsDropdown.value.contains(e.target)) {
    brandsMenuOpen.value = false
  }
}

onMounted(async () => {
  // Load brands with caching
  const cachedBrands = getCachedData('brands')
  if (cachedBrands) {
    brands.value = cachedBrands
  } else {
    const { data } = await supabase.from('brands').select('*').order('name')
    if (data) {
      brands.value = data
      setCachedData('brands', data)
    }
  }
  
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

