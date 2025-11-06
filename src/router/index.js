import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/ProductsPage.vue')
  },
  {
    path: '/bestsellers',
    name: 'Bestsellers',
    component: () => import('../views/BestsellersPage.vue')
  },
  {
    path: '/how-to-buy',
    name: 'HowToBuy',
    component: () => import('../views/HowToBuyPage.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

