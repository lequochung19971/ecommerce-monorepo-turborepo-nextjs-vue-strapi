<script setup lang="ts">
import SearchField from '@/components/SearchField.vue'
import { useDeleteCategoryMutation } from '@/composables/useDeleteCategoryMutation'
import { useGetCategoriesQuery } from '@/composables/useGetCategoriesQuery'
import { useRouteFilter } from '@/composables/useRouteFilter'
import { convertToSortString } from '@/helpers/convertToSortString'
import type { AppRoute } from '@/router'
import { QueryKey } from '@/types/queryKey'
import type { QueryResponse } from '@/types/queryResponse'
import { useQueryClient } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import type { DataTablePageEvent, DataTableSortEvent } from 'primevue/datatable'
import MultiSelect from 'primevue/multiselect'
import { useToast } from 'primevue/usetoast'
import type { Category } from 'types'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const [routeFilterParams, upsertRouteFieldParams] = useRouteFilter()
const queryClient = useQueryClient()
const toast = useToast()

const queryCategoriesParams = computed(() => {
  return {
    populate: ['childCategories', 'childCategories.childCategories', 'parentCategory'],
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
const { data: response, isFetching } = useGetCategoriesQuery(queryCategoriesParams)
const { mutate: deleteCategory } = useDeleteCategoryMutation({
  onMutate: async (id) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: [QueryKey.CATEGORIES] })

    // Snapshot the previous value
    const previousCategories = queryClient.getQueryData([
      QueryKey.CATEGORIES,
      queryCategoriesParams
    ]) as AxiosResponse<QueryResponse<Category[]>>

    // Optimistically update to the new value
    queryClient.setQueryData(
      [QueryKey.ORDER_DETAILS, queryCategoriesParams],
      (oldCategory?: AxiosResponse<QueryResponse<Category[]>>) => {
        if (!oldCategory) return oldCategory
        return {
          ...oldCategory,
          data: {
            ...oldCategory.data,
            data: oldCategory.data.data?.filter((od) => od.id !== id)
          }
        }
      }
    )

    // Return a context object with the snapshotted value
    return { previousCategories }
  },
  onError: (_err, _newTodo, context) => {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Delete fail', life: 3000 })
    const mutationContext = context as {
      previousCategories?: AxiosResponse<QueryResponse<Category[]>>
    }
    queryClient.setQueryData(
      [QueryKey.CATEGORIES, queryCategoriesParams],
      mutationContext.previousCategories ?? []
    )
  },
  onSuccess() {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Delete successfully',
      life: 3000
    })
  },
  onSettled: () => {
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

const handleDeleteCategory = (id: string) => {}
watch(
  () => response.value?.data?.data,
  (a) => console.log(a)
)
</script>

<template>
  <h1 class="text-xl mb-6">Categories</h1>
  <div class="rounded-xl border-default p-4 bg-white">
    <div class="flex w-full justify-end mb-4">
      <Button
        label="Create Category"
        icon="pi pi-plus"
        size="small"
        @click="router.push('/categories/create' as AppRoute)"
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
      <Column sortable field="name" header="Name"></Column>
      <Column sortable field="parentCategory.name" header="Parent Category"></Column>
      <Column field="childCategories" header="Child Categories">
        <template #body="{ data = [] }">
          <template v-if="data.childCategories?.length">
            <MultiSelect
              class="w-full"
              :modelValue="data.childCategories.map((c: Category) => c.id)"
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              display="chip"
              :options="data.childCategories"
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
            <i class="pi pi-trash cursor-pointer" @click="deleteCategory(data.id)"></i>
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
@/composables/useGetCategoriesQuery
