import AdminLayout from '@/layout/AdminLayout.vue'
import AdminCustomers from '@/components/views/admin/AdminCustomers.vue'
import AdminCollections from '@/components/views/admin/AdminCollections.vue'
import WorkInProgress from '@components/views/WorkInProgress/WorkInProgress.vue'

export const adminRoutes = [
    {
        path: '/admin',
        component: AdminLayout,
        redirect: '/admin/dashboard',
        children: [
            {
                path: 'dashboard',
                component: WorkInProgress,
                name: 'Dashboard',
                meta: { label: 'Dashboard', icon: 'home' },
            },
            {
                path: 'products',
                component: WorkInProgress,
                name: 'Produits',
                meta: { label: 'Produits', icon: 'cube' },
            },
            {
                path: 'collections',
                component: AdminCollections,
                name: 'Collections',
                meta: { label: 'Collections', icon: 'albums' },
            },
            {
                path: 'orders',
                component: WorkInProgress,
                name: 'Commandes',
                meta: { label: 'Commandes', icon: 'cart' },
            },
            {
                path: 'customers',
                component: AdminCustomers,
                name: 'Clients',
                meta: { label: 'Clients', icon: 'people' },
                children: [
                    {
                        path: ':id',
                        component: WorkInProgress,
                        name: 'Client',
                        meta: { label: 'Client' },
                    },
                ],
            },
            {
                path: 'users',
                component: WorkInProgress,
                name: 'Utilisateurs',
                meta: { label: 'Utilisateurs', icon: 'people-circle' },
            },
        ],
    },
]
