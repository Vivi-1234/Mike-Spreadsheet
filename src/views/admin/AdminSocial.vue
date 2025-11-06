<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-text-primary">Social Media Links</h2>
    
    <div class="panel p-6 max-w-2xl">
      <div class="space-y-3 mb-4">
        <div 
          v-for="(link, index) in socialLinks" 
          :key="link.id || index"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-bg-card rounded-lg"
        >
          <div>
            <label class="label text-xs">Platform Name</label>
            <input 
              v-model="link.platform_name"
              class="input mt-1" 
              placeholder="e.g., Instagram"
            >
          </div>
          
          <div>
            <label class="label text-xs">Link URL</label>
            <input 
              v-model="link.link_url"
              class="input mt-1" 
              placeholder="https://..."
            >
          </div>
          
          <div class="flex gap-2 items-end">
            <div class="flex-grow">
              <label class="label text-xs">Icon URL</label>
              <input 
                v-model="link.icon_url"
                class="input mt-1" 
                placeholder="Image URL"
              >
            </div>
            <button @click="deleteSocialLink(link.id, index)" class="btn-icon text-red-400 hover:text-red-500 mb-px">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="socialLinks.length === 0" class="text-center py-8 text-text-secondary">
          No social links yet. Add one below!
        </div>
      </div>
      
      <div class="mt-4">
        <button @click="addSocialLink" class="btn btn-secondary text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Social Link
        </button>
      </div>
      
      <div class="text-right mt-4">
        <button @click="saveSocialLinks" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Social Links' }}
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

const socialLinks = ref([])
const saving = ref(false)
const message = ref('')
const messageType = ref('success')

const loadSocialLinks = async () => {
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('social_links')
      .select('*')
      .order('display_order')
    
    if (error) throw error
    socialLinks.value = data || []
  } catch (error) {
    console.error('Error loading social links:', error)
    showMessage('Failed to load social links', 'error')
  }
}

const addSocialLink = () => {
  socialLinks.value.push({
    platform_name: '',
    link_url: '',
    icon_url: '',
    display_order: socialLinks.value.length
  })
}

const deleteSocialLink = async (id, index) => {
  if (!confirm('Are you sure you want to delete this social link?')) return
  
  if (id) {
    try {
      const db = await getAuthenticatedClient()
      const { error } = await db
        .from('social_links')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } catch (error) {
      console.error('Error deleting social link:', error)
      showMessage('Failed to delete social link: ' + error.message, 'error')
      return
    }
  }
  
  socialLinks.value.splice(index, 1)
  showMessage('Social link deleted successfully!', 'success')
}

const saveSocialLinks = async () => {
  saving.value = true
  message.value = ''
  
  try {
    const db = await getAuthenticatedClient()
    
    // Update existing and insert new
    for (let i = 0; i < socialLinks.value.length; i++) {
      const link = socialLinks.value[i]
      link.display_order = i
      
      if (link.id) {
        // Update existing
        const { error } = await db
          .from('social_links')
          .update({
            platform_name: link.platform_name,
            link_url: link.link_url,
            icon_url: link.icon_url,
            display_order: link.display_order
          })
          .eq('id', link.id)
        
        if (error) throw error
      } else {
        // Insert new
        const { data, error } = await db
          .from('social_links')
          .insert([{
            platform_name: link.platform_name,
            link_url: link.link_url,
            icon_url: link.icon_url,
            display_order: link.display_order
          }])
          .select()
        
        if (error) throw error
        if (data && data[0]) {
          link.id = data[0].id
        }
      }
    }
    
    showMessage('Social links saved successfully!', 'success')
  } catch (error) {
    console.error('Error saving social links:', error)
    showMessage('Failed to save social links: ' + error.message, 'error')
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
  loadSocialLinks()
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
