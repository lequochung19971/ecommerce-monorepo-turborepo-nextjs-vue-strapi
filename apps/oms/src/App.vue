<script setup lang="ts">
import { onMounted } from 'vue'
import { googleOneTap, googleTokenLogin } from 'vue3-google-login'
import { decodeCredential } from 'vue3-google-login'
import { useToast } from 'primevue/usetoast'
import httpClient from './httpClient'
import { ApiUrl } from 'types'

const toast = useToast()
type UserLoginResponse = {
  jwt: string
  user: {
    id: string
    username: string
    email: string
  }
}
onMounted(() => {
  // googleOneTap()
  //   .then(async (response) => {
  //     console.log('Handle the response', response)
  //     console.log('Handle the response', decodeCredential(response.credential))
  //     const { data } = await httpClient.get<UserLoginResponse>(
  //       `${ApiUrl.AUTH_GOOGLE_CALLBACK}?access_token=${response.credential}`
  //     )
  //     // This promise is resolved when user selects an account from the the One Tap prompt
  //     console.log('Handle the response', data)
  //   })
  //   .catch((error) => {
  //     toast.add({
  //       severity: 'error',
  //       summary: 'Sign In Error',
  //       detail: 'Cannot Sign with this google account'
  //     })
  //     console.log('Handle the error', error)
  //   })
})
const signIn = () => {
  googleTokenLogin()
    .then(async (response) => {
      console.log('Handle the response', response)

      const { data } = await httpClient.get<UserLoginResponse>(
        `${ApiUrl.AUTH_GOOGLE_CALLBACK}?access_token=${response.access_token}`
      )
      // This promise is resolved when user selects an account from the the One Tap prompt
      console.log('Handle the response', data)
    })
    .catch((error) => {
      toast.add({
        severity: 'error',
        summary: 'Sign In Error',
        detail: 'Cannot Sign with this google account'
      })
      console.log('Handle the error', error)
    })
}
</script>

<template>
  <Toast />
  <RouterView />
</template>

<style scoped></style>
