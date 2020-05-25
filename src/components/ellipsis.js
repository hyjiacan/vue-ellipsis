const cache = new Map()
let proxy = document.querySelector('#vue-ellipsis-proxy')

const ellipsis = {
  init() {
    if (proxy) {
      return
    }
    proxy = ellipsis.createProxy(document.body)
    proxy.id = 'vue-ellipsis-proxy'
    proxy.style.top = '-99999px'
    proxy.style.left = '0'
    proxy.style.position = 'fixed'
    proxy.style.visibility = 'hidden'
  },
  validate(rows, position, scale) {
    if (['start', 'middle', 'end'].indexOf(position) === -1) {
      console.warn(`Invalid ellipse position value "${position}", available: start, middle, end`)
      return false
    }

    if (rows > 1 && position === 'middle') {
      console.warn(`Ellipsis accept single row while position is "middle", got value "${rows}"`)
      return false
    }

    if (rows > 1 && scale) {
      console.warn(`Ellipsis accept single row while "scale" enabled, got value "${rows}"`)
      return false
    }
    return true
  },
  destroy(id) {
    if (!cache.has(id)) {
      return
    }
    let {contentProxy, fillProxy, wordProxy} = cache.get(id)
    proxy.removeChild(contentProxy)
    proxy.removeChild(fillProxy)
    proxy.removeChild(wordProxy)
    cache.delete(id)
  },
  createProxy(parent, id, type) {
    let proxy = document.createElement('div')
    if (id) {
      proxy.setAttribute('data-proxy-id', id)
    }
    if (type) {
      proxy.setAttribute('data-proxy-type', type)
    }
    parent.appendChild(proxy)
    return proxy
  },
  getProxy(el, id) {
    if (cache.has(id)) {
      return cache.get(id)
    }
    cache.set(id, {
      contentProxy: ellipsis.createProxy(proxy, id, 'content'),
      fillProxy: ellipsis.createProxy(proxy, id, 'fill'),
      wordProxy: ellipsis.createProxy(proxy, id, 'word')
    })
    return cache.get(id)
  },
  setProxyStyle(el, style) {
    el.style.fontSize = style.fontSize
    el.style.fontWeight = style.fontWeight
    el.style.letterSpacing = style.letterSpacing
    el.style.wordSpacing = style.wordSpacing
    el.style.wordWrap = style.wordWrap
    el.style.fontFamily = style.fontFamily
    el.style.transform = style.transform
    el.style.whiteSpace = 'nowrap'
    el.style.wordBreak = 'keep-all'
    el.style.top = '-99999px'
    el.style.left = '0'
    el.style.position = 'fixed'
  },
  getStyle(el) {
    return window.getComputedStyle(el)
  },
  getRect(el) {
    return el.getClientRects()[0]
  },
  isAlphabet(ch) {
    return /^[a-zA-Z']$/.test(ch)
  },
  isNumeric(ch) {
    return /^[0-9]$/.test(ch)
  },
  isSeparator(ch) {
    return /[\s\t\r\n,.+=\-_:;"/<>!@#$%^&*()|`~\\[\]{}]/.test(ch)
  },
  /**
   * 获取英文的前一个词(按空格/.,?等字符分隔)
   * @param content
   * @param index
   */
  getPrevWord(content, index) {
    if (ellipsis.isSeparator(content[index])) {
      return content[index]
    }
    let temp = []
    for (; index >= 0; index--) {
      let ch = content[index]
      if (ellipsis.isSeparator(ch)) {
        break
      }
      temp.unshift(ch)

      if (ellipsis.isNumeric(ch) || ellipsis.isAlphabet(ch)) {
        continue
      }
      break
    }
    return temp.join('')
  },

  /**
   * 获取英文的后一个词(按空格/.,?等字符分隔)
   * @param content
   * @param index
   */
  getNextWord(content, index) {
    if (ellipsis.isSeparator(content[index])) {
      return content[index]
    }
    let temp = []
    for (; index < content.length; index++) {
      let ch = content[index]
      if (ellipsis.isSeparator(ch)) {
        break
      }
      temp.push(ch)

      if (ellipsis.isNumeric(ch) || ellipsis.isAlphabet(ch)) {
        continue
      }
      break
    }
    return temp.join('')
  },
  getWordWidth(wordProxy, word) {
    // 使用 &nbsp; 作为空格来计算字符长度
    wordProxy.innerHTML = word === ' ' ? '&nbsp;' : word
    return parseFloat(ellipsis.getRect(wordProxy).width)
  },
  getMeta(el, id, {content, fill}) {
    if (!el) {
      return {}
    }
    // 设置样式
    let {wordProxy, contentProxy, fillProxy} = ellipsis.getProxy(el, id)
    contentProxy.innerHTML = content
    let containerStyle = ellipsis.getStyle(el)
    ellipsis.setProxyStyle(wordProxy, containerStyle)
    ellipsis.setProxyStyle(contentProxy, containerStyle)

    let fillWidth = 0
    if (fill.length) {
      fillProxy.innerHTML = fill
      ellipsis.setProxyStyle(fillProxy, containerStyle)
      fillWidth = parseFloat(this.getRect(fillProxy).width)
    }

    let contentWidth = parseFloat(this.getRect(contentProxy).width)
    let containerWidth = parseFloat(containerStyle.width)
    let containerMaxWidth = parseFloat(containerStyle.maxWidth)
    let containerWordbreak = containerStyle.wordBreak === 'break-all'
    if (!containerWidth && !containerMaxWidth) {
      throw new Error('You should specify "width" or "max-width" for ellipsis')
    }
    if (!containerWidth) {
      containerWidth = containerMaxWidth
    }

    return {
      fillWidth,
      contentWidth,
      containerWidth,
      containerWordbreak,
      containerMaxWidth,
      contentProxy,
      containerStyle,
      wordProxy
    }
  },
  clearContent(content) {
    return content.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim()
  },
  // eslint-disable-next-line no-unused-vars
  getScaleInfo({containerWidth, contentProxy, contentWidth, containerStyle}) {
    // 原始高度
    const height = parseFloat(ellipsis.getRect(contentProxy).height)
    const fontsize = parseFloat(containerStyle.fontSize)
    const color = containerStyle.color
    // 缩放比例
    const ratio = containerWidth / contentWidth
    const scaledFontsize = fontsize * ratio

    return {
      // 基准线，用于使文字垂直居中 (被 dominant-baseline: central 使用)
      baseline: height / 2,
      // 文字样式
      style: `fill: ${color};font-size: ${scaledFontsize}px;dominant-baseline: central;`,
      viewBox: `0 0 ${containerWidth} ${height}`,
      scaled: Math.round(fontsize) > Math.round(scaledFontsize)
    }
  },
  makeLeft({containerWidth, fillWidth, wordProxy, containerWordbreak}, {content, fill, rows}) {
    let suffix = ''
    let i = content.length - 1
    for (let row = rows; row >= 1; row--) {
      // 第一行才设置省略
      let size = row === 1 ? (containerWidth - fillWidth) : containerWidth
      for (; i >= 0;) {
        let word = containerWordbreak ? content[i] : ellipsis.getPrevWord(content, i)
        i -= word.length
        size -= ellipsis.getWordWidth(wordProxy, word)
        if (size < 0) {
          break
        }
        suffix = word + suffix
      }
    }

    return `${fill}${suffix}`
  },
  makeCenter({containerWidth, fillWidth, wordProxy}, {content, fill}) {
    let size = containerWidth - fillWidth
    let contentLength = content.length

    let prefix = ''
    let suffix = ''

    for (let i = 0; i < contentLength; i++) {
      let ch = content[i]
      size -= ellipsis.getWordWidth(wordProxy, ch)
      if (size < 0) {
        break
      }
      prefix = prefix + ch
      ch = content[contentLength - 1 - i]
      size -= ellipsis.getWordWidth(wordProxy, ch)
      if (size < 0) {
        break
      }
      suffix = ch + suffix
    }

    return `${prefix}${fill}${suffix}`
  },
  makeRight({containerWidth, fillWidth, wordProxy, containerWordbreak}, {content, fill, rows}) {
    let contentLength = content.length
    let prefix = ''
    let i = 0
    for (let row = 0; row < rows; row++) {
      // 最后一行才设置省略
      let size = row === rows - 1 ? (containerWidth - fillWidth) : containerWidth
      for (; i < contentLength;) {
        let word = containerWordbreak ? content[i] : ellipsis.getNextWord(content, i)
        i += word.length
        size -= ellipsis.getWordWidth(wordProxy, word)
        if (size < 0) {
          break
        }
        prefix = prefix + word
        if (i === contentLength) {
          return prefix
        }
      }
    }

    return `${prefix}${fill}`
  },
  make(meta, option) {
    if (meta.contentWidth <= meta.containerWidth ||
      meta.contentWidth + meta.fillWidth <= meta.containerWidth) {
      return [false, option.content]
    }

    switch (option.position) {
      case 'start':
        return [true, ellipsis.makeLeft(meta, option)]
      case 'middle':
        return [true, ellipsis.makeCenter(meta, option)]
      case 'end':
        return [true, ellipsis.makeRight(meta, option)]
      default:
        return [false, option.content]
    }
  },
  newId() {
    return `${new Date().getTime()}${Math.round(Math.random() * 1000)}`
  }
}

ellipsis.init()

export default ellipsis
