<script lang="ts" setup>
import { readBinaryFile, readDir } from '@tauri-apps/api/fs'
import { POSITION, useToast } from 'vue-toastification'

const toast = useToast()

/** Get meta information */
function mateFun(mdString: string) {
  const frontMatter = mdString.split('---')[1]
  const metadata = {}
  const lines = frontMatter.split('\n')

  lines.forEach((line) => {
    if (line) {
      const parts = line.split(':')
      const key = parts[0].trim()
      let value = parts.slice(1).join('join').trim() as any

      if (value[0] === '-')
        value = value.slice(1).trim().split('\n -').map((s) => { return s.trim })
      metadata[key] = value
    }
  })
  console.log(metadata)

  return metadata
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
        mateFun(mdStr)

        fileNames.push(entry.name)
      }
      else {
        console.warn('This is not an MD file')
      }
    }
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
      <n-list-item>
        <n-thing title="延迟加载策略" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                性能优化
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                用户体验
              </n-tag>
            </n-space>
          </template>
          提高响应速度<br>
          提升自身的开发素质
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="微服务架构" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                分布式系统
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                容器化
              </n-tag>
            </n-space>
          </template>
          构建高效的、可扩展的系统<br>
          实现服务的高度自治<br>
          早晨好，我的开发团队<br>
          让我们一起构建庞大的工厂吧
        </n-thing>
      </n-list-item>
    </n-list>
    <n-list clickable hoverable>
      <n-list-item>
        <n-thing title="后端与数据库交互" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                Python
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                SQL
              </n-tag>
            </n-space>
          </template>
          以勇气和决心进行编程，<br>
          实现你伟大的项目目标
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="前端JavaScript框架" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                React
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                Vue.js
              </n-tag>
            </n-space>
          </template>
          利用最新的框架技术<br>
          构建绚丽的用户界面<br>
          早安，我的编程伙伴，<br>
          让我们一起打造出令人惊叹的产品
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="机器学习与深度学习" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                TensorFlow
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                PyTorch
              </n-tag>
            </n-space>
          </template>
          探索神经网络的神秘世界，<br>
          创造出智能化的解决方案<br>
          让机器学习助力人类前进
        </n-thing>
      </n-list-item>
    </n-list>
    <n-list clickable hoverable>
      <n-list-item>
        <n-thing title="晚来的启示" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                温暖的代码
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                春季代码重构
              </n-tag>
            </n-space>
          </template>
          勇敢地编码，然后好好休息<br>
          这就是程序员的伟大生涯
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-thing title="他在朝未来的大门" content-style="margin-top: 10px;">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" type="info" size="small">
                循环递归
              </n-tag>
              <n-tag :bordered="false" type="info" size="small">
                潜在的驱动程序
              </n-tag>
            </n-space>
          </template>
          那最新的打印机操纵逻辑<br>
          为彩色接口复制着代码<br>
          早安，我的定时任务先生<br>
          让他带你走进硅川的工厂
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
