import OrderLayout from '@/layout/OrderLayout.vue'

import { useToast } from '@/components/ui/toast/use-toast'
import OrderSummary from '@/components/views/order/OrderSummary.vue'
import OrderSuccess from '@/components/views/order/OrderSuccess.vue'
import OrderFail from '@/components/views/order/OrderFail.vue'

export const orderRoutesName = {
    SUMMARY: 'OrderSummary',
    SUCCESS: 'OrderSuccess',
    FAIL: 'OrderFail',
}

export const orderRoutes = [
    {
        path: '/order',
        component: OrderLayout,
        beforeEnter: () => {
            // Check if user is authenticated
            // If not, redirect to login page
            if (localStorage.getItem('accessToken')) {
                return true
            }
            const { toast } = useToast()
            toast({
                title: 'Vous devez être connecté',
                description:
                    'Pour accéder à cette page, vous devez être connecté.',
                variant: 'destructive',
            })
            return { name: 'Home' }
        },

        children: [
            {
                path: 'summary',
                component: OrderSummary,
                name: orderRoutesName.SUMMARY,
            },
            {
                path: 'success',
                component: OrderSuccess,
                name: orderRoutesName.SUCCESS,
            },
            { path: 'fail', component: OrderFail, name: orderRoutesName.FAIL },
        ],
    },
]
