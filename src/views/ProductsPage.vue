<template>
  <div>
    <AppHeader />
    
    <!-- Social Sidebar -->
    <div id="social-sidebar" class="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center space-y-4 hidden md:flex">
      <a v-for="link in socialLinks" :key="link.id" :href="formatUrl(link.link_url)" target="_blank" class="social-sidebar-icon" :title="link.platform_name">
        <img :src="link.icon_url" :alt="`${link.platform_name} logo`" class="w-full h-full object-cover rounded-full box-shadow">
      </a>
    </div>
    
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Hero Section -->
      <section class="text-center pt-16 pb-8 md:pt-20 md:pb-12 fade-in-up" :class="{ 'visible': mounted }">
        <div class="relative z-10">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight">{{ siteTitle }}</h1>
          <p class="mt-3 max-w-2xl mx-auto text-lg md:text-xl text-text-secondary">{{ siteSubtitle }}</p>
          
          <div class="mt-6 max-w-xl mx-auto">
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Search for products, brands..." class="w-full h-14 pl-14 pr-4 bg-white/5 border border-border-color rounded-full text-lg focus:ring-2 focus:ring-accent-red focus:border-accent-red outline-none transition-all">
            </div>
          </div>
        </div>
      </section>


      <!-- Product Section -->
      <section class="fade-in-up" :class="{ 'visible': mounted }">
        <!-- Price Sort -->
        <div class="flex justify-center mb-6">
          <div class="relative inline-block" id="price-sort-container">
            <button @click.stop="togglePriceSortMenu" class="filter-btn flex items-center gap-2 whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <path d="m21 16-4 4-4-4"></path>
                <path d="M17 20V4"></path>
                <path d="m3 8 4-4 4 4"></path>
                <path d="M7 4v16"></path>
              </svg>
              <span>{{ sortLabel }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div v-show="priceSortMenuOpen" id="price-sort-menu" class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 rounded-lg z-[100] p-2 space-y-1">
              <button @click="changePriceSort('default')" class="sort-option w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-white rounded-md transition-colors" :class="{ 'bg-bg-card text-white': currentPriceSort === 'default' }">Default</button>
              <button @click="changePriceSort('price-asc')" class="sort-option w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-white rounded-md transition-colors" :class="{ 'bg-bg-card text-white': currentPriceSort === 'price-asc' }">Price: Low to High</button>
              <button @click="changePriceSort('price-desc')" class="sort-option w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-bg-card hover:text-white rounded-md transition-colors" :class="{ 'bg-bg-card text-white': currentPriceSort === 'price-desc' }">Price: High to Low</button>
            </div>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="mb-6">
          <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <button @click="changeCategory('all')" class="filter-btn" :class="{ 'active': currentCategory === 'all' }">All</button>
            <button v-for="nav in navItems" :key="nav.id" @click="changeCategory(nav.link_text)" class="filter-btn" :class="{ 'active': currentCategory === nav.link_text }">
              {{ nav.link_text }}
            </button>
          </div>
        </div>

        <!-- Product List -->
        <div id="product-list-container" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          <!-- Loading Skeletons -->
          <template v-if="loading && products.length === 0">
            <div v-for="n in 20" :key="n" class="skeleton-card">
              <div class="skeleton-placeholder" style="aspect-ratio: 1 / 1;"></div>
              <div class="p-4 space-y-3">
                <div class="skeleton-placeholder h-4 rounded w-3/4"></div>
                <div class="skeleton-placeholder h-4 rounded w-1/2"></div>
                <div class="skeleton-placeholder h-6 rounded w-1/3 mt-2"></div>
              </div>
            </div>
          </template>
          
          <!-- Products -->
          <ProductCard v-for="product in products" :key="product.id" :product="product" :cnyToUsdRate="cnyToUsdRate" @click="logProductClick(product.name)" />
          
          <!-- No Products Message -->
          <div v-if="!loading && products.length === 0" class="col-span-full text-center text-text-secondary text-lg py-16">
            No products found matching your criteria.
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-show="loadingMore" class="flex justify-center items-center p-8">
          <div class="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'
import { getCachedData, setCachedData } from '@/utils/cache'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()

// State
const siteTitle = ref('')
const siteSubtitle = ref('')
const products = ref([])
const socialLinks = ref([])
const navItems = ref([])
const currentCategory = ref('all')
const currentBrand = ref('all')
const currentPriceSort = ref('default')
const searchQuery = ref('')
const cnyToUsdRate = ref(0.156) // Fixed rate: 1 CNY = 1/6.41 USD
const loading = ref(true)
const loadingMore = ref(false)
const mounted = ref(false)
const priceSortMenuOpen = ref(false)

// Pagination
const currentPage = ref(1)
const pageSize = 50
const allProductsLoaded = ref(false)

const sortLabel = computed(() => {
  if (currentPriceSort.value === 'price-asc') return 'Price: Low to High'
  if (currentPriceSort.value === 'price-desc') return 'Price: High to Low'
  return 'Sort Products'
})

// Methods
const formatUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

const appendRefParam = (url) => {
  const refId = route.query.ref
  if (!refId || !url) return url
  try {
    const urlObj = new URL(url)
    if (!urlObj.searchParams.has('ref')) {
      urlObj.searchParams.append('ref', refId)
    }
    return urlObj.toString()
  } catch (e) {
    return url
  }
}

const logProductClick = async (productName) => {
  try {
    await supabase.from('analytics_events').insert([{
      event_type: 'product_click',
      event_value: productName,
      ref_id: route.query.ref || null
    }])
  } catch (error) {
    console.error('Error logging product click:', error)
  }
}

const logEvent = async (eventType, eventValue = null) => {
  try {
    await supabase.from('analytics_events').insert([{
      event_type: eventType,
      event_value: eventValue,
      ref_id: route.query.ref || null
    }])
  } catch (error) {
    console.error('Error logging event:', error)
  }
}

const togglePriceSortMenu = () => {
  priceSortMenuOpen.value = !priceSortMenuOpen.value
}

const changePriceSort = (sort) => {
  currentPriceSort.value = sort
  priceSortMenuOpen.value = false
  currentPage.value = 1
  allProductsLoaded.value = false
  fetchProducts()
}

const changeCategory = (category) => {
  currentCategory.value = category
  currentBrand.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
  allProductsLoaded.value = false
  updateURL()
  fetchProducts()
}

let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentCategory.value = 'all'
    currentBrand.value = 'all'
    currentPage.value = 1
    allProductsLoaded.value = false
    updateURL()
    fetchProducts()
  }, 500)
}

const updateURL = () => {
  const query = {}
  if (currentBrand.value && currentBrand.value !== 'all') query.brand = currentBrand.value
  if (currentCategory.value && currentCategory.value !== 'all') query.category = currentCategory.value
  if (searchQuery.value) query.q = searchQuery.value
  if (route.query.ref) query.ref = route.query.ref
  router.replace({ query })
}

const fetchProducts = async () => {
  if (allProductsLoaded.value) return
  
  if (currentPage.value === 1) {
    loading.value = true
  } else {
    loadingMore.value = true
  }
  
  try {
    const from = (currentPage.value - 1) * pageSize
    const to = from + pageSize - 1
    
    let query = supabase
      .from('products')
      .select('*, brands(name)', { count: 'exact' })
      .eq('is_active', true)
    
    if (currentCategory.value !== 'all') {
      query = query.like('category', `%${currentCategory.value}%`)
    }
    
    if (currentBrand.value !== 'all') {
      query = query.eq('brand_id', currentBrand.value)
    }
    
    if (searchQuery.value) {
      query = query.ilike('name', `%${searchQuery.value}%`)
    }
    
    // Apply sorting
    if (currentPriceSort.value === 'price-asc') {
      query = query.order('price', { ascending: true })
    } else if (currentPriceSort.value === 'price-desc') {
      query = query.order('price', { ascending: false })
    } else {
      query = query.order('tags', { ascending: false, nullsFirst: false })
                   .order('display_order', { ascending: true })
    }
    
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching products:', error)
      return
    }
    
    if (currentPage.value === 1) {
      products.value = data || []
    } else {
      products.value.push(...(data || []))
    }
    
    if (data && data.length < pageSize || (currentPage.value * pageSize) >= count) {
      allProductsLoaded.value = true
      if (scrollObserver) {
        scrollObserver.disconnect()
      }
    } else {
      // Reattach observer to new last element
      setupInfiniteScroll()
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const setupInfiniteScroll = () => {
  // Disconnect existing observer
  if (scrollObserver) {
    scrollObserver.disconnect()
  }
  
  // Wait for DOM to update
  setTimeout(() => {
    const allProducts = document.querySelectorAll('#product-list-container > a.product-card')
    const lastProduct = allProducts[allProducts.length - 1]
    if (lastProduct) {
      scrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading.value && !loadingMore.value && !allProductsLoaded.value) {
          currentPage.value++
          fetchProducts()
        }
      }, { root: null, rootMargin: '0px', threshold: 0.5 })
      
      scrollObserver.observe(lastProduct)
    }
  }, 100)
}

const setupCountdown = () => {
  if (!flashSaleEndTime.value) return
  
  const updateCountdown = () => {
    const now = new Date().getTime()
    const end = new Date(flashSaleEndTime.value).getTime()
    const distance = end - now
    
    if (distance < 0) {
      flashSaleActive.value = false
      return
    }
    
    countdown.value = {
      days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
      hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
      minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
      seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0')
    }
  }
  
  updateCountdown()
  const interval = setInterval(updateCountdown, 1000)
  
  return () => clearInterval(interval)
}

let countdownCleanup = null
let scrollObserver = null

const handleClickOutside = (e) => {
  if (!e.target.closest('#price-sort-container')) {
    priceSortMenuOpen.value = false
  }
}

onMounted(async () => {
  mounted.value = true
  
  // Initialize from URL params
  currentBrand.value = route.query.brand || 'all'
  currentCategory.value = route.query.category || 'all'
  searchQuery.value = route.query.q || ''
  
  // Load configuration and products in parallel for faster page load
  const loadConfig = async () => {
    const cachedConfig = getCachedData('siteConfig')
    
    if (cachedConfig) {
      // Use cached data
      if (cachedConfig.settings) {
        siteTitle.value = cachedConfig.settings.site_title || siteTitle.value
        siteSubtitle.value = cachedConfig.settings.site_subtitle || siteSubtitle.value
      }
      
      if (cachedConfig.navigation) {
        navItems.value = cachedConfig.navigation.filter(item => item.link_text && item.link_text.toLowerCase() !== 'home')
      }
      
      if (cachedConfig.socialLinks) {
        socialLinks.value = cachedConfig.socialLinks
      }
    } else {
      // Fetch fresh data
      try {
        const [settingsRes, navRes, socialRes] = await Promise.all([
          supabase.from('settings').select('*').limit(1).single(),
          supabase.from('navigation').select('*').order('display_order'),
          supabase.from('social_links').select('*').order('display_order')
        ])
        
        if (settingsRes.data) {
          siteTitle.value = settingsRes.data.site_title || siteTitle.value
          siteSubtitle.value = settingsRes.data.site_subtitle || siteSubtitle.value
        }
        
        if (navRes.data) {
          navItems.value = navRes.data.filter(item => item.link_text && item.link_text.toLowerCase() !== 'home')
        }
        
        if (socialRes.data) {
          socialLinks.value = socialRes.data
        }
        
        // Cache the configuration data
        setCachedData('siteConfig', {
          settings: settingsRes.data,
          navigation: navRes.data,
          socialLinks: socialRes.data
        })
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }
  }
  
  // Load config and products in parallel
  await Promise.all([
    loadConfig(),
    fetchProducts()
  ])
  
  // Log site visit (async, non-blocking)
  logEvent('site_visit')
  
  // Setup click outside handler
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  if (scrollObserver) scrollObserver.disconnect()
  document.removeEventListener('click', handleClickOutside)
})

// Watch for brand changes from route
watch(() => route.query.brand, (newBrand, oldBrand) => {
  const brandValue = newBrand || 'all'
  if (brandValue !== currentBrand.value) {
    currentBrand.value = brandValue
    currentCategory.value = 'all'
    searchQuery.value = ''
    currentPage.value = 1
    allProductsLoaded.value = false
    fetchProducts()
  }
})
</script>

