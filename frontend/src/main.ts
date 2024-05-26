// IMPORTS
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import App from './App.vue'
import './assets/index.css'

// IMPORT Routes
import { backofficeRoutes } from './routes/backoffice'

import ShopMain from '@components/views/ShopMain.vue'

const app = createApp(App)

const routes = [{ path: '/', component: ShopMain }].concat(backofficeRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  }
})

app.use(createPinia())

app.use(router).mount('#app')
