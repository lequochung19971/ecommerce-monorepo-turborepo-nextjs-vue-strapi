<script setup lang="ts">
import { useQueryOrderDetail } from '@/composables/useQueryOrderDetail'
import { watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ReadOnlyText from '@/components/form/ReadOnlyText.vue'
import { useForm } from 'vee-validate'
import { OrderStatus, type OrderDetail, PaymentProvider, PaymentStatus, PaymentType } from 'types'
import InputTextField from '@/components/form/InputTextField.vue'
import DropdownField from '@/components/form/DropdownField.vue'
import type { DataSource } from '@/types/dataSource'
import { getCities, getDistricts, getWards } from 'configs'

const orderStatusOptions: DataSource<OrderStatus>[] = [
  {
    label: 'Pending',
    value: OrderStatus.PENDING
  },
  {
    label: 'Cancelled',
    value: OrderStatus.CANCELLED
  },
  {
    label: 'Delivered',
    value: OrderStatus.DELIVERED
  },
  {
    label: 'Processing',
    value: OrderStatus.PROCESSING
  },
  {
    label: 'Shipped',
    value: OrderStatus.SHIPPED
  }
]
const cities = getCities()
const districts = getDistricts()
const wards = getWards()

const { params } = useRoute()
const { id } = params
const { data, isSuccess } = useQueryOrderDetail(
  {
    id: id as string,
    params: {
      populate: {
        orderItems: {
          populate: {
            product: {
              populate: '*'
            }
          }
        },
        paymentDetail: true,
        user: true,
        address: true
      }
    }
  },
  {
    enabled: !!id
  }
)
const { resetForm, setValues, setFieldValue } = useForm<OrderDetail>({
  initialValues: {
    id: '',
    orderItems: [],
    orderStatus: OrderStatus.PENDING,
    email: '',
    paymentDetail: {
      id: '',
      extraInfo: '',
      provider: undefined,
      status: PaymentStatus.PENDING,
      type: PaymentType.CASH
    },
    address: {
      address1: '',
      address2: '',
      city: '',
      country: '',
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
    }
  }
})
watchEffect(() => {
  console.log('isSuccess.value', isSuccess.value)
})
watchEffect(() => {
  console.log('data.value?.data.data', data.value?.data.data)
})
watch(
  () => ({
    isSuccess: isSuccess.value,
    orderDetail: data.value?.data.data
  }),
  (watchedResult) => {
    if (watchedResult.isSuccess && watchedResult.orderDetail) {
      resetForm({
        values: watchedResult.orderDetail
      })
    }
  }
)
</script>

<template>
  <div class="rounded-xl border-default p-4 bg-white">
    <section>
      <h1 class="text-xl mb-6">Customer</h1>
      <div class="flex flex-row justify-between mx-[-0.5rem]">
        <ReadOnlyText
          :containerProps="{
            class: 'w-1/3 px-2'
          }"
          label="First Name"
          text="Le"
        ></ReadOnlyText>
        <ReadOnlyText
          :containerProps="{
            class: 'w-1/3 px-2'
          }"
          label="Last Name"
          text="Hung"
        ></ReadOnlyText>
        <ReadOnlyText
          :containerProps="{
            class: 'w-1/3 px-2'
          }"
          label="Email"
          text="lequochung19971@gmail.com"
        ></ReadOnlyText>
      </div>
    </section>
    <section class="mt-4">
      <h1 class="text-xl mb-6">Order Information</h1>
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
          :options="orderStatusOptions"
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
  </div>
</template>

<style scoped></style>
