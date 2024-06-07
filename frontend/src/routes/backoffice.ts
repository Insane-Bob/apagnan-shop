import MyProfile from '@components/views/MyProfile.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'
import CommandResume from '@components/views/CommandResume.vue'

export const backofficeRoutes = [
  {
    path: '/profile',
    component: HeaderLayout,

    children: [
      { path: '', component: MyProfile },
      { path: 'command/:id', component: CommandResume }
    ]
  }
]
