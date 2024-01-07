import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    showTabBar: false,
    showSideBar: false,
    sideBarWidth: 280,
  }),
})
