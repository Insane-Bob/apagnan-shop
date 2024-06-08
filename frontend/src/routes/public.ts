import ProductsPage from '@components/views/ProductsPage.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'

export const publicRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: HeaderLayout,

    children: [{ path: 'products', component: ProductsPage }]
  }
]
