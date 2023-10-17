<script lang="ts" setup>
import { readBinaryFile, readDir } from '@tauri-apps/api/fs'
import { POSITION, useToast } from 'vue-toastification'

const toast = useToast()
const metaDataList: Ref<any> = ref([])

/** Get meta information */
function convertToDict(mdString: string) {
  const frontMatter = mdString.split('---')[1]
  const dict = {} as any
  const lines = frontMatter.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.includes(':')) {
      const splitLine = line.split(':')
      const key = splitLine[0].trim()
      const value = splitLine[1].trim()

      if (key === 'tags' || key === 'categories') {
        // If it's a list item, keep reading lines until finished
        dict[key] = []
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim().startsWith('-')) {
            dict[key].push(lines[j].trim().substring(1).trim())
          }
          else {
            // If the next line does not start with a dash ('-'), it's not part of the list
            i = j - 1
            break
          }
        }
      }
      else {
        dict[key] = value
      }
    }
  }

  return dict
}

/** Get the title and summary of the article */
async function redFileTitle() {
  const folderPath = localStorage.getItem('folderPath')
  if (folderPath) {
    const entries = await readDir(folderPath)

    const fileNames = []
    for (const entry of entries) {
      if (entry.name?.endsWith('.md')) {
        const contents = await readBinaryFile(entry.path)
        const decoder = new TextDecoder()
        const mdStr = decoder.decode(contents)
        const metaData = convertToDict(mdStr)
        metaDataList.value.push(metaData)
        fileNames.push(entry.name)
      }
      else {
        console.warn('This is not an MD file')
      }
    }
    console.log(metaDataList)
  }
  else {
    toast.warning('No folder path set in localStorage.', {
      position: POSITION.TOP_CENTER,
    })
  }
}

// onMounted(() => {
//   invoke('my_custom_command').then((response) => {
//   // eslint-disable-next-line no-console
//     console.log(response)
//   })
// })
</script>

<template>
  <n-button @click="redFileTitle">
    点我
  </n-button>
  <div h-full w-full>
    <n-list clickable hoverable>
      <n-list-item v-for="metaData in metaDataList" :key="metaData.title">
        <n-thing :title="metaData.title" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag v-for="tag in metaData.tags" :key="tag" :bordered="false" type="info" size="small">
                {{ tag }}
              </n-tag>
            </n-space>
          </template>
          {{ metaData.data }}
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
