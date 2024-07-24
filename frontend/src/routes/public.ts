import ProductsPage from '@components/views/ProductsPage.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import ProductView from '@/components/views/ProductView.vue'
import ResetPasswordView from '@/components/views/auth/ResetPasswordView.vue'
import CollectionView from '@components/views/CollectionView.vue'
import UnsubscribeNewsletter from '@components/Newsletter/UnsubscribeNewsletter.vue'

export const publicRoutes = [
    {
        path: '/',
        redirect: '/home',
        component: HeaderLayout,
        name: 'Home',

        children: [
            {
                path: 'collections/:cslug',
                component: CollectionView,
            },
            { path: 'products', component: ProductsPage },
            {
                path: 'collections/:cslug/products/:pslug',
                component: ProductView,
            },
            {
                path: 'reset-password',
                component: ResetPasswordView,
            },
            {
                path: 'unsubscribe',
                component: UnsubscribeNewsletter,
            },
        ],
    },
]
