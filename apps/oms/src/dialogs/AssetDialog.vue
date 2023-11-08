<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import FileUpload from 'primevue/fileupload'
import { useGetFilesQuery } from '@/composables/useGetFilesQuery'
import type { Media } from 'types'
import MediaCard from '@/components/MediaCard.vue'

const props = withDefaults(defineProps<{ visible: boolean; selectedMedias?: Media[] }>(), {
  visible: false
})

const emit = defineEmits<{
  (action: 'update:visible', value: boolean): void
  (action: 'update:selectedMedias', value: Media[]): void
}>()

const visible = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})
const { data: getFilesResponse } = useGetFilesQuery({})
const selectedMedias = ref<Media[]>(props.selectedMedias ? [...props.selectedMedias] : [])

const medias = computed(() => getFilesResponse.value?.data)

const handleRemoveSelectedMedia = (id: string | number) => {
  selectedMedias.value = selectedMedias.value.filter((m) => m.id !== id)
}

const saveSelectedMedia = () => {
  emit('update:selectedMedias', selectedMedias.value)
  emit('update:visible', false)
}
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
        mode="basic"
        name="demo[]"
        accept="image/*"
        :maxFileSize="1000000"
        :auto="true"
        chooseLabel="Add New Asset"
      />
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
                      v-if="!!selectedMedias.find((m) => m.id === media.id)"
                      @click="handleRemoveSelectedMedia(media.id)"
                      icon="pi pi-times"
                      size="small"
                      severity="secondary"
                      style="margin-left: 0.5em"
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
