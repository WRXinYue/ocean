import { readBinaryFile, readDir } from '@tauri-apps/api/fs'
import { POSITION, useToast } from 'vue-toastification'
import type { ArticleMeta } from '~/models/article'
import { getArticle, parseArticleMeta } from '~/utils/article/meta'

const toast = useToast()

/**
 * 获取文章的标题和摘要
 * Get the title and summary of the article
 */
export async function redFileTitle(folderPath: any) {
  const fileList = await readDir(folderPath)
  const metaDataList: ArticleMeta[] = []

  if (!folderPath) {
    toast.warning('No folder path set in localStorage.', {
      position: POSITION.TOP_CENTER,
    })
    return []
  }

  const fileNames = []
  for (const file of fileList) {
    if (file.children)
      continue

    if (file.name?.endsWith('.md')) {
      const contents = await readBinaryFile(file.path)
      const decoder = new TextDecoder()
      const mdStr = decoder.decode(contents)
      const metaData: ArticleMeta = convertToDict(mdStr)
      metaData.path = file.path
      metaDataList.push(metaData)
      fileNames.push(file.name)
    }
    else {
      console.warn('This is not an MD file')
    }
  }
  return metaDataList
}

/** Get meta information */
function convertToDict(mdString: string) {
  const article = getArticle(mdString)
  const dict = parseArticleMeta(article.meta)
  return dict
}
