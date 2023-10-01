<script setup lang="ts">
import { OrderStatus, PaymentStatus, PaymentType } from 'types'
import type { OrderDetail } from 'types'

const tableDataSource: OrderDetail[] = [
  {
    user: {
      email: 'hung@gmail.com',
      id: '1',
      username: 'hung'
    },
    email: 'hung2@gmail.com',
    id: '2',
    orderItems: [],
    orderStatus: OrderStatus.PENDING,
    paymentDetail: {
      id: '3',
      status: PaymentStatus.PENDING,
      type: PaymentType.CASH
    },
    phoneNumber: '1234567890'
  }
]
</script>

<template>
  <h1 class="text-xl mb-6">Order Management</h1>
  <div class="rounded-xl border-default p-4 bg-white">
    <DataTable
      :value="tableDataSource"
      tableStyle="min-width: 50rem"
      showGridlines
      :pt="{
        wrapper: '',
        root: 'rounder-xl'
      }"
    >
      <Column field="id" header="ID"></Column>
      <Column field="orderStatus" header="Status"></Column>
      <Column field="phoneNumber" header="Phone Number"></Column>
      <Column field="email" header="Email"></Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
