<script setup lang="ts">
import { useDeleteOrderDetailMutation } from '@/composables/useDeleteOrderDetailMutation'
import { useGetOrderDetailsQuery } from '@/composables/useGetOrderDetailsQuery'
import type { AppRoute } from '@/router'
import { QueryKey } from '@/types/queryKey'
import type { QueryResponse } from '@/types/queryResponse'
import { useQueryClient } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import type { OrderDetail } from 'types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchField from '@/components/SearchField.vue'
import { useRouteFilter } from '@/composables/useRouteFilter'
import { convertToSortString } from '@/helpers/convertToSortString'

const router = useRouter()
const [routeFilterParams, upsertRouteFieldParams] = useRouteFilter()

const computedQueryParams = computed(() => {
  return {
    populate: '*',
    pagination: {
      page: routeFilterParams.value?.page ?? 1,
      pageSize: routeFilterParams.value?.pageSize ?? 5
    },
    sort: [
      convertToSortString(
        routeFilterParams.value?.sortField ?? '',
        routeFilterParams.value?.sortOrder ?? 0
      )
    ],
    filters: {
      user: {
        username: {
          $contains: routeFilterParams.value.search
        }
      }
    }
  }
})
const queryClient = useQueryClient()
const { data: response, isFetching } = useGetOrderDetailsQuery(computedQueryParams)
const { mutate: deleteOrderDetail } = useDeleteOrderDetailMutation({
  onMutate: async (id) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: [QueryKey.ORDER_DETAILS] })

    // Snapshot the previous value
    const previousOrderDetails = queryClient.getQueryData([
      QueryKey.ORDER_DETAILS,
      computedQueryParams
    ]) as AxiosResponse<QueryResponse<OrderDetail[]>>

    // Optimistically update to the new value
    queryClient.setQueryData(
      [QueryKey.ORDER_DETAILS, computedQueryParams],
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
      [QueryKey.ORDER_DETAILS, computedQueryParams],
      mutationContext.previousOrderDetails ?? []
    )
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: [QueryKey.ORDER_DETAILS] })
  }
})

const handlePageChange = (event: DataTablePageEvent) => {
  upsertRouteFieldParams({
    page: event.page + 1,
    pageSize: event.rows
  })
}
const handleSortChange = (event: DataTableSortEvent) => {
  upsertRouteFieldParams({
    sortOrder: event.sortOrder as number,
    sortField: event.sortField as string
  })
}

const handleOnSearch = (e: Event) => {
  upsertRouteFieldParams({
    search: (e.target as any).value
  })
}
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
      <SearchField @search="handleOnSearch" class="ml-4"></SearchField>
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
      :sortField="routeFilterParams?.sortField"
      :sortOrder="routeFilterParams?.sortOrder"
      :first="(routeFilterParams?.pageSize ?? 5) * ((routeFilterParams?.page ?? 1) - 1)"
      :rows="routeFilterParams?.pageSize ?? 5"
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
