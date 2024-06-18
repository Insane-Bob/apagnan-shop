import AdminLayout from '@/layout/AdminLayout.vue'
import AdminDashboard from '@/components/views/admin/AdminDashboard.vue'
import AdminCustomers from '@/components/views/admin/AdminCustomers.vue'
import WorkInProgress from '@components/views/WorkInProgress/WorkInProgress.vue'

export const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        component: AdminDashboard,
        name: 'Dashboard',
        meta: { label: 'Dashboard', icon: 'home' }
      },
      {
        path: 'products',
        component: WorkInProgress,
        name: 'Produits',
        meta: { label: 'Produits', icon: 'cube' }
      },
      {
        path: 'collections',
        component: WorkInProgress,
        name: 'Collections',
        meta: { label: 'Collections', icon: 'albums' }
      },
      {
        path: 'orders',
        component: WorkInProgress,
        name: 'Commandes',
        meta: { label: 'Commandes', icon: 'cart' }
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
        meta: { label: 'Utilisateurs', icon: 'people-circle' }
      }
    ]
  }

]
