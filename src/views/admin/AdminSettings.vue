<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-text-primary">Site Settings</h2>
    
    <div class="panel p-6 space-y-6 max-w-2xl">
      <div>
        <label for="siteTitle" class="label">Main Title</label>
        <input 
          type="text" 
          id="siteTitle" 
          v-model="settings.site_title"
          class="input mt-1"
        >
      </div>
      
      <div>
        <label for="siteSubtitle" class="label">Subtitle</label>
        <textarea 
          id="siteSubtitle" 
          v-model="settings.site_subtitle"
          class="input mt-1" 
          rows="2"
        ></textarea>
      </div>
      
      <div class="pt-4 border-t border-border-color text-right">
        <button @click="saveSettings" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Settings' }}
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

const settings = ref({
  site_title: '',
  site_subtitle: ''
})

const saving = ref(false)
const message = ref('')
const messageType = ref('success')

const loadSettings = async () => {
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('settings')
      .select('*')
      .limit(1)
      .single()
    
    if (error) throw error
    
    if (data) {
      settings.value = {
        site_title: data.site_title || '',
        site_subtitle: data.site_subtitle || ''
      }
    }
  } catch (error) {
    console.error('Error loading settings:', error)
    showMessage('Failed to load settings', 'error')
  }
}

const saveSettings = async () => {
  saving.value = true
  message.value = ''
  
  try {
    const db = await getAuthenticatedClient()
    
    // Check if settings exist
    const { data: existing } = await db
      .from('settings')
      .select('id')
      .limit(1)
      .single()
    
    let result
    if (existing) {
      // Update existing settings
      result = await db
        .from('settings')
        .update({
          site_title: settings.value.site_title,
          site_subtitle: settings.value.site_subtitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      // Insert new settings
      result = await db
        .from('settings')
        .insert([{
          site_title: settings.value.site_title,
          site_subtitle: settings.value.site_subtitle
        }])
    }
    
    if (result.error) throw result.error
    
    showMessage('Settings saved successfully!', 'success')
  } catch (error) {
    console.error('Error saving settings:', error)
    showMessage('Failed to save settings: ' + error.message, 'error')
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
  loadSettings()
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

