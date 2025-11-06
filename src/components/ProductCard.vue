<template>
  <a :href="appendRefParam(product.target_url)" target="_blank" class="group block product-card relative" @click="emit('click')">
    <div class="img-wrapper relative">
      <img :src="optimizedImageUrl" :alt="product.name" loading="lazy" class="loaded" @error="handleImageError">
      <div v-if="showDiscount && discountPercentage > 0" class="badge discount-badge">
        {{ discountPercentage }}% OFF
      </div>
      <div v-if="tagBadgeText" class="badge tag-badge" :class="{ 'best-selling': isBestSelling }">
        {{ tagBadgeText }}
      </div>
    </div>
    <div class="p-4">
      <h3 class="product-title text-text-primary group-hover:text-white transition-colors">{{ product.name }}</h3>
      <p v-if="showDiscount && usdDiscountPrice" class="product-price text-accent-red mt-2">
        ${{ usdDiscountPrice }}
        <span class="text-base text-text-secondary font-medium line-through ml-2" style="font-family: 'Barlow', sans-serif;">
          ${{ usdPrice }}
        </span>
      </p>
      <p v-else class="product-price text-text-primary mt-2">${{ usdPrice }}</p>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  cnyToUsdRate: {
    type: Number,
    default: 0.156 // Fixed rate: 1 CNY = 1/6.41 USD
  }
})

const emit = defineEmits(['click'])

const route = useRoute()

const now = new Date()
const expiry = props.product.discount_expires_at ? new Date(props.product.discount_expires_at) : null

const showDiscount = computed(() => {
  return props.product.discount_is_active && 
         props.product.discount_price && 
         (!expiry || expiry > now)
})

const usdPrice = computed(() => {
  return (props.product.price * props.cnyToUsdRate).toFixed(2)
})

const usdDiscountPrice = computed(() => {
  return props.product.discount_price 
    ? (props.product.discount_price * props.cnyToUsdRate).toFixed(2) 
    : null
})

const discountPercentage = computed(() => {
  if (!props.product.discount_factor) return 0
  return Math.round((1 - props.product.discount_factor) * 100)
})

const tagBadgeText = computed(() => {
  if (!props.product.tags) return ''
  const firstTag = props.product.tags.split(',')[0].trim()
  return firstTag
})

const isBestSelling = computed(() => {
  const tag = tagBadgeText.value.toUpperCase()
  return tag.includes('BEST SELLING') || tag.includes('BESTSELLING')
})

const optimizedImageUrl = computed(() => {
  const SUPABASE_URL = 'https://tmrnspktjewfkhbqitnw.supabase.co'
  const placeholder = 'https://placehold.co/400x400/2E2E2E/B0B0B0?text=NO+IMAGE'
  
  if (!props.product.image_url) return placeholder
  if (!props.product.image_url.includes(SUPABASE_URL)) return props.product.image_url
  
  try {
    const url = new URL(props.product.image_url)
    const pathSegments = url.pathname.split('/')
    const bucketIndex = pathSegments.findIndex(segment => segment === 'public') + 1
    
    if (bucketIndex >= pathSegments.length) return props.product.image_url
    
    const bucketName = pathSegments[bucketIndex]
    const imagePath = pathSegments.slice(bucketIndex + 1).join('/')
    
    return `${SUPABASE_URL}/storage/v1/render/image/public/${bucketName}/${imagePath}?width=400&height=400&quality=75`
  } catch (e) {
    console.error('Failed to parse image URL:', e)
    return placeholder
  }
})

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

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/400x400/303030/B0B0B0?text=NO+IMAGE'
}
</script>

