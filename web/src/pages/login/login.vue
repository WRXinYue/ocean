<script lang="ts" setup>
import { nextTick } from 'vue'
import { POSITION, useToast } from 'vue-toastification'
import loginApi from '~/api/modules/login'

const toast = useToast()

const router = useRouter()

const email = ref('')
const password = ref('')

async function handleSubmit(event: any) {
  // Block default behavior
  event.preventDefault()
  try {
    const response = await loginApi.postVerification({ email: email.value, password: password.value })
    if (response.status) {
      toast.success('Login Successful', {
        position: POSITION.TOP_CENTER,
      })

      // Delay the router navigation
      nextTick(() => {
        router.push('/')
      })
    }
  }
  catch (error) {
    toast.error(`Login Failed. Please check your credentials and try again. \nError info: ${(error as any).errors}`, {
      position: POSITION.TOP_CENTER,
    })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <p>Email: <input v-model="email" type="text" name="name" size="20" border></p>
    <p>Password: <input v-model="password" type="password" name="password" size="20" border></p>
    <p>
      <input type="submit" value="确定">
      <input type="reset" value="取消">
    </p>
  </form>
</template>
