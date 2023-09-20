<script lang="ts" setup>
import { nextTick } from 'vue'
import loginApi from '~/api/modules/login'
import Message from '~/components/Message/Message.vue'

const router = useRouter()
const message = ref()

const email = ref('')
const password = ref('')

async function handleSubmit(event: any) {
  // Block default behavior
  event.preventDefault()
  try {
    const response = await loginApi.postVerification({ email: email.value, password: password.value })
    if (response.status) {
      message.value.success({
        message: 'Successful landing',
        description: ' ',
      })

      // Delay the router navigation
      nextTick(() => {
        router.push('/')
      })
    }
  }
  catch (error) {
    console.error(error)
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
  <Message
    ref="message"
    placement="topRight"
    :duration="3000"
    :top="24"
  />
</template>
