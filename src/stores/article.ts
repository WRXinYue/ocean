import { defineStore } from 'pinia'

const useArticleStore = defineStore({
  id: 'article',
  state: () => ({
    path: '',
  }),
  actions: {
    setPath(newPath: string) {
      this.path = newPath
    },
  },
})

export default useArticleStore
