<script setup lang="ts">
import { computed, reactive, ref, toRef, watch } from 'vue'
import Dialog from 'primevue/dialog'
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload'
import { useGetFilesQuery } from '@/composables/useGetFilesQuery'
import type { Media } from 'types'
import MediaCard from '@/components/MediaCard.vue'
import { useUploadFileMutation } from '@/composables/useUploadFileMutation'
import { useToast } from 'primevue/usetoast'
import SearchField from '@/components/SearchField.vue'
import { useDeleteFileMutation } from '@/composables/useDeleteFileMutation'

const props = withDefaults(defineProps<{ visible: boolean; selectedMedias?: Media[] }>(), {
  visible: false
})

const emit = defineEmits<{
  (action: 'update:visible', value: boolean): void
  (action: 'update:selectedMedias', value: Media[]): void
}>()
const toast = useToast()

const { mutateAsync: uploadFile } = useUploadFileMutation()
const { mutate: deleteFile } = useDeleteFileMutation({
  onError() {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Delete File fail', life: 3000 })
  },
  onSuccess() {
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Delete File successfully',
      life: 3000
    })
  }
})

const visible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})
const searchValue = ref('')
const { data: getFilesResponse } = useGetFilesQuery({})
const selectedMedias = ref<Media[]>(props.selectedMedias ? [...props.selectedMedias] : [])

const medias = computed(
  () =>
    getFilesResponse.value?.data.filter((m) =>
      searchValue.value ? m.name.includes(searchValue.value) : true
    )
)

const handleRemoveSelectedMedia = (id: string | number) => {
  selectedMedias.value = selectedMedias.value.filter((m) => m.id !== id)
}

const saveSelectedMedia = () => {
  emit('update:selectedMedias', selectedMedias.value)
  emit('update:visible', false)
}

const handleUpload = async (event: FileUploadUploaderEvent) => {
  const file = (event.files as File[])[0]
  const formData = new FormData()
  formData.append('fileInfo.name', file.name)
  formData.append('files', file)
  try {
    const response = await uploadFile(formData)
    selectedMedias.value.push(response.data[0])
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Upload successfully',
      life: 3000
    })
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Upload fail', life: 3000 })
  }
}

watch(
  () => props.selectedMedias,
  (s) => {
    if (s) {
      selectedMedias.value = [...s]
    }
  }
)
</script>
<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Asset"
    :style="{ width: '60rem' }"
    :pt="{
      content: '!overflow-hidden'
    }"
  >
    <div class="flex justify-end">
      <FileUpload
        class="mr-2"
        mode="basic"
        customUpload
        auto
        accept="image/*"
        :maxFileSize="1000000"
        chooseLabel="Add New Asset"
        @uploader="handleUpload($event)"
      />
      <SearchField v-model="searchValue"></SearchField>
    </div>
    <TabView
      :pt="{
        panelContainer: '!p-0'
      }"
    >
      <TabPanel header="All">
        <section class="flex flex-wrap overflow-auto h-[35rem] pt-3">
          <template v-if="medias?.length">
            <div class="w-1/4 p-2" :key="media.id" v-for="media in medias">
              <MediaCard v-bind="media">
                <template #footer>
                  <div class="flex flex-nowrap justify-end">
                    <Button
                      class="mr-2"
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      @click="
                        () => {
                          deleteFile(media.id)
                          handleRemoveSelectedMedia(media.id)
                        }
                      "
                      outlined
                    />
                    <Button
                      v-if="!!selectedMedias.find((m) => m.id === media.id)"
                      @click="handleRemoveSelectedMedia(media.id)"
                      icon="pi pi-times"
                      size="small"
                      severity="secondary"
                      outlined
                    />
                    <Button
                      v-else
                      icon="pi pi-check"
                      size="small"
                      outlined
                      @click="selectedMedias.push(media)"
                    />
                  </div>
                </template>
              </MediaCard>
            </div>
          </template>
          <template v-else>
            <div class="h-full w-full flex justify-center items-center">
              <h2 class="text-xl font-bold">Result not found</h2>
            </div>
          </template>
        </section>
      </TabPanel>
      <TabPanel header="Selected">
        <section class="flex flex-wrap overflow-auto h-[35rem] pt-3">
          <template v-if="!!selectedMedias?.length">
            <div class="w-1/4 p-2" :key="media.id" v-for="media in selectedMedias">
              <MediaCard v-bind="media">
                <template #footer>
                  <div class="flex flex-nowrap justify-end">
                    <Button
                      icon="pi pi-times"
                      @click="handleRemoveSelectedMedia(media.id)"
                      size="small"
                      severity="secondary"
                      style="margin-left: 0.5em"
                      outlined
                    />
                  </div>
                </template>
              </MediaCard>
            </div>
          </template>
          <template v-else>
            <div class="h-full w-full flex justify-center items-center">
              <h2 class="text-xl font-bold">Result not found</h2>
            </div>
          </template>
        </section>
      </TabPanel>
    </TabView>

    <template #footer>
      <Button class="!mr-0" @click="saveSelectedMedia">Save</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>
