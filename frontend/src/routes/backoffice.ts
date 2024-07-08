import MyProfile from '@components/views/MyProfile.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import CommandResume from '@components/views/CommandResume.vue'
import { apiClient } from '@/lib/apiClient'
import { useToast } from '@/components/ui/toast/use-toast'
import WorkInProgress from '@/components/views/WorkInProgress/WorkInProgress.vue'

export const backofficeRoutes = [
    {
        path: '/profile',
        component: HeaderLayout,
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
            { path: '', component: MyProfile },
            { path: 'command/:id', component: CommandResume },
        ],
    },
    {
        path: '/logout',
        component: WorkInProgress,
        beforeEnter: async () => {
            console.log('logout');
            if (localStorage.getItem('accessToken')) {
                const { toast } = useToast()
                await apiClient.post('logout')
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                toast({
                    title: 'Déconnexion',
                    description: 'Vous avez été déconnecté.',
                })
                return { name: 'Home' }
            }
        },
    },
]
