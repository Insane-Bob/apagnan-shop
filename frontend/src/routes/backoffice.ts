import MyProfile from '@/components/views/MyProfile.vue'
import ProfileCommand from '@/components/views/ProfileCommand.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'

export const backofficeRoutes = [
  {
    path: '/profile',
    component: HeaderLayout,

    children: [
      { path: '', component: MyProfile, name: 'MenuProfile' },
      { path: 'commands', component: ProfileCommand, name: 'ProfileCommand' }
    ]
  }
]
