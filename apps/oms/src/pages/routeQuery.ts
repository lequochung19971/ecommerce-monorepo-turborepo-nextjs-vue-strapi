import { route } from './OrderManagementPage.vue'

export const routeQuery = {
  page: (route.query?.page as number) ?? 1,
  pageSize: route.query?.pageSize ?? 10,
  sortOrder: route.query?.sortOrder,
  sortField: route.query?.sortField ?? ''
}
