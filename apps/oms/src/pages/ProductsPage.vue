<script setup lang="ts">
import SearchField from '@/components/SearchField.vue'
import { useDeleteProductMutation } from '@/composables/useDeleteProductMutation'
import { useGetProductsQuery } from '@/composables/useGetProductsQuery'
import { useRouteFilter } from '@/composables/useRouteFilter'
import { convertToSortString } from '@/helpers/convertToSortString'
import type { AppRoute } from '@/router'
import { QueryKey } from '@/types/queryKey'
import type { QueryResponse } from '@/types/queryResponse'
import { useQueryClient } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import { useToast } from 'primevue/usetoast'
import type { Category, Product } from 'types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const VITE_API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const [routeFilterParams, upsertRouteFieldParams] = useRouteFilter()
const queryClient = useQueryClient()
const toast = useToast()
const queryParams = computed(() => {
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
      name: {
        $contains: routeFilterParams.value.search
      }
    }
  }
})

const { data: response, isFetching } = useGetProductsQuery(queryParams)
const { mutate: deleteProduct } = useDeleteProductMutation({
  onMutate: async (id) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: [QueryKey.PRODUCTS] })

    // Snapshot the previous value
    const previousProducts = queryClient.getQueryData([
      QueryKey.PRODUCTS,
      queryParams
    ]) as AxiosResponse<QueryResponse<Product[]>>

    // Optimistically update to the new value
    queryClient.setQueryData(
      [QueryKey.PRODUCTS, queryParams],
      (oldProduct?: AxiosResponse<QueryResponse<Product[]>>) => {
        if (!oldProduct) return oldProduct
        return {
          ...oldProduct,
          data: {
            ...oldProduct.data,
            data: oldProduct.data.data?.filter((od) => od.id !== id)
          }
        }
      }
    )

    // Return a context object with the snapshotted value
    return { previousProducts }
  },
  onError: (_err, _newTodo, context) => {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Delete fail', life: 3000 })
    const mutationContext = context as {
      previousProducts?: AxiosResponse<QueryResponse<Product[]>>
    }
    queryClient.setQueryData(
      [QueryKey.PRODUCTS, queryParams],
      mutationContext.previousProducts ?? []
    )
  },
  onSuccess() {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Delete successfully',
      life: 3000
    })
    queryClient.invalidateQueries({ queryKey: [QueryKey.CATEGORIES] })
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
  <h1 class="text-xl mb-6">Products</h1>
  <div class="rounded-xl border-default p-4 bg-white">
    <div class="flex w-full justify-end mb-4">
      <Button
        label="Create Product"
        icon="pi pi-plus"
        size="small"
        @click="router.push('/products/create' as AppRoute)"
      ></Button>
      <SearchField @search="handleOnSearch" class="ml-4"></SearchField>
    </div>
    <DataTable
      :value="response?.data.data ?? []"
      tableStyle="min-width: 50rem"
      :loading="isFetching"
      showGridlines
      lazy
      paginator
      :first="0"
      :rowsPerPageOptions="[5, 10, 20]"
      :totalRecords="response?.data.meta?.pagination?.total"
      @page="handlePageChange"
      @sort="handleSortChange"
      :sortField="routeFilterParams?.sortField"
      :sortOrder="routeFilterParams?.sortOrder"
      :rows="routeFilterParams?.pageSize ?? 5"
      :pt="{
        wrapper: '',
        root: 'rounder-xl'
      }"
    >
      <Column field="id" header="ID"></Column>
      <Column header="Image">
        <template #body="{ data }">
          <template v-if="(data as Product).media?.[0].url">
            <img
              :src="`${VITE_API_URL}${(data as Product).media?.[0].url}`"
              :alt="(data as Product).media?.[0].alternativeText"
              class="w-[3rem] shadow-lg rounded-lg"
            />
          </template>
        </template>
      </Column>

      <Column sortable field="name" header="Name"></Column>
      <Column field="categories" header="Categories">
        <template #body="{ data = [] }">
          <template v-if="data.categories?.length">
            <MultiSelect
              class="w-full"
              :modelValue="data.categories.map((c: Category) => c.id)"
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              display="chip"
              :options="data.categories"
              :pt="{
                wrapper: 'w-full'
              }"
            ></MultiSelect>
          </template>
        </template>
      </Column>

      <Column>
        <template #body="{ data }">
          <div class="w-full flex justify-center items-center space-x-4">
            <RouterLink :to="`/categories/${data.id}`">
              <i class="pi pi-pencil cursor-pointer"></i>
            </RouterLink>
            <i class="pi pi-trash cursor-pointer" @click="deleteProduct(data.id)"></i>
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
