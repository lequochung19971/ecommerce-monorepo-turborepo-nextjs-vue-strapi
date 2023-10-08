<script setup lang="ts">
import googleIcon from '@/assets/googleIcon.png'
import Logo from '@/components/shell/Logo.vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import useAuth from '@/composables/useAuth'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import InputTextField from '@/components/form/InputTextField.vue'

type SignInForm = {
  email: string
  password: string
}

const { emailSignIn, googleSignIn } = useAuth()
const toast = useToast()
const router = useRouter()

const { handleSubmit, errors, defineComponentBinds, defineInputBinds } = useForm<SignInForm>({
  initialValues: {
    email: '',
    password: ''
  },
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().nonempty().nullable(),
      password: z.string().nonempty().nullable()
    })
  )
})

const email = defineComponentBinds('email')
const password = defineComponentBinds('password')

const handleGoogleSignIn = async () => {
  try {
    await googleSignIn()
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Sign in success',
      life: 1000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Sign in error',
      detail: 'Cannot Sign with this google account',
      life: 1000
    })
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await emailSignIn(values)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Sign in success',
      life: 1000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Sign in error',
      detail: 'Cannot Sign with this email',
      life: 1000
    })
  }
})
</script>

<template>
  <div class="h-[100vh] w-full flex justify-center items-center flex-col">
    <Logo class="custom-logo" />
    <h1 class="text-2xl font-bold mb-6">Sign in to your account</h1>
    <Card>
      <template #content>
        <form @submit="onSubmit" class="space-y-6">
          <InputTextField
            :containerProps="{
              class: 'w-full'
            }"
            name="email"
            label="Email *"
            placeholder="Enter an email"
          ></InputTextField>

          <div class="flex flex-col w-full">
            <label class="mb-2" for="password">Password *</label>
            <Password
              v-bind="password"
              id="password"
              :class="{ 'p-invalid': !!errors.password }"
              toggleMask
              feedback
              placeholder="Enter an password"
            />
            <small class="p-error" id="text-error">{{ errors.password }}</small>
          </div>
          <Button type="submit" label="Submit">Sign In</Button>
          <Divider align="center" type="solid">
            <b class="text-sm">or continue with</b>
          </Divider>
          <Button type="button" severity="secondary" outlined icon="" @click="handleGoogleSignIn">
            <img class="h-5" :src="googleIcon" />
          </Button>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.p-card {
  width: 400px;
}
:deep(.p-password-input) {
  @apply w-full;
}
.p-button {
  @apply w-full justify-center;
}
.custom-logo {
  @apply text-lg mb-5;
  :deep(> span) {
    @apply text-2xl py-1 px-6;
  }
}
</style>
