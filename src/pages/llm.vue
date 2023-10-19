<script setup lang="ts">
import type { LLMMessage } from '~/models/llm'

const llmMessages: Ref<LLMMessage[]> = ref([])
const problem: Ref<string> = ref('')
const chatId: Ref<number> = ref(0)

function getChatID() {
  return chatId.value++
}

function getAnswer() {
  const newMessage: LLMMessage = {
    id: getChatID(),
    message: problem.value,
    role: 'user',
  }
  problem.value = ''
  llmMessages.value.push(newMessage)
}
</script>

<template>
  <main mt-5>
    <!-- Message View -->
    <div v-for="llmMessage in llmMessages" :key="llmMessage.id">
      <div v-if="llmMessage.role === 'user'" flex items-center pr-2>
        <n-avatar size="large" mx-2 bg-black>
          XinYue
        </n-avatar>
        <span> {{ llmMessage.message }} </span>
      </div>
      <div v-else-if="llmMessage.role === 'system'" flex items-center pr-2>
        <n-avatar size="large" mx-2 bg-black>
          LLM
        </n-avatar>
        <span> {{ llmMessage.message }} </span>
      </div>
      <n-divider />
    </div>
    <!-- Page Footer -->
    <div fixed bottom-0 w-full>
      <n-input
        v-model:value="problem"
        type="textarea"
        placeholder="Enter some questions..."
        :autosize="{
          minRows: 3,
        }"
      />
      <div left-0 h-10 flex items-center border text-center>
        <n-button ml-10 h-full w-80vh @click="getAnswer">
          Send
        </n-button>
      </div>
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
