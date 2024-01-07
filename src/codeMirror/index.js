import { filter } from 'fuzzaldrin'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/selection/active-line'
import 'codemirror/mode/meta'
import codeMirror from 'codemirror/lib/codemirror'

import loadmode from './loadmode'
import overlayMode from './overlayMode'
import multiplexMode from './mltiplexMode'
import languages from './modes'
import 'codemirror/lib/codemirror.css'
import './index.css'
import 'codemirror/theme/railscasts.css'

loadmode(codeMirror)
overlayMode(codeMirror)
multiplexMode(codeMirror)
window.CodeMirror = codeMirror

const modes = codeMirror.modeInfo
codeMirror.modeURL = './codemirror/mode/%N/%N.js'

function getModeFromName(name) {
  let result = null
  const lang = languages.filter(lang => lang.name === name)[0]
  if (lang) {
    const { name, mode, mime } = lang
    const matched = modes.filter((m) => {
      if (m.mime) {
        if (Array.isArray(m.mime) && m.mime.includes(mime) && m.mode === mode)
          return true
        else if (typeof m.mime === 'string' && m.mime === mime && m.mode === mode)
          return true
      }
      if (Array.isArray(m.mimes) && m.mimes.includes(mime) && m.mode === mode)
        return true

      return false
    })
    if (matched.length && typeof matched[0] === 'object') {
      result = {
        name,
        mode: matched[0],
      }
    }
  }
  return result
}

export function search(text) {
  const matchedLangs = filter(languages, text, { key: 'name' })
  return matchedLangs
    .map(({ name }) => getModeFromName(name))
    .filter(lang => !!lang)
}

/**
 * set cursor at the end of last line.
 */
export function setCursorAtLastLine(cm) {
  const lastLine = cm.lastLine()
  const lineHandle = cm.getLineHandle(lastLine)

  cm.focus()
  cm.setCursor(lastLine, lineHandle.text.length)
}

// if cursor at firstLine return true
export function isCursorAtFirstLine(cm) {
  const cursor = cm.getCursor()
  const { line, ch, outside } = cursor

  return line === 0 && ch === 0 && outside
}

export function isCursorAtLastLine(cm) {
  const lastLine = cm.lastLine()
  const cursor = cm.getCursor()
  const { line, outside, sticky } = cursor
  return line === lastLine && (outside || !sticky)
}

export function isCursorAtBegin(cm) {
  const cursor = cm.getCursor()
  const { line, ch, hitSide } = cursor
  return line === 0 && ch === 0 && !!hitSide
}

export function onlyHaveOneLine(cm) {
  return cm.lineCount() === 1
}

export function isCursorAtEnd(cm) {
  const lastLine = cm.lastLine()
  const lastLineHandle = cm.getLineHandle(lastLine)
  const cursor = cm.getCursor()
  const { line, ch, hitSide } = cursor

  return line === lastLine && ch === lastLineHandle.text.length && !!hitSide
}

export function getBeginPosition() {
  return {
    anchor: { line: 0, ch: 0 },
    head: { line: 0, ch: 0 },
  }
}

export function getEndPosition(cm) {
  const lastLine = cm.lastLine()
  const lastLineHandle = cm.getLineHandle(lastLine)
  const line = lastLine
  const ch = lastLineHandle.text.length
  return { anchor: { line, ch }, head: { line, ch } }
}

export function setCursorAtFirstLine(cm) {
  cm.focus()
  cm.setCursor(0, 0)
}

export function setMode(doc, text) {
  const m = getModeFromName(text)

  if (!m) {
    const errMsg = !text
      ? 'You\'d better provided a language mode when you create code block'
      : `${text} is not a valid language mode!`
    return Promise.reject(errMsg)
  }

  const { mode, mime } = m.mode
  return new Promise((resolve) => {
    codeMirror.requireMode(mode, () => {
      doc.setOption('mode', mime || mode)
      codeMirror.autoLoadMode(doc, mode)
      resolve(m)
    })
  })
}

export function setTextDirection(cm, textDirection) {
  cm.setOption('direction', textDirection)
}

export default codeMirror
