<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    return {
      inverted: ref(false),
    }
  },
})
</script>

<template>
  <main
    text="gray-700 dark:gray-200" h-100vh w-full flex flex-col
  >
    <n-space vertical>
      <n-layout>
        <n-layout-header :inverted="inverted" bordered>
          <TheHead />
        </n-layout-header>
        <n-layout has-sider>
          <SideBar />
          <n-layout h-85vh>
            <RouterView />
          </n-layout>
        </n-layout>
        <n-layout-footer :inverted="inverted" bordered>
          <TheFooter />
        </n-layout-footer>
      </n-layout>
    </n-space>
  </main>
</template>
