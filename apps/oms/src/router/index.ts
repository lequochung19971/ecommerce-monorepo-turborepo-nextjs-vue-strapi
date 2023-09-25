import { createRouter, createWebHistory } from 'vue-router'
import Shell from '@/components/shell/Shell.vue'
import SignInPage from '@/pages/SignInPage.vue'

export type AppRoute = '/' | '/order-management' | '/order-management/:id'

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
      path: '/sign-in',
      component: SignInPage
    }
  ]
})

export default router
