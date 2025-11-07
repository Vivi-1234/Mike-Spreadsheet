<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="page-header">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <div>
            <h2 class="text-2xl font-bold text-text-primary">Product Management</h2>
          </div>
          
          <!-- Stats Card Inline -->
          <div class="stat-card-inline">
            <div class="stat-icon-small">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div class="stat-text-horizontal">
              <span class="stat-label-inline">Total</span>
              <span class="stat-value-inline">{{ totalProducts }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <button @click="openAddProductModal" class="btn btn-primary btn-compact">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span class="ml-2">Add Product</span>
          </button>
          <button @click="downloadTemplate" class="btn btn-secondary btn-compact">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span class="ml-2">Template</span>
          </button>
          <button @click="importProducts" class="btn btn-secondary btn-compact">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span class="ml-2">Import</span>
          </button>
          <button @click="exportProducts" class="btn btn-secondary btn-compact">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span class="ml-2">Export</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddProductModal" class="modal-overlay" @click.self="closeAddProductModal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="flex items-center gap-3">
            <div class="modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Add New Product</h3>
            </div>
          </div>
          <button @click="closeAddProductModal" class="modal-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-grid">
            <!-- Basic Information -->
            <div class="form-section">
              <h4 class="section-title">Basic Information</h4>
              
              <div class="form-group">
                <label class="form-label">Product Name <span class="required">*</span></label>
                <input 
                  v-model="newProduct.name" 
                  class="input" 
                  placeholder="Enter product name"
                >
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Price (¥) <span class="required">*</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    v-model="newProduct.price" 
                    class="input input-number" 
                    placeholder="0.00"
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label">Brand</label>
                  <div class="custom-dropdown" @click="toggleBrandDropdown" ref="brandDropdownRef">
                    <div class="dropdown-selected">
                      <span :class="{ 'placeholder': !selectedBrandName }">
                        {{ selectedBrandName || '-- Select Brand --' }}
                      </span>
                      <svg 
                        class="dropdown-arrow" 
                        :class="{ 'open': isBrandDropdownOpen }"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    <transition name="dropdown">
                      <div v-if="isBrandDropdownOpen" class="dropdown-menu">
                        <div class="dropdown-search">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                          <input 
                            v-model="brandSearchQuery"
                            type="text" 
                            placeholder="Search brands..."
                            @click.stop
                          >
                        </div>
                        <div class="dropdown-options">
                          <div 
                            class="dropdown-option"
                            :class="{ 'selected': !newProduct.brand_id }"
                            @click.stop="selectBrand('')"
                          >
                            <span>-- Select Brand --</span>
                            <svg v-if="!newProduct.brand_id" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <div 
                            v-for="brand in filteredBrands" 
                            :key="brand.id"
                            class="dropdown-option"
                            :class="{ 'selected': newProduct.brand_id === brand.id }"
                            @click.stop="selectBrand(brand.id)"
                          >
                            <span>{{ brand.name }}</span>
                            <svg v-if="newProduct.brand_id === brand.id" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <div v-if="filteredBrands.length === 0" class="dropdown-empty">
                            No brands found
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Target URL <span class="required">*</span></label>
                <input 
                  v-model="newProduct.target_url" 
                  class="input"
                >
              </div>
            </div>
            
            <!-- Categories & Tags -->
            <div class="form-section">
              <h4 class="section-title">Categories & Tags</h4>
              
              <div class="form-group">
                <label class="form-label">Categories</label>
                <div class="checkbox-grid">
                  <div 
                    v-for="cat in categories" 
                    :key="cat.link_text"
                    class="checkbox-item"
                    @click="toggleCategory(cat.link_text)"
                  >
                    <input 
                      type="checkbox" 
                      :checked="newProduct.selectedCategories.includes(cat.link_text)"
                      class="checkbox-input"
                      @click.stop="toggleCategory(cat.link_text)"
                    >
                    <span class="checkbox-label">{{ cat.link_text }}</span>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Tags</label>
                <div class="checkbox-grid">
                  <div 
                    v-for="tag in tags" 
                    :key="tag.name"
                    class="checkbox-item"
                    @click="toggleTag(tag.name)"
                  >
                    <input 
                      type="checkbox" 
                      :checked="newProduct.selectedTags.includes(tag.name)"
                      class="checkbox-input"
                      @click.stop="toggleTag(tag.name)"
                    >
                    <span class="checkbox-label">{{ tag.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Product Image -->
            <div class="form-section full-width">
              <h4 class="section-title">Product Image</h4>
              
              <div class="image-upload-area">
                <input 
                  ref="newProductImageInput"
                  type="file" 
                  class="hidden" 
                  accept="image/*"
                  @change="handleNewProductImageUpload"
                >
                
                      <div v-if="newProduct.imagePreview || newProduct.image_url" class="product-preview-card">
                        <div class="product-preview-wrapper">
                          <img 
                            :src="newProduct.imagePreview || newProduct.image_url" 
                            class="product-preview-image"
                          >
                        </div>
                        <div class="product-preview-info">
                          <h4 class="product-preview-title">{{ newProduct.name || 'Product Name' }}</h4>
                          <p class="product-preview-price">${{ newProduct.price ? (newProduct.price * 0.156).toFixed(2) : '0.00' }}</p>
                        </div>
                        <button 
                          @click="removeNewProductImage" 
                          class="image-remove-btn"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                
                <div v-else class="upload-placeholder" @click="$refs.newProductImageInput.click()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p class="upload-text">Click to upload product image</p>
                  <p class="upload-hint">PNG, JPG, GIF up to 10MB</p>
                </div>
                
                <div class="mt-3 flex gap-2">
                  <input 
                    v-model="newProduct.image_url" 
                    class="input flex-1" 
                    placeholder="Or enter image URL"
                  >
                  <button 
                    @click="$refs.newProductImageInput.click()"
                    class="btn btn-secondary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeAddProductModal" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="submitNewProduct" class="btn btn-primary" :disabled="saving">
            <svg v-if="!saving" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span v-if="saving" class="mr-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ saving ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Existing Products -->
    <div class="panel">
      <div class="p-6 border-b border-border-color">
        <div class="flex justify-between items-center gap-4" style="position: relative; overflow: visible;">
          <h3 class="font-semibold text-lg flex-shrink-0">Existing Products</h3>
          
          <!-- Filters -->
          <div class="filters-container flex-1">
          <div class="filter-group">
            <div class="filter-dropdown" @click="toggleFilterDropdown('brand')" ref="brandFilterRef">
              <div class="filter-selected">
                <span :class="{ 'placeholder': !selectedBrandFilter }">
                  {{ selectedBrandFilter ? getBrandName(selectedBrandFilter) : 'All Brands' }}
                </span>
                <svg 
                  class="filter-arrow" 
                  :class="{ 'open': activeFilter === 'brand' }"
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <transition name="dropdown">
                <div v-if="activeFilter === 'brand'" class="filter-menu">
                  <div class="filter-options">
                    <div 
                      class="filter-option"
                      :class="{ 'selected': !selectedBrandFilter }"
                      @click.stop="selectFilter('brand', null)"
                    >
                      <span>All Brands</span>
                      <svg v-if="!selectedBrandFilter" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div 
                      v-for="brand in brands" 
                      :key="brand.id"
                      class="filter-option"
                      :class="{ 'selected': selectedBrandFilter === brand.id }"
                      @click.stop="selectFilter('brand', brand.id)"
                    >
                      <span>{{ brand.name }}</span>
                      <svg v-if="selectedBrandFilter === brand.id" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-dropdown" @click="toggleFilterDropdown('category')" ref="categoryFilterRef">
              <div class="filter-selected">
                <span :class="{ 'placeholder': !selectedCategoryFilter }">
                  {{ selectedCategoryFilter || 'All Categories' }}
                </span>
                <svg 
                  class="filter-arrow" 
                  :class="{ 'open': activeFilter === 'category' }"
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <transition name="dropdown">
                <div v-if="activeFilter === 'category'" class="filter-menu">
                  <div class="filter-options">
                    <div 
                      class="filter-option"
                      :class="{ 'selected': !selectedCategoryFilter }"
                      @click.stop="selectFilter('category', null)"
                    >
                      <span>All Categories</span>
                      <svg v-if="!selectedCategoryFilter" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div 
                      v-for="cat in categories" 
                      :key="cat.link_text"
                      class="filter-option"
                      :class="{ 'selected': selectedCategoryFilter === cat.link_text }"
                      @click.stop="selectFilter('category', cat.link_text)"
                    >
                      <span>{{ cat.link_text }}</span>
                      <svg v-if="selectedCategoryFilter === cat.link_text" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-dropdown" @click="toggleFilterDropdown('tag')" ref="tagFilterRef">
              <div class="filter-selected">
                <span :class="{ 'placeholder': !selectedTagFilter }">
                  {{ selectedTagFilter || 'All Tags' }}
                </span>
                <svg 
                  class="filter-arrow" 
                  :class="{ 'open': activeFilter === 'tag' }"
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <transition name="dropdown">
                <div v-if="activeFilter === 'tag'" class="filter-menu">
                  <div class="filter-options">
                    <div 
                      class="filter-option"
                      :class="{ 'selected': !selectedTagFilter }"
                      @click.stop="selectFilter('tag', null)"
                    >
                      <span>All Tags</span>
                      <svg v-if="!selectedTagFilter" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div 
                      v-for="tag in tags" 
                      :key="tag.name"
                      class="filter-option"
                      :class="{ 'selected': selectedTagFilter === tag.name }"
                      @click.stop="selectFilter('tag', tag.name)"
                    >
                      <span>{{ tag.name }}</span>
                      <svg v-if="selectedTagFilter === tag.name" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          
          <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-filters-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Clear
          </button>
          </div>
          
          <div class="w-64 flex-shrink-0">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            class="input" 
            placeholder="Search by name..."
          >
        </div>
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
      
      <div class="table-container">
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
                <div class="table-dropdown">
                  <button 
                    @click="toggleDropdown(product.id, 'brand')"
                    class="table-dropdown-btn"
                  >
                    <span class="table-dropdown-text">{{ product.brands?.name || 'None' }}</span>
                    <svg class="table-dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div 
                    v-if="activeDropdown.id === product.id && activeDropdown.type === 'brand'"
                    class="table-dropdown-menu"
                  >
                    <div class="table-dropdown-options">
                      <div 
                        class="table-dropdown-option"
                        :class="{ 'selected': !product.brand_id }"
                        @click="updateProductField(product.id, 'brand_id', null)"
                      >
                        <span>None</span>
                        <svg v-if="!product.brand_id" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div 
                        v-for="brand in brands" 
                        :key="brand.id"
                        class="table-dropdown-option"
                        :class="{ 'selected': product.brand_id === brand.id }"
                        @click="updateProductField(product.id, 'brand_id', brand.id)"
                      >
                        <span>{{ brand.name }}</span>
                        <svg v-if="product.brand_id === brand.id" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <div class="table-dropdown">
                  <button 
                    @click="toggleDropdown(product.id, 'category')"
                    class="table-dropdown-btn"
                  >
                    <span class="table-dropdown-text">{{ getCategoryDisplay(product.category) }}</span>
                    <svg class="table-dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div 
                    v-if="activeDropdown.id === product.id && activeDropdown.type === 'category'"
                    class="table-dropdown-menu"
                  >
                    <div class="table-dropdown-options">
                      <label 
                        v-for="cat in categories" 
                        :key="cat.link_text"
                        class="table-dropdown-option"
                        :class="{ 'selected': isInList(product.category, cat.link_text) }"
                        @click.stop="updateMultiSelect(product.id, 'category', cat.link_text, !isInList(product.category, cat.link_text))"
                      >
                        <input 
                          type="checkbox" 
                          :checked="isInList(product.category, cat.link_text)"
                          class="table-dropdown-checkbox"
                          style="pointer-events: none;"
                        >
                        <span>{{ cat.link_text }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <div class="table-dropdown">
                  <button 
                    @click="toggleDropdown(product.id, 'tags')"
                    class="table-dropdown-btn"
                  >
                    <span class="table-dropdown-text">{{ getTagsDisplay(product.tags) }}</span>
                    <svg class="table-dropdown-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div 
                    v-if="activeDropdown.id === product.id && activeDropdown.type === 'tags'"
                    class="table-dropdown-menu"
                  >
                    <div class="table-dropdown-options">
                      <label 
                        v-for="tag in tags" 
                        :key="tag.name"
                        class="table-dropdown-option"
                        :class="{ 'selected': isInList(product.tags, tag.name) }"
                        @click.stop="updateMultiSelect(product.id, 'tags', tag.name, !isInList(product.tags, tag.name))"
                      >
                        <input 
                          type="checkbox" 
                          :checked="isInList(product.tags, tag.name)"
                          class="table-dropdown-checkbox"
                          style="pointer-events: none;"
                        >
                        <span>{{ tag.name }}</span>
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
    <div v-if="editingProduct" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="flex items-center gap-3">
            <div class="modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Edit Product</h3>
            </div>
          </div>
          <button @click="closeEditModal" class="modal-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        
        <div class="modal-body">
          <div class="form-grid">
            <!-- Left Column: Basic Information -->
            <div class="form-section">
              <h4 class="section-title">Basic Information</h4>
              
              <div class="form-group">
                <label class="form-label">Product Name <span class="required">*</span></label>
                <input v-model="editingProduct.name" class="input" placeholder="Enter product name">
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Price (¥) <span class="required">*</span></label>
                  <input type="number" step="0.01" v-model="editingProduct.price" class="input input-number" placeholder="0.00">
                </div>
                
                <div class="form-group">
                  <label class="form-label">Brand</label>
                  <div class="custom-dropdown" @click="toggleEditBrandDropdown" ref="editBrandDropdownRef">
                    <div class="dropdown-selected">
                      <span :class="{ 'placeholder': !editingProduct.brand_id }">
                        {{ editingProduct.brand_id ? getBrandName(editingProduct.brand_id) : '-- No Brand --' }}
                      </span>
                      <svg 
                        class="dropdown-arrow" 
                        :class="{ 'open': isEditBrandDropdownOpen }"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    <transition name="dropdown">
                      <div v-if="isEditBrandDropdownOpen" class="dropdown-menu">
                        <div class="dropdown-search">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                          <input 
                            v-model="editBrandSearchQuery"
                            type="text" 
                            placeholder="Search brands..."
                            @click.stop
                          >
                        </div>
                        <div class="dropdown-options">
                          <div 
                            class="dropdown-option"
                            :class="{ 'selected': !editingProduct.brand_id }"
                            @click.stop="selectEditBrand('')"
                          >
                            <span>-- No Brand --</span>
                            <svg v-if="!editingProduct.brand_id" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <div 
                            v-for="brand in filteredEditBrands" 
                            :key="brand.id"
                            class="dropdown-option"
                            :class="{ 'selected': editingProduct.brand_id === brand.id }"
                            @click.stop="selectEditBrand(brand.id)"
                          >
                            <span>{{ brand.name }}</span>
                            <svg v-if="editingProduct.brand_id === brand.id" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Target URL <span class="required">*</span></label>
                <input v-model="editingProduct.target_url" class="input">
              </div>
            </div>
            
            <!-- Right Column: Categories & Tags -->
            <div class="form-section">
              <h4 class="section-title">Categories & Tags</h4>
              
              <div class="form-group">
                <label class="form-label">Categories</label>
                <div class="checkbox-grid">
                  <div 
                    v-for="cat in categories" 
                    :key="cat.link_text"
                    class="checkbox-item"
                    @click="toggleEditCategory(cat.link_text)"
                  >
                    <input 
                      type="checkbox" 
                      :checked="isInList(editingProduct.category, cat.link_text)"
                      class="checkbox-input"
                      @click.stop="toggleEditCategory(cat.link_text)"
                    >
                    <span class="checkbox-label">{{ cat.link_text }}</span>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Tags</label>
                <div class="checkbox-grid">
                  <div 
                    v-for="tag in tags" 
                    :key="tag.name"
                    class="checkbox-item"
                    @click="toggleEditTag(tag.name, !isInList(editingProduct.tags, tag.name))"
                  >
                    <input 
                      type="checkbox" 
                      :checked="isInList(editingProduct.tags, tag.name)"
                      class="checkbox-input"
                      @click.stop="toggleEditTag(tag.name, !isInList(editingProduct.tags, tag.name))"
                    >
                    <span class="checkbox-label">{{ tag.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Product Image -->
            <div class="form-section full-width">
              <h4 class="section-title">Product Image</h4>
              
              <div class="image-upload-area">
                <input type="file" accept="image/*" class="hidden" @change="handleEditImageUpload" ref="editImageInput">
                
                <div v-if="editImagePreview || editingProduct.image_url" class="product-preview-card">
                  <div class="product-preview-wrapper">
                    <img :src="editImagePreview || editingProduct.image_url" class="product-preview-image">
                  </div>
                  <div class="product-preview-info">
                    <h4 class="product-preview-title">{{ editingProduct.name || 'Product Name' }}</h4>
                    <p class="product-preview-price">${{ editingProduct.price ? (editingProduct.price * 0.156).toFixed(2) : '0.00' }}</p>
                  </div>
                  <button 
                    @click="editImageFile = null; editImagePreview = ''; editingProduct.image_url = ''"
                    class="image-remove-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
                
                <div v-else class="upload-placeholder" @click="$refs.editImageInput.click()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p class="upload-text">Click to upload product image</p>
                  <p class="upload-hint">PNG, JPG, GIF up to 10MB</p>
                </div>
                
                <div class="mt-3 flex gap-2">
                  <input v-model="editingProduct.image_url" class="input flex-1" placeholder="Or enter image URL" @input="editImageFile = null">
                  <button @click="$refs.editImageInput.click()" class="btn btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div class="modal-footer">
          <button @click="closeEditModal" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="saveProductChanges" class="btn btn-primary" :disabled="saving">
            <svg v-if="!saving" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span v-if="saving" class="mr-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
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
const showAddProductModal = ref(false)
const newProduct = ref({
  name: '',
  price: '',
  target_url: '',
  image_url: '',
  imageFile: null,
  imagePreview: '',
  brand_id: '',
  selectedCategories: [],
  selectedTags: []
})
const newProductImageInput = ref(null)
const brandDropdownRef = ref(null)
const isBrandDropdownOpen = ref(false)
const brandSearchQuery = ref('')
const editingProduct = ref(null)
const brandFilterRef = ref(null)
const categoryFilterRef = ref(null)
const tagFilterRef = ref(null)
const selectedBrandFilter = ref(null)
const selectedCategoryFilter = ref(null)
const selectedTagFilter = ref(null)
const activeFilter = ref(null)
const editImageFile = ref(null)
const editImagePreview = ref('')
const editImageInput = ref(null)
const editBrandDropdownRef = ref(null)
const isEditBrandDropdownOpen = ref(false)
const editBrandSearchQuery = ref('')
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

let sortableInstance = null
let searchTimeout = null

// Computed
const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize))

// Custom dropdown computed properties
const selectedBrandName = computed(() => {
  if (!newProduct.value.brand_id) return ''
  const brand = brands.value.find(b => b.id === newProduct.value.brand_id)
  return brand ? brand.name : ''
})

const filteredBrands = computed(() => {
  if (!brandSearchQuery.value.trim()) return brands.value
  const query = brandSearchQuery.value.toLowerCase()
  return brands.value.filter(brand => 
    brand.name.toLowerCase().includes(query)
  )
})

const filteredEditBrands = computed(() => {
  if (!editBrandSearchQuery.value.trim()) return brands.value
  const query = editBrandSearchQuery.value.toLowerCase()
  return brands.value.filter(brand => 
    brand.name.toLowerCase().includes(query)
  )
})

// Filter computed properties
const hasActiveFilters = computed(() => {
  return selectedBrandFilter.value !== null || 
         selectedCategoryFilter.value !== null || 
         selectedTagFilter.value !== null
})

const getBrandName = (brandId) => {
  const brand = brands.value.find(b => b.id === brandId)
  return brand ? brand.name : 'Unknown'
}

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
    
    // Apply search filter
    if (searchQuery.value) {
      query = query.ilike('name', `%${searchQuery.value}%`)
    }
    
    // Apply brand filter
    if (selectedBrandFilter.value) {
      query = query.eq('brand_id', selectedBrandFilter.value)
    }
    
    // Apply category filter
    if (selectedCategoryFilter.value) {
      query = query.ilike('category', `%${selectedCategoryFilter.value}%`)
    }
    
    // Apply tag filter
    if (selectedTagFilter.value) {
      query = query.ilike('tags', `%${selectedTagFilter.value}%`)
    }
    
    const { data, error, count } = await query
      .order('display_order')
      .range(from, to)
    
    if (error) throw error
    
    products.value = data || []
    totalProducts.value = count || 0
    
    // Reinitialize sortable after products load
    await nextTick()
    setTimeout(() => {
      initSortable()
    }, 100)
  } catch (error) {
    console.error('Error loading products:', error)
    showMessage('Failed to load products', 'error')
  } finally {
    loading.value = false
  }
}

const initSortable = () => {
  try {
    if (sortableInstance) {
      sortableInstance.destroy()
      sortableInstance = null
    }
    
    if (productTableBody.value && products.value.length > 0) {
      sortableInstance = new Sortable(productTableBody.value, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        onEnd: saveProductOrder
      })
    }
  } catch (error) {
    console.error('Error initializing sortable:', error)
  }
}

const saveProductOrder = async (evt) => {
  const { oldIndex, newIndex } = evt
  
  // If no movement, do nothing
  if (oldIndex === newIndex) {
    return
  }
  
  try {
    // Update the local products array to reflect the new order
    const movedProduct = products.value.splice(oldIndex, 1)[0]
    products.value.splice(newIndex, 0, movedProduct)
    
    // Calculate the affected range
    const startIndex = Math.min(oldIndex, newIndex)
    const endIndex = Math.max(oldIndex, newIndex)
    
    const db = await getAuthenticatedClient()
    
    // Only update the products that were affected by the move
    const updatePromises = []
    for (let i = startIndex; i <= endIndex; i++) {
      const product = products.value[i]
      const newOrder = i + ((currentPage.value - 1) * pageSize)
      
      updatePromises.push(
        db.from('products')
          .update({ display_order: newOrder })
          .eq('id', product.id)
      )
    }
    
    await Promise.all(updatePromises)
    showMessage('Order saved!')
  } catch (error) {
    console.error('Error saving order:', error)
    showMessage('Reorder failed: ' + error.message, 'error')
    // Reload to restore correct order
    await loadProducts(currentPage.value)
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
// Add Product Modal Functions
const openAddProductModal = () => {
  showAddProductModal.value = true
}

const closeAddProductModal = () => {
  showAddProductModal.value = false
  // Reset form
  newProduct.value = {
    name: '',
    price: '',
    target_url: '',
    image_url: '',
    imageFile: null,
    imagePreview: '',
    brand_id: '',
    selectedCategories: [],
    selectedTags: []
  }
  // Reset dropdown state
  isBrandDropdownOpen.value = false
  brandSearchQuery.value = ''
}

// Custom dropdown methods
const toggleBrandDropdown = (event) => {
  event.stopPropagation()
  isBrandDropdownOpen.value = !isBrandDropdownOpen.value
  if (!isBrandDropdownOpen.value) {
    brandSearchQuery.value = ''
  }
}

const selectBrand = (brandId) => {
  newProduct.value.brand_id = brandId
  isBrandDropdownOpen.value = false
  brandSearchQuery.value = ''
}

// Toggle category and tag selection
const toggleCategory = (categoryName) => {
  const index = newProduct.value.selectedCategories.indexOf(categoryName)
  if (index > -1) {
    newProduct.value.selectedCategories.splice(index, 1)
  } else {
    newProduct.value.selectedCategories.push(categoryName)
  }
}

const toggleTag = (tagName) => {
  const index = newProduct.value.selectedTags.indexOf(tagName)
  if (index > -1) {
    newProduct.value.selectedTags.splice(index, 1)
  } else {
    newProduct.value.selectedTags.push(tagName)
  }
}

// Filter dropdown functions
const toggleFilterDropdown = (filterType) => {
  if (activeFilter.value === filterType) {
    activeFilter.value = null
  } else {
    activeFilter.value = filterType
  }
}

const selectFilter = (filterType, value) => {
  if (filterType === 'brand') {
    selectedBrandFilter.value = value
  } else if (filterType === 'category') {
    selectedCategoryFilter.value = value
  } else if (filterType === 'tag') {
    selectedTagFilter.value = value
  }
  
  activeFilter.value = null
  loadProducts(1) // Reset to page 1 when filter changes
}

const clearAllFilters = () => {
  selectedBrandFilter.value = null
  selectedCategoryFilter.value = null
  selectedTagFilter.value = null
  loadProducts(1)
}

const handleNewProductImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    newProduct.value.imageFile = file
    newProduct.value.imagePreview = URL.createObjectURL(file)
    newProduct.value.image_url = ''
  }
}

const removeNewProductImage = () => {
  newProduct.value.imageFile = null
  newProduct.value.imagePreview = ''
  newProduct.value.image_url = ''
  if (newProductImageInput.value) {
    newProductImageInput.value.value = ''
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

const submitNewProduct = async () => {
  // Validate
  if (!newProduct.value.name || !newProduct.value.price || !newProduct.value.target_url) {
    showMessage('Please fill in required fields (Name, Price, URL)', 'error')
    return
  }
  
  saving.value = true
  
  try {
    const db = await getAuthenticatedClient()
    
    // Get the minimum display_order to insert new product at the top
    const { data: minData } = await db
      .from('products')
      .select('display_order')
      .order('display_order', { ascending: true })
      .limit(1)
    
    const minOrder = minData && minData.length > 0 ? minData[0].display_order : 0
    const newDisplayOrder = minOrder - 1  // Place new product before the current first one
    
    let imageUrl = newProduct.value.image_url
    
    if (newProduct.value.imageFile) {
      imageUrl = await uploadImage(newProduct.value.imageFile)
    }
    
    // Prepare product data - new product gets the lowest display_order (top of list)
    const productData = {
      name: newProduct.value.name,
      price: parseFloat(newProduct.value.price),
      target_url: newProduct.value.target_url,
      image_url: imageUrl,
      brand_id: newProduct.value.brand_id || null,
      category: newProduct.value.selectedCategories.join(','),
      tags: newProduct.value.selectedTags.join(','),
      display_order: newDisplayOrder,
      is_active: true
    }
    
    const { error } = await db.from('products').insert([productData])
    
    if (error) throw error
    
    showMessage('Product added successfully!')
    closeAddProductModal()
    // Wait for modal to close before reloading products
    // Always go to first page to see the new product at the top
    await nextTick()
    setTimeout(() => {
      loadProducts(1)
    }, 300)
  } catch (error) {
    console.error('Error adding product:', error)
    showMessage('Failed to add product: ' + error.message, 'error')
  } finally {
    saving.value = false
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
  isEditBrandDropdownOpen.value = false
  editBrandSearchQuery.value = ''
}

const handleEditImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    editImageFile.value = file
    editImagePreview.value = URL.createObjectURL(file)
    editingProduct.value.image_url = ''
  }
}

// Edit modal dropdown functions
const toggleEditBrandDropdown = (event) => {
  event.stopPropagation()
  isEditBrandDropdownOpen.value = !isEditBrandDropdownOpen.value
  if (!isEditBrandDropdownOpen.value) {
    editBrandSearchQuery.value = ''
  }
}

const selectEditBrand = (brandId) => {
  editingProduct.value.brand_id = brandId
  isEditBrandDropdownOpen.value = false
  editBrandSearchQuery.value = ''
}

const toggleEditCategory = (categoryName) => {
  const currentCategories = editingProduct.value.category ? editingProduct.value.category.split(',').map(c => c.trim()).filter(c => c) : []
  const index = currentCategories.indexOf(categoryName)
  
  if (index > -1) {
    currentCategories.splice(index, 1)
  } else {
    currentCategories.push(categoryName)
  }
  
  editingProduct.value.category = currentCategories.join(',')
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
      
      // 如果更新的是 brand_id，同时更新关联的 brands 对象
      if (field === 'brand_id') {
        if (value) {
          const brand = brands.value.find(b => b.id === value)
          product.brands = brand || null
          showMessage('Brand updated successfully', 'success')
        } else {
          product.brands = null
          showMessage('Brand removed successfully', 'success')
        }
        // 关闭下拉菜单
        activeDropdown.value = { id: null, type: null }
      }
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
  
  try {
    const db = await getAuthenticatedClient()
    const { error } = await db
      .from('products')
      .update({ [field]: newValue })
      .eq('id', productId)
    
    if (error) throw error
    
    // 更新本地数据
    product[field] = newValue
    
    const fieldName = field === 'category' ? 'Category' : 'Tags'
    showMessage(`${fieldName} updated successfully`, 'success')
  } catch (error) {
    console.error('Error updating field:', error)
    showMessage('Update failed: ' + error.message, 'error')
    loadProducts(currentPage.value)
  }
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
  // Handle brand dropdown in add product modal
  if (brandDropdownRef.value && !brandDropdownRef.value.contains(event.target)) {
    isBrandDropdownOpen.value = false
    brandSearchQuery.value = ''
  }
  
  // Handle brand dropdown in edit product modal
  if (editBrandDropdownRef.value && !editBrandDropdownRef.value.contains(event.target)) {
    isEditBrandDropdownOpen.value = false
    editBrandSearchQuery.value = ''
  }
  
  // Handle filter dropdowns
  const clickedOnFilterDropdown = event.target.closest('.filter-dropdown')
  if (!clickedOnFilterDropdown && activeFilter.value) {
    activeFilter.value = null
  }
  
  // Handle other dropdowns (table dropdowns and custom dropdowns)
  if (!event.target.closest('.custom-dropdown') && !event.target.closest('.table-dropdown')) {
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
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (sortableInstance) {
    sortableInstance.destroy()
  }
})
</script>

<style scoped>
/* === Page Header === */
.page-header {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* === Stats Card Inline === */
.stat-card-inline {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.625rem;
  transition: all 0.2s ease;
  height: 2.375rem; /* Match button height */
}

.stat-card-inline:hover {
  border-color: var(--accent-red);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon-small {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 0.375rem;
  color: var(--accent-red);
}

.stat-text-horizontal {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-label-inline {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value-inline {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* === Panel === */
.panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: visible;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.panel > div:first-child {
  overflow: visible;
}

/* === Filters === */
.filters-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-group {
  min-width: 150px;
  flex-shrink: 0;
  position: relative;
}

.filter-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-dropdown {
  position: relative;
  cursor: pointer;
}

.filter-selected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.8125rem;
  gap: 0.5rem;
  white-space: nowrap;
}

.filter-selected:hover {
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.filter-selected .placeholder {
  color: var(--text-secondary);
}

.filter-arrow {
  flex-shrink: 0;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.filter-arrow.open {
  transform: rotate(180deg);
  color: var(--accent-red);
}

.filter-selected:hover .filter-arrow {
  color: var(--accent-red);
}

.filter-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 200px;
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  overflow: hidden;
}

.filter-options {
  max-height: 280px;
  overflow-y: auto;
}

.filter-options::-webkit-scrollbar {
  width: 6px;
}

.filter-options::-webkit-scrollbar-track {
  background: rgba(20, 20, 25, 0.4);
}

.filter-options::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.5);
  border-radius: 3px;
}

.filter-options::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.7);
}

.filter-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.filter-option:hover {
  background: rgba(239, 68, 68, 0.1);
}

.filter-option.selected {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
  color: var(--accent-red);
  font-weight: 600;
}

.filter-option svg {
  color: var(--accent-red);
  flex-shrink: 0;
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1.5px solid var(--accent-red);
  border-radius: 0.5rem;
  color: var(--accent-red);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.clear-filters-btn:hover {
  background: var(--accent-red);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.clear-filters-btn svg {
  width: 14px;
  height: 14px;
}

/* === Product Table === */
.table-container {
  overflow-x: auto;
  overflow-y: visible;
}

table {
  position: relative;
}

table tbody {
  position: relative;
  overflow: visible;
}

table tbody tr {
  position: relative;
  overflow: visible;
}

.product-row {
  transition: all 0.2s ease;
}

.product-row:hover {
  background: rgba(239, 68, 68, 0.05) !important;
}

.product-row td {
  vertical-align: middle;
  position: relative;
  overflow: visible;
}

.product-row img {
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease;
}

.product-row img:hover {
  transform: scale(2.5);
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  border-color: var(--accent-red);
}

/* === Table Dropdowns === */
.table-dropdown {
  position: relative;
}

.table-dropdown-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 36px;
}

.table-dropdown-btn:hover {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(30, 30, 35, 0.8);
}

.table-dropdown-text {
  flex: 1;
  text-align: left;
  font-size: 0.8125rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-dropdown-arrow {
  flex-shrink: 0;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.table-dropdown-btn:hover .table-dropdown-arrow {
  color: var(--accent-red);
}

.table-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  min-width: 180px;
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 100;
  overflow: hidden;
}

.table-dropdown-options {
  max-height: 240px;
  overflow-y: auto;
}

.table-dropdown-options::-webkit-scrollbar {
  width: 5px;
}

.table-dropdown-options::-webkit-scrollbar-track {
  background: rgba(20, 20, 25, 0.4);
}

.table-dropdown-options::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.5);
  border-radius: 3px;
}

.table-dropdown-options::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.7);
}

.table-dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-primary);
  font-size: 0.8125rem;
}

.table-dropdown-option:hover {
  background: rgba(239, 68, 68, 0.1);
}

.table-dropdown-option.selected {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
  color: var(--accent-red);
  font-weight: 600;
}

.table-dropdown-option svg {
  color: var(--accent-red);
  flex-shrink: 0;
}

.table-dropdown-option span {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-dropdown-checkbox {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  accent-color: var(--accent-red);
  flex-shrink: 0;
}

.label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: block;
}

/* === Inputs === */
.input {
  width: 100%;
  border: 1.5px solid var(--border-color);
  border-radius: 0.625rem;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.input:focus {
  outline: none;
  border-color: var(--accent-red);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input:hover:not(:focus) {
  border-color: rgba(255, 255, 255, 0.2);
}

/* === Buttons === */
.btn, .btn-icon {
  padding: 0.75rem 1.25rem;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn-icon {
  padding: 0.625rem;
}

.btn-xs {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
}

.btn-compact {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn:disabled {
  background-color: rgba(50, 50, 50, 0.5) !important;
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary {
  background-color: var(--accent-red);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-red-hover);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
}

.btn-secondary {
  background-color: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-surface);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-secondary.active {
  background-color: var(--accent-red);
  border-color: var(--accent-red);
  color: white;
}

/* === Table === */
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

table thead {
  background-color: var(--bg-card);
  color: var(--text-secondary);
  position: sticky;
  top: 0;
  z-index: 10;
}

table thead th {
  padding: 1rem;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid var(--border-color);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

table tbody tr:last-child {
  border-bottom: none;
}

table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

table tbody td {
  padding: 1rem;
  vertical-align: middle;
  position: relative;
  overflow: visible;
}

/* === Editable Cells === */
.editable-cell {
  cursor: pointer;
  position: relative;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.editable-cell:hover {
  background-color: rgba(239, 68, 68, 0.05);
}

/* === Sortable === */
.sortable-ghost {
  opacity: 0.5;
  background-color: rgba(239, 68, 68, 0.1);
  border: 2px dashed var(--accent-red);
}

.drag-handle {
  cursor: grab;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.drag-handle:hover {
  color: var(--accent-red);
}

.drag-handle:active {
  cursor: grabbing;
}

/* === Add Product Form === */
.add-form-row {
  background-color: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
  position: relative;
}

.add-form-row:hover {
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.remove-form-row-btn {
  transition: all 0.2s ease;
  z-index: 10;
}

.remove-form-row-btn:hover {
  transform: scale(1.15) rotate(90deg);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
}

/* === Image Upload === */
.add-image-box {
  transition: all 0.2s ease;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(30, 30, 35, 0.5);
  border-radius: 0.75rem;
}

.add-image-box:hover {
  border-color: var(--accent-red) !important;
  background-color: rgba(239, 68, 68, 0.05);
}

.add-image-placeholder {
  color: var(--text-secondary);
  font-weight: 500;
}

.add-image-box:hover .add-image-placeholder {
  color: var(--accent-red);
}

/* === Product Images === */
table tbody img {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

table tbody tr:hover img {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* === Checkbox === */
input[type="checkbox"] {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: var(--accent-red);
  transition: transform 0.2s ease;
}

input[type="checkbox"]:hover {
  transform: scale(1.1);
}

/* === Scrollbar === */
.overflow-x-auto::-webkit-scrollbar {
  height: 10px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: var(--bg-card);
  border-radius: 5px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.5);
  border-radius: 5px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.7);
}

/* === Modal Styles === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.modal-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15));
  border-radius: 0.75rem;
  color: var(--accent-red);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.modal-close-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  cursor: pointer;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--accent-red);
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(20, 20, 25, 0.4);
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.4);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.6);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-section.full-width {
  grid-column: 1 / -1;
}

.section-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(239, 68, 68, 0.3);
  margin-bottom: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.required {
  color: var(--accent-red);
  margin-left: 0.25rem;
}

/* Hide number input arrows */
.input-number::-webkit-outer-spin-button,
.input-number::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-number[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Custom Dropdown Styles */
.custom-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-selected {
  width: 100%;
  border: 1.5px solid var(--border-color);
  border-radius: 0.625rem;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  transition: all 0.2s ease;
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 0.9375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-selected:hover {
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.dropdown-selected .placeholder {
  color: var(--text-secondary);
}

.dropdown-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.dropdown-arrow.open {
  transform: translateY(-50%) rotate(180deg);
  color: var(--accent-red);
}

.dropdown-selected:hover .dropdown-arrow {
  color: var(--accent-red);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 0.625rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-main);
}

.dropdown-search svg {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.dropdown-search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.dropdown-search input::placeholder {
  color: var(--text-secondary);
}

.dropdown-options {
  max-height: 240px;
  overflow-y: auto;
}

.dropdown-options::-webkit-scrollbar {
  width: 6px;
}

.dropdown-options::-webkit-scrollbar-track {
  background: rgba(20, 20, 25, 0.4);
}

.dropdown-options::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.5);
  border-radius: 3px;
}

.dropdown-options::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.7);
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.dropdown-option:hover {
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-option.selected {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
  color: var(--accent-red);
  font-weight: 600;
}

.dropdown-option svg {
  color: var(--accent-red);
  flex-shrink: 0;
}

.dropdown-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.625rem;
  max-height: 220px;
  overflow-y: auto;
  padding: 0;
  background: transparent;
}

.checkbox-grid::-webkit-scrollbar {
  width: 6px;
}

.checkbox-grid::-webkit-scrollbar-track {
  background: rgba(20, 20, 25, 0.4);
  border-radius: 3px;
}

.checkbox-grid::-webkit-scrollbar-thumb {
  background: rgba(239, 68, 68, 0.5);
  border-radius: 3px;
}

.checkbox-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(239, 68, 68, 0.7);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.checkbox-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.checkbox-item:hover {
  background: rgba(30, 30, 35, 0.8);
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.checkbox-item:hover::before {
  opacity: 1;
}

.checkbox-item:has(.checkbox-input:checked) {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
  border-color: var(--accent-red);
  box-shadow: 0 2px 12px rgba(239, 68, 68, 0.2);
}

.checkbox-item:has(.checkbox-input:checked) .checkbox-label {
  color: var(--accent-red);
  font-weight: 600;
}

.checkbox-input {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: var(--accent-red);
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
}

.checkbox-input:hover {
  transform: scale(1.1);
}

.checkbox-label {
  font-size: 0.8125rem;
  color: var(--text-primary);
  flex: 1;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease;
  pointer-events: none;
}

.image-upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Product Preview Card - Matches Frontend Style */
.product-preview-card {
  position: relative;
  max-width: 300px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.product-preview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
  border-color: #555;
}

.product-preview-wrapper {
  overflow: hidden;
  aspect-ratio: 1 / 1;
  position: relative;
}

.product-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  background-color: var(--bg-card);
}

.product-preview-card:hover .product-preview-image {
  transform: scale(1.05);
}

.product-preview-info {
  padding: 1rem;
}

.product-preview-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-preview-card:hover .product-preview-title {
  color: white;
}

.product-preview-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.image-remove-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(220, 38, 38, 0.95);
  border: none;
  border-radius: 0.375rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.image-remove-btn:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  background: rgba(20, 20, 25, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  border-color: var(--accent-red);
  background: rgba(239, 68, 68, 0.05);
}

.upload-icon {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.upload-placeholder:hover .upload-icon {
  color: var(--accent-red);
  transform: scale(1.1);
}

.upload-text {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.upload-hint {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(20, 20, 25, 0.5);
}

/* === Responsive === */
@media (max-width: 768px) {
  .page-header {
    padding: 1rem;
  }
  
  .stat-card-inline {
    padding: 0.5rem 0.875rem;
    height: auto;
  }
  
  .stat-icon-small {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .btn-compact {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
  }
  
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .checkbox-grid {
    grid-template-columns: 1fr;
  }
}
</style>
