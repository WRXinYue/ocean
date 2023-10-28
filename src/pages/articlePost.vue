<script lang="ts" setup>
import 'github-markdown-css/github-markdown-light.css'
import { ref, shallowRef } from 'vue'
import { marked } from 'marked'
import { readBinaryFile } from '@tauri-apps/api/fs'
import useArticleStore from '~/stores/article'
import { getArticle, parseArticleMeta } from '~/utils/article/meta'

const articleStore = useArticleStore()
const render = new marked.Renderer()
/** Render the markdown of the page */
const mdContent: Ref<string> = ref('')
const mdMeta: Ref<any> = ref('')
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
  const markdownStr: string = decoder.decode(contents)
  const article = getArticle(markdownStr)

  mdContent.value = article.content
  mdMeta.value = parseArticleMeta(article.meta)
  markdownToHtml.value = marked(mdContent.value)
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
  <!-- TODO: mdMeta 需要建立model类，不能以any进行声明，此处仅作为测试 -->
  {{ mdMeta }}
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
