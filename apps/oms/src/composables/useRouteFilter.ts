import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type FilterParams = {
  page?: number
  pageSize?: number
  sortOrder?: number
  sortField?: string
  search?: string
}

export const useRouteFilter = (): [
  ComputedRef<FilterParams>,
  (params: Partial<FilterParams>) => void
] => {
  const route = useRoute()
  const router = useRouter()

  const routeFilterParams = computed(() => {
    let params: FilterParams = {}
    if ('page' in route.query && route.query.page) {
      params = {
        ...params,
        page: +(route.query?.page as unknown as number)
      }
    }
    if ('pageSize' in route.query && route.query.pageSize) {
      params = {
        ...params,
        pageSize: +(route.query?.pageSize as unknown as number)
      }
    }

    if ('sortOrder' in route.query && route.query.sortOrder) {
      params = {
        ...params,
        sortOrder: +(route.query?.sortOrder as unknown as number)
      }
    }

    if ('sortField' in route.query && route.query.sortField) {
      params = {
        ...params,
        sortField: route.query?.sortField as string
      }
    }

    if ('search' in route.query && route.query.search) {
      params = {
        ...params,
        search: route.query?.search as string
      }
    }

    return {
      ...params
    }
  })

  const upsertRouteFieldParams = (params: Partial<FilterParams>) => {
    router.push({
      path: route.path,
      query: {
        ...routeFilterParams.value,
        ...params
      }
    })
  }

  return [routeFilterParams, upsertRouteFieldParams]
}
