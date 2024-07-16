import ProductsPage from '@components/views/ProductsPage.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import ProductView from '@/components/views/ProductView.vue'
import ResetPasswordView from '@/components/views/auth/ResetPasswordView.vue'

export const publicRoutes = [
    {
        path: '/',
        redirect: '/home',
        component: HeaderLayout,
        name: 'Home',

        children: [
            { path: 'products', component: ProductsPage },
            {
                path: 'collections/:cslug/products/:pslug',
                component: ProductView,
            },
            {
                path: 'reset-password',
                component: ResetPasswordView,
            },
        ],
    },
]
