<template>
  <!-- Auth Screen -->
  <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center p-4 relative z-10">
    <div class="w-full max-w-sm panel p-8">
      <h1 class="text-3xl font-bold text-center text-text-primary mb-6">Admin Panel</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="label block mb-1">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email"
            class="input" 
            placeholder="admin@example.com"
            required
          >
        </div>
        <div>
          <label for="password" class="label block mb-1">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password"
            class="input" 
            placeholder="••••••••"
            required
          >
        </div>
        <button type="submit" class="w-full btn btn-primary" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p v-if="error" class="text-red-400 text-sm text-center mt-4">{{ error }}</p>
    </div>
  </div>

  <!-- Admin Panel -->
  <div v-else class="relative z-10">
    <!-- Mobile Header -->
    <header class="md:hidden flex items-center justify-between px-4 py-2 bg-bg-surface/80 backdrop-blur-sm sticky top-0 z-20 border-b border-border-color">
      <h1 class="text-xl font-bold text-text-primary">Admin</h1>
      <button @click="toggleMobileMenu" class="p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-accent-red">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </header>

    <div class="relative flex min-h-screen">
      <!-- Mobile Menu Overlay -->
      <div v-show="mobileMenuOpen" @click="closeMobileMenu" class="md:hidden fixed inset-0 bg-black/50 z-30"></div>

      <!-- Sidebar -->
      <aside 
        class="w-64 p-4 flex-col fixed inset-y-0 left-0 z-40 transform transition-transform md:relative md:translate-x-0 md:flex"
        :class="{ '-translate-x-full': !mobileMenuOpen, 'translate-x-0': mobileMenuOpen }"
        style="background-color: var(--bg-main); border-right: 1px solid var(--border-color);"
      >
        <h1 class="text-2xl font-bold text-text-primary px-2 pb-4 border-b border-border-color">Mike's Spreadsheet</h1>
        
        <nav class="mt-6 space-y-1 flex-grow">
          <!-- Core Modules -->
          <button 
            @click="selectTab('dashboard')"
            class="tab-button"
            :class="{ 'active': activeTab === 'dashboard' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </button>
          <button 
            @click="selectTab('products')"
            class="tab-button"
            :class="{ 'active': activeTab === 'products' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            Products
          </button>
          <button 
            @click="selectTab('brands')"
            class="tab-button"
            :class="{ 'active': activeTab === 'brands' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            Brands
          </button>
          <button 
            @click="selectTab('tags')"
            class="tab-button"
            :class="{ 'active': activeTab === 'tags' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            Tags
          </button>
          
          <!-- Pages Section -->
          <div class="px-3 py-2 text-xs uppercase text-gray-500 font-semibold tracking-wider mt-4">Pages</div>
          <button 
            @click="selectTab('sellers')"
            class="tab-button"
            :class="{ 'active': activeTab === 'sellers' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Sellers
          </button>
          <button 
            @click="selectTab('how_to_buy')"
            class="tab-button"
            :class="{ 'active': activeTab === 'how_to_buy' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            How-to-buy
          </button>
          <button 
            @click="selectTab('navigation')"
            class="tab-button"
            :class="{ 'active': activeTab === 'navigation' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            Categories
          </button>
          
          <!-- Settings Section -->
          <div class="px-3 py-2 text-xs uppercase text-gray-500 font-semibold tracking-wider mt-4">Settings</div>
          <button 
            @click="selectTab('settings')"
            class="tab-button"
            :class="{ 'active': activeTab === 'settings' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            Site Settings
          </button>
          <button 
            @click="selectTab('social')"
            class="tab-button"
            :class="{ 'active': activeTab === 'social' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 h-5 w-5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Social Media
          </button>
        </nav>

        <div class="pt-4 border-t border-border-color">
          <button @click="handleLogout" class="w-full text-sm font-medium text-red-400 hover:text-danger-color text-left px-2 py-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-4 md:p-8 overflow-y-auto">
        <component :is="currentTabComponent" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

// Import admin components
import AdminDashboard from './AdminDashboard.vue'
import AdminProducts from './AdminProducts.vue'
import AdminSettings from './AdminSettings.vue'
import AdminBrands from './AdminBrands.vue'
import AdminTags from './AdminTags.vue'
import AdminNavigation from './AdminNavigation.vue'
import AdminSocial from './AdminSocial.vue'
import AdminHowToBuy from './AdminHowToBuy.vue'
import AdminSellers from './AdminSellers.vue'

const auth = useAuth()
const { isAuthenticated, login, logout } = auth

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const activeTab = ref('dashboard')
const mobileMenuOpen = ref(false)

// Component mapping
const componentMap = {
  dashboard: AdminDashboard,
  products: AdminProducts,
  brands: AdminBrands,
  tags: AdminTags,
  sellers: AdminSellers,
  how_to_buy: AdminHowToBuy,
  navigation: AdminNavigation,
  settings: AdminSettings,
  social: AdminSocial
}

const currentTabComponent = computed(() => {
  return componentMap[activeTab.value] || AdminDashboard
})

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password'
    return
  }

  loading.value = true
  error.value = ''

  const result = await login(email.value, password.value)

  loading.value = false

  if (!result.success) {
    error.value = result.error
  } else {
    email.value = ''
    password.value = ''
  }
}

const handleLogout = () => {
  logout()
}

const selectTab = (tabId) => {
  activeTab.value = tabId
  closeMobileMenu()
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  auth.checkAuth()
})
</script>

<style scoped>
.panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
}

.label {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.input {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
  background-color: var(--bg-card);
  color: var(--text-primary);
}

.input::placeholder {
  color: #666;
}

.input:focus {
  outline: none;
  border-color: var(--accent-red);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
}

.btn:disabled {
  background-color: #222 !important;
  color: #666;
  border-color: #333 !important;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--accent-red);
  color: var(--text-primary);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-red-hover);
}

.tab-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.tab-button:hover {
  background-color: var(--bg-card);
  color: var(--text-primary);
}

.tab-button.active {
  background-color: var(--accent-red);
  color: var(--text-primary);
  font-weight: 600;
}
</style>

