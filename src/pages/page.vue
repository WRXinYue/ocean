<script lang="ts" setup>
import 'github-markdown-css/github-markdown-light.css'
import { ref, shallowRef } from 'vue'
import { marked } from 'marked'
import { readBinaryFile } from '@tauri-apps/api/fs'

const mdStr: Ref<string> = ref('')

const render = new marked.Renderer()
const markdownToHtml = shallowRef('')

marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
})

async function redFile() {
  const contents = await readBinaryFile('/home/wrxinyue/文档/my_project/MyBlog/source/_posts/WebBackend/Python/Python虚拟环境创建.md')
  const decoder = new TextDecoder()
  mdStr.value = decoder.decode(contents)
  markdownToHtml.value = marked(mdStr.value)
}

function change(value: string) {
  markdownToHtml.value = marked(value)
}

onMounted(() => {
  redFile()
})
</script>

<template>
  <n-input v-model:value="mdStr" type="textarea" @input="change" />
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
