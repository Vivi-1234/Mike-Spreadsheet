<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-text-primary">Navigation (Categories)</h2>
    
    <div class="panel p-6 max-w-2xl">
      <p class="text-sm text-text-secondary mb-4">Manage the category filter buttons on the homepage. Drag to reorder.</p>
      
      <div class="space-y-3 mb-4">
        <div 
          v-for="(item, index) in navItems" 
          :key="item.id"
          class="flex items-center gap-2 p-3 bg-bg-card rounded-lg hover:bg-opacity-80 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-text-secondary cursor-move">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          
          <input 
            v-model="item.link_text"
            class="input flex-grow" 
            placeholder="Category Name"
            @blur="updateNavItem(item)"
          >
          
          <button @click="deleteNavItem(item.id, index)" class="btn-icon text-red-400 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="navItems.length === 0" class="text-center py-8 text-text-secondary">
          No navigation items yet. Add one below!
        </div>
      </div>
      
      <div class="mt-4">
        <button @click="addNavItem" class="btn btn-secondary text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Nav Item
        </button>
      </div>
      
      <div class="text-right mt-4">
        <button @click="saveAllChanges" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save All Changes' }}
        </button>
      </div>
    </div>
    
    <div v-if="message" class="max-w-2xl">
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

const navItems = ref([])
const saving = ref(false)
const message = ref('')
const messageType = ref('success')

const loadNavItems = async () => {
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('navigation')
      .select('*')
      .order('display_order')
    
    if (error) throw error
    navItems.value = (data || []).filter(item => item.link_text && item.link_text.toLowerCase() !== 'home')
  } catch (error) {
    console.error('Error loading navigation items:', error)
    showMessage('Failed to load navigation items', 'error')
  }
}

const addNavItem = async () => {
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('navigation')
      .insert([{ 
        link_text: 'New Category',
        display_order: navItems.value.length
      }])
      .select()
    
    if (error) throw error
    
    if (data && data[0]) {
      navItems.value.push(data[0])
      showMessage('Navigation item added successfully!', 'success')
    }
  } catch (error) {
    console.error('Error adding navigation item:', error)
    showMessage('Failed to add navigation item: ' + error.message, 'error')
  }
}

const updateNavItem = async (item) => {
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('navigation')
      .update({ link_text: item.link_text })
      .eq('id', item.id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating navigation item:', error)
    showMessage('Failed to update navigation item', 'error')
  }
}

const deleteNavItem = async (id, index) => {
  if (!confirm('Are you sure you want to delete this navigation item?')) return
  
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('navigation')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    navItems.value.splice(index, 1)
    showMessage('Navigation item deleted successfully!', 'success')
  } catch (error) {
    console.error('Error deleting navigation item:', error)
    showMessage('Failed to delete navigation item: ' + error.message, 'error')
  }
}

const saveAllChanges = async () => {
  saving.value = true
  message.value = ''
  
  try {
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
  loadNavItems()
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
