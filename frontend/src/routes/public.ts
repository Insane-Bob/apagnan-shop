import ProductsPage from '@components/views/ProductsPage.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import ProductView from '@/components/views/ProductView.vue'
import ResetPasswordView from '@/components/views/auth/ResetPasswordView.vue'
//import CollectionsIndex from '@/components/views/CollectionsIndex.vue'
//import CollectionProductsPage from '@/components/views/CollectionProductsPage.vue'

export const publicRoutes = [
    {
        path: '/',
        redirect: '/home',
        component: HeaderLayout,
        name: 'Home',

        children: [
            { path: 'products', component: ProductsPage },
            //{ path: 'collections', component: CollectionsIndex },
            //{ path: 'collections/:cslug/products', component: CollectionProductsPage}
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
