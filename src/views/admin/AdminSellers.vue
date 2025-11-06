<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-text-primary">Seller Management</h2>
      <button @click="saveAllSellers" class="btn btn-primary" :disabled="saving">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
    
    <div class="panel p-6">
      <h3 class="text-lg font-semibold mb-4 text-text-primary">Add New Seller</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="new-seller-name" class="label">Seller Name</label>
          <input 
            type="text" 
            id="new-seller-name" 
            v-model="newSeller.name"
            class="input mt-1" 
            placeholder="Enter seller name"
          >
        </div>
        <div>
          <label class="label">Logo URL</label>
          <input 
            type="text" 
            v-model="newSeller.logo_url"
            class="input mt-1" 
            placeholder="Enter image URL"
          >
        </div>
        <div>
          <label for="new-seller-link" class="label">Store Link</label>
          <input 
            type="text" 
            id="new-seller-link" 
            v-model="newSeller.store_link"
            class="input mt-1" 
            placeholder="Enter store URL"
          >
        </div>
      </div>
      <div class="mt-4">
        <label for="new-seller-description" class="label">Description</label>
        <textarea 
          id="new-seller-description" 
          v-model="newSeller.description"
          class="input mt-1" 
          rows="3" 
          placeholder="Describe the seller's specialties and products"
        ></textarea>
      </div>
      <div class="mt-6 flex justify-end">
        <button @click="addSeller" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Seller
        </button>
      </div>
    </div>
    
    <div class="panel p-6">
      <h3 class="text-lg font-semibold mb-4 text-text-primary">Existing Sellers</h3>
      <p class="text-sm text-text-secondary mb-4">Manage existing sellers. Drag to reorder.</p>
      <div class="space-y-4">
        <div 
          v-for="(seller, index) in sellers" 
          :key="seller.id"
          class="flex items-start gap-4 p-4 bg-bg-card rounded-lg hover:bg-opacity-80 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-text-secondary cursor-move mt-1">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          
          <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label text-xs">Name</label>
              <input 
                v-model="seller.name"
                class="input mt-1" 
              >
            </div>
            <div>
              <label class="label text-xs">Logo URL</label>
              <input 
                v-model="seller.logo_url"
                class="input mt-1" 
              >
            </div>
            <div class="md:col-span-2">
              <label class="label text-xs">Store Link</label>
              <input 
                v-model="seller.store_link"
                class="input mt-1" 
              >
            </div>
            <div class="md:col-span-2">
              <label class="label text-xs">Description</label>
              <textarea 
                v-model="seller.description"
                class="input mt-1" 
                rows="2"
              ></textarea>
            </div>
          </div>
          
          <button @click="deleteSeller(seller.id, index)" class="btn-icon text-red-400 hover:text-red-500 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="sellers.length === 0" class="text-center py-8 text-text-secondary">
          No sellers yet. Add one above!
        </div>
      </div>
    </div>
    
    <div v-if="message" class="max-w-4xl">
      <div class="p-4 rounded-lg" :class="messageType === 'success' ? 'bg-green-600' : 'bg-red-500'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { getAuthenticatedClient } = useAuth()

const sellers = ref([])
const newSeller = ref({
  name: '',
  logo_url: '',
  store_link: '',
  description: ''
})
const saving = ref(false)
const message = ref('')
const messageType = ref('success')

const loadSellers = async () => {
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('sellers')
      .select('*')
      .order('display_order')
    
    if (error) throw error
    sellers.value = data || []
  } catch (error) {
    console.error('Error loading sellers:', error)
    showMessage('Failed to load sellers', 'error')
  }
}

const addSeller = async () => {
  if (!newSeller.value.name.trim()) {
    showMessage('Please enter a seller name', 'error')
    return
  }
  
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('sellers')
      .insert([{
        name: newSeller.value.name,
        logo_url: newSeller.value.logo_url,
        store_link: newSeller.value.store_link,
        description: newSeller.value.description,
        display_order: sellers.value.length
      }])
      .select()
    
    if (error) throw error
    
    if (data && data[0]) {
      sellers.value.push(data[0])
      newSeller.value = {
        name: '',
        logo_url: '',
        store_link: '',
        description: ''
      }
      showMessage('Seller added successfully!', 'success')
    }
  } catch (error) {
    console.error('Error adding seller:', error)
    showMessage('Failed to add seller: ' + error.message, 'error')
  }
}

const deleteSeller = async (id, index) => {
  if (!confirm('Are you sure you want to delete this seller?')) return
  
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('sellers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    sellers.value.splice(index, 1)
    showMessage('Seller deleted successfully!', 'success')
  } catch (error) {
    console.error('Error deleting seller:', error)
    showMessage('Failed to delete seller: ' + error.message, 'error')
  }
}

const saveAllSellers = async () => {
  saving.value = true
  message.value = ''
  
  try {
    const db = await getAuthenticatedClient()
    
    for (let i = 0; i < sellers.value.length; i++) {
      const seller = sellers.value[i]
      const { error } = await db
        .from('sellers')
        .update({
          name: seller.name,
          logo_url: seller.logo_url,
          store_link: seller.store_link,
          description: seller.description,
          display_order: i
        })
        .eq('id', seller.id)
      
      if (error) throw error
    }
    
    showMessage('All sellers saved successfully!', 'success')
  } catch (error) {
    console.error('Error saving sellers:', error)
    showMessage('Failed to save sellers: ' + error.message, 'error')
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
  loadSellers()
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
</style>
