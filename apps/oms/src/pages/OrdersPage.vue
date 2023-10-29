<script setup lang="ts">
import { useDeleteOrderDetailMutation } from '@/composables/useDeleteOrderDetailMutation'
import { useOrderDetailsQuery } from '@/composables/useOrderDetailsQuery'
import type { AppRoute } from '@/router'
import { QueryKey } from '@/types/queryKey'
import type { QueryResponse } from '@/types/queryResponse'
import { useQueryClient } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import type { OrderDetail } from 'types'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { throttle } from 'lodash'

const route = useRoute()
const router = useRouter()
const sortConfig = {
  [1]: 'asc',
  [-1]: 'desc'
}

const routeQuery = computed(() => {
  return {
    page: +((route.query?.page as unknown as number) ?? 1),
    pageSize: +((route.query?.pageSize as unknown as number) ?? 5),
    sortOrder: +(route.query?.sortOrder as unknown as number),
    sortField: (route.query?.sortField as string) ?? '',
    search: (route.query?.search as string) ?? ''
  }
})
const computedQueryParams = computed(() => {
  return {
    populate: '*',
    pagination: {
      page: routeQuery.value?.page ?? 1,
      pageSize: routeQuery.value?.pageSize ?? 5
    },
    sort: [
      routeQuery.value?.sortOrder
        ? `${routeQuery.value?.sortField}:${
            sortConfig[routeQuery.value?.sortOrder as unknown as keyof typeof sortConfig]
          }`
        : (routeQuery.value?.sortField as string)
    ],
    filters: {
      user: {
        username: {
          $contains: routeQuery.value.search
        }
      }
    }
  }
})
const queryClient = useQueryClient()
const { data: response, isFetching } = useOrderDetailsQuery(computedQueryParams)
const { mutate: deleteOrderDetail } = useDeleteOrderDetailMutation({
  onMutate: async (id) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: [QueryKey.ORDER_DETAIL] })

    // Snapshot the previous value
    const previousOrderDetails = queryClient.getQueryData([
      QueryKey.ORDER_DETAIL,
      computedQueryParams
    ]) as AxiosResponse<QueryResponse<OrderDetail[]>>

    // Optimistically update to the new value
    queryClient.setQueryData(
      [QueryKey.ORDER_DETAIL, computedQueryParams],
      (oldOrderDetail?: AxiosResponse<QueryResponse<OrderDetail[]>>) => {
        if (!oldOrderDetail) return oldOrderDetail
        return {
          ...oldOrderDetail,
          data: {
            ...oldOrderDetail.data,
            data: oldOrderDetail.data.data?.filter((od) => od.id !== id)
          }
        }
      }
    )

    // Return a context object with the snapshotted value
    return { previousOrderDetails }
  },
  onError: (_err, _newTodo, context) => {
    const mutationContext = context as {
      previousOrderDetails?: AxiosResponse<QueryResponse<OrderDetail[]>>
    }
    queryClient.setQueryData(
      [QueryKey.ORDER_DETAIL, computedQueryParams],
      mutationContext.previousOrderDetails ?? []
    )
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.ORDER_DETAIL] })
  }
})

const handlePageChange = (event: DataTablePageEvent) => {
  router.push({
    path: route.path,
    query: {
      ...routeQuery.value,
      page: event.page + 1,
      pageSize: event.rows
    }
  })
}
const handleSortChange = (event: DataTableSortEvent) => {
  router.push({
    path: route.path,
    query: {
      ...routeQuery.value,
      sortOrder: event.sortOrder,
      sortField: event.sortField as string
    }
  })
}
const searchDebounce = throttle((e: Event) => {
  router.push({
    path: route.path,
    query: {
      ...routeQuery.value,
      search: (e.target as any).value
    }
  })
}, 250)
</script>

<template>
  <h1 class="text-xl mb-6">Orders</h1>
  <div class="rounded-xl border-default p-4 bg-white">
    <div class="flex w-full justify-end mb-4">
      <Button
        label="Create Order"
        icon="pi pi-plus"
        size="small"
        @click="router.push('/orders/create' as AppRoute)"
      ></Button>
      <span class="p-input-icon-left ml-4">
        <i class="pi pi-search"></i>
        <InputText placeholder="Search" @input="searchDebounce" />
      </span>
    </div>
    <DataTable
      :value="response?.data.data ?? []"
      tableStyle="min-width: 50rem"
      showGridlines
      :loading="isFetching"
      lazy
      paginator
      :totalRecords="response?.data.meta?.pagination?.total"
      @page="handlePageChange"
      @sort="handleSortChange"
      :sortField="routeQuery?.sortField"
      :sortOrder="routeQuery?.sortOrder"
      :first="0"
      :rows="routeQuery?.pageSize"
      :rowsPerPageOptions="[5, 10, 20]"
      :pt="{
        wrapper: '',
        root: 'rounder-xl'
      }"
    >
      <Column field="id" header="ID"></Column>
      <Column sortable field="user.username" header="User"></Column>
      <Column sortable field="phoneNumber" header="Phone Number"></Column>
      <Column sortable field="email" header="Email"></Column>
      <Column sortable field="orderStatus" header="Status"></Column>

      <Column>
        <template #body="{ data }">
          <div class="w-full flex justify-center items-center space-x-4">
            <RouterLink :to="`/orders/${data.id}`">
              <i class="pi pi-pencil cursor-pointer"></i>
            </RouterLink>
            <i class="pi pi-trash cursor-pointer" @click="() => deleteOrderDetail(data.id)"></i>
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="w-full flex justify-center items-center h-60">No data.</div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped></style>
