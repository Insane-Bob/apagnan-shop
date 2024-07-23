import AdminProducts from '@/components/views/admin/products/AdminProducts.vue'
import StoreKeeperLayout from '@/layout/StoreKeeperLayout.vue'
import { ApiClient } from '@/lib/apiClient'

export const storeKeeperRoutes = [
    {
        path: '/store-keeper',
        component: StoreKeeperLayout,
    },
]
