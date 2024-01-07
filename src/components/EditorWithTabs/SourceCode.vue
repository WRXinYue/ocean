<script setup lang="ts">
import codeMirror, { setCursorAtLastLine, setMode, setTextDirection } from '~/codeMirror'
import { usePreferencesStore } from '~/stores/preferences'
import { useEditorStore } from '~/stores/editor'
import { oneDarkThemes, railscastsThemes } from '~/config'

const props = defineProps({
  markdown: String,
  cursor: Object,
  textDirection: {
    type: String,
    required: true,
  },
})

const preferencesStore = usePreferencesStore()
const editorStore = useEditorStore()

const contentStateRef = ref(null)
const editorRef = ref(null)
const commitTimerRef = ref(null)
const viewDestroyedRef = ref(false)
const tabIdRef = ref(null)

const theme = computed(() => preferencesStore.theme)
const sourceCode = computed(() => preferencesStore.sourceCode)
const currentTab = computed(() => editorStore.currentFile)

watch(props.textDirection as any, (value, oldValue) => {
  if (value !== oldValue && editorRef.value)
    setTextDirection(editorRef.value, value)
})

onMounted(() => {
  nextTick(() => {
    const { id } = currentTab.value
    const container = sourceCode.value
    const codeMirrorConfig = {
      value: props.markdown,
      lineNumbers: true,
      autofocus: true,
      lineWrapping: true,
      styleActiveLine: true,
      direction: props.textDirection,
      viewportMargin: Infinity,
      theme: '',
      lineNumberFormatter(line: number) {
        if (line % 10 === 0 || line === 1)
          return line
        else
          return ''
      },
    }

    // Set theme
    if (railscastsThemes.includes(theme.value))
      codeMirrorConfig.theme = 'railscasts'
    else if (oneDarkThemes.includes(theme.value))
      codeMirrorConfig.theme = 'one-dark'

    // Init CodeMirror
    const editor = editorRef.value = codeMirror(container, codeMirrorConfig)

    // bus.$on('file-loaded', this.handleFileChange)
    // bus.$on('invalidate-image-cache', this.handleInvalidateImageCache)
    // bus.$on('file-changed', this.handleFileChange)
    // bus.$on('selectAll', this.handleSelectAll)
    // bus.$on('image-action', this.handleImageAction)

    setMode(editor, 'markdown')
    listenChange()

    editor.on('contextmenu', (cm: any, event: any) => {
      // Make sure no context menu is shown in source-code mode because we have to handle
      // Muyas menu by Electron.
      event.preventDefault()
      event.stopPropagation()
    })

    // NOTE: Cursor may be not null but the inner values are.
    if (props.cursor && props.cursor.anchor && props.cursor.focus) {
      const { anchor, focus } = props.cursor
      editor.setSelection(anchor, focus, { scroll: true }) // Scroll the focus into view.
    }
    else {
      setCursorAtLastLine(editor)
    }
    tabIdRef.value = id
  })
})

onBeforeUnmount(() => {
  // NOTE: Clear timer and manually commit changes. After mode switching and cleanup may follow
  // further key inputs, so ignore all inputs.
  viewDestroyedRef.value = true
  if (commitTimerRef.value)
    clearTimeout(commitTimerRef.value)

  // bus.$off('file-loaded', this.handleFileChange)
  // bus.$off('invalidate-image-cache', this.handleInvalidateImageCache)
  // bus.$off('file-changed', this.handleFileChange)
  // bus.$off('selectAll', this.handleSelectAll)
  // bus.$off('image-action', this.handleImageAction)

  const { cursor, markdown } = getMarkdownAndCursor(editorRef.value)

  // bus.$emit('file-changed', { id: this.tabId, markdown, cursor, renderCursor: true })
})

function handleImageAction({ id, result, alt }) {
  const value = editorRef.value.getCursor()
  const focus = editorRef.value.getCursor('focus')
  const anchor = editorRef.value.getCursor('anchor')
  const lines = value.split('\n')
  const index = lines.findIndex(line => line.indexOf(id) > 0)

  if (index > -1) {
    const oldLine = lines[index]
    lines[index] = oldLine.replace(new RegExp(`!\\[${id}\\]\\(.*\\)`), `![${alt}](${result})`)
    const newValue = lines.join('\n')
    editorRef.value.setValue(newValue)
    const match = /(!\[.*\]\(.*\))/.exec(oldLine)
    if (!match) {
      // User maybe delete `![]()` structure, and the match is null.
    }
    const range = {
      start: match?.index,
      end: match?.index + match[1].length,
    }
    const delta = alt.length + result.length + 5 - match[1].length

    const adjust = (pointer) => {
      if (!pointer)
        return

      if (pointer.line !== index)
        return

      if (pointer.ch <= range.start) {
        // do nothing.
      }
      else if (pointer.ch > range.start && pointer.ch < range.end) {
        pointer.ch = range.start + alt.length + result.length + 5
      }
      else {
        pointer.ch += delta
      }
    }

    adjust(focus)
    adjust(anchor)
    if (focus && anchor)
      editorRef.value.setSelection(anchor, focus, { scroll: true })
    else
      setCursorAtLastLine(0)
  }
}

function listenChange() {
  editorRef.value.on('cursorActivity', (cm) => {
    const { cursor, markdown } = getMarkdownAndCursor(cm)
    // Attention: the cursor may be `{focus: null, anchor: null}` when press `backspace`
    const wordCount = getWordCount(markdown)
    if (commitTimerRef.value)
      clearTimeout(commitTimerRef.value)
    commitTimerRef.value = setTimeout(() => {
      if (viewDestroyedRef.value) {
        if (tabIdRef.value) {
          // this.$store.dispatch('LISTEN_FOR_CONTENT_CHANGE', { id: this.tabId, markdown, wordCount, cursor })
          debugger
        }
        else {
          // This may occur during tab switching but should not occur otherwise.
          console.warn('LISTEN_FOR_CONTENT_CHANGE: Cannot commit changes because not tab id was set!')
        }
      }
    }, 1000)
  })
}

// Another tab was selected - only listen to get changes but don't set history or other things.
function handleFileChange(id, markdown, cursor) {
  prepareTabSwitch()

  if (typeof markdown === 'string')
    editorRef.value.setValue(markdown)
  // Cursor is null when loading a file or creating a new tab in source code mode.
  if (cursor) {
    const { anchor, focus } = cursor
    editorRef.value.setSelection(anchor, focus, { scroll: true })
  }
  else {
    setCursorAtLastLine(editorRef.value)
  }
  tabIdRef.value = id
}

// Get markdown and cursor from CodeMirror.
function getMarkdownAndCursor(cm) {
  let focus = cm.getCursor('head')
  let anchor = cm.getCursor('anchor')
  const markdown = cm.getValue()
  const convertToMuyaCursor = (cursor) => {
    const line = cm.getLine(cursor.line)
    const preLine = cm.getLine(cursor.line - 1)
    const nextLine = cm.getLine(cursor.line + 1)
    return adjustCursor(cursor, preLine, line, nextLine)
  }

  anchor = convertToMuyaCursor(anchor) // Selection start as Muya cursor
  focus = convertToMuyaCursor(focus) // Selection end as Muya cursor

  // Normalize cursor that `anchor` is always before `focus` because
  // this is the expected behavior in Muya.
  if (anchor && focus && anchor.line > focus.line) {
    const tmpCursor = focus
    focus = anchor
    anchor = tmpCursor
  }
  return { cursor: { focus, anchor }, markdown }
}

// Commit changes from old tab. Problem: tab was already switched, so commit changes with old tab id.
function prepareTabSwitch() {
  if (commitTimerRef.value)
    clearTimeout(commitTimerRef.value)
  if (tabIdRef.value) {
    const { cursor, markdown } = getMarkdownAndCursor(editorRef.value)
    // this.$store.dispatch('LISTEN_FOR_CONTENT_CHANGE', { id: this.tabId, markdown, cursor })
    tabIdRef.value = null // invalidate tab id
  }
}

function handleSelectAll() {
  if (!sourceCode.value)
    return

  if (editorRef.value && editorRef.value.hasFocus()) { editorRef.value.execCommand('selectAll') }
  else {
    const activeElement = document.activeElement
    const nodeName = activeElement?.nodeName
    if (nodeName === 'INPUT' || nodeName === 'TEXTAREA')
      activeElement.select()
  }
}

function handleInvalidateImageCache() {
  if (editorRef.value)
    editorRef.value.invalidateImageCache()
}
</script>

<template>
  <div ref="sourceCode" class="source-code" />
</template>

<style>
  .source-code {
    height: calc(100vh - var(--titleBarHeight));
    box-sizing: border-box;
    overflow: auto;
  }
  .source-code .CodeMirror {
    height: auto;
    margin: 50px auto;
    max-width: var(--editorAreaWidth);
    background: transparent;
  }
  .source-code .CodeMirror-gutters {
    border-right: none;
    background-color: transparent;
  }
  .source-code .CodeMirror-activeline-background,
  .source-code .CodeMirror-activeline-gutter {
    background: var(--floatHoverColor);
  }
</style>
