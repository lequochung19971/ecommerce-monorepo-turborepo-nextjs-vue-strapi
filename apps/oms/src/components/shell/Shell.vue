<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import Toast from 'primevue/toast'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { AppRoute } from '@/router'

type BreadCrumbType = MenuItem & {
  route?: AppRoute
}
type NavigationItem = MenuItem & {
  route?: AppRoute
  children?: NavigationItem[]
  hidden?: boolean
  breadcrumbs?: BreadCrumbType[]
}
const navigationItems = ref<NavigationItem[]>([
  {
    label: 'Dashboard',
    icon: 'pi pi-fw pi-plus',
    route: '/'
  },
  {
    label: 'Order Management',
    icon: 'pi pi-fw pi-trash',
    route: '/order-management',
    children: [
      {
        route: '/order-management',
        hidden: true,
        breadcrumbs: [
          {
            label: 'Test'
          }
        ]
      },
      {
        route: '/order-management/:id',
        hidden: true,
        breadcrumbs: [
          {
            label: 'Test'
          }
        ]
      }
    ],
    breadcrumbs: [
      {
        label: 'Test'
      }
    ]
  }
])
const home = ref({
  icon: 'pi pi-home',
  route: '/'
})
const route = useRoute()
const currentBreadcrumb = computed(() => {
  const currentRouteMatched = route.matched[route.matched.length - 1]
  let result: BreadCrumbType[] | undefined

  const findBreadcrumb = (navItems: NavigationItem[]) => {
    navItems.some((item) => {
      if (item.route && item.route === currentRouteMatched.path) {
        result = item.breadcrumbs
        return true
      }

      if (item.children) {
        return findBreadcrumb(item.children)
      }

      return false
    })
  }

  findBreadcrumb(navigationItems.value)
  return result
})
</script>

<template>
  <div class="shell">
    <Toast />
    <div class="shell__side-bar">
      <div class="shell__logo">
        <span>LOGO</span>
      </div>
      <div class="card">
        <Menu
          :model="navigationItems"
          :pt="{
            root: '!border-[0px] !w-full'
          }"
        >
          <template #item="{ label, props, item }">
            <RouterLink v-if="item.route" v-slot="routerProps" :to="item.route">
              <a :href="routerProps.href" v-bind="props.action">
                <span
                  v-bind="props.icon"
                  :class="routerProps.isExactActive ? '!text-primary' : ''"
                ></span>
                <span
                  v-bind="props.label"
                  :class="routerProps.isExactActive ? '!text-primary' : ''"
                  >{{ label }}</span
                >
              </a>
            </RouterLink>
          </template>
        </Menu>
      </div>
    </div>

    <div class="shell__main-wrapper">
      <div class="shell__top-bar">
        <div class="card flex justify-content-center">
          <Breadcrumb :home="home" :model="currentBreadcrumb">
            <template #item="{ label, item, props }">
              <RouterLink v-if="item.route" v-slot="routerProps" :to="item.route">
                <a :href="routerProps.href" v-bind="props.action">
                  <span v-bind="props.icon"></span>
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </RouterLink>
              <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                <span v-if="item.icon" v-bind="props.icon"></span>
                <span v-bind="props.label">{{ label }}</span>
              </a>
            </template>
          </Breadcrumb>
        </div>
      </div>
      <div class="shell__main">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shell {
  @apply flex flex-row h-[100vh] overflow-hidden;

  &__logo {
    @apply h-fit flex justify-center items-center py-5;
    span {
      @apply border-2 border-solid border-gray-800 py-1 px-4 text-xl;
    }
  }

  &__side-bar {
    @apply min-w-[248px] h-full bg-white;
  }

  &__main-wrapper {
    @apply h-full p-4 flex flex-col overflow-auto w-full;
  }

  &__top-bar {
    @apply min-h-[80px];
  }

  &__main {
    @apply flex-1;
  }
}
</style>
