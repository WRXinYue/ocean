<script lang="ts" setup>
import 'github-markdown-css/github-markdown-light.css'
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

<route lang="yaml">
meta:
  layout: home
</route>

<style scoped lang="scss">
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}

.markdown-body code {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,.05);
  border-radius: 3px;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}
</style>
