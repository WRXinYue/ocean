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
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)

      goHome()
    }
  }
  catch (error) {
    toast.error(`Login Failed. Please check your credentials and try again. \nError info: ${(error as any).errors}`, {
      position: POSITION.TOP_CENTER,
    })
  }
}

function goHome() {
  // Delay the router navigation
  nextTick(() => {
    router.push('/')
  })
}
</script>

<template>
  <div h-100vh w-full justify-center>
    <div relative top-45>
      <form mx-auto my-8 max-w-sm w-full @submit.prevent="handleSubmit">
        <div mb-4>
          <label for="email" mb-2 block text-sm font-bold text-gray-700>Email:</label>
          <input id="email" v-model="email" type="text" name="name" w-full appearance-none border rounded px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none>
        </div>
        <div mb-4>
          <label for="password" mb-2 block text-sm font-bold text-gray-700>Password:</label>
          <input id="password" v-model="password" type="password" name="password" w-full appearance-none border rounded px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none>
        </div>
        <div flex items-center justify-between>
          <input type="submit" value="confirm" rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none>
          <input type="reset" value="cancel" rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none @click="goHome">
        </div>
      </form>
    </div>
  </div>
</template>
