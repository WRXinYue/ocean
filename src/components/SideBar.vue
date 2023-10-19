<script setup lang="ts">
import type { Component } from 'vue'
import { h, ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import {
  BookOutline as BookIcon,
  ChatboxEllipsesOutline as ChatboxEllipsesOut,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
} from '@vicons/ionicons5'
import { RouterLink } from 'vue-router'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const inverted = ref(false)

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: '/',
          },
        },
        { default: () => '主页' },
      ),
    key: 'home',
    icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: '/article',
          },
        },
        { default: () => '博客文章' },
      ),
    key: 'blog-posts',
    icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: '/about',
          },
        },
        { default: () => '关于我' },
      ),
    key: 'about-me',
    icon: renderIcon(PersonIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: '/page',
          },
        },
        { default: () => '测试页' },
      ),
    key: 'page',
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
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: '/setting',
          },
        },
        { default: () => '设置' },
      ),
    key: 'setting',
    icon: renderIcon(BookIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: '/llm',
          },
        },
        { default: () => 'LLM' },
      ),
    key: 'llm',
    icon: renderIcon(ChatboxEllipsesOut),
  },
]
</script>

<template>
  <n-layout-sider
    bordered
    show-trigger="bar"
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :native-scrollbar="false"
    :inverted="inverted"
  >
    <n-menu
      :inverted="inverted"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </n-layout-sider>
</template>
