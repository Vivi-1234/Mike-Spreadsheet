<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-text-primary">"How-to-buy" Page Management</h2>
      <button @click="saveAllChanges" class="btn btn-primary" :disabled="saving">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        {{ saving ? 'Saving...' : 'Save All Changes' }}
      </button>
    </div>
    
    <!-- General Settings -->
    <div class="panel p-6 space-y-4">
      <h3 class="text-lg font-semibold text-text-primary">General Settings</h3>
      <div>
        <label class="label">Tutorial Video URL</label>
        <input 
          v-model="settings.video_url"
          class="input mt-1" 
          placeholder="Enter YouTube 'embed' link"
        >
      </div>
      <div>
        <label class="label">Sign Up Button Link</label>
        <input 
          v-model="settings.signup_url"
          class="input mt-1" 
          placeholder="Enter the link for the sign up button"
        >
      </div>
    </div>
    
    <!-- Tutorial Steps -->
    <div class="panel p-6">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-lg font-semibold text-text-primary">Tutorial Steps</h3>
          <p class="text-sm text-text-secondary mt-1">Create main steps and add sub-steps to each one</p>
        </div>
        <button @click="addMainStep" class="btn btn-secondary btn-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-3 w-3">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Main Step
        </button>
      </div>
      
      <div ref="mainStepsContainer" class="space-y-4">
        <div 
          v-for="mainStep in mainSteps" 
          :key="mainStep.tempId"
          :data-id="mainStep.tempId"
          class="main-step-card panel p-4 space-y-4"
        >
          <!-- Main Step Header -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2 flex-grow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="main-step-drag-handle cursor-move text-gray-500">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <input 
                v-model="mainStep.title"
                class="input flex-grow" 
                placeholder="Main Step Title (e.g., Requirements)"
              >
            </div>
            <button @click="deleteMainStep(mainStep.tempId)" class="btn btn-danger btn-xs ml-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
          
          <!-- Sub-steps -->
          <div class="pl-8">
            <h4 class="text-sm font-semibold text-text-secondary mb-2">Sub-steps:</h4>
            <div :ref="el => setSubStepsContainer(mainStep.tempId, el)" class="sub-steps-container space-y-3">
              <div 
                v-for="subStep in mainStep.subSteps" 
                :key="subStep.tempId"
                :data-id="subStep.tempId"
                class="sub-step-row p-4 border border-gray-800 rounded-lg bg-bg-card space-y-4"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sub-step-drag-handle cursor-move text-gray-600">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    <h5 class="font-semibold text-text-secondary">Sub-step</h5>
                  </div>
                  <button @click="deleteSubStep(mainStep.tempId, subStep.tempId)" class="btn btn-danger btn-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-4">
                    <div>
                      <label class="label">Sub-step Title</label>
                      <input 
                        v-model="subStep.title"
                        class="input mt-1" 
                        placeholder="Sub-step title"
                      >
                    </div>
                    <div>
                      <label class="label">Description</label>
                      <textarea 
                        v-model="subStep.description"
                        class="input mt-1" 
                        rows="4"
                        placeholder="Step description"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div class="space-y-1">
                    <label class="label">Image</label>
                    <div 
                      class="step-image-upload-box relative p-4 rounded-lg text-center cursor-pointer text-gray-500 border-2 border-dashed border-gray-600 hover:border-accent-red h-full flex items-center justify-center min-h-[180px]"
                      @click="triggerImageUpload(subStep.tempId)"
                    >
                      <p v-if="!subStep.image_url && !subStep.imageFile" class="step-image-placeholder">Click to upload</p>
                      <img 
                        v-if="subStep.image_url || subStep.imagePreview" 
                        :src="subStep.imagePreview || subStep.image_url" 
                        class="step-image-preview max-h-32 mx-auto rounded"
                      >
                      <button 
                        v-if="subStep.image_url || subStep.imageFile"
                        @click.stop="clearSubStepImage(mainStep.tempId, subStep.tempId)" 
                        class="delete-step-image-btn absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                    <input 
                      :ref="el => setImageInput(subStep.tempId, el)"
                      type="file" 
                      accept="image/*" 
                      class="hidden"
                      @change="(e) => handleImageUpload(e, mainStep.tempId, subStep.tempId)"
                    >
                    <p v-if="subStep.imageFile" class="text-xs text-green-400 mt-1">File: {{ subStep.imageFile.name }}</p>
                  </div>
                </div>
              </div>
              
              <div v-if="mainStep.subSteps.length === 0" class="text-center py-4 text-text-secondary text-sm">
                No sub-steps yet. Add one below.
              </div>
            </div>
            
            <button @click="addSubStep(mainStep.tempId)" class="btn btn-secondary btn-xs mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-3 w-3">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Sub-step
            </button>
          </div>
        </div>
        
        <div v-if="mainSteps.length === 0" class="text-center py-8 text-text-secondary">
          No main steps yet. Add one above!
        </div>
      </div>
    </div>
    
    <div v-if="message" class="fixed bottom-5 right-5 z-[101]">
      <div class="p-4 rounded-lg shadow-lg" :class="messageType === 'success' ? 'bg-green-600' : 'bg-red-500'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Sortable from 'sortablejs'

const { getAuthenticatedClient } = useAuth()

const settings = ref({
  video_url: '',
  signup_url: ''
})
const mainSteps = ref([])
const saving = ref(false)
const message = ref('')
const messageType = ref('success')

const mainStepsContainer = ref(null)
const subStepsContainers = ref({})
const imageInputs = ref({})

let mainStepsSortable = null
const subStepsSortables = {}

const setSubStepsContainer = (mainStepId, el) => {
  if (el) {
    subStepsContainers.value[mainStepId] = el
  }
}

const setImageInput = (subStepId, el) => {
  if (el) {
    imageInputs.value[subStepId] = el
  }
}

const uploadImage = async (file, bucket = 'how-to-buy-steps') => {
  if (!file) return null
  const db = await getAuthenticatedClient()
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
  const { error } = await db.storage.from(bucket).upload(fileName, file)
  if (error) {
    throw new Error(`Image upload failed: ${error.message}`)
  }
  const { data: { publicUrl } } = db.storage.from(bucket).getPublicUrl(fileName)
  return publicUrl
}

const loadData = async () => {
  try {
    const db = await getAuthenticatedClient()
    
    // Load settings
    const { data: settingsData } = await db
      .from('how_to_buy_settings')
      .select('*')
      .limit(1)
      .single()
    
    if (settingsData) {
      settings.value = {
        video_url: settingsData.video_url || '',
        signup_url: settingsData.signup_url || ''
      }
    }
    
    // Load steps
    const { data: stepsData } = await db
      .from('how_to_buy_steps')
      .select('*')
      .order('display_order')
    
    if (stepsData) {
      // Separate main steps and sub-steps
      const allSteps = stepsData || []
      const mainStepsData = allSteps.filter(s => !s.section_title)
      const subStepsByParent = allSteps.reduce((acc, step) => {
        if (step.section_title) {
          if (!acc[step.section_title]) acc[step.section_title] = []
          acc[step.section_title].push(step)
        }
        return acc
      }, {})
      
      mainSteps.value = mainStepsData.map(mainStep => ({
        id: mainStep.id,
        tempId: `main_${mainStep.id}`,
        title: mainStep.title,
        subSteps: (subStepsByParent[mainStep.title] || []).map(subStep => ({
          id: subStep.id,
          tempId: `sub_${subStep.id}`,
          title: subStep.title,
          description: subStep.description,
          image_url: subStep.image_url,
          imageFile: null,
          imagePreview: null
        }))
      }))
    }
    
    // Initialize sortables after data loads
    await nextTick()
    initSortables()
  } catch (error) {
    console.error('Error loading how-to-buy data:', error)
    showMessage('Failed to load data: ' + error.message, 'error')
  }
}

const initSortables = () => {
  // Main steps sortable
  if (mainStepsSortable) {
    mainStepsSortable.destroy()
  }
  
  if (mainStepsContainer.value) {
    mainStepsSortable = new Sortable(mainStepsContainer.value, {
      animation: 150,
      handle: '.main-step-drag-handle',
      ghostClass: 'sortable-ghost'
    })
  }
  
  // Sub-steps sortables
  Object.keys(subStepsSortables).forEach(key => {
    if (subStepsSortables[key]) {
      subStepsSortables[key].destroy()
    }
  })
  
  mainSteps.value.forEach(mainStep => {
    const container = subStepsContainers.value[mainStep.tempId]
    if (container) {
      subStepsSortables[mainStep.tempId] = new Sortable(container, {
        animation: 150,
        handle: '.sub-step-drag-handle',
        ghostClass: 'sortable-ghost'
      })
    }
  })
}

const addMainStep = async () => {
  const tempId = `main_${Date.now()}`
  mainSteps.value.push({
    tempId,
    title: '',
    subSteps: []
  })
  
  await nextTick()
  initSortables()
}

const deleteMainStep = (tempId) => {
  if (!confirm('Are you sure you want to delete this entire main step and all its sub-steps?')) return
  
  const index = mainSteps.value.findIndex(s => s.tempId === tempId)
  if (index > -1) {
    mainSteps.value.splice(index, 1)
  }
}

const addSubStep = async (mainStepTempId) => {
  const mainStep = mainSteps.value.find(s => s.tempId === mainStepTempId)
  if (!mainStep) return
  
  const tempId = `sub_${Date.now()}`
  mainStep.subSteps.push({
    tempId,
    title: '',
    description: '',
    image_url: '',
    imageFile: null,
    imagePreview: null
  })
  
  await nextTick()
  initSortables()
}

const deleteSubStep = (mainStepTempId, subStepTempId) => {
  const mainStep = mainSteps.value.find(s => s.tempId === mainStepTempId)
  if (!mainStep) return
  
  const index = mainStep.subSteps.findIndex(s => s.tempId === subStepTempId)
  if (index > -1) {
    mainStep.subSteps.splice(index, 1)
  }
}

const triggerImageUpload = (subStepTempId) => {
  const input = imageInputs.value[subStepTempId]
  if (input) {
    input.click()
  }
}

const handleImageUpload = (event, mainStepTempId, subStepTempId) => {
  const file = event.target.files[0]
  if (!file) return
  
  const mainStep = mainSteps.value.find(s => s.tempId === mainStepTempId)
  if (!mainStep) return
  
  const subStep = mainStep.subSteps.find(s => s.tempId === subStepTempId)
  if (!subStep) return
  
  subStep.imageFile = file
  subStep.imagePreview = URL.createObjectURL(file)
  subStep.image_url = '' // Clear old URL
}

const clearSubStepImage = (mainStepTempId, subStepTempId) => {
  const mainStep = mainSteps.value.find(s => s.tempId === mainStepTempId)
  if (!mainStep) return
  
  const subStep = mainStep.subSteps.find(s => s.tempId === subStepTempId)
  if (!subStep) return
  
  subStep.imageFile = null
  subStep.imagePreview = null
  subStep.image_url = ''
  
  // Clear file input
  const input = imageInputs.value[subStepTempId]
  if (input) {
    input.value = ''
  }
}

const saveAllChanges = async () => {
  saving.value = true
  
  try {
    const db = await getAuthenticatedClient()
    
    // Save settings
    const { data: existingSettings } = await db
      .from('how_to_buy_settings')
      .select('id')
      .limit(1)
      .single()
    
    if (existingSettings) {
      await db
        .from('how_to_buy_settings')
        .update({
          video_url: settings.value.video_url || null,
          signup_url: settings.value.signup_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
    }
    
    // Save steps
    let displayOrderCounter = 0
    const allPayloads = []
    
    // Get order from DOM
    const mainStepElements = mainStepsContainer.value.querySelectorAll('.main-step-card')
    
    for (const mainStepEl of mainStepElements) {
      const mainStepTempId = mainStepEl.dataset.id
      const mainStep = mainSteps.value.find(s => s.tempId === mainStepTempId)
      
      if (!mainStep || !mainStep.title.trim()) continue
      
      // Main step payload
      const mainStepPayload = {
        id: mainStep.id,
        title: mainStep.title.trim(),
        section_title: null,
        description: null,
        image_url: null,
        display_order: displayOrderCounter++
      }
      allPayloads.push(mainStepPayload)
      
      // Sub-steps
      const subStepsContainer = mainStepEl.querySelector('.sub-steps-container')
      if (subStepsContainer) {
        const subStepElements = subStepsContainer.querySelectorAll('.sub-step-row')
        
        for (const subStepEl of subStepElements) {
          const subStepTempId = subStepEl.dataset.id
          const subStep = mainStep.subSteps.find(s => s.tempId === subStepTempId)
          
          if (!subStep) continue
          
          let imageUrl = subStep.image_url
          
          // Upload new image if exists
          if (subStep.imageFile) {
            imageUrl = await uploadImage(subStep.imageFile)
          }
          
          const subStepPayload = {
            id: subStep.id,
            title: subStep.title.trim(),
            description: subStep.description.trim(),
            image_url: imageUrl,
            section_title: mainStep.title.trim(),
            display_order: displayOrderCounter++
          }
          allPayloads.push(subStepPayload)
        }
      }
    }
    
    // Get existing steps to determine what to delete
    const { data: existingSteps } = await db.from('how_to_buy_steps').select('id')
    const existingIds = (existingSteps || []).map(s => s.id)
    const currentIds = allPayloads.filter(p => p.id).map(p => p.id)
    const idsToDelete = existingIds.filter(id => !currentIds.includes(id))
    
    // Delete removed steps
    if (idsToDelete.length > 0) {
      await db.from('how_to_buy_steps').delete().in('id', idsToDelete)
    }
    
    // Update existing and insert new
    const recordsToUpdate = allPayloads.filter(p => p.id)
    const recordsToInsert = allPayloads.filter(p => !p.id)
    
    if (recordsToUpdate.length > 0) {
      const updatePromises = recordsToUpdate.map(record => {
        const { id, ...updateData } = record
        return db.from('how_to_buy_steps').update(updateData).eq('id', id)
      })
      const updateResults = await Promise.all(updatePromises)
      const firstError = updateResults.find(res => res.error)
      if (firstError) throw firstError.error
    }
    
    if (recordsToInsert.length > 0) {
      const cleanRecordsToInsert = recordsToInsert.map(({ id, ...rest }) => rest)
      const { error: insertError } = await db.from('how_to_buy_steps').insert(cleanRecordsToInsert)
      if (insertError) throw insertError
    }
    
    showMessage('Successfully saved "How-to-buy" page!')
    
    // Reload data to get fresh IDs
    await loadData()
  } catch (error) {
    console.error('Error saving changes:', error)
    showMessage('Save failed: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  loadData()
})

onBeforeUnmount(() => {
  if (mainStepsSortable) {
    mainStepsSortable.destroy()
  }
  Object.values(subStepsSortables).forEach(sortable => {
    if (sortable) {
      sortable.destroy()
    }
  })
})
</script>

<style scoped>
.panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
}

.main-step-card {
  background-color: rgba(24, 24, 24, 0.3);
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

.btn-xs {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
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

.btn-danger {
  background-color: transparent;
  color: #f87171;
  border-color: #7f1d1d;
}

.btn-danger:hover {
  background-color: rgba(248, 113, 113, 0.1);
  border-color: #f87171;
}

.sortable-ghost {
  opacity: 0.4;
  background-color: var(--bg-card);
}
</style>
