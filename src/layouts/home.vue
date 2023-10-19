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
        <n-layout-header :inverted="inverted">
          <TheHead />
        </n-layout-header>
        <n-layout has-sider h-92vh>
          <SideBar />
          <n-layout>
            <RouterView />
          </n-layout>
        </n-layout>
        <!-- not use n-layout-footer -->
        <TheFooter />
      </n-layout>
    </n-space>
  </main>
</template>
