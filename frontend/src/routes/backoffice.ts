import ProfileForm from '@/components/Forms/Profile/ProfileForm.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import CommandResume from '@components/views/CommandResume.vue'
import MyCommands from '@components/views/MyCommands.vue'
import WorkInProgress from '@/components/views/WorkInProgress/WorkInProgress.vue'
import { useUserStore } from '@store/user'
import NotificationManagementView from "@components/views/NotificationManagementView.vue";
import {ApiClient} from '@/lib/apiClient'
import MyProfile from '@components/views/MyProfile.vue'
import { useRouter } from 'vue-router'

export const backofficeRoutesName = {
    PROFILE: 'MyProfile',
    COMMANDS: 'MyCommands',
    COMMAND_RESUME: 'CommandResume',
    INFORMATIONS: 'ProfileForm',
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
                path: 'informations',
                component: ProfileForm,
                name: backofficeRoutesName.INFORMATIONS,
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
            const user = useUserStore()
            const { toast } = useToast()
            const router = useRouter()

            if (localStorage.getItem('accessToken')) {
                const apiClient = new ApiClient()
                await apiClient.post('logout',{})
                user.logout()
            }

            toast({
                title: 'Déconnexion',
                description: 'Vous avez été déconnecté.',
            })

            router.push({ name: 'Home' })
        },
    },
]
