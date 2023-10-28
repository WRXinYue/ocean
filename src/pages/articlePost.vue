<script lang="ts" setup>
import 'github-markdown-css/github-markdown-light.css'
import { ref, shallowRef } from 'vue'
import { marked } from 'marked'
import { readBinaryFile } from '@tauri-apps/api/fs'
import useArticleStore from '~/stores/article'

const articleStore = useArticleStore()
const render = new marked.Renderer()

const mdStr: Ref<string> = ref('')
const articlePath = ref('')
const markdownToHtml = shallowRef('')

marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
})

/** first reade file, initialize */
async function redFile() {
  const contents = await readBinaryFile(articlePath.value)
  const decoder = new TextDecoder()
  mdStr.value = decoder.decode(contents)
  markdownToHtml.value = marked(mdStr.value)
}

function change(value: string) {
  markdownToHtml.value = marked(value)
}

onMounted(() => {
  articlePath.value = articleStore.path
  redFile()
})
</script>

<template>
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
