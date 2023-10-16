<script setup lang="ts">
import { dialog, fs } from '@tauri-apps/api'
import { FolderOpen } from '@vicons/ionicons5'

async function getDirCon(dir: string | string []) {
  if (typeof dir === 'string') {
    const dirCon = await fs.readDir(dir)
    console.log(777, dirCon)
  }
}

async function chooseDir() {
  const dir = await dialog.open({
    directory: true,
    multiple: false,
  })
  console.log(666, dir)
  getDirCon(dir as string)
}

const obsidianFolderPath = ref('')
</script>

<template>
  <n-card title="Obsidian 克隆">
    <n-input v-model:value="obsidianFolderPath" placeholder="/path 克隆文件路径">
      <template #prefix>
        <n-icon :component="FolderOpen" />
      </template>
    </n-input>
    <div mt-3>
      <n-button mr-3 @click="getDirCon(obsidianFolderPath)">
        导入
      </n-button>
      <n-button @click="chooseDir">
        选择文件夹
      </n-button>
      <!-- <n-progress
        type="line"
        :percentage="0"
        indicator-placement="inside"
        processing
      /> -->
    </div>
  </n-card>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
