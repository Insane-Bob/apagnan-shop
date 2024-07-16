import MyProfile from '@components/views/MyProfile.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import CommandResume from '@components/views/CommandResume.vue'
import MyCommands from '@components/views/MyCommands.vue'
import { useToast } from '@/components/ui/toast/use-toast'


export const backofficeRoutesName = {
    PROFILE: 'MyProfile',
    COMMANDS: 'MyCommands',
    COMMAND_RESUME: 'CommandResume',
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
            }
        ],
    },
]
