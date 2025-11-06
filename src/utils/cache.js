/**
 * Local Storage Cache Utility
 * Provides simple key-value caching with automatic expiration
 */

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

/**
 * Get cached data from localStorage
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export function getCachedData(key) {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    
    // Check if cache is still valid
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data
    }
    
    // Cache expired, remove it
    localStorage.removeItem(key)
    return null
  } catch (error) {
    console.error('Error reading cache:', error)
    return null
  }
}

/**
 * Set cached data in localStorage
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export function setCachedData(key, data) {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(cacheEntry))
  } catch (error) {
    console.error('Error setting cache:', error)
  }
}

/**
 * Clear specific cache entry
 * @param {string} key - Cache key
 */
export function clearCache(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

/**
 * Clear all cache entries with a specific prefix
 * @param {string} prefix - Cache key prefix
 */
export function clearCacheByPrefix(prefix) {
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    console.error('Error clearing cache by prefix:', error)
  }
}

