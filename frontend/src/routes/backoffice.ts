import MyProfile from '@components/views/MyProfile.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import CommandResume from '@components/views/CommandResume.vue'
import MyCommands from '@components/views/MyCommands.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import WorkInProgress from '@/components/views/WorkInProgress/WorkInProgress.vue'
import { useUserStore } from '@store/user'
import NotificationManagementView from "@components/views/NotificationManagementView.vue";


export const backofficeRoutesName = {
    PROFILE: 'MyProfile',
    COMMANDS: 'MyCommands',
    COMMAND_RESUME: 'CommandResume',
    NOTIFICATIONS: 'Notifications'
}

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
            {
                path: '',
                component: MyProfile,
                name: backofficeRoutesName.PROFILE,
            },
            {
                path: 'commands',
                component: MyCommands,
                name: backofficeRoutesName.COMMANDS,
            },
            {
                path: 'command/:id',
                component: CommandResume,
                name: backofficeRoutesName.COMMAND_RESUME,
            },
            {
                path: 'notifications',
                component: NotificationManagementView,
                name : backofficeRoutesName.NOTIFICATIONS
            }
        ],
    },
    {
        path: '/logout',
        component: WorkInProgress,
        beforeEnter: async () => {
            // Auth user
            const user = useUserStore()
            if (localStorage.getItem('accessToken')) {
                const { toast } = useToast()
                await apiClient.post('logout')
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                user.clearUser()
                toast({
                    title: 'Déconnexion',
                    description: 'Vous avez été déconnecté.',
                })
                return { name: 'Home' }
            }
        },
    },
]
