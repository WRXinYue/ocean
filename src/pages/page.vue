<script lang="ts" setup>
import { marked } from 'marked'
import { ref, shallowRef } from 'vue'

const render = new marked.Renderer()
marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
})

const value = ref('**Hello,World**')
const markdownToHtml = shallowRef('')
markdownToHtml.value = marked(value.value)

function change(value: string) {
  markdownToHtml.value = marked(value)
}
</script>

<template>
  <n-input v-model:value="value" type="textarea" @input="change" />
  <div class="markdown-body" v-html="markdownToHtml" />
</template>
