<script setup lang="ts">
import { useOrderDetailQuery } from '@/composables/useOrderDetailQuery'
import { computed, reactive, ref, toValue, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import {
  OrderStatus,
  type OrderDetail,
  type OrderItem,
  PaymentStatus,
  PaymentMethod,
  type Product
} from 'types'
import InputTextField from '@/components/form/InputTextField.vue'
import DropdownField from '@/components/form/DropdownField.vue'
import InputNumberField from '@/components/form/InputNumberField.vue'
import {
  getCities,
  getDistricts,
  getWards,
  orderStatusDataSource,
  paymentMethodDataSource,
  paymentProviderDataSource,
  paymentStatusDataSource
} from 'configs'
import { useOrderItemsQuery } from '@/composables/useOrderItemsQuery'
import { useUsersQuery } from '@/composables/useUsersQuery'
import { useUpdateOrderDetailMutation } from '@/composables/useUpdateOrderDetailMutation'
import { useUpdatePaymentDetailMutation } from '@/composables/useUpdatePaymentDetailMutation'
import { useToast } from 'primevue/usetoast'
import { useProductsQuery } from '@/composables/useProductsQuery'
import { v4 as uuidv4 } from 'uuid'
import InputNumber from 'primevue/inputnumber'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { ApiUrl } from 'types'
import { QueryKey } from '@/types/queryKey'
import httpClient from '@/httpClient'
import type { QueryResponse } from '@/types/queryResponse'
import type { CreateOrderDetailRequest } from 'types'
import { useCreateOrderDetailMutation } from '@/composables/useCreateOrderDetailMutation'
import type { AppRoute } from '@/router'
const props = withDefaults(defineProps<{ mode: 'create' | 'edit' }>(), {
  mode: 'create'
})

const VITE_API_URL = import.meta.env.VITE_API_URL

const cities = getCities()
const districts = getDistricts()
const wards = getWards()

const toast = useToast()
const router = useRouter()
const { params } = useRoute()
const { id = '' } = params
const { data: response, isSuccess } = useOrderDetailQuery(
  {
    id: id as string,
    params: {
      populate: {
        paymentDetail: true,
        user: true,
        address: true,
        rider: true
      }
    }
  },
  {
    enabled: !!id && props.mode === 'edit'
  }
)
const { data: queryUsersResponse } = useUsersQuery({
  populate: '*'
})
const { mutate: upsertOrderDetail, isLoading: isUpsertOrderDetailLoading } =
  useUpdateOrderDetailMutation()
const { mutate: upsertPaymentDetail, isLoading: isUpsertPaymentDetailLoading } =
  useUpdatePaymentDetailMutation()
const {
  mutate: createOrderDetail,
  isLoading: isCreateOrderDetailLoading,
  mutateAsync: createOrderDetailAsync
} = useCreateOrderDetailMutation()
const users = computed(() => queryUsersResponse.value?.data ?? [])

const currentOrderDetail = computed(() => response.value?.data.data)
const queryItemsParams = reactive({
  filters: {
    orderDetail: {
      id
    }
  },
  populate: {
    product: {
      populate: '*'
    }
  },
  pagination: {
    limit: -1
  },
  sort: [] as string[]
})
const { data: queryOrderItemsResponse, isFetching } = useOrderItemsQuery(queryItemsParams, {
  enabled: !!id
})

const search = ref('')

const { data, fetchNextPage } = useInfiniteQuery<QueryResponse<Product[]>>({
  queryKey: [QueryKey.PRODUCT, search],
  queryFn: ({ pageParam }) => {
    return httpClient
      .get(ApiUrl.PRODUCTS, {
        params: {
          populate: '*',
          pagination: {
            start: pageParam === undefined ? 0 : pageParam + 5,
            limit: 5
          },
          filters: {
            name: {
              $contains: search.value
            }
          },
          sort: [] as string[]
        }
      })
      .then((d) => d.data)
  },
  getNextPageParam: (lastPage) => {
    return lastPage.meta?.pagination?.start
  },
  enabled: props.mode === 'create'
})
const finalData = computed(() => {
  const lastPage = data.value?.pages?.[data.value?.pages.length - 1]
  return {
    data: data.value?.pages.reduce((result, page) => {
      return result.concat(page.data ?? [])
    }, [] as Product[]),
    meta: lastPage?.meta ?? {}
  }
})

const { resetForm, setFieldValue, handleSubmit, meta } = useForm<OrderDetail>({
  initialValues: currentOrderDetail.value ?? {
    id: '',
    orderItems: [],
    orderStatus: OrderStatus.PENDING,
    email: '',
    paymentDetail: {
      id: '',
      extraInfo: '',
      provider: undefined,
      status: PaymentStatus.PENDING,
      method: PaymentMethod.COD
    },
    address: {
      address1: '',
      address2: '',
      city: '',
      country: '84',
      district: '',
      postCode: '',
      ward: ''
    },
    phoneNumber: '',
    user: {
      id: '',
      email: '',
      username: '',
      firstName: '',
      lastName: ''
    },
    rider: {
      id: '',
      email: '',
      username: '',
      firstName: '',
      lastName: ''
    }
  }
})

function formatCurrency(value: number, opts: { locale?: string; currency?: string } = {}) {
  const { locale = 'en-US', currency = 'USD' } = opts
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    maximumFractionDigits: 2
  })
  return formatter.format(value)
}

const totalCost = computed(() => {
  const orderItems =
    props.mode === 'edit' ? queryOrderItemsResponse.value?.data.data : selectedOrderItems.value
  return (orderItems ?? []).reduce((total, item) => {
    total = total + +item.product.price * item.quantity
    return total
  }, 0)
})

const doUpdate = (formValue: OrderDetail) => {
  upsertOrderDetail({
    ...formValue,
    orderItems: undefined
  })
  upsertPaymentDetail(formValue.paymentDetail)
  resetForm({
    values: formValue
  })
  toast.add({ severity: 'success', summary: 'Success', detail: 'Edit successfully', life: 3000 })
}

const doCreate = async (formValue: OrderDetail) => {
  try {
    const request: CreateOrderDetailRequest = {
      address: formValue.address,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      user: formValue.user,
      orderItems: selectedOrderItems.value,
      payment: {
        method: formValue.paymentDetail.method!,
        provider: formValue.paymentDetail.provider
      },
      rider: formValue.rider
    }
    await createOrderDetailAsync(request)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Create successfully',
      life: 3000
    })
    router.push('/orders' as AppRoute)
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Create failed', life: 3000 })
  }
}

const onSubmit = handleSubmit((formValue) => {
  if (props.mode === 'edit') {
    doUpdate(formValue)
  } else if (props.mode === 'create') {
    doCreate(formValue)
  }
})

const selectedProductIds = ref([] as string[])
const selectedOrderItems = ref([] as OrderItem[])
const onLazyLoadProducts = (e: { last: number }) => {
  const { start = 0, total = 0, limit = 0 } = finalData.value.meta.pagination ?? {}
  if (start >= total) {
    return
  }

  if (start + limit === e.last) {
    fetchNextPage()
  }
}
const handleUpdateModelValue = (changedIds: string[]) => {
  const previousIds = selectedOrderItems.value.map((p) => p.product.id)
  const newIds = changedIds.filter((cid) => !previousIds.includes(cid))
  const deleteIds = previousIds.filter((pid) => !changedIds.includes(pid))
  const newOrderItems = (finalData.value.data ?? [])
    ?.filter((p) => newIds.includes(p.id))
    .map(
      (p) =>
        ({
          id: uuidv4(),
          quantity: 1,
          product: p
        }) as OrderItem
    )
  selectedOrderItems.value = selectedOrderItems.value.filter(
    (p) => !deleteIds.includes(p.product.id)
  )
  selectedOrderItems.value.push(...newOrderItems)
}
watch(data, (a) => console.log(a))
const removeOrderItem = (index: number) => {
  selectedOrderItems.value.splice(index, 1)
  selectedProductIds.value.splice(index, 1)
}

watch(
  () => ({
    isSuccess: isSuccess.value,
    orderDetail: currentOrderDetail
  }),
  (watchedResult) => {
    if (watchedResult.isSuccess && watchedResult.orderDetail) {
      resetForm({
        values: watchedResult.orderDetail.value
      })
    }
  }
)
</script>

<template>
  <form @submit="onSubmit" class="rounded-xl border-default p-4 bg-white space-y-4">
    <section>
      <h1 class="text-xl mb-6 text-primary"># Customer</h1>
      <div class="flex flex-row justify-between mx-[-0.5rem]">
        <template v-if="props.mode === 'create'">
          <DropdownField
            :containerProps="{
              class: 'w-1/3 px-2 pb-2'
            }"
            :options="users"
            optionLabel="username"
            placeholder="Select a customer"
            optionValue="id"
            label="Customer"
            name="user.id"
            :virtualScrollerOptions="{
              itemSize: 48
            }"
          ></DropdownField>
        </template>
        <template v-else>
          <InputTextField
            :containerProps="{
              class: 'w-1/4 px-2 pb-2'
            }"
            label="First Name"
            name="user.firstName"
            readOnly
          ></InputTextField>
          <InputTextField
            :containerProps="{
              class: 'w-1/4 px-2 pb-2'
            }"
            label="Last Name"
            name="user.lastName"
            readOnly
          ></InputTextField>
          <InputTextField
            :containerProps="{
              class: 'w-1/4 px-2 pb-2'
            }"
            label="Username"
            name="user.username"
            readOnly
          ></InputTextField>
          <InputTextField
            :containerProps="{
              class: 'w-1/4 px-2 pb-2'
            }"
            label="Email"
            name="user.email"
            readOnly
          ></InputTextField>
        </template>
      </div>
    </section>
    <section>
      <h1 class="text-xl mb-6 text-primary"># Order Information</h1>
      <div class="flex flex-row flex-wrap mx-[-0.5rem]">
        <InputTextField
          :containerProps="{
            class: 'w-1/3 px-2 pb-2'
          }"
          label="Phone Number"
          name="phoneNumber"
          placeholder="Enter a phone number"
        ></InputTextField>
        <InputTextField
          :containerProps="{
            class: 'w-1/3 px-2 pb-2'
          }"
          type="email"
          label="Email Address"
          name="email"
          placeholder="Enter an email"
        ></InputTextField>
        <DropdownField
          :containerProps="{
            class: 'w-1/3 px-2 pb-2'
          }"
          :options="orderStatusDataSource"
          optionLabel="label"
          optionValue="value"
          label="Status"
          name="orderStatus"
        ></DropdownField>
        <DropdownField
          :containerProps="{
            class: 'w-1/3 px-2 pb-2'
          }"
          :options="[
            {
              name: 'Vietnam',
              id: '84'
            }
          ]"
          disabled
          optionLabel="name"
          placeholder="Country"
          optionValue="id"
          label="Country"
          name="address.country"
        ></DropdownField>
        <DropdownField
          :containerProps="{
            class: 'w-1/3 px-2 pb-2'
          }"
          :options="cities"
          optionLabel="name"
          optionValue="id"
          label="City"
          placeholder="City"
          name="address.city"
          @change="
            () => {
              setFieldValue('address.district', '')
              setFieldValue('address.ward', '')
            }
          "
        ></DropdownField>
        <DropdownField
          :containerProps="{
            class: 'w-1/3 px-2 pb-2'
          }"
          :options="districts"
          optionLabel="name"
          optionValue="id"
          label="District"
          placeholder="District"
          name="address.district"
          @change="
            () => {
              setFieldValue('address.ward', '')
            }
          "
          :virtualScrollerOptions="{ itemSize: 48 }"
        ></DropdownField>
        <DropdownField
          :containerProps="{
            class: 'w-1/3 px-2 pb-2'
          }"
          :options="wards"
          optionLabel="name"
          optionValue="id"
          label="Ward"
          placeholder="Ward"
          name="address.ward"
          :virtualScrollerOptions="{ itemSize: 48 }"
        ></DropdownField>
        <InputTextField
          :containerProps="{
            class: 'w-2/3 px-2 pb-2'
          }"
          label="Address"
          name="address.address1"
          placeholder="Enter an address"
        ></InputTextField>
      </div>
    </section>
    <section>
      <h1 class="text-xl mb-6 text-primary"># Order Items</h1>
      <template v-if="props.mode === 'create'">
        <div class="w-full flex justify-end">
          <MultiSelect
            v-model="selectedProductIds"
            @update:modelValue="handleUpdateModelValue"
            :options="finalData.data ?? []"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Products"
            dataKey="id"
            display="chip"
            filter
            @filter="(e) => (search = e.value)"
            class="w-full mb-4 product-list"
            :pt="{
              virtualScroller: 'test',
              panel: 'test-panel'
            }"
            :virtualScrollerOptions="{
              lazy: true,
              onLazyLoad: onLazyLoadProducts,
              delay: 150,
              itemSize: 104,
              scrollHeight: '300px'
            }"
          >
            <template #option="slotProps">
              <div :key="slotProps.option.id" class="flex items-center">
                <img
                  :alt="slotProps.option.name"
                  :src="`${VITE_API_URL}${(slotProps.option as Product).media?.[0].url}`"
                  class="mr-4 ml-3 h-20 shadow-lg rounded-lg"
                />
                <div>{{ slotProps.option.name }}{{ slotProps.index }}</div>
              </div>
            </template>
            <template #footer>
              <div class="py-2 px-3">
                <b>{{ selectedProductIds ? selectedProductIds.length : 0 }}</b> product{{
                  (selectedProductIds ? selectedProductIds.length : 0) > 1 ? 's' : ''
                }}
                selected.
              </div>
            </template>
          </MultiSelect>
        </div>

        <DataTable
          :value="selectedOrderItems ?? []"
          tableStyle="min-width: 50rem;"
          scrollHeight="500px"
          showGridlines
          paginator
          :rowsPerPageOptions="[5, 10, 20]"
          :totalRecords="selectedOrderItems.length"
          :first="0"
          :rows="5"
        >
          <Column field="product.name" header="Name"></Column>
          <Column header="Image">
            <template #body="{ data: product }">
              <img
                :src="`${VITE_API_URL}${(product as OrderItem).product.media?.[0].url}`"
                :alt="(product as OrderItem).product.media?.[0].alternativeText"
                class="w-[3rem] shadow-lg rounded-lg"
              />
            </template>
          </Column>
          <Column field="product.price" header="Price">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.product.price) }}
            </template>
          </Column>
          <Column field="quantity" header="Quantity">
            <template #body="slotProps">
              <InputNumber
                showButtons
                v-model="selectedOrderItems[slotProps.index].quantity"
                :min="0"
                :max="100"
              ></InputNumber>
            </template>
          </Column>
          <Column>
            <template #body="slotProps">
              <Button
                icon="pi pi-times"
                severity="danger"
                rounded
                outlined
                aria-label="Cancel"
                @click="removeOrderItem(slotProps.index)"
              ></Button>
            </template>
          </Column>
          <template #empty>
            <div class="w-full flex justify-center items-center h-60">No data.</div>
          </template>
        </DataTable>
      </template>
      <template v-else>
        <DataTable
          :value="queryOrderItemsResponse?.data.data ?? []"
          tableStyle="min-width: 50rem;"
          scrollHeight="500px"
          showGridlines
          :loading="isFetching"
          lazy
          :totalRecords="queryOrderItemsResponse?.data.meta?.pagination?.total"
          :first="0"
          :rows="5"
        >
          <Column field="product.name" header="Name"></Column>
          <Column header="Image">
            <template #body="{ data: orderItem }">
              <img
                :src="`${VITE_API_URL}${(orderItem as OrderItem).product?.media?.[0].url}`"
                :alt="(orderItem as OrderItem).product?.media?.[0].alternativeText"
                class="w-[3rem] shadow-lg rounded-lg"
              />
            </template>
          </Column>
          <Column field="product.price" header="Price">
            <template #body="slotProps">
              {{ formatCurrency(slotProps.data.product.price) }}
            </template>
          </Column>
          <Column field="product.category[0].name" header="Category">
            <template #body="slotProps">
              {{ (slotProps.data as OrderItem).product?.categories?.[0].name }}
            </template>
          </Column>
          <Column field="quantity" header="Quantity"> </Column>
          <template #empty>
            <div class="w-full flex justify-center items-center h-60">No data.</div>
          </template>
        </DataTable>
      </template>
    </section>
    <section class="flex flex-row">
      <section class="w-3/4">
        <h1 class="text-xl mb-6 text-primary"># Payment</h1>
        <div class="flex flex-row flex-wrap mx-[-0.5rem]">
          <DropdownField
            :containerProps="{
              class: 'w-1/3 px-2 pb-2'
            }"
            :options="paymentMethodDataSource"
            readOnly
            optionLabel="label"
            optionValue="value"
            label="Method"
            name="paymentDetail.method"
          ></DropdownField>
          <DropdownField
            :containerProps="{
              class: 'w-1/3 px-2 pb-2'
            }"
            :options="paymentProviderDataSource"
            readOnly
            optionLabel="label"
            optionValue="value"
            label="Provider"
            name="paymentDetail.provider"
          ></DropdownField>
          <DropdownField
            :containerProps="{
              class: 'w-1/3 px-2 pb-2'
            }"
            :options="paymentStatusDataSource"
            optionLabel="label"
            optionValue="value"
            label="Status"
            name="paymentDetail.status"
          ></DropdownField>
        </div>
      </section>
      <section class="w-1/4 pl-4">
        <h1 class="text-xl mb-6 text-primary"># Delivery</h1>
        <div class="flex flex-wrap">
          <DropdownField
            :containerProps="{
              class: 'pb-2 w-full'
            }"
            :options="users"
            optionLabel="username"
            placeholder="Select a rider"
            optionValue="id"
            label="Rider"
            name="rider.id"
            :virtualScrollerOptions="{
              itemSize: 48
            }"
          ></DropdownField>
        </div>
      </section>
    </section>

    <section>
      <div class="w-full flex justify-end">
        <div class="w-1/2 pl-2">
          <h1 class="text-xl mb-6 text-primary"># Charges</h1>
          <div class="flex flex-col border border-solid border-gray-e5e">
            <div class="flex w-full border-b">
              <div class="w-1/2 p-2 border-r border-solid bg-gray-f8f">Sub total</div>
              <div class="w-1/2 p-2">{{ formatCurrency(totalCost) }}</div>
            </div>
            <div class="flex w-full border-b">
              <div class="w-1/2 p-2 border-r border-solid bg-gray-f8f">Delivery charges</div>
              <div class="w-1/2 p-2">{{ formatCurrency(0) }}</div>
            </div>
            <div class="flex w-full">
              <div class="w-1/2 p-2 border-r border-solid bg-gray-f8f">Total</div>
              <div class="w-1/2 p-2">{{ formatCurrency(totalCost) }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="w-full text-right">
      <Button
        type="submit"
        :loading="
          isUpsertOrderDetailLoading || isUpsertPaymentDetailLoading || isCreateOrderDetailLoading
        "
        :disabled="!meta.dirty"
        >Save</Button
      >
    </section>
  </form>
</template>

<style lang="scss">
.test-panel {
  .p-virtualscroller.p-virtualscroller {
    height: 300px !important;
  }
}
</style>
