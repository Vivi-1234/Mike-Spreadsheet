<template>
  <div>
    <AppHeader :showDiscountCode="false" />
    
    <!-- Sticky Step Navigation -->
    <nav v-if="mainSteps.length > 1" id="sticky-step-nav" class="border-b border-border-color shadow-md" style="position: sticky; top: var(--header-height); z-index: 20; background-color: rgba(34, 34, 34, 0.7); backdrop-filter: blur(12px); --header-height: 64px;">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-6 md:space-x-8 h-14 overflow-x-auto">
        <a v-for="(step, index) in mainSteps" :key="step.id" :href="`#${slugify(step.title)}`" class="step-nav-link font-medium text-sm md:text-base" :class="{ 'active': activeSection === slugify(step.title) }" style="color: var(--text-secondary); transition: color 0.2s ease-in-out; white-space: nowrap;">
          {{ index + 1 }}. {{ step.title }}
        </a>
      </div>
    </nav>
    
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
      <section class="text-center pt-0 pb-12 md:pb-16 fade-in-up" :class="{ 'visible': mounted }">
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">How to Buy</h1>
        <p class="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-text-secondary">Follow these simple steps to get the best products sourced and shipped directly to you.</p>
        
        <div class="mt-8">
          <div id="discount-code-box" @click="copyDiscountCode" style="background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 9999px; padding: 0.5rem 0.5rem 0.5rem 1.25rem; display: inline-flex; align-items: center; cursor: pointer; transition: all 0.2s ease-in-out;">
            <span class="text-sm text-text-secondary">Shipping Code: <span class="font-bold text-text-primary">Mike</span></span>
            <span class="ml-3 bg-accent-red text-white p-2 rounded-full" style="transition: all 0.3s ease;">
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

        <div v-if="settings && settings.signup_url" class="mt-8 flex items-center justify-center gap-4">
          <a :href="formatUrl(settings.signup_url)" target="_blank" class="btn btn-primary">Sign Up Here</a>
          <a href="#steps-section" class="btn btn-secondary">View Steps</a>
        </div>
      </section>

      <section v-if="settings && settings.video_url" class="my-12 md:my-16 fade-in-up" :class="{ 'visible': mounted }">
        <div class="max-w-4xl mx-auto">
          <div class="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-border-color">
            <iframe :src="settings.video_url" class="w-full h-full" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>
      </section>

      <div id="steps-section">
        <section v-for="(mainStep, index) in mainSteps" :key="mainStep.id" :id="slugify(mainStep.title)" class="py-16 md:py-20 fade-in-up" :class="{ 'visible': sectionsVisible[index] }">
          <div class="max-w-5xl mx-auto">
            <div class="flex items-center gap-4 md:gap-6 mb-12">
              <div class="step-number flex items-center justify-center rounded-full font-bold text-2xl" style="width: 3.5rem; height: 3.5rem; flex-shrink: 0; border: 2px solid var(--border-color); background-color: var(--bg-surface); color: var(--accent-red);">
                {{ index + 1 }}
              </div>
              <h2 class="section-title text-3xl md:text-4xl font-bold tracking-tight text-text-primary">{{ mainStep.title }}</h2>
            </div>
            <div class="space-y-10 pl-4 md:pl-8 border-l-2 border-border-color ml-7">
              <div v-for="(subStep, subIndex) in getSubSteps(mainStep.title)" :key="subIndex" :class="{ 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center': subStep.image_url }">
                <div :class="{ 'lg:order-last': subStep.image_url && index % 2 !== 0 }">
                  <h4 class="text-xl font-bold text-text-primary">{{ subStep.title || '' }}</h4>
                  <p class="mt-2 text-text-secondary">{{ subStep.description || '' }}</p>
                </div>
                <div v-if="subStep.image_url" class="flex items-center justify-center mt-4 lg:mt-0">
                  <img :src="subStep.image_url" :alt="subStep.title || 'Step image'" class="rounded-lg shadow-lg w-full h-auto object-cover border border-border-color">
                </div>
                <div v-if="subIndex < getSubSteps(mainStep.title).length - 1" class="my-8 border-b border-dashed border-border-color"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { supabase } from '@/config/supabase'
import { getCachedData, setCachedData } from '@/utils/cache'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const settings = ref(null)
const allSteps = ref([])
const mainSteps = ref([])
const mounted = ref(false)
const copied = ref(false)
const activeSection = ref('')
const sectionsVisible = ref([])

const slugify = (text) => {
  if (!text) return ''
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

const formatUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

const getSubSteps = (mainStepTitle) => {
  return allSteps.value.filter(step => step.section_title === mainStepTitle)
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

let observer = null

const setupIntersectionObserver = () => {
  const sections = document.querySelectorAll('#steps-section > section')
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(sections).indexOf(entry.target)
        sectionsVisible.value[index] = true
        activeSection.value = entry.target.id
      }
    })
  }, { 
    threshold: 0.1,
    rootMargin: '-100px 0px -50% 0px'
  })
  
  sections.forEach((section, index) => {
    observer.observe(section)
    sectionsVisible.value[index] = false
  })
}

onMounted(async () => {
  mounted.value = true
  
  // Load how-to-buy data with caching
  const cachedData = getCachedData('howToBuyData')
  
  if (cachedData) {
    // Use cached data
    if (cachedData.settings) {
      settings.value = cachedData.settings
    }
    
    if (cachedData.steps) {
      allSteps.value = cachedData.steps
      mainSteps.value = cachedData.steps.filter(step => !step.section_title)
    }
    
    await nextTick()
    setupIntersectionObserver()
  } else {
    // Fetch fresh data
    try {
      const [settingsRes, stepsRes] = await Promise.all([
        supabase.from('how_to_buy_settings').select('video_url, signup_url').limit(1).single(),
        supabase.from('how_to_buy_steps').select('*').order('display_order')
      ])
      
      if (settingsRes.data) {
        settings.value = settingsRes.data
      }
      
      if (stepsRes.data) {
        allSteps.value = stepsRes.data
        mainSteps.value = stepsRes.data.filter(step => !step.section_title)
      }
      
      // Cache the data
      setCachedData('howToBuyData', {
        settings: settingsRes.data,
        steps: stepsRes.data
      })
      
      await nextTick()
      setupIntersectionObserver()
    } catch (error) {
      console.error('Error loading how-to-buy data:', error)
    }
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.step-nav-link.active {
  color: var(--accent-red);
}

.step-nav-link:hover {
  color: var(--accent-red);
}
</style>

