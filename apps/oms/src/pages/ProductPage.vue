<script setup lang="ts">
import EditorField from '@/components/form/EditorField.vue'
import InputNumberField from '@/components/form/InputNumberField.vue'
import InputTextField from '@/components/form/InputTextField.vue'
import MultipleSelectField from '@/components/form/MultipleSelectField.vue'
import { useCreateProductMutation } from '@/composables/useCreateProductMutation'
import { useGetCategoriesQuery } from '@/composables/useGetCategoriesQuery'
import type { AppRoute } from '@/router'
import { toTypedSchema } from '@vee-validate/zod'
import Carousel from 'primevue/carousel'
import { useToast } from 'primevue/usetoast'
import type { Media, Product } from 'types'
import { useField, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'
import { useGetProductQuery } from '@/composables/useGetProductQuery'
import { useUpdateProductMutation } from '@/composables/useUpdateProductMutation'

const VITE_API_URL = import.meta.env.VITE_API_URL

type ProductForm = Pick<Product, 'name' | 'description' | 'price' | 'sku' | 'media'> & {
  categoryIds: (string | number)[]
}
const props = defineProps<{
  mode: 'create' | 'edit'
}>()
const route = useRoute()
const router = useRouter()
const { data: queryCategoriesResponse, isLoading: isGetCategoriesLoading } = useGetCategoriesQuery({
  populate: '*'
})
const { data: getProductResponse, isSuccess: isGetProductSuccess } = useGetProductQuery(
  {
    id: route.params.id as string,
    params: {
      populate: '*'
    }
  },
  {
    enabled: !!route.params.id && props.mode === 'edit'
  }
)
const { mutate: updateProduct } = useUpdateProductMutation({
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Update successfully',
      life: 3000
    })
    router.push('/products' as AppRoute)
  },
  onError: () => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Update fail',
      life: 3000
    })
  }
})
const categories = computed(() => queryCategoriesResponse.value?.data.data)
const toast = useToast()

const { mutate: createProduct, isLoading: isCreateProductLoading } = useCreateProductMutation({
  onSuccess: () => {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Create successfully',
      life: 3000
    })
    router.push('/products' as AppRoute)
  },
  onError: () => {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Create fail',
      life: 3000
    })
  }
})

const visible = ref(false)

const { resetForm, handleSubmit, meta } = useForm<ProductForm>({
  initialValues: getProductResponse.value?.data.data
    ? {
        categoryIds: getProductResponse.value?.data.data?.categories.map((c) => c.id),
        description: getProductResponse.value?.data.data?.description,
        media: getProductResponse.value?.data.data?.media,
        name: getProductResponse.value?.data.data?.name,
        price: +getProductResponse.value?.data.data?.price!,
        sku: getProductResponse.value?.data.data?.sku
      }
    : {
        name: '',
        sku: '',
        description: '',
        price: 0,
        categoryIds: [],
        media: undefined
      },
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().nonempty().nullable(),
      description: z.string(),
      sku: z.string().nonempty().nullable(),
      price: z.number().min(1).nullable(),
      categoryIds: z.array(z.number()).nonempty().nullable(),
      media: z.array(z.any())
    })
  )
})

const mediaField = useField<Media[]>('media')
const mediaFieldValue = mediaField.value

const handleSave = handleSubmit((formValue) => {
  if (props.mode === 'create') {
    createProduct({
      categories: formValue.categoryIds.map((id) => ({
        id
      })),
      name: formValue.name,
      price: formValue.price,
      sku: formValue.sku,
      description: formValue.description,
      media: formValue.media
    })
  } else {
    updateProduct({
      id: getProductResponse.value?.data.data?.id!,
      categories: formValue.categoryIds.map((id) => ({
        id
      })),
      name: formValue.name,
      price: formValue.price,
      sku: formValue.sku,
      description: formValue.description,
      media: formValue.media
    })
  }
})
watch(
  () => ({
    product: getProductResponse.value?.data.data,
    isSuccess: isGetProductSuccess
  }),
  ({ isSuccess, product }) => {
    if (isSuccess) {
      resetForm({
        values: {
          categoryIds: product?.categories.map((c) => c.id),
          description: product?.description,
          media: product?.media,
          name: product?.name,
          price: +product?.price!,
          sku: product?.sku
        }
      })
    }
  }
)
</script>
<template>
  <AssetDialog v-model:visible="visible" v-model:selectedMedias="mediaFieldValue"></AssetDialog>
  <form @submit="handleSave" class="page-container">
    <section class="flex flex-row flex-wrap mx-[-0.5rem]">
      <InputTextField
        :containerProps="{
          class: 'w-1/2 px-2 pb-2'
        }"
        label="Name *"
        name="name"
        placeholder="Enter a name"
      ></InputTextField>
      <MultipleSelectField
        label="Category *"
        name="categoryIds"
        :options="categories ?? []"
        optionLabel="name"
        optionValue="id"
        placeholder="Select Categories"
        dataKey="id"
        display="chip"
        filter
        showClear
        :containerProps="{
          class: 'w-1/2 px-2 pb-2'
        }"
        :virtualScrollerOptions="{
          lazy: true,
          itemSize: 38
        }"
        :loading="isGetCategoriesLoading"
      >
      </MultipleSelectField>
      <InputTextField
        :containerProps="{
          class: 'w-1/2 px-2 pb-2'
        }"
        label="Sku *"
        name="sku"
        placeholder="Enter a sku"
      ></InputTextField>
      <InputNumberField
        showButtons
        mode="currency"
        currency="USD"
        locale="en-US"
        :containerProps="{
          class: 'w-1/2 px-2 pb-2'
        }"
        label="Price *"
        name="price"
        placeholder="Enter price"
      ></InputNumberField>
      <section class="w-full px-2 pb-2">
        <label class="mb-2 block">Images</label>
        <div class="w-full border-default rounded-lg">
          <header class="bg-gray-f9f border-default-b p-2 rounded-t-lg">
            <Button icon="pi pi-plus" rounded outlined @click="visible = true"></Button>
          </header>
          <div v-if="mediaFieldValue?.length" class="px-4 pt-4">
            <Carousel
              :value="mediaFieldValue"
              :numScroll="1"
              :numVisible="1"
              :pt="{
                root: 'w-full'
              }"
            >
              <template #item="slotProps">
                <div class="w-full h-56 flex justify-center">
                  <img
                    class="h-full"
                    :src="`${VITE_API_URL}${slotProps.data.url}`"
                    :alt="`${VITE_API_URL}${slotProps.data.alternativeText}`"
                  />
                </div>
              </template>
            </Carousel>
          </div>
          <div v-else class="w-full h-full flex justify-center items-center h-40">
            <h2 class="text-lg font-bold">No Data</h2>
          </div>
        </div>
      </section>

      <EditorField
        label="Description"
        name="description"
        :containerProps="{
          class: 'w-full px-2 pb-2'
        }"
        editorStyle="height: 320px;"
      />
    </section>
    <section class="w-full text-right">
      <Button type="submit" :disabled="!meta.dirty" :loading="isCreateProductLoading">Save</Button>
    </section>
  </form>
</template>

<style scoped></style>
