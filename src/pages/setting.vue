<script setup lang="ts">
import { dialog, fs } from '@tauri-apps/api'
import { FolderOpen } from '@vicons/ionicons5'
import { POSITION, useToast } from 'vue-toastification'

const toast = useToast()

async function getDirCon(dir: string | string []) {
  if (typeof dir === 'string') {
    try {
      await fs.readDir(dir) // Verify if the path is legal
      toast.success('File path imported successfully', {
        position: POSITION.TOP_CENTER,
      })
      localStorage.setItem('folderPath', dir)
    }
    catch (err: any) {
      toast.error(err, {
        position: POSITION.TOP_CENTER,
      })
    }
  }
}

async function chooseDir() {
  try {
    const dir = await dialog.open({
      directory: true,
      multiple: false,
    })
    toast.warning(`666, ${dir}`, {
      position: POSITION.TOP_CENTER,
    })
    getDirCon(dir as string)
  }
  catch (err: any) {
    toast.error(err, {
      position: POSITION.TOP_CENTER,
    })
  }
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
