// IMPORTS
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/index.css'

// IMPORT COMPONENTS
import ShopMain from '@components/views/ShopMain.vue'
import MyProfile from '@components/views/MyProfile.vue'

const app = createApp(App)

const routes = [
  { path: '/', component: ShopMain },
  { path: '/profile', component: MyProfile }
]

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
