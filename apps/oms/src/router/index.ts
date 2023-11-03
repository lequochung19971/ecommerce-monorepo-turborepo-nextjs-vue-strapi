import { createRouter, createWebHistory, useRoute, useRouter } from 'vue-router'
import Shell from '@/components/shell/Shell.vue'
import { getAuth } from '@/composables/useAuth'

export type AppRoute =
  | '/dashboard'
  | '/orders'
  | '/orders/:id'
  | '/orders/create'
  | '/auth/sign-in'
  | '/categories'
  | '/categories/:id'
  | '/categories/create'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Shell,
      children: [
        {
          path: '',
          redirect: 'dashboard'
        },
        {
          path: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue')
        },
        {
          path: 'orders',
          children: [
            {
              path: '',
              component: () => import('@/pages/OrdersPage.vue')
            },
            {
              path: 'create',
              component: () => import('@/pages/OrderDetailPage.vue'),
              props: {
                mode: 'create'
              }
            },
            {
              path: ':id',
              component: () => import('@/pages/OrderDetailPage.vue'),
              props: {
                mode: 'edit'
              }
            }
          ]
        },
        {
          path: 'categories',
          children: [
            {
              path: '',
              component: () => import('@/pages/CategoriesPage.vue')
            },
            {
              path: 'create',
              component: () => import('@/pages/CategoryPage.vue'),
              props: {
                mode: 'create'
              }
            },
            {
              path: ':id',
              component: () => import('@/pages/CategoryPage.vue'),
              props: {
                mode: 'edit'
              }
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
  const { getCurrentUserInfo } = getAuth()
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
