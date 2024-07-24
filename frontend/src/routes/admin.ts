import WorkInProgress from '@/components/views/WorkInProgress/WorkInProgress.vue'
import AdminProducts from '@/components/views/admin/products/AdminProducts.vue'
import AdminLayout from '@/layout/AdminLayout.vue'
import { ApiClient } from '@/lib/apiClient'
import Dashboard from '@components/views/admin/Dashboard.vue'
import AdminCollections from '@components/views/admin/collections/AdminCollections.vue'
import AdminOrderTable from '@components/views/admin/orders/AdminOrderTable.vue'
import AdminPromos from '@components/views/admin/promos/AdminPromos.vue'
import AdminRefundsTable from '@components/views/admin/refunds/AdminRefundsTable.vue'
import AdminReviews from '@components/views/admin/reviews/AdminReviews.vue'
import AdminUsersTable from '@components/views/admin/users/AdminUsersTable.vue'
import AdminNewsletterTable from '@components/views/admin/newletter/AdminNewsletterTable.vue'
import AdminLegalTable from '@components/views/admin/Legals/AdminLegalTable.vue'

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
                    const apiClient = new ApiClient()
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
                component: AdminProducts,
                name: 'Produits',
                meta: { label: 'Produits', icon: 'cube' },
                children: [
                    {
                        path: ':slug',
                        name: 'Produit',
                        meta: { label: 'Produit' },
                    },
                ],
            },
            {
                path: 'collections',
                component: AdminCollections,
                name: 'Collections',
                meta: { label: 'Collections', icon: 'albums' },
            },
            {
                path: 'orders',
                component: AdminOrderTable,
                name: 'Commandes',
                meta: { label: 'Commandes', icon: 'cart' },
            },
            {
                path: 'reviews',
                component: AdminReviews,
                name: 'Avis',
                meta: { label: 'Avis', icon: 'star' },
            },
            {
                path: 'users',
                component: AdminUsersTable,
                name: 'Utilisateurs',
                meta: { label: 'Utilisateurs', icon: 'people-circle' },
            },
            {
                path: 'refunds',
                component: AdminRefundsTable,
                name: 'Demandes de remboursement',
                meta: { label: 'Remboursement', icon: 'wallet' },
            },
            {
                path: 'promos',
                component: AdminPromos,
                name: 'Promotions',
                meta: { label: 'Promo', icon: 'pricetag' },
            },
            {
                path: 'newsletter',
                component: AdminNewsletterTable,
                name: 'Newsletter',
                meta: { label: 'Newsletter', icon: 'mail' },
            },
            {
                path: 'legales',
                component: AdminLegalTable,
                name: 'legalesIndex',
                meta: { label: 'Légales', icon: 'document' },
                children: [
                    {
                        path: ':slug',
                        name: 'legal',
                        meta: { label: 'Edtition' },
                    },
                ],
            },
        ],
    },
]
