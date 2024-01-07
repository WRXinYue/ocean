<script setup lang="ts">
import { useLayoutStore } from '~/stores/layout'

defineProps({
  markdown: {
    type: String,
    required: true,
  },
  cursor: {
    validator(value) {
      return typeof value === 'object'
    },
    required: true,
  },
  sourceCode: {
    type: Boolean,
    required: true,
  },
  showTabBar: {
    type: Boolean,
    required: true,
  },
  textDirection: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
})

const layoutStore = useLayoutStore()

const showSideBar = computed(() => layoutStore.showSideBar)
const sideBarWidth = computed(() => layoutStore.sideBarWidth)
</script>

<template>
  <div
    class="editor-with-tabs"
    :style="{ 'max-width': showSideBar ? `calc(100vw - ${sideBarWidth}px` : '100vw' }"
  >
    <tabs v-show="showTabBar" />
    <div class="container">
      <Editor
        :markdown="markdown"
        :cursor="cursor"
        :text-direction="textDirection"
        :platform="platform"
      />
      <SourceCode
        v-if="sourceCode"
        :markdown="markdown"
        :cursor="cursor"
        :text-direction="textDirection"
      />
      <TabNotifications />
    </div>
  </div>
</template>

<style scoped>
  .editor-with-tabs {
    position: relative;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    overflow: hidden;
    background: var(--editorBgColor);
    & > .container {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
