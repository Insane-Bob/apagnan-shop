// IMPORTS
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import App from './App.vue'
import './assets/index.css'

// IMPORT Routes
import { backofficeRoutes } from './routes/backoffice'
import { publicRoutes } from './routes/public'
import { adminRoutes } from './routes/admin'
import { storeKeeperRoutes } from './routes/storeKeeper'
import { orderRoutes } from './routes/order'
import { errorsRoutes } from './routes/errors'

import ShopMain from '@components/views/ShopMain.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

const routes = [{ path: '/home', component: ShopMain }]
    .concat(backofficeRoutes)
    .concat(storeKeeperRoutes)
    .concat(adminRoutes)
    .concat(orderRoutes)
    .concat(publicRoutes)
    .concat(errorsRoutes) // HAVE TO BE IN THE END

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to: any) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        } else {
            return { top: 0 }
        }
    },
})



app.use(router).mount('#app')
