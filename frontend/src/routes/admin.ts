import AdminLayout from '@/layout/AdminLayout.vue'
import WorkInProgress from '@components/views/WorkInProgress/WorkInProgress.vue'

export const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', component: WorkInProgress, name: 'Dashboard' },
      { path: 'products', component: WorkInProgress, name: 'Produits' },
      { path: 'collections', component: WorkInProgress, name: 'Collections' },
      { path: 'orders', component: WorkInProgress, name: 'Commandes' },
      { path: 'customers', component: WorkInProgress, name: 'Clients' },
      { path: 'users', component: WorkInProgress, name: 'Utilisateurs' },
      { path: 'settings', component: WorkInProgress, name: 'Paramètres' }
    ]
  }
]
