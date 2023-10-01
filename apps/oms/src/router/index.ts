import { createRouter, createWebHistory, useRoute, useRouter } from 'vue-router'
import Shell from '@/components/shell/Shell.vue'
import useAuth from '@/composables/useAuth'

export type AppRoute = '/' | '/order-management' | '/order-management/:id' | '/auth/sign-in'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Shell,
      children: [
        {
          path: '',
          component: () => import('@/pages/DashboardPage.vue')
        },
        {
          path: 'order-management',
          children: [
            {
              path: '',
              component: () => import('@/pages/OrderManagementPage.vue')
            }
          ]
        }
      ]
    },
    {
      name: 'signIn',
      path: '/auth/sign-in',
      component: () => import('@/pages/SignInPage.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { getCurrentUserInfo } = useAuth()
  const currentUserInfo = getCurrentUserInfo()
  const isAuthenticated = !!currentUserInfo

  if (to.name === 'signIn' && isAuthenticated) {
    router.back()
  }

  if (to.name !== 'signIn' && !isAuthenticated) {
    next('/auth/sign-in' as AppRoute)
    return
  }

  next()
})

export default router
