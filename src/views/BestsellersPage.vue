<template>
  <div>
    <AppHeader />
    
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
      <section class="text-center pt-0 pb-12 md:pb-16 fade-in-up" :class="{ 'visible': mounted }">
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">Our Bestsellers</h1>
        <p class="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-text-secondary">Discover our top-rated sellers offering the best products and services.</p>
      </section>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        <div v-if="loading && sellers.length === 0" v-for="n in 10" :key="n" class="skeleton-card">
          <div class="skeleton-placeholder" style="aspect-ratio: 1 / 1;"></div>
          <div class="p-4 space-y-3">
            <div class="skeleton-placeholder h-4 rounded w-3/4"></div>
            <div class="skeleton-placeholder h-4 rounded w-1/2"></div>
            <div class="skeleton-placeholder h-6 rounded w-1/3 mt-2"></div>
          </div>
        </div>
        
        <div v-else-if="sellers.length === 0" class="col-span-full text-center text-text-secondary text-lg py-16">
          No sellers found.
        </div>
        
        <div v-for="seller in sellers" :key="seller.id" class="seller-card">
          <div class="logo-wrapper">
            <img :src="seller.logo_url || 'https://via.placeholder.com/400x225?text=No+Logo'" :alt="`${seller.name} Logo`" @error="handleImageError">
          </div>
          <div class="p-4 sm:p-6">
            <h3 class="text-lg sm:text-xl font-bold mb-2">{{ seller.name }}</h3>
            <p class="text-sm sm:text-base text-text-secondary mb-4">{{ seller.description || 'No description available.' }}</p>
            <a :href="formatUrl(seller.store_link)" target="_blank" rel="noopener noreferrer" class="btn btn-primary w-full">Visit Store</a>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/config/supabase'
import { getCachedData, setCachedData } from '@/utils/cache'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const sellers = ref([])
const loading = ref(true)
const mounted = ref(false)

const formatUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x225?text=No+Logo'
}

onMounted(async () => {
  mounted.value = true
  
  // Load sellers with caching
  const cachedSellers = getCachedData('sellers')
  if (cachedSellers) {
    sellers.value = cachedSellers
    loading.value = false
  } else {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .order('display_order')
      
      if (error) {
        console.error('Error loading sellers:', error)
      } else {
        sellers.value = data || []
        setCachedData('sellers', data || [])
      }
    } catch (error) {
      console.error('Error loading sellers:', error)
    } finally {
      loading.value = false
    }
  }
})
</script>

