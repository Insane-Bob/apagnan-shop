import HeaderLayout from '@/layout/HeaderLayout.vue'

import WorkInProgress from '@/components/views/WorkInProgress/WorkInProgress.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useUserStore } from '@store/user'

const user = useUserStore()

export const backofficeRoutes = [
    {
        path: '/order',
        component: HeaderLayout,
        beforeEnter: () => {
            // Check if user is authenticated
            // If not, redirect to login page
            if (user.isAuthenticated) {
                const { toast } = useToast()
                toast({
                    title: 'Vous devez être connecté',
                    description:
                        'Pour accéder à cette page, vous devez être connecté.',
                    variant: 'destructive',
                })
            }
            return { name: 'Home' }
        },

        children: [
            { path: 'summary', component: WorkInProgress },
            { path: ':id/payment', component: WorkInProgress },
            { path: ':id/report', component: WorkInProgress },
        ],
    },
]
