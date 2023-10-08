<script setup lang="ts">
import { useQueryOrderDetails } from '@/composables/useQueryOrderDetails'
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import { reactive, watch } from 'vue'

const queryParams = reactive({
  populate: '*',
  pagination: {
    page: 1,
    pageSize: 10
  },
  sort: [] as string[]
})
const {
  data: response,
  isError,
  isLoading,
  isFetching,
  error,
  isSuccess
} = useQueryOrderDetails(queryParams)
watch(
  () => response.value?.data,
  (a) => console.log(a)
)
const handlePageChange = (event: DataTablePageEvent) => {
  queryParams.pagination.page = event.page + 1
  queryParams.pagination.pageSize = event.rows
}
const handleSortChange = (event: DataTableSortEvent) => {
  const sortConfig = {
    [1]: 'asc',
    [-1]: 'desc'
  }

  if (typeof event.sortField === 'string') {
    queryParams.sort = [
      event.sortOrder ? `${event.sortField}:${sortConfig[event.sortOrder]}` : event.sortField
    ]
  }
}
</script>

<template>
  <h1 class="text-xl mb-6">Order Management</h1>
  <div class="rounded-xl border-default p-4 bg-white">
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
      :first="0"
      :rows="3"
      :pt="{
        wrapper: '',
        root: 'rounder-xl'
      }"
    >
      <Column field="id" header="ID"></Column>
      <Column sortable field="orderStatus" header="Status"></Column>
      <Column sortable field="phoneNumber" header="Phone Number"></Column>
      <Column sortable field="email" header="Email"></Column>
      <Column>
        <template #body="{ data }">
          <div class="w-full flex justify-center">
            <RouterLink :to="`/order-management/${data.id}`">
              <i class="pi pi-pencil cursor-pointer"></i>
            </RouterLink>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
@/composables/useQueryOrderDetails
