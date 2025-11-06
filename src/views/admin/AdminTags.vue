<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-text-primary">Tag Management</h2>
    
    <div class="panel p-6 max-w-2xl">
      <p class="text-sm text-text-secondary mb-4">Manage special tags like "Sales", "Top Selling", etc.</p>
      
      <div class="flex items-center gap-2 mb-4">
        <input 
          type="text" 
          v-model="newTagName"
          @keyup.enter="addTag"
          class="input flex-grow" 
          placeholder="Enter new tag name (e.g., Sales)"
        >
        <button @click="addTag" class="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      
      <div class="space-y-3 mb-4 border-t border-border-color pt-4">
        <div 
          v-for="(tag, index) in tags" 
          :key="tag.id"
          class="flex items-center gap-2 p-3 bg-bg-card rounded-lg hover:bg-opacity-80 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-text-secondary cursor-move">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          
          <input 
            v-model="tag.name"
            class="input flex-grow" 
            @blur="updateTag(tag)"
          >
          
          <button @click="deleteTag(tag.id, index)" class="btn-icon text-red-400 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        
        <div v-if="tags.length === 0" class="text-center py-8 text-text-secondary">
          No tags yet. Add one above!
        </div>
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

const tags = ref([])
const newTagName = ref('')
const message = ref('')
const messageType = ref('success')

const loadTags = async () => {
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('product_tags')
      .select('*')
      .order('display_order')
    
    if (error) throw error
    tags.value = data || []
  } catch (error) {
    console.error('Error loading tags:', error)
    showMessage('Failed to load tags', 'error')
  }
}

const addTag = async () => {
  if (!newTagName.value.trim()) return
  
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('product_tags')
      .insert([{ 
        name: newTagName.value.trim(),
        display_order: tags.value.length
      }])
      .select()
    
    if (error) throw error
    
    if (data && data[0]) {
      tags.value.push(data[0])
      newTagName.value = ''
      showMessage('Tag added successfully!', 'success')
    }
  } catch (error) {
    console.error('Error adding tag:', error)
    showMessage('Failed to add tag: ' + error.message, 'error')
  }
}

const updateTag = async (tag) => {
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('product_tags')
      .update({ name: tag.name })
      .eq('id', tag.id)
    
    if (error) throw error
  } catch (error) {
    console.error('Error updating tag:', error)
    showMessage('Failed to update tag', 'error')
  }
}

const deleteTag = async (id, index) => {
  if (!confirm('Are you sure you want to delete this tag?')) return
  
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('product_tags')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    tags.value.splice(index, 1)
    showMessage('Tag deleted successfully!', 'success')
  } catch (error) {
    console.error('Error deleting tag:', error)
    showMessage('Failed to delete tag: ' + error.message, 'error')
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
  loadTags()
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

