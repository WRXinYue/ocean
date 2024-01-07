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
const markdownContent: Ref<string> = ref('')
const markdownMeta: Ref<any> = ref('')
const markdownRenderedContent = shallowRef('')

marked.setOptions({
  renderer: render,
  gfm: true,
  pedantic: false,
})

function handleClick(event: any) {
  const divElement = document.getElementById('markdownContent')
  // 检查元素是否存在
  if (divElement) {
    // 执行相应的操作，例如获取源代码、显示编辑器等
    const sourceCode = markdownContent.value
    console.log('点击的源代码段落:', sourceCode)
  }
}

/** first reade file, initialize */
async function renderContent(markdownPath: string) {
  const contents = await readBinaryFile(markdownPath)
  const decoder = new TextDecoder()
  const markdownStr: string = decoder.decode(contents)
  const article = getArticle(markdownStr)

  markdownContent.value = article.content
  markdownMeta.value = parseArticleMeta(article.meta)
  markdownRenderedContent.value = marked(markdownContent.value)
  console.log(markdownRenderedContent.value)
}

function change(value: string) {
  markdownRenderedContent.value = marked(value)
}

onMounted(() => {
  renderContent(articleStore.path)

  const divElement = document.getElementById('markdownContent')
  if (divElement)
    divElement.addEventListener('click', handleClick)
})
</script>

<template>
  <!-- TODO: mdMeta 需要建立model类，不能以any进行声明，此处仅作为测试 -->
  {{ markdownMeta }}
  <div id="markdownContent" class="markdown-body" v-html="markdownRenderedContent" />
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
