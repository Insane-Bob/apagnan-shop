import OrderLayout from '@/layout/OrderLayout.vue'

import WorkInProgress from '@/components/views/WorkInProgress/WorkInProgress.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import OrderSummary from '@/components/views/order/OrderSummary.vue'

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
            { path: 'summary', component: OrderSummary },
            { path: ':id/payment', component: WorkInProgress },
            { path: ':id/report', component: WorkInProgress },
        ],
    },
]
