<script setup lang="ts">
import { useEditorStore } from '~/stores/editor'
import { useLayoutStore } from '~/stores/layout'

const editorStore = useEditorStore()
const layoutStore = useLayoutStore()

const currentFile = computed(() => editorStore.currentFile)
const showSideBar = computed(() => layoutStore.showSideBar)
const sideBarWidth = computed(() => layoutStore.sideBarWidth)

const currentNotification = computed(() => {
  const notifications = currentFile.value.notifications
  if (!notifications || notifications.length === 0)
    return null

  return notifications[0]
})

function handleClick(status) {
  const notifications = currentFile.value.notifications
  if (!notifications || notifications.length === 0) {
    console.error('notifications::handleClick: Cannot find notification on stack.')
    return
  }

  const item = notifications.shift()
  const action = item.action
  if (action)
    action(status)
}
</script>

<template>
  <div
    v-if="currentNotification"
    class="editor-notifications"
    :class="currentNotification.style"
    :style="{ 'max-width': showSideBar ? `calc(100vw - ${sideBarWidth}px` : '100vw' }"
  >
    <div class="msg">
      {{ currentNotification.msg }}
    </div>
    <div class="controls">
      <div>
        <span
          v-if="currentNotification.showConfirm"
          class="inline-button"
          @click.stop="handleClick(true)"
        >
          Ok
        </span>
        <span
          class="inline-button"
          @click.stop="handleClick(false)"
        >
          <svg class="close-icon icon" aria-hidden="true">
            <use id="default-close-icon" xlink:href="#icon-close-small" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .editor-notifications {
    position: relative;
    display: flex;
    flex-direction: row;
    max-height: 100px;
    margin-top: 4px;
    background: var(--notificationPrimaryBg);
    color: var(--notificationPrimaryColor);
    padding: 8px 10px;
    user-select: none;
    overflow: hidden;
    &.warn {
      background: var(--notificationWarningBg);
      color: var(--notificationWarningColor);
    }
    &.crit {
      background: var(--notificationErrorBg);
      color: var(--notificationErrorColor);
    }
  }
  .msg {
    font-size: 13px;
    flex: 1;
  }
  .controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    & > div {
      display: flex;
      flex-direction: row;
    }
    & .inline-button:not(:last-child) {
      margin-right: 3px;
    }
    & .inline-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    & .inline-button:hover {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.6);
    }
  }
</style>
