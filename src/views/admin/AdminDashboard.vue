<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-text-primary">Dashboard</h2>
      <div class="flex items-center gap-4">
        <input 
          ref="dateRangePicker"
          type="text" 
          placeholder="Select date range"
          class="input"
        >
        <button @click="exportToExcel" class="btn btn-secondary text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Data
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="panel p-5">
        <p class="text-sm text-text-secondary">Total Site Visits</p>
        <p class="text-2xl font-bold text-text-primary">{{ stats.totalVisits }}</p>
      </div>
      <div class="panel p-5">
        <p class="text-sm text-text-secondary">Total Product Clicks</p>
        <p class="text-2xl font-bold text-text-primary">{{ stats.totalProductClicks }}</p>
      </div>
      <div class="panel p-5">
        <p class="text-sm text-text-secondary">Total Products</p>
        <p class="text-2xl font-bold text-text-primary">{{ stats.totalProducts }}</p>
      </div>
      <div class="panel p-5">
        <p class="text-sm text-text-secondary">Top Product</p>
        <p class="text-lg font-bold truncate text-text-primary">{{ stats.topProduct || 'N/A' }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="panel p-6">
        <h3 class="font-semibold mb-4 text-text-primary">Site Visit Trend</h3>
        <div class="h-64">
          <canvas ref="visitsChartCanvas"></canvas>
        </div>
      </div>
      <div class="panel p-6">
        <h3 class="font-semibold mb-4 text-text-primary">Product Click Trend</h3>
        <div class="h-64">
          <canvas ref="clicksChartCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '@/composables/useAuth'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import * as XLSX from 'xlsx'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
)

const { getAuthenticatedClient } = useAuth()

const dateRangePicker = ref(null)
const stats = ref({
  totalVisits: 0,
  totalProductClicks: 0,
  totalProducts: 0,
  topProduct: ''
})

const visitsChartCanvas = ref(null)
const clicksChartCanvas = ref(null)
let visitsChart = null
let clicksChart = null
let currentAnalyticsData = []

const loadDashboardData = async (startDate, endDate) => {
  try {
    const db = await getAuthenticatedClient()
    
    const startStr = startDate.toISOString()
    const endStr = new Date(endDate.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
    
    // Use pagination to fetch ALL data within the date range
    let allData = []
    let page = 0
    const pageSize = 1000
    let hasMore = true
    
    while (hasMore) {
      const { data, error } = await db
        .from('analytics_events')
        .select('*')
        .gte('created_at', startStr)
        .lt('created_at', endStr)
        .order('created_at', { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1)
      
      if (error) {
        console.error('Failed to load analytics:', error)
        break
      }
      
      if (data && data.length > 0) {
        allData = allData.concat(data)
        if (data.length < pageSize) {
          hasMore = false
        } else {
          page++
        }
      } else {
        hasMore = false
      }
    }
    
    currentAnalyticsData = allData
    
    // Get total products (not filtered by date)
    const { count: productsCount } = await db
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    
    stats.value.totalProducts = productsCount || 0
    
    // Filter analytics data
    const siteVisits = allData.filter(e => e.event_type === 'site_visit')
    const productClicks = allData.filter(e => e.event_type === 'product_click')
    // Filter out API Error and Network Error
    const validVisits = siteVisits.filter(e => e.country_code !== 'API Error' && e.country_code !== 'Network Error')
    
    stats.value.totalVisits = validVisits.length
    stats.value.totalProductClicks = productClicks.length
    
    // Calculate top product
    const productClickCounts = productClicks.reduce((acc, curr) => {
      acc[curr.event_value] = (acc[curr.event_value] || 0) + 1
      return acc
    }, {})
    
    const topProduct = Object.keys(productClickCounts).length
      ? Object.entries(productClickCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A'
    
    stats.value.topProduct = topProduct
    
    // Generate date labels for charts
    const dateLabels = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateLabels.push(d.toLocaleDateString('en-CA'))
    }
    
    renderCharts(dateLabels, validVisits, productClicks)
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    renderCharts([], [], [])
  }
}

const processDataForChart = (events, labels) => {
  const dataMap = labels.reduce((acc, label) => {
    acc[label] = 0
    return acc
  }, {})
  
  events.forEach(event => {
    const eventDate = new Date(event.created_at).toLocaleDateString('en-CA')
    if (dataMap.hasOwnProperty(eventDate)) {
      dataMap[eventDate]++
    }
  })
  
  return Object.values(dataMap)
}

const renderCharts = (labels, validVisits, productClicks) => {
  const visitsData = processDataForChart(validVisits, labels)
  const clicksData = processDataForChart(productClicks, labels)
  
  // Create visits chart
  if (visitsChart) {
    visitsChart.destroy()
  }
  
  if (visitsChartCanvas.value) {
    visitsChart = new Chart(visitsChartCanvas.value, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Site Visits',
          data: visitsData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderWidth: 2,
          fill: 'start',
          tension: 0.4,
          pointBackgroundColor: 'rgb(239, 68, 68)',
          pointBorderColor: '#222222',
          pointHoverRadius: 6,
          pointHoverBorderWidth: 2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#FFFFFF'
            }
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].label
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#FFFFFF'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#FFFFFF',
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
              maxTicksLimit: 15
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    })
  }
  
  // Create clicks chart
  if (clicksChart) {
    clicksChart.destroy()
  }
  
  if (clicksChartCanvas.value) {
    clicksChart = new Chart(clicksChartCanvas.value, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Product Clicks',
          data: clicksData,
          borderColor: 'rgb(176, 176, 176)',
          backgroundColor: 'rgba(176, 176, 176, 0.2)',
          borderWidth: 2,
          fill: 'start',
          tension: 0.4,
          pointBackgroundColor: 'rgb(176, 176, 176)',
          pointBorderColor: '#222222',
          pointHoverRadius: 6,
          pointHoverBorderWidth: 2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#FFFFFF'
            }
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].label
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#FFFFFF'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#FFFFFF',
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
              maxTicksLimit: 15
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    })
  }
}

const exportToExcel = () => {
  if (currentAnalyticsData.length === 0) {
    alert('No data to export. Please select a date range.')
    return
  }
  
  try {
    const worksheet = XLSX.utils.json_to_sheet(currentAnalyticsData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics Data')
    XLSX.writeFile(workbook, `analytics_export_${new Date().toISOString().slice(0, 10)}.xlsx`)
    alert('Data exported successfully!')
  } catch (error) {
    alert('Export failed: ' + error.message)
  }
}

onMounted(() => {
  // Initialize flatpickr date range picker
  if (dateRangePicker.value) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 29)
    
    flatpickr(dateRangePicker.value, {
      mode: 'range',
      dateFormat: 'Y-m-d',
      defaultDate: [startDate, endDate],
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          loadDashboardData(selectedDates[0], selectedDates[1])
        }
      }
    })
    
    // Load initial data with default range
    loadDashboardData(startDate, endDate)
  }
})

onBeforeUnmount(() => {
  // Clean up charts
  if (visitsChart) {
    visitsChart.destroy()
  }
  if (clicksChart) {
    clicksChart.destroy()
  }
})
</script>

<style scoped>
.panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
}

.input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-card);
  color: var(--text-primary);
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

