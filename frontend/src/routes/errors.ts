import NotFound from '@/components/views/errors/NotFound.vue'

export const errorsRoutes = [
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  }
]
