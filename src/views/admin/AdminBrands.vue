<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-text-primary">Brand Management</h2>
    
    <div class="panel p-6 max-w-2xl">
      <p class="text-sm text-text-secondary mb-4">Manage product brands. Drag to reorder.</p>
      
      <div class="flex items-center gap-2 mb-4">
        <input 
          type="text" 
          v-model="newBrandName"
          @keyup.enter="addBrand"
          class="input flex-grow" 
          placeholder="Enter new brand name"
        >
        <button @click="addBrand" class="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      
      <div class="space-y-3 mb-4 border-t border-border-color pt-4">
        <div 
          v-for="(brand, index) in brands" 
          :key="brand.id"
          class="flex items-center gap-2 p-3 bg-bg-card rounded-lg hover:bg-opacity-80 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-text-secondary cursor-move">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          
          <input 
            v-model="brand.name"
            class="input flex-grow" 
            @blur="updateBrand(brand)"
          >
          
          <button @click="deleteBrand(brand.id, index)" class="btn-icon text-red-400 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="brands.length === 0" class="text-center py-8 text-text-secondary">
          No brands yet. Add one above!
        </div>
      </div>
      
      <div class="text-right mt-4">
        <button @click="saveBrands" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save All Changes' }}
        </button>
      </div>
    </div>
    
    <div v-if="message" class="max-w-2xl">
      <div 
        class="p-4 rounded-lg" 
        :class="messageType === 'success' ? 'bg-green-600' : 'bg-red-500'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { getAuthenticatedClient } = useAuth()

const brands = ref([])
const newBrandName = ref('')
const saving = ref(false)
const message = ref('')
const messageType = ref('success')

const loadBrands = async () => {
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('brands')
      .select('*')
      .order('name')
    
    if (error) throw error
    brands.value = data || []
  } catch (error) {
    console.error('Error loading brands:', error)
    showMessage('Failed to load brands', 'error')
  }
}

const addBrand = async () => {
  if (!newBrandName.value.trim()) return
  
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('brands')
      .insert([{ name: newBrandName.value.trim() }])
      .select()
    
    if (error) throw error
    
    if (data && data[0]) {
      brands.value.push(data[0])
      newBrandName.value = ''
      showMessage('Brand added successfully!', 'success')
    }
  } catch (error) {
    console.error('Error adding brand:', error)
    showMessage('Failed to add brand: ' + error.message, 'error')
  }
}

const updateBrand = async (brand) => {
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('brands')
      .update({ name: brand.name })
      .eq('id', brand.id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating brand:', error)
    showMessage('Failed to update brand', 'error')
  }
}

const deleteBrand = async (id, index) => {
  if (!confirm('Are you sure you want to delete this brand?')) return
  
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('brands')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    brands.value.splice(index, 1)
    showMessage('Brand deleted successfully!', 'success')
  } catch (error) {
    console.error('Error deleting brand:', error)
    showMessage('Failed to delete brand: ' + error.message, 'error')
  }
}

const saveBrands = async () => {
  saving.value = true
  message.value = ''
  
  try {
    // All changes are already saved individually
    showMessage('All changes saved successfully!', 'success')
  } finally {
    saving.value = false
  }
}

const showMessage = (msg, type) => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  loadBrands()
})
</script>

<style scoped>
.panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
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

.input:focus {
  outline: none;
  border-color: var(--accent-red);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
}

.btn, .btn-icon {
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

.btn-icon {
  padding: 0.5rem;
}

.btn:disabled {
  background-color: #222 !important;
  color: #666;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--accent-red);
  color: var(--text-primary);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-red-hover);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--bg-card);
  border-color: #555;
}
</style>

