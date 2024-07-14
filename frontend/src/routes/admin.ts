import AdminLayout from '@/layout/AdminLayout.vue'
import { apiClient } from '@/lib/apiClient'
import WorkInProgress from '@components/views/WorkInProgress/WorkInProgress.vue'
import AdminCustomers from '@components/views/admin/AdminCustomers.vue'
import Dashboard from '@components/views/admin/Dashboard.vue'
import AdminCollections from '@components/views/admin/collections/AdminCollections.vue'
import AdminUsers from '@components/views/admin/users/AdminUsers.vue'

export const adminRoutes = [
    {
        path: '/admin',
        component: AdminLayout,
        redirect: '/admin/dashboard',
        beforeEnter: async () => {
            // Check if user is authenticated && is admin
            // If not, redirect to login page
            if (localStorage.getItem('accessToken')) {
                try {
                    const result = await apiClient.get('me')
                    if (result.data.user.role === 'admin') {
                        return true
                    } else {
                        return { name: 'NotFound' }
                    }
                } catch (error) {
                    return { name: 'NotFound' }
                }
            }
            return { name: 'NotFound' }
        },
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
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
                component: AdminUsers,
                name: 'Utilisateurs',
                meta: { label: 'Utilisateurs', icon: 'people-circle' },
            },
        ],
    },
]
