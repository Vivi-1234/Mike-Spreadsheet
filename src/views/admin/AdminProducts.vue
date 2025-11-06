<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-text-primary">Product Management</h2>
      <div class="flex gap-2">
        <button @click="downloadTemplate" class="btn btn-secondary text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Template
        </button>
        <button @click="importProducts" class="btn btn-secondary text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Import
        </button>
        <button @click="exportProducts" class="btn btn-secondary text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Add New Products Section -->
    <div class="panel p-6">
      <h3 class="font-semibold mb-4 text-lg">Add New Product(s)</h3>
      
      <div class="space-y-4">
        <div 
          v-for="(product, index) in newProducts" 
          :key="product.tempId"
          class="add-form-row relative p-4 border border-border-color rounded-lg"
        >
          <button 
            @click="removeProductFormRow(index)" 
            class="remove-form-row-btn absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              v-model="product.name" 
              class="input" 
              placeholder="Product Name"
            >
            <input 
              type="number" 
              step="0.01"
              v-model="product.price" 
              class="input" 
              placeholder="Price (CNY)"
            >
          </div>
          
          <div class="mt-4">
            <input 
              v-model="product.target_url" 
              class="input" 
              placeholder="Target URL"
            >
          </div>
          
          <div class="mt-4">
            <label class="label mb-1 block">Product Image</label>
            <div 
              class="add-image-box mt-1 relative p-4 rounded-lg bg-bg-main text-center cursor-pointer text-gray-400 border-2 border-dashed border-gray-600 hover:border-accent-red"
              @click="triggerFileInput(product.tempId)"
            >
              <p v-if="!product.imageFile && !product.image_url" class="add-image-placeholder">Click to upload</p>
              <img 
                v-if="product.imageFile" 
                :src="product.imagePreview" 
                class="max-h-24 mx-auto rounded add-preview-image"
              >
              <p v-if="product.imageFile" class="text-xs text-green-400 mt-2">{{ product.imageFile.name }}</p>
            </div>
            <input 
              :ref="el => setFileInput(product.tempId, el)"
              type="file" 
              class="hidden" 
              accept="image/*"
              @change="(e) => handleNewProductImageUpload(e, index)"
            >
          </div>
        </div>
      </div>
      
      <div class="mt-4 flex justify-between">
        <button @click="addProductFormRow" class="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Another
        </button>
        <button @click="submitAllNewProducts" class="btn btn-primary" :disabled="newProducts.length === 0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Submit All
        </button>
      </div>
    </div>

    <!-- Existing Products -->
    <div class="panel">
      <div class="p-6 flex justify-between items-center border-b border-border-color">
        <h3 class="font-semibold text-lg">Existing Products</h3>
        <div class="w-64">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            class="input" 
            placeholder="Search by name..."
          >
        </div>
      </div>
      
      <!-- Bulk Action Bar -->
      <div v-if="selectedProducts.length > 0" class="p-4 bg-bg-card border-b border-border-color flex items-center justify-between">
        <span class="text-sm text-text-secondary">{{ selectedProducts.length }} product(s) selected</span>
        <div class="flex gap-2">
          <button @click="bulkDelete" class="btn btn-secondary btn-xs text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1 h-3 w-3">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete Selected
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-text-secondary uppercase bg-bg-surface">
            <tr>
              <th class="p-4 w-12">
                <input type="checkbox" v-model="selectAll" @change="handleSelectAll" class="rounded border-border-color">
              </th>
              <th class="p-4 w-12"></th>
              <th class="p-4" style="min-width: 250px;">Product</th>
              <th class="p-4" style="min-width: 150px;">Brand</th>
              <th class="p-4" style="min-width: 150px;">Category</th>
              <th class="p-4" style="min-width: 150px;">Tags</th>
              <th class="p-4 w-24">Price</th>
              <th class="p-4" style="min-width: 200px;">URL</th>
              <th class="p-4 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody ref="productTableBody">
            <tr v-if="loading" class="border-b border-border-color">
              <td colspan="9" class="p-8 text-center text-text-secondary">
                <div class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                  Loading products...
                </div>
              </td>
            </tr>
            <tr v-else-if="products.length === 0" class="border-b border-border-color">
              <td colspan="9" class="p-8 text-center text-text-secondary">
                No products found. Add one above!
              </td>
            </tr>
            <tr 
              v-else
              v-for="product in products" 
              :key="product.id"
              :data-id="product.id"
              class="product-row border-b border-border-color hover:bg-bg-card transition-colors"
            >
              <td class="p-4">
                <input 
                  type="checkbox" 
                  :checked="selectedProducts.includes(product.id)"
                  @change="toggleProductSelection(product.id)"
                  class="rounded border-border-color"
                >
              </td>
              <td class="p-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cursor-move text-gray-500 drag-handle">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <img 
                    v-if="product.image_url" 
                    :src="product.image_url" 
                    :alt="product.name"
                    class="w-10 h-10 object-cover rounded"
                    @error="(e) => e.target.style.display = 'none'"
                  >
                  <div class="flex-grow">
                    <p class="font-medium text-text-primary">{{ product.name }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <select 
                  :value="product.brand_id || ''"
                  @change="(e) => updateProductField(product.id, 'brand_id', e.target.value || null)"
                  class="input text-sm"
                >
                  <option value="">None</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
              </td>
              <td class="p-4">
                <div class="custom-dropdown">
                  <button 
                    @click="toggleDropdown(product.id, 'category')"
                    class="input text-left text-sm truncate w-full"
                  >
                    {{ getCategoryDisplay(product.category) }}
                  </button>
                  <div 
                    v-if="activeDropdown.id === product.id && activeDropdown.type === 'category'"
                    class="dropdown-menu active"
                  >
                    <div class="p-2 space-y-1 max-h-48 overflow-y-auto">
                      <label 
                        v-for="cat in categories" 
                        :key="cat.link_text"
                        class="dropdown-item flex items-center gap-2 p-2 hover:bg-bg-card rounded cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          :value="cat.link_text"
                          :checked="isInList(product.category, cat.link_text)"
                          @change="(e) => updateMultiSelect(product.id, 'category', cat.link_text, e.target.checked)"
                          class="rounded border-border-color"
                        >
                        <span class="text-sm">{{ cat.link_text }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <div class="custom-dropdown">
                  <button 
                    @click="toggleDropdown(product.id, 'tags')"
                    class="input text-left text-sm truncate w-full"
                  >
                    {{ getTagsDisplay(product.tags) }}
                  </button>
                  <div 
                    v-if="activeDropdown.id === product.id && activeDropdown.type === 'tags'"
                    class="dropdown-menu active"
                  >
                    <div class="p-2 space-y-1 max-h-48 overflow-y-auto">
                      <label 
                        v-for="tag in tags" 
                        :key="tag.name"
                        class="dropdown-item flex items-center gap-2 p-2 hover:bg-bg-card rounded cursor-pointer"
                      >
                        <input 
                          type="checkbox" 
                          :value="tag.name"
                          :checked="isInList(product.tags, tag.name)"
                          @change="(e) => updateMultiSelect(product.id, 'tags', tag.name, e.target.checked)"
                          class="rounded border-border-color"
                        >
                        <span class="text-sm">{{ tag.name }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </td>
              <td class="p-4 editable-cell" @dblclick="startInlineEdit($event, product.id, 'price')">
                <span class="text-text-primary font-medium">¥{{ product.price }}</span>
              </td>
              <td class="p-4 editable-cell" @dblclick="startInlineEdit($event, product.id, 'target_url')">
                <div class="truncate max-w-[15ch] text-text-secondary">{{ product.target_url || '—' }}</div>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button @click="editProduct(product)" class="btn-icon p-2 text-blue-400 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button @click="deleteProduct(product.id)" class="btn-icon p-2 text-red-400 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="p-4 flex justify-between items-center border-t border-border-color">
        <span class="text-sm text-text-secondary">
          Page {{ currentPage }} of {{ totalPages }} ({{ totalProducts }} total)
        </span>
        <div class="flex items-center gap-2" v-if="totalPages > 1">
          <button 
            @click="goToPage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="btn btn-secondary btn-xs"
          >
            Previous
          </button>
          
          <template v-if="totalPages <= 7">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="goToPage(page)"
              class="btn btn-secondary btn-xs"
              :class="{ 'active': page === currentPage }"
            >
              {{ page }}
            </button>
          </template>
          <template v-else>
            <button 
              v-if="currentPage > 3"
              @click="goToPage(1)"
              class="btn btn-secondary btn-xs"
            >
              1
            </button>
            <span v-if="currentPage > 4" class="px-2 text-gray-500">...</span>
            
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="goToPage(page)"
              class="btn btn-secondary btn-xs"
              :class="{ 'active': page === currentPage }"
            >
              {{ page }}
            </button>
            
            <span v-if="currentPage < totalPages - 3" class="px-2 text-gray-500">...</span>
            <button 
              v-if="currentPage < totalPages - 2"
              @click="goToPage(totalPages)"
              class="btn btn-secondary btn-xs"
            >
              {{ totalPages }}
            </button>
          </template>
          
          <button 
            @click="goToPage(currentPage + 1)" 
            :disabled="currentPage >= totalPages"
            class="btn btn-secondary btn-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    
    <!-- Edit Modal -->
    <div v-if="editingProduct" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeEditModal">
      <div class="panel w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-border-color flex justify-between items-center sticky top-0 bg-bg-surface z-10">
          <h3 class="text-lg font-semibold">Edit Product</h3>
          <button @click="closeEditModal" class="p-1 rounded-full hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <div>
            <label class="label">Product Name</label>
            <input v-model="editingProduct.name" class="input mt-1">
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">Price (¥)</label>
              <input type="number" step="0.01" v-model="editingProduct.price" class="input mt-1">
            </div>
            <div>
              <label class="label">Brand</label>
              <select v-model="editingProduct.brand_id" class="input mt-1">
                <option value="">-- No Brand --</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="label">Target URL</label>
            <input v-model="editingProduct.target_url" class="input mt-1">
          </div>
          
          <div>
            <label class="label">Image</label>
            <div class="mt-2 flex items-start gap-4">
              <div v-if="editingProduct.image_url && !editImageFile" class="relative">
                <img :src="editingProduct.image_url" class="w-32 h-32 object-cover rounded">
                <button 
                  @click="editingProduct.image_url = ''"
                  class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
              <div v-if="editImageFile" class="relative">
                <img :src="editImagePreview" class="w-32 h-32 object-cover rounded">
                <button 
                  @click="editImageFile = null; editImagePreview = ''"
                  class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div class="flex-1">
                <input v-model="editingProduct.image_url" class="input" placeholder="Image URL" @input="editImageFile = null">
                <div class="mt-2">
                  <label class="btn btn-secondary text-sm cursor-pointer inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload Image
                    <input type="file" accept="image/*" class="hidden" @change="handleEditImageUpload">
                  </label>
                  <p v-if="editImageFile" class="text-xs text-green-400 mt-1">{{ editImageFile.name }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label class="label">Category</label>
            <input v-model="editingProduct.category" class="input mt-1" placeholder="e.g., Shoes, Accessories">
          </div>
          
          <div>
            <label class="label">Tags</label>
            <div class="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <label 
                v-for="tag in tags" 
                :key="tag.name"
                class="flex items-center gap-2 p-2 bg-bg-card rounded cursor-pointer hover:bg-bg-main"
              >
                <input 
                  type="checkbox" 
                  :value="tag.name"
                  :checked="isInList(editingProduct.tags, tag.name)"
                  @change="(e) => toggleEditTag(tag.name, e.target.checked)"
                  class="rounded border-border-color"
                >
                <span class="text-sm">{{ tag.name }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="p-4 bg-bg-main/50 rounded-b-lg text-right border-t border-border-color flex justify-end gap-2">
          <button @click="closeEditModal" class="btn btn-secondary">Cancel</button>
          <button @click="saveProductChanges" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Hidden file input for import -->
    <input ref="importFileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="handleImportFile">
    
    <div v-if="message" class="fixed bottom-5 right-5 z-[101]">
      <div class="p-4 rounded-lg shadow-lg" :class="messageType === 'success' ? 'bg-green-600' : 'bg-red-500'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth'
import Sortable from 'sortablejs'
import * as XLSX from 'xlsx'

const { getAuthenticatedClient } = useAuth()

// Reactive state
const products = ref([])
const brands = ref([])
const categories = ref([])
const tags = ref([])
const newProducts = ref([])
const editingProduct = ref(null)
const editImageFile = ref(null)
const editImagePreview = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 50
const totalProducts = ref(0)
const loading = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref('success')
const selectedProducts = ref([])
const selectAll = ref(false)
const activeDropdown = ref({ id: null, type: null })
const productTableBody = ref(null)
const importFileInput = ref(null)
const fileInputs = ref({})

let sortableInstance = null
let searchTimeout = null

// Computed
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Functions
const showMessage = (msg, type = 'success') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

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
  }
}

const loadCategories = async () => {
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('navigation')
      .select('*')
      .order('display_order')
    
    if (error) throw error
    categories.value = (data || []).filter(item => item.link_text && item.link_text.toLowerCase() !== 'home')
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

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
  }
}

const loadProducts = async (page = 1) => {
  currentPage.value = page
  loading.value = true
  
  try {
    const db = await getAuthenticatedClient()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    let query = db
      .from('products')
      .select('*, brands(*)', { count: 'exact' })
      .eq('is_active', true)
    
    if (searchQuery.value) {
      query = query.ilike('name', `%${searchQuery.value}%`)
    }
    
    const { data, error, count } = await query
      .order('display_order')
      .range(from, to)
    
    if (error) throw error
    
    products.value = data || []
    totalProducts.value = count || 0
    
    // Reinitialize sortable after products load
    await nextTick()
    initSortable()
  } catch (error) {
    console.error('Error loading products:', error)
    showMessage('Failed to load products', 'error')
  } finally {
    loading.value = false
  }
}

const initSortable = () => {
  if (sortableInstance) {
    sortableInstance.destroy()
  }
  
  if (productTableBody.value && products.value.length > 0) {
    sortableInstance = new Sortable(productTableBody.value, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      onEnd: saveProductOrder
    })
  }
}

const saveProductOrder = async (evt) => {
  loading.value = true
  
  try {
    const db = await getAuthenticatedClient()
    const reorderedIds = Array.from(evt.to.children)
      .filter(el => el.dataset.id)
      .map(el => parseInt(el.dataset.id))
    
    const updates = reorderedIds.map((id, index) => 
      db.from('products')
        .update({ display_order: index + ((currentPage.value - 1) * pageSize) })
        .eq('id', id)
    )
    
    await Promise.all(updates)
    showMessage('Order saved!')
  } catch (error) {
    console.error('Error saving order:', error)
    showMessage('Reorder failed: ' + error.message, 'error')
    await loadProducts(currentPage.value)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadProducts(1)
  }, 500)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadProducts(page)
  }
}

// New product functions
const setFileInput = (tempId, el) => {
  if (el) {
    fileInputs.value[tempId] = el
  }
}

const triggerFileInput = (tempId) => {
  const input = fileInputs.value[tempId]
  if (input) {
    input.click()
  }
}

const addProductFormRow = () => {
  const tempId = `new_${Date.now()}`
  newProducts.value.push({
    tempId,
    name: '',
    price: '',
    target_url: '',
    image_url: '',
    imageFile: null,
    imagePreview: null
  })
}

const removeProductFormRow = (index) => {
  const product = newProducts.value[index]
  if (product && fileInputs.value[product.tempId]) {
    delete fileInputs.value[product.tempId]
  }
  newProducts.value.splice(index, 1)
}

const handleNewProductImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    newProducts.value[index].imageFile = file
    newProducts.value[index].imagePreview = URL.createObjectURL(file)
    newProducts.value[index].image_url = ''
  }
}

const uploadImage = async (file, bucket = 'product-images') => {
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

const submitAllNewProducts = async () => {
  if (newProducts.value.length === 0) {
    showMessage('No products to add', 'error')
    return
  }
  
  // Validate
  for (const product of newProducts.value) {
    if (!product.name || !product.price || !product.target_url) {
      showMessage('Please fill in required fields (Name, Price, URL) for all products', 'error')
      return
    }
  }
  
  loading.value = true
  
  try {
    const db = await getAuthenticatedClient()
    const { count } = await db.from('products').select('*', { count: 'exact', head: true })
    let currentOrder = count || 0
    
    const productsToUpload = []
    
    for (const product of newProducts.value) {
      let imageUrl = product.image_url
      
      if (product.imageFile) {
        imageUrl = await uploadImage(product.imageFile)
      }
      
      productsToUpload.push({
        name: product.name,
        price: parseFloat(product.price),
        target_url: product.target_url,
        image_url: imageUrl,
        display_order: currentOrder++,
        is_active: true
      })
    }
    
    const { error } = await db.from('products').insert(productsToUpload)
    
    if (error) throw error
    
    showMessage(`Successfully added ${productsToUpload.length} new products!`)
    newProducts.value = []
    addProductFormRow()
    loadProducts(currentPage.value)
  } catch (error) {
    console.error('Error adding products:', error)
    showMessage('Bulk add failed: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Edit functions
const editProduct = (product) => {
  editingProduct.value = { ...product }
  editImageFile.value = null
  editImagePreview.value = ''
}

const closeEditModal = () => {
  editingProduct.value = null
  editImageFile.value = null
  editImagePreview.value = ''
}

const handleEditImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    editImageFile.value = file
    editImagePreview.value = URL.createObjectURL(file)
    editingProduct.value.image_url = ''
  }
}

const toggleEditTag = (tagName, checked) => {
  const currentTags = editingProduct.value.tags ? editingProduct.value.tags.split(',').map(t => t.trim()).filter(t => t) : []
  
  if (checked) {
    if (!currentTags.includes(tagName)) {
      currentTags.push(tagName)
    }
  } else {
    const index = currentTags.indexOf(tagName)
    if (index > -1) {
      currentTags.splice(index, 1)
    }
  }
  
  editingProduct.value.tags = currentTags.join(',')
}

const saveProductChanges = async () => {
  saving.value = true
  
  try {
    const db = await getAuthenticatedClient()
    
    let imageUrl = editingProduct.value.image_url
    
    if (editImageFile.value) {
      imageUrl = await uploadImage(editImageFile.value)
    }
    
    const { error } = await db
      .from('products')
      .update({
        name: editingProduct.value.name,
        price: parseFloat(editingProduct.value.price),
        target_url: editingProduct.value.target_url,
        image_url: imageUrl,
        brand_id: editingProduct.value.brand_id || null,
        category: editingProduct.value.category,
        tags: editingProduct.value.tags
      })
      .eq('id', editingProduct.value.id)
    
    if (error) throw error
    
    showMessage('Product updated successfully!')
    closeEditModal()
    loadProducts(currentPage.value)
  } catch (error) {
    console.error('Error updating product:', error)
    showMessage('Failed to update product: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (id) => {
  const product = products.value.find(p => p.id === id)
  if (!confirm(`Are you sure you want to remove "${product?.name || 'this product'}"?`)) return
  
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) throw error
    
    showMessage('Product removed.')
    loadProducts(currentPage.value)
  } catch (error) {
    console.error('Error deleting product:', error)
    showMessage('Failed to delete product: ' + error.message, 'error')
  }
}

// Inline edit
const startInlineEdit = (event, productId, field) => {
  const cell = event.currentTarget
  const product = products.value.find(p => p.id === productId)
  if (!product) return
  
  const currentValue = product[field]
  const input = document.createElement('input')
  input.type = field === 'price' ? 'number' : 'text'
  input.value = currentValue
  input.className = 'input w-full'
  
  cell.innerHTML = ''
  cell.appendChild(input)
  input.focus()
  input.select()
  
  const saveEdit = async () => {
    const newValue = field === 'price' ? parseFloat(input.value) : input.value
    if (newValue !== currentValue) {
      await updateProductField(productId, field, newValue)
    }
    loadProducts(currentPage.value)
  }
  
  input.addEventListener('blur', saveEdit)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur()
    } else if (e.key === 'Escape') {
      loadProducts(currentPage.value)
    }
  })
}

const updateProductField = async (productId, field, value) => {
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('products')
      .update({ [field]: value })
      .eq('id', productId)
    
    if (error) throw error
    
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product[field] = value
    }
  } catch (error) {
    console.error('Error updating field:', error)
    showMessage('Update failed: ' + error.message, 'error')
    loadProducts(currentPage.value)
  }
}

// Multi-select dropdowns
const toggleDropdown = (id, type) => {
  if (activeDropdown.value.id === id && activeDropdown.value.type === type) {
    activeDropdown.value = { id: null, type: null }
  } else {
    activeDropdown.value = { id, type }
  }
}

const isInList = (list, value) => {
  if (!list) return false
  return list.split(',').map(item => item.trim()).includes(value)
}

const updateMultiSelect = async (productId, field, value, checked) => {
  const product = products.value.find(p => p.id === productId)
  if (!product) return
  
  const currentList = product[field] ? product[field].split(',').map(item => item.trim()).filter(item => item) : []
  
  if (checked) {
    if (!currentList.includes(value)) {
      currentList.push(value)
    }
  } else {
    const index = currentList.indexOf(value)
    if (index > -1) {
      currentList.splice(index, 1)
    }
  }
  
  const newValue = currentList.join(',')
  await updateProductField(productId, field, newValue)
}

const getCategoryDisplay = (category) => {
  if (!category) return 'Select Category'
  const cats = category.split(',').map(c => c.trim()).filter(c => c)
  return cats.join(', ') || 'Select Category'
}

const getTagsDisplay = (tags) => {
  if (!tags) return 'Select Tags'
  const tagList = tags.split(',').map(t => t.trim()).filter(t => t)
  return tagList.join(', ') || 'Select Tags'
}

// Selection functions
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = products.value.map(p => p.id)
  } else {
    selectedProducts.value = []
  }
}

const toggleProductSelection = (id) => {
  const index = selectedProducts.value.indexOf(id)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(id)
  }
  selectAll.value = selectedProducts.value.length === products.value.length
}

const bulkDelete = async () => {
  if (selectedProducts.value.length === 0) return
  
  if (!confirm(`Are you sure you want to delete ${selectedProducts.value.length} products?`)) return
  
  loading.value = true
  
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('products')
      .update({ is_active: false })
      .in('id', selectedProducts.value)
    
    if (error) throw error
    
    showMessage(`${selectedProducts.value.length} products deleted`)
    selectedProducts.value = []
    selectAll.value = false
    loadProducts(currentPage.value)
  } catch (error) {
    console.error('Error bulk deleting:', error)
    showMessage('Bulk delete failed: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Import/Export
const downloadTemplate = () => {
  const template = [
    { name: 'Example Product', price: 99.99, target_url: 'https://example.com/product', image_url: 'https://example.com/image.jpg', brand: 'Example Brand', category: 'Category1,Category2', tags: 'Tag1,Tag2' }
  ]
  const worksheet = XLSX.utils.json_to_sheet(template)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
  XLSX.writeFile(workbook, 'product_template.xlsx')
}

const importProducts = () => {
  importFileInput.value.click()
}

const handleImportFile = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  loading.value = true
  
  try {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    
    if (jsonData.length === 0) {
      throw new Error('No data found in file')
    }
    
    const db = await getAuthenticatedClient()
    const { count } = await db.from('products').select('*', { count: 'exact', head: true })
    let currentOrder = count || 0
    
    const productsToInsert = []
    
    for (const row of jsonData) {
      if (!row.name || !row.price || !row.target_url) continue
      
      // Find brand ID
      let brandId = null
      if (row.brand) {
        const brand = brands.value.find(b => b.name === row.brand)
        if (brand) brandId = brand.id
      }
      
      productsToInsert.push({
        name: row.name,
        price: parseFloat(row.price),
        target_url: row.target_url,
        image_url: row.image_url || null,
        brand_id: brandId,
        category: row.category || null,
        tags: row.tags || null,
        display_order: currentOrder++,
        is_active: true
      })
    }
    
    if (productsToInsert.length === 0) {
      throw new Error('No valid products found in file')
    }
    
    const { error } = await db.from('products').insert(productsToInsert)
    
    if (error) throw error
    
    showMessage(`Successfully imported ${productsToInsert.length} products!`)
    loadProducts(currentPage.value)
  } catch (error) {
    console.error('Error importing:', error)
    showMessage('Import failed: ' + error.message, 'error')
  } finally {
    loading.value = false
    event.target.value = ''
  }
}

const exportProducts = async () => {
  loading.value = true
  
  try {
    const db = await getAuthenticatedClient()
    const { data, error } = await db
      .from('products')
      .select('*, brands(name)')
      .eq('is_active', true)
      .order('display_order')
    
    if (error) throw error
    
    const exportData = (data || []).map(p => ({
      name: p.name,
      price: p.price,
      target_url: p.target_url,
      image_url: p.image_url,
      brand: p.brands?.name || '',
      category: p.category || '',
      tags: p.tags || ''
    }))
    
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
    XLSX.writeFile(workbook, `products_export_${new Date().toISOString().slice(0, 10)}.xlsx`)
    
    showMessage('Products exported successfully!')
  } catch (error) {
    console.error('Error exporting:', error)
    showMessage('Export failed: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.custom-dropdown')) {
    activeDropdown.value = { id: null, type: null }
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await Promise.all([
    loadBrands(),
    loadCategories(),
    loadTags()
  ])
  await loadProducts(1)
  addProductFormRow()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (sortableInstance) {
    sortableInstance.destroy()
  }
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

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-card);
  border-color: #555;
}

.btn-secondary.active {
  background-color: var(--accent-red);
  border-color: var(--accent-red);
}

.editable-cell {
  cursor: pointer;
}

.editable-cell:hover {
  background-color: var(--bg-card);
}

.custom-dropdown {
  position: relative;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  margin-top: 0.5rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  min-width: 200px;
  max-width: 300px;
}

.dropdown-menu.active {
  display: block;
}

.dropdown-item {
  transition: background-color 0.2s ease;
}

.sortable-ghost {
  opacity: 0.4;
  background-color: var(--bg-card);
}

table {
  border-collapse: collapse;
}

table thead {
  background-color: var(--bg-surface);
  color: var(--text-secondary);
}

table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s ease;
}

table tbody tr:last-child {
  border-bottom: none;
}

table tbody tr:hover {
  background-color: var(--bg-card);
}

.add-form-row {
  background-color: var(--bg-main);
}

.add-form-row:hover {
  border-color: #444;
}

.remove-form-row-btn {
  transition: all 0.2s ease;
}

.remove-form-row-btn:hover {
  transform: scale(1.1);
}

.add-image-box {
  transition: all 0.2s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-image-box:hover {
  border-color: var(--accent-red);
  background-color: rgba(239, 68, 68, 0.05);
}
</style>
