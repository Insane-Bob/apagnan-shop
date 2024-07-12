import AdminLayout from '@/layout/AdminLayout.vue'
import AdminCustomers from '@/components/views/admin/AdminCustomers.vue'
import AdminCollections from '@/components/views/admin/collections/AdminCollections.vue'
import AdminUsers from '@/components/views/admin/users/AdminUsers.vue'
import WorkInProgress from '@components/views/WorkInProgress/WorkInProgress.vue'
import { apiClient } from '@/lib/apiClient'
import { useToast } from '@/components/ui/toast/use-toast'
import AdminProducts from '@/components/views/admin/products/AdminProducts.vue'

export const adminRoutes = [
    {
        path: '/admin',
        component: AdminLayout,
        redirect: '/admin/dashboard',
        beforeEnter: async () => {
            // Check if user is authenticated && is admin
            // If not, redirect to login page
            if (localStorage.getItem('accessToken')) {
                const { toast } = useToast()
                try {
                    const result = await apiClient.get('me')
                    if (result.data.user.role === 'admin') {
                        return true
                    } else {
                        toast({
                            title: 'Erreur',
                            description:
                                "Vous n'êtes pas autorisé à accéder à cette page.",
                            variant: 'destructive',
                        })
                        return { name: 'NotFound' }
                    }
                } catch (error) {
                    toast({
                        title: 'Erreur',
                        description:
                            "Vous n'êtes pas autorisé à accéder à cette page.",
                        variant: 'destructive',
                    })
                    return { name: 'NotFound' }
                }
            }
            return { name: 'NotFound' }
        },
        children: [
            {
                path: 'dashboard',
                component: WorkInProgress,
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
                path: 'reviews',
                component: WorkInProgress,
                name: 'Avis',
                meta: { label: 'Avis', icon: 'star' },
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
