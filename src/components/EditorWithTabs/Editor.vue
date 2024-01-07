<script setup lang="ts">
import Muya from '~/muya/lib'
import TablePicker from '~/muya/lib/ui/tablePicker'
import QuickInsert from '~/muya/lib/ui/quickInsert'
import CodePicker from '~/muya/lib/ui/codePicker'
import EmojiPicker from '~/muya/lib/ui/emojiPicker'
import ImagePathPicker from '~/muya/lib/ui/imagePicker'
import ImageSelector from '~/muya/lib/ui/imageSelector'
import ImageToolbar from '~/muya/lib/ui/imageToolbar'
import Transformer from '~/muya/lib/ui/transformer'
import FormatPicker from '~/muya/lib/ui/formatPicker'
import LinkTools from '~/muya/lib/ui/linkTools'
import FootnoteTool from '~/muya/lib/ui/footnoteTool'
import TableBarTools from '~/muya/lib/ui/tableTools'
import FrontMenu from '~/muya/lib/ui/frontMenu'
import bus from '~/bus'
import { usePreferencesStore } from '~/stores/preferences'
import { useEditorStore } from '~/stores/editor'
import { useProjectStore } from '~/stores/project'
import { DEFAULT_EDITOR_FONT_FAMILY } from '~/config'
import Printer from '~/services/printService'
import { SpellcheckerLanguageCommand } from '~/commands'
import { SpellChecker } from '~/spellchecker'
import { animatedScrollTo, isOsx } from '~/utils'
import { guessClipboardFilePath } from '~/utils/clipboard'
import { addCommonStyle, setEditorWidth } from '~/utils/theme'

import CloseIcon from '~/assets/icons/close.svg'

const props = defineProps({
  markdown: String,
  cursor: Object,
  textDirection: {
    type: String,
    required: true,
  },
  platform: String,
})

const STANDAR_Y = 320

const preferencesStore = usePreferencesStore()
const editorStore = useEditorStore()
const projectStore = useProjectStore()

const preferLooseListItem = computed(() => preferencesStore.preferLooseListItem)
const autoPairBracket = computed(() => preferencesStore.autoPairBracket)
const autoPairMarkdownSyntax = computed(() => preferencesStore.autoPairMarkdownSyntax)
const autoPairQuote = computed(() => preferencesStore.autoPairQuote)
const bulletListMarker = computed(() => preferencesStore.bulletListMarker)
const orderListDelimiter = computed(() => preferencesStore.orderListDelimiter)
const tabSize = computed(() => preferencesStore.tabSize)
const listIndentation = computed(() => preferencesStore.listIndentation)
const frontmatterType = computed(() => preferencesStore.frontmatterType)
const superSubScript = computed(() => preferencesStore.superSubScript)
const footnote = computed(() => preferencesStore.footnote)
const isHtmlEnabled = computed(() => preferencesStore.isHtmlEnabled)
const isGitlabCompatibilityEnabled = computed(() => preferencesStore.isGitlabCompatibilityEnabled)
const lineHeight = computed(() => preferencesStore.lineHeight)
const fontSize = computed(() => preferencesStore.fontSize)
const codeFontSize = computed(() => preferencesStore.codeFontSize)
const codeFontFamily = computed(() => preferencesStore.codeFontFamily)
const codeBlockLineNumbers = computed(() => preferencesStore.codeBlockLineNumbers)
const trimUnnecessaryCodeBlockEmptyLines = computed(() => preferencesStore.trimUnnecessaryCodeBlockEmptyLines)
const editorFontFamily = computed(() => preferencesStore.editorFontFamily)
const hideQuickInsertHint = computed(() => preferencesStore.hideQuickInsertHint)
const hideLinkPopup = computed(() => preferencesStore.hideLinkPopup)
const autoCheck = computed(() => preferencesStore.autoCheck)
const editorLineWidth = computed(() => preferencesStore.editorLineWidth)
const imageInsertAction = computed(() => preferencesStore.imageInsertAction)
const imagePreferRelativeDirectory = computed(() => preferencesStore.imagePreferRelativeDirectory)
const imageRelativeDirectoryName = computed(() => preferencesStore.imageRelativeDirectoryName)
const imageFolderPath = computed(() => preferencesStore.imageFolderPath)
const theme = computed(() => preferencesStore.theme)
const sequenceTheme = computed(() => preferencesStore.sequenceTheme)
const hideScrollbar = computed(() => preferencesStore.hideScrollbar)
const spellcheckerEnabled = computed(() => preferencesStore.spellcheckerEnabled)
const spellcheckerNoUnderline = computed(() => preferencesStore.spellcheckerNoUnderline)
const spellcheckerLanguage = computed(() => preferencesStore.spellcheckerLanguage)

const currentFile = computed(() => editorStore.currentFile)
const projectTree = computed(() => projectStore.projectTree)

// edit modes
const typewriter = computed(() => preferencesStore.typewriter)
const focus = computed(() => preferencesStore.focus)
const sourceCode = computed(() => preferencesStore.sourceCode)

const defaultFontFamily = ref(DEFAULT_EDITOR_FONT_FAMILY)
const selectionChange = ref(null)
const spellchecker: Ref<SpellChecker> = ref() as any
const printer: Ref<Printer> = ref() as any
const editor: Ref<Muya> = ref(new Muya())
const switchLanguageCommand: Ref<SpellcheckerLanguageCommand> = ref() as any
const imageViewer = ref()
// const pathname = ref('')
const isShowClose = ref(false)
const dialogTableVisible = ref(false)
const imageViewerVisible = ref(false)
const tableChecker = ref({
  rows: 4,
  columns: 3,
})

watch(typewriter, (value) => {
  if (value)
    scrollToCursor()
})

watch(focus, (value) => {
  editor.value.setFocusMode(value)
})

watch([fontSize, lineHeight], ([newFontSize, newLineHeight], [oldFontSize, oldLineHeight]) => {
  if ((newFontSize !== oldFontSize || newLineHeight !== oldLineHeight) && editor.value)
    editor.value.setFont({ fontSize: newFontSize, lineHeight: newLineHeight })
})

watch(preferLooseListItem, (value, oldValue) => {
  if (value !== oldValue && editor.value) {
    editor.value.setOptions({
      preferLooseListItem: value,
    })
  }
})

watch(tabSize, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setTabSize(value)
})

watch(theme, (value, oldValue) => {
  if (value !== oldValue && editor.value) {
    // Agreement：Any black series theme needs to contain dark `word`.
    if (/dark/i.test(value)) {
      editor.value.setOptions({
        mermaidTheme: 'dark',
        vegaTheme: 'dark',
      }, true)
    }
    else {
      editor.value.setOptions({
        mermaidTheme: 'default',
        vegaTheme: 'latimes',
      }, true)
    }
  }
})

watch(sequenceTheme, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ sequenceTheme: value }, true)
})

watch(listIndentation, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setListIndentation(value)
})

watch(frontmatterType, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ frontmatterType: value })
})

watch(superSubScript, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ superSubScript: value }, true)
})

watch(footnote, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ footnote: value }, true)
})

watch(isHtmlEnabled, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ disableHtml: value }, true)
})

watch(isGitlabCompatibilityEnabled, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ isGitlabCompatibilityEnabled: value }, true)
})

watch(hideQuickInsertHint, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ hideQuickInsertHint: value })
})

watch(editorLineWidth, (value, oldValue) => {
  if (value !== oldValue)
    setEditorWidth(value)
})

watch(autoPairBracket, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ autoPairBracket: value })
})

watch(autoPairMarkdownSyntax, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ autoPairMarkdownSyntax: value })
})

watch(autoPairQuote, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ autoPairQuote: value })
})

watch(trimUnnecessaryCodeBlockEmptyLines, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ trimUnnecessaryCodeBlockEmptyLines: value })
})

watch(bulletListMarker, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ bulletListMarker: value })
})

watch(orderListDelimiter, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ orderListDelimiter: value })
})

watch(hideLinkPopup, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ hideLinkPopup: value })
})

watch(autoCheck, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ autoCheck: value })
})

watch(codeFontSize, (value, oldValue) => {
  if (value !== oldValue) {
    addCommonStyle({
      codeFontSize: value,
      codeFontFamily,
      hideScrollbar,
    })
  }
})

watch(codeBlockLineNumbers, (value, oldValue) => {
  if (value !== oldValue && editor.value)
    editor.value.setOptions({ codeBlockLineNumbers: value }, true)
})

watch(codeFontFamily, (value, oldValue) => {
  if (value !== oldValue) {
    addCommonStyle({
      codeFontSize,
      codeFontFamily: value,
      hideScrollbar,
    })
  }
})

watch(hideScrollbar, (value, oldValue) => {
  if (value !== oldValue) {
    addCommonStyle({
      codeFontSize,
      codeFontFamily,
      hideScrollbar: value,
    })
  }
})

watch(spellcheckerEnabled, (value, oldValue) => {
  if (value !== oldValue) {
    // Set Muya's spellcheck container attribute.
    editor.value.setOptions({ spellcheckEnabled: value })

    // Disable native spell checker
    if (value)
      spellchecker.value.activateSpellchecker(spellcheckerLanguage.value)

    else
      spellchecker.value.deactivateSpellchecker()
  }
})

watch(spellcheckerNoUnderline, (value, oldValue) => {
  if (value !== oldValue) {
    // Set Muya's spellcheck container attribute.
    editor.value.setOptions({ spellcheckEnabled: !value })
  }
})

watch(spellcheckerLanguage, (value, oldValue) => {
  if (value !== oldValue)
    spellchecker.value.lang = value
})

watch(currentFile, (value, oldValue) => {
  if (value && value !== oldValue) {
    scrollToCursor(0)
    // Hide float tools if needed.
    editor.value && editor.value.hideAllFloatTools()
  }
})

watch(sourceCode, (value, oldValue) => {
  if (value && value !== oldValue)
    editor.value && editor.value.hideAllFloatTools()
})

onMounted(() => {
  nextTick(() => {
    printer.value = new Printer()
    const ele = editor.value
    const focusMode = focus.value
    const { markdown } = props

    // use muya UI plugins
    Muya.use(TablePicker)
    Muya.use(QuickInsert)
    Muya.use(CodePicker)
    Muya.use(EmojiPicker)
    Muya.use(ImagePathPicker)
    Muya.use(ImageSelector, {
      unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
      photoCreatorClick,
    })
    Muya.use(Transformer)
    Muya.use(ImageToolbar)
    Muya.use(FormatPicker)
    Muya.use(FrontMenu)
    Muya.use(LinkTools, {
      jumpClick,
    })
    Muya.use(FootnoteTool)
    Muya.use(TableBarTools)

    const options = {
      focusMode,
      markdown,
      preferLooseListItem,
      autoPairBracket,
      autoPairMarkdownSyntax,
      trimUnnecessaryCodeBlockEmptyLines,
      autoPairQuote,
      bulletListMarker,
      orderListDelimiter,
      tabSize,
      fontSize,
      lineHeight,
      codeBlockLineNumbers,
      listIndentation,
      frontmatterType,
      superSubScript,
      footnote,
      disableHtml: !isHtmlEnabled,
      isGitlabCompatibilityEnabled,
      hideQuickInsertHint,
      hideLinkPopup,
      autoCheck,
      sequenceTheme,
      spellcheckEnabled: spellcheckerEnabled.value,
      imageAction,
      imagePathPicker,
      clipboardFilePath: guessClipboardFilePath,
      imagePathAutoComplete,
    }

    if (/dark/i.test(theme.value)) {
      Object.assign(options, {
        mermaidTheme: 'dark',
        vegaTheme: 'dark',
      })
    }
    else {
      Object.assign(options, {
        mermaidTheme: 'default',
        vegaTheme: 'latimes',
      })
    }

    const { container } = editor.value = new Muya(ele, options)

    // Create spell check wrapper and enable spell checking if preferred.
    spellchecker.value = new SpellChecker(spellcheckerEnabled.value, spellcheckerLanguage.value)

    // Register command palette entry for switching spellchecker language.
    switchLanguageCommand.value = new SpellcheckerLanguageCommand(spellchecker)
    // eslint-disable-next-line vue/custom-event-name-casing
    setTimeout(() => bus.$emit('cmd::register-command', switchLanguageCommand), 100)

    if (typewriter)
      scrollToCursor()

    // listen for bus events.
    bus.$on('file-loaded', setMarkdownToEditor)
    bus.$on('invalidate-image-cache', handleInvalidateImageCache)
    bus.$on('undo', handleUndo)
    bus.$on('redo', handleRedo)
    bus.$on('selectAll', handleSelectAll)
    bus.$on('export', handleExport)
    bus.$on('print-service-clearup', handlePrintServiceClearup)
    bus.$on('paragraph', handleEditParagraph)
    bus.$on('format', handleInlineFormat)
    bus.$on('searchValue', handleSearch)
    bus.$on('replaceValue', handReplace)
    bus.$on('find-action', handleFindAction)
    bus.$on('insert-image', insertImage)
    bus.$on('image-uploaded', handleUploadedImage)
    bus.$on('file-changed', handleFileChange)
    bus.$on('editor-blur', blurEditor)
    bus.$on('editor-focus', focusEditor)
    bus.$on('copyAsMarkdown', handleCopyPaste)
    bus.$on('copyAsHtml', handleCopyPaste)
    bus.$on('pasteAsPlainText', handleCopyPaste)
    bus.$on('duplicate', handleParagraph)
    bus.$on('createParagraph', handleParagraph)
    bus.$on('deleteParagraph', handleParagraph)
    bus.$on('insertParagraph', handleInsertParagraph)
    bus.$on('scroll-to-header', scrollToHeader)
    bus.$on('screenshot-captured', handleScreenShot)
    bus.$on('switch-spellchecker-language', switchSpellcheckLanguage)
    bus.$on('open-command-spellchecker-switch-language', openSpellcheckerLanguageCommand)
    bus.$on('replace-misspelling', replaceMisspelling)

    editor.value.on('change', (changes) => {
      // WORKAROUND: "id: 'muya'"
      $store.dispatch('LISTEN_FOR_CONTENT_CHANGE', Object.assign(changes, { id: 'muya' }))
    })

    editor.value.on('format-click', ({ event, formatType, data }) => {
      const ctrlOrMeta = (isOsx && event.metaKey) || (!isOsx && event.ctrlKey)
      if (formatType === 'link' && ctrlOrMeta) {
        $store.dispatch('FORMAT_LINK_CLICK', { data, dirname: window.DIRNAME })
      }
      else if (formatType === 'image' && ctrlOrMeta) {
        if (imageViewer)
          imageViewer.destroy()

        // Disabled due to #2120.
        // imageViewer = new ViewImage($refs.imageViewer, {
        //   url: data,
        //   snapView: true
        // })

        setImageViewerVisible(true)
      }
    })

    // Disabled due to #2120.
    // editor.value.on('preview-image', ({ data }) => {
    //   if (imageViewer) {
    //     imageViewer.destroy()
    //   }
    //
    //   imageViewer = new ViewImage($refs.imageViewer, {
    //     url: data,
    //     snapView: true
    //   })
    //
    //   setImageViewerVisible(true)
    // })

    editor.value.on('selectionChange', (changes) => {
      const { y } = changes.cursorCoords
      if (typewriter) {
        const startPosition = container.scrollTop
        const toPosition = startPosition + y - STANDAR_Y

        // Prevent micro shakes and unnecessary scrolling.
        if (Math.abs(startPosition - toPosition) > 2)
          animatedScrollTo(container, toPosition, 100)
      }

      // Used to fix #628: auto scroll cursor to visible if the cursor is too low.
      if (container.clientHeight - y < 100) {
        // editableHeight is the lowest cursor position(till to top) that editor allowed.
        const editableHeight = container.clientHeight - 100
        animatedScrollTo(container, container.scrollTop + (y - editableHeight), 0)
      }

      selectionChange.value = changes
      $store.dispatch('SELECTION_CHANGE', changes)
    })

    editor.value.on('selectionFormats', (formats) => {
      $store.dispatch('SELECTION_FORMATS', formats)
    })

    document.addEventListener('keyup', keyup)

    setEditorWidth(editorLineWidth)
  })
})

function photoCreatorClick(url) {
  shell.openExternal(url)
}

function jumpClick(linkInfo) {
  const { href } = linkInfo
  $store.dispatch('FORMAT_LINK_CLICK', { data: { href }, dirname: window.DIRNAME })
}

async function imagePathAutoComplete(src) {
  const files = await $store.dispatch('ASK_FOR_IMAGE_AUTO_PATH', src)
  return files.map((f) => {
    const iconClass = f.type === 'directory' ? 'icon-folder' : 'icon-image'
    return Object.assign(f, { iconClass, text: f.file + (f.type === 'directory' ? '/' : '') })
  })
}

async function imageAction(image, id, alt = '') {
  // TODO(Refactor): Refactor this method.
  const {
    filename,
    pathname,
  } = currentFile.value

  // Save an image relative to the file if the relative image directory include the filename variable.
  // The image is save relative to the root folder without a variable.
  const saveRelativeToFile = () => {
    return /\${filename}/.test(imageRelativeDirectoryName.value)
  }

  // Figure out the current working directory.
  const isTabSavedOnDisk = !!pathname
  let relativeBasePath = isTabSavedOnDisk ? path.dirname(pathname) : null
  if (isTabSavedOnDisk && !saveRelativeToFile() && projectTree) {
    const { pathname: rootPath } = projectTree
    if (rootPath && isChildOfDirectory(rootPath, pathname)) {
      // Save assets relative to root directory.
      relativeBasePath = rootPath
    }
  }

  const getResolvedImagePath = (imagePath) => {
    const replacement = isTabSavedOnDisk
    // Filename w/o extension
      ? filename.replace(/\.[^/.]+$/, '')
      : ''
    return imagePath.replace(/\${filename}/g, replacement)
  }

  const resolvedImageFolderPath = getResolvedImagePath(imageFolderPath)
  const resolvedImageRelativeDirectoryName = getResolvedImagePath(imageRelativeDirectoryName)
  let destImagePath = ''
  switch (imageInsertAction) {
    case 'upload': {
      try {
        destImagePath = await uploadImage(pathname, image, preferences)
      }
      catch (err) {
        notice.notify({
          title: 'Upload Image',
          type: 'warning',
          message: err,
        })
        destImagePath = await moveImageToFolder(pathname, image, resolvedImageFolderPath)
      }
      break
    }
    case 'folder': {
      destImagePath = await moveImageToFolder(pathname, image, resolvedImageFolderPath)
      if (isTabSavedOnDisk && imagePreferRelativeDirectory)
        destImagePath = await moveToRelativeFolder(relativeBasePath, resolvedImageRelativeDirectoryName, pathname, destImagePath)

      break
    }
    case 'path': {
      if (typeof image === 'string') {
        // Input is a local path.
        destImagePath = image
      }
      else {
        // Save and move image to image folder if input is binary.
        destImagePath = await moveImageToFolder(pathname, image, resolvedImageFolderPath)

        // Respect user preferences if tab exists on disk.
        if (isTabSavedOnDisk && imagePreferRelativeDirectory)
          destImagePath = await moveToRelativeFolder(relativeBasePath, resolvedImageRelativeDirectoryName, pathname, destImagePath)
      }
      break
    }
  }

  if (id && sourceCode) {
    bus.$emit('image-action', {
      id,
      result: destImagePath,
      alt,
    })
  }
  return destImagePath
}

function imagePathPicker() {
  return $store.dispatch('ASK_FOR_IMAGE_PATH')
}

function keyup(event) {
  if (event.key === 'Escape')
    setImageViewerVisible(false)
}

function setImageViewerVisible(status) {
  imageViewerVisible = status
}

function switchSpellcheckLanguage(languageCode) {
  const { spellchecker } = this
  const { isEnabled } = spellchecker

  // This method is also called from bus, so validate state before continuing.
  if (!isEnabled)
    throw new Error('Cannot switch language because spell checker is disabled!')

  spellchecker.switchLanguage(languageCode)
    .then((langCode) => {
      if (!langCode) {
        // Unable to switch language due to missing dictionary. The spell checker is now in an invalid state.
        notice.notify({
          title: 'Spelling',
          type: 'warning',
          message: `Unable to switch to language "${languageCode}". Requested language dictionary is missing.`,
        })
      }
    })
    .catch((error) => {
      log.error(`Error while switching to language "${languageCode}":`)
      log.error(error)

      notice.notify({
        title: 'Spelling',
        type: 'error',
        message: `Error while switching to "${languageCode}": ${error.message}`,
      })
    })
}

function handleInvalidateImageCache() {
  if (editor)
    editor.invalidateImageCache()
}

function openSpellcheckerLanguageCommand() {
  if (!isOsx)
    bus.$emit('show-command-palette', switchLanguageCommand)
}

function replaceMisspelling({ word, replacement }) {
  if (editor)
    editor._replaceCurrentWordInlineUnsafe(word, replacement)
}

function handleUndo() {
  if (editor)
    editor.undo()
}

function handleRedo() {
  if (editor)
    editor.redo()
}

function handleSelectAll() {
  if (sourceCode)
    return

  if (editor && (editor.hasFocus() || editor.contentState.selectedTableCells)) {
    editor.selectAll()
  }
  else {
    const activeElement = document.activeElement
    const nodeName = activeElement.nodeName
    if (nodeName === 'INPUT' || nodeName === 'TEXTAREA')
      activeElement.select()
  }
}

// Custom copyAsMarkdown copyAsHtml pasteAsPlainText
function handleCopyPaste(type) {
  if (editor)
    editor[type]()
}

function insertImage(src) {
  if (!sourceCode)
    editor && editor.insertImage({ src })
}

function handleSearch(value, opt) {
  const searchMatches = editor.search(value, opt)
  $store.dispatch('SEARCH', searchMatches)
  scrollToHighlight()
}

function handReplace(value, opt) {
  const searchMatches = editor.replace(value, opt)
  $store.dispatch('SEARCH', searchMatches)
}

function handleUploadedImage(url, deletionUrl) {
  insertImage(url)
  $store.dispatch('SHOW_IMAGE_DELETION_URL', deletionUrl)
}

function scrollToCursor(duration = 300) {
  nextTick(() => {
    const { container } = editor
    const { y } = editor.getSelection().cursorCoords
    animatedScrollTo(container, container.scrollTop + y - STANDAR_Y, duration)
  })
}

function scrollToHighlight() {
  return scrollToElement('.ag-highlight')
}

function scrollToHeader(slug) {
  return scrollToElement(`#${slug}`)
}

function scrollToElement(selector) {
  // Scroll to search highlight word
  const { container } = editor
  const anchor = document.querySelector(selector)
  if (anchor) {
    const { y } = anchor.getBoundingClientRect()
    const DURATION = 300
    animatedScrollTo(container, container.scrollTop + y - STANDAR_Y, DURATION)
  }
}

function handleFindAction(action) {
  const searchMatches = editor.find(action)
  $store.dispatch('SEARCH', searchMatches)
  scrollToHighlight()
}

async function handleExport(options) {
  const {
    type,
    header,
    footer,
    headerFooterStyled,
    htmlTitle,
  } = options

  if (!/^pdf|print|styledHtml$/.test(type))
    throw new Error(`Invalid type to export: "${type}".`)

  const extraCss = getCssForOptions(options)
  const htmlToc = getHtmlToc(editor.getTOC(), options)

  switch (type) {
    case 'styledHtml': {
      try {
        const content = await editor.exportStyledHTML({
          title: htmlTitle || '',
          printOptimization: false,
          extraCss,
          toc: htmlToc,
        })
        $store.dispatch('EXPORT', { type, content })
      }
      catch (err) {
        log.error('Failed to export document:', err)
        notice.notify({
          title: `Printing/Exporting ${htmlTitle || 'html'} failed`,
          type: 'error',
          message: err.message || 'There is something wrong when exporting.',
        })
      }
      break
    }
    case 'pdf': {
      // NOTE: We need to set page size via Electron.
      try {
        const { pageSize, pageSizeWidth, pageSizeHeight, isLandscape } = options
        const pageOptions = {
          pageSize, pageSizeWidth, pageSizeHeight, isLandscape,
        }

        const html = await editor.exportStyledHTML({
          title: '',
          printOptimization: true,
          extraCss,
          toc: htmlToc,
          header,
          footer,
          headerFooterStyled,
        })
        printer.renderMarkdown(html, true)
        $store.dispatch('EXPORT', { type, pageOptions })
      }
      catch (err) {
        log.error('Failed to export document:', err)
        notice.notify({
          title: 'Printing/Exporting failed',
          type: 'error',
          message: `There is something wrong when export ${htmlTitle || 'PDF'}.`,
        })
        handlePrintServiceClearup()
      }
      break
    }
    case 'print': {
      // NOTE: Print doesn't support page size or orientation.
      try {
        const html = await editor.exportStyledHTML({
          title: '',
          printOptimization: true,
          extraCss,
          toc: htmlToc,
          header,
          footer,
          headerFooterStyled,
        })
        printer.renderMarkdown(html, true)
        $store.dispatch('PRINT_RESPONSE')
      }
      catch (err) {
        log.error('Failed to export document:', err)
        notice.notify({
          title: 'Printing/Exporting failed',
          type: 'error',
          message: `There is something wrong when print ${htmlTitle || ''}.`,
        })
        handlePrintServiceClearup()
      }
      break
    }
  }
}

function handlePrintServiceClearup() {
  printer.clearup()
}

function handleEditParagraph(type) {
  if (type === 'table') {
    tableChecker = { rows: 4, columns: 3 }
    dialogTableVisible = true
    $nextTick(() => {
      $refs.rowInput.focus()
    })
  }
  else if (editor) {
    editor.updateParagraph(type)
  }
}

// handle `duplicate`, `delete`, `create paragraph below`
function handleParagraph(type) {
  const { editor } = this
  if (editor) {
    switch (type) {
      case 'duplicate': {
        return editor.duplicate()
      }
      case 'createParagraph': {
        return editor.insertParagraph('after', '', true)
      }
      case 'deleteParagraph': {
        return editor.deleteParagraph()
      }
      default:
        console.error(`unknow paragraph edit type: ${type}`)
    }
  }
}

function handleInlineFormat(type) {
  editor && editor.format(type)
}

function handleDialogTableConfirm() {
  dialogTableVisible = false
  editor && editor.createTable(tableChecker)
}

// listen for `open-single-file` event, it will call this method only when open a new file.
function setMarkdownToEditor({ id, markdown, cursor }) {
  const { editor } = this
  if (editor) {
    editor.clearHistory()
    if (cursor)
      editor.setMarkdown(markdown, cursor, true)
    else
      editor.setMarkdown(markdown)
  }
}

// listen for markdown change form source mode or change tabs etc
function handleFileChange({ id, markdown, cursor, renderCursor, history }) {
  const { editor } = this
  nextTick(() => {
    if (editor) {
      if (history)
        editor.setHistory(history)

      if (typeof markdown === 'string')
        editor.setMarkdown(markdown, cursor, renderCursor)
      else if (cursor)
        editor.setCursor(cursor)

      if (renderCursor)
        scrollToCursor(0)
    }
  })
}

function handleInsertParagraph(location) {
  const { editor } = this
  editor && editor.insertParagraph(location)
}

function blurEditor() {
  editor.blur(false, true)
}

function focusEditor() {
  editor.focus()
}

function handleScreenShot() {
  if (editor)
    document.execCommand('paste')
}
</script>

<template>
  <div
    class="editor-wrapper"
    :class="[{ typewriter, focus, source: sourceCode }]"
    :style="{
      'lineHeight': lineHeight,
      'fontSize': `${fontSize}px`,
      'font-family': editorFontFamily ? `${editorFontFamily}, ${defaultFontFamily}` : `${defaultFontFamily}`,
    }"
    :dir="textDirection"
  >
    <div
      ref="editor"
      class="editor-component"
    />
    <div
      v-show="imageViewerVisible"
      class="image-viewer"
    >
      <span class="icon-close" @click="setImageViewerVisible(false)">
        <svg :viewBox="CloseIcon.viewBox">
          <use :xlink:href="CloseIcon.url" />
        </svg>
      </span>
      <div
        ref="imageViewer"
      />
    </div>
    <el-dialog
      v-model:visible="dialogTableVisible"
      :show-close="isShowClose"
      :modal="true"
      custom-class="ag-dialog-table"
      width="454px"
      center
      dir="ltr"
    >
      <div slot="title" class="dialog-title">
        Insert Table
      </div>
      <el-form :model="tableChecker" :inline="true">
        <el-form-item label="Rows">
          <el-input-number
            ref="rowInput"
            v-model="tableChecker.rows"
            size="mini"
            controls-position="right"
            :min="1"
            :max="30"
          />
        </el-form-item>
        <el-form-item label="Columns">
          <el-input-number
            v-model="tableChecker.columns"
            size="mini"
            controls-position="right"
            :min="1"
            :max="20"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="handleDialogTableConfirm">
          OK
        </el-button>
      </div>
    </el-dialog>
    <!-- <search
      v-if="!sourceCode"
    /> -->
  </div>
</template>

<style>
  .editor-wrapper {
    height: 100%;
    position: relative;
    flex: 1;
    color: var(--editorColor);
    & .ag-dialog-table {
      & .el-button {
        font-size: 13px;
        width: 70px;
      }
    }
  }

  .editor-wrapper.source {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .editor-component {
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    cursor: default;
  }

  .typewriter .editor-component {
    padding-top: calc(50vh - 136px);
    padding-bottom: calc(50vh - 54px);
  }

  .image-viewer {
    position: fixed;
    backdrop-filter: blur(5px);
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .8);
    z-index: 11;
    & .icon-close {
      z-index: 1000;
      width: 30px;
      height: 30px;
      position: absolute;
      top: 50px;
      left: 50px;
      display: block;
      & svg {
        fill: #efefef;
        width: 100%;
        height: 100%;
      }
    }
  }

  .iv-container {
    width: 100%;
    height: 100%;
  }

  .iv-snap-view {
    opacity: 1;
    bottom: 20px;
    right: 20px;
    top: auto;
    left: auto;
  }
</style>
