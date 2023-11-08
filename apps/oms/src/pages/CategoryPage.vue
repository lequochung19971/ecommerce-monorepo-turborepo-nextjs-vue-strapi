<script setup lang="ts">
import DropdownField from '@/components/form/DropdownField.vue'
import EditorField from '@/components/form/EditorField.vue'
import InputTextField from '@/components/form/InputTextField.vue'
import { useCreateCategoryMutation } from '@/composables/useCreateCategoryMutation'
import { useGetCategoriesQuery } from '@/composables/useGetCategoriesQuery'
import { useGetCategoryQuery } from '@/composables/useGetCategoryQuery'
import { useUpdateCategoryMutation } from '@/composables/useUpdateCategoryMutation'
import type { AppRoute } from '@/router'
import { toTypedSchema } from '@vee-validate/zod'
import { kebabCase } from 'lodash'
import { useToast } from 'primevue/usetoast'
import { type Category, type CreateCategoryRequest, type UpdateCategoryRequest } from 'types'
import { useField, useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

type CategoryForm = Partial<Pick<Category, 'name' | 'slug' | 'parentCategory' | 'description'>>

const props = defineProps<{ mode: 'create' | 'edit' }>()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const { data: queryCategoriesResponse, isLoading: isGetCategoriesLoading } = useGetCategoriesQuery({
  populate: '*'
})

const { data: getCategoryResponse, isSuccess } = useGetCategoryQuery(
  {
    id: (route.params.id as string) ?? '',
    params: {
      populate: '*'
    }
  },
  {
    enabled: !!route.params.id && props.mode === 'edit'
  }
)

const currentCategory = computed(() => getCategoryResponse.value?.data.data)

const { mutateAsync: createCategory, isLoading: isCreateCategoryLoading } =
  useCreateCategoryMutation()
const { mutateAsync: updateCategory, isLoading: isUpdateCategoryLoading } =
  useUpdateCategoryMutation()

const { resetForm, handleSubmit, meta } = useForm<CategoryForm>({
  initialValues: currentCategory.value ?? {
    name: '',
    parentCategory: {
      id: undefined
    },
    slug: '',
    description: ''
  },
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().nonempty().nullable(),
      slug: z.string().nonempty().nullable(),
      description: z.string(),
      parentCategory: z.object({
        id: z.number().nullish()
      })
    })
  )
})

watch(
  () => ({
    category: getCategoryResponse.value?.data.data,
    isSuccess
  }),
  ({ category, isSuccess }) => {
    if (isSuccess) {
      resetForm({
        values: {
          description: category?.description,
          name: category?.name,
          parentCategory: {
            id: category?.parentCategory?.id
          },
          slug: category?.slug
        }
      })
    }
  }
)

const categories = computed(() => queryCategoriesResponse.value?.data.data)

const doCreateCategory = async (request: CreateCategoryRequest) => {
  try {
    await createCategory(request)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Create successfully',
      life: 3000
    })
    router.push('/categories' as AppRoute)
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Create fail', life: 3000 })
  }
}

const doUpdateCategory = async (request: UpdateCategoryRequest) => {
  try {
    await updateCategory(request)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Update successfully',
      life: 3000
    })
    router.push('/categories' as AppRoute)
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Update fail', life: 3000 })
  }
}

const onSubmit = handleSubmit(async (formValue) => {
  if (props.mode === 'create') {
    doCreateCategory({
      name: formValue.name!,
      description: formValue.description!,
      parentCategory: {
        id: formValue.parentCategory?.id!
      },
      slug: formValue.slug!
    })
  } else if (props.mode === 'edit') {
    doUpdateCategory({
      id: route.params.id as string,
      name: formValue.name,
      description: formValue.description,
      parentCategory: {
        id: formValue.parentCategory?.id!
      },
      slug: formValue.slug!
    })
  }
})

const slugFieldValue = useField('slug')
</script>
<template>
  <form @submit="onSubmit" class="page-container">
    <section class="flex flex-row flex-wrap mx-[-0.5rem]">
      <InputTextField
        :containerProps="{
          class: 'w-1/2 px-2 pb-2'
        }"
        label="Name *"
        name="name"
        placeholder="Enter a name"
        @input="
          (e) => {
            slugFieldValue.setValue(
              (e.target as any).value
                ? `${kebabCase((e.target as any).value)}-${new Date().getTime()}`
                : ''
            )
          }
        "
      ></InputTextField>
      <InputTextField
        :containerProps="{
          class: 'w-1/2 px-2 pb-2'
        }"
        label="Slug *"
        name="slug"
        placeholder="Enter a slug"
        readOnly
      ></InputTextField>
      <DropdownField
        label="Parent Category *"
        name="parentCategory.id"
        :options="categories ?? []"
        optionLabel="name"
        optionValue="id"
        placeholder="Select Products"
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
      </DropdownField>
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
      <Button
        type="submit"
        :disabled="!meta.dirty"
        :loading="isCreateCategoryLoading || isUpdateCategoryLoading"
        >Save</Button
      >
    </section>
  </form>
</template>

<style scoped></style>
