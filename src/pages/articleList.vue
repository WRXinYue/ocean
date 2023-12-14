<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import useArticleStore from '~/stores/article'
import { redFileTitle } from '~/utils/file'
import type { ArticleMeta } from '~/models/article'

const router = useRouter()
const toast = useToast()
const articleStore = useArticleStore()
const metaDataList: Ref<ArticleMeta[]> = ref([])

function goToArticlePost(path: string) {
  articleStore.setPath(path)
  router.push({ path: '/articlePost' })
}

onMounted(async () => {
  const folderPath = localStorage.getItem('folderPath')
  metaDataList.value = await redFileTitle(folderPath)
})
</script>

<template>
  <div h-full w-full>
    <div v-if="metaDataList">
      <n-list clickable hoverable>
        <n-list-item v-for="metaData in metaDataList" :key="metaData.title">
          <n-thing :title="metaData.title" content-style="margin-top: 10px;" @click="goToArticlePost(metaData.path)">
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
    <div v-else>
      null
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
