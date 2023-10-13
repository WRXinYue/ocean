<script lang="ts">
import type { Component } from 'vue'
import { defineComponent, h, ref } from 'vue'
import { NIcon } from 'naive-ui'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: '主页',
    key: 'home',
    icon: renderIcon(BookIcon),
  },
  {
    label: '博客文章',
    key: 'blog-posts',
    icon: renderIcon(BookIcon),
    children: [
      {
        label: '技术',
        key: 'tech',
      },
      {
        label: '旅游',
        key: 'travel',
      },
    ],
  },
  {
    label: '关于我',
    key: 'about-me',
    icon: renderIcon(PersonIcon),
  },
  {
    label: '联系我',
    key: 'contact',
    icon: renderIcon(PersonIcon),
  },
  {
    label: '我的项目',
    key: 'my-projects',
    icon: renderIcon(PersonIcon),
    children: [
      {
        type: 'group',
        label: '商业',
        key: 'commercial',
        children: [
          {
            label: '项目1',
            key: 'project-1',
            icon: renderIcon(PersonIcon),
          },
          {
            label: '项目2',
            key: 'project-2',
            icon: renderIcon(PersonIcon),
          },
        ],
      },
      {
        label: '个人',
        key: 'personal',
        icon: renderIcon(WineIcon),
        children: [
          {
            label: '项目1',
            key: 'personal-project-1',
          },
        ],
      },
    ],
  },
]

export default defineComponent({
  setup() {
    return {
      inverted: ref(false),
      menuOptions,
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
          <n-layout-sider
            bordered
            show-trigger
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :native-scrollbar="false"
            :inverted="inverted"
            style="max-height: 320px"
          >
            <n-menu
              :inverted="inverted"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
            />
          </n-layout-sider>
          <n-layout m-h-full>
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
