import MyProfile from '@/components/views/MyProfile.vue'
import HeaderLayout from '@/layout/HeaderLayout.vue'

export const backofficeRoutes = [
  {
    path: '/profile',
    component: HeaderLayout,

    children: [{ path: '', component: MyProfile, name: 'MenuProfile' }]
  }
]
