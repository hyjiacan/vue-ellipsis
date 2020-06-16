/*
 * The core of ellipsis
 */

// The global cache.
const cache = new Map()
let proxy = document.querySelector('#vue-ellipsis-proxy')

function raiseError(message) {
  throw new Error('[vue-ellipsis] ' + message)
}

const ellipsis = {
  /**
   * Create a global(and unique) HTMLElement proxy for all temporary ellipsis elements.
   */
  init() {
    if (proxy) {
      return
    }
    proxy = this.createProxy(document.body)
    proxy.id = 'vue-ellipsis-proxy'
    proxy.style.top = '-99999px'
    proxy.style.left = '0'
    proxy.style.position = 'fixed'
    proxy.style.visibility = 'hidden'
  },
  /**
   * Validate component props/directive modifiers
   * @param rows
   * @param position
   * @param scale
   * @return {boolean}
   */
  validate(rows, position, scale) {
    if (['start', 'middle', 'end'].indexOf(position) === -1) {
      raiseError(`Invalid ellipse position value "${position}", available: start, middle, end`)
      return false
    }

    // Position with value "middle" makes no sense if there are more than one lines
    if (rows > 1 && position === 'middle') {
      raiseError(`Accept single row while position is "middle", got value "${rows}"`)
      return false
    }

    // Scaling makes no sense if there are more than one lines
    if (rows > 1 && scale) {
      raiseError(`Accept single row while "scale" enabled, got value "${rows}"`)
      return false
    }
    return true
  },
  /**
   * Destroy all temporary elements
   * @param id
   */
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
  /**
   * Create proxy for new ellipsis instance
   * @param parent
   * @param id
   * @param type
   * @return {HTMLDivElement}
   */
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
  /**
   * Get proxy of specified id from cache
   * @param el
   * @param id
   * @return {any}
   */
  getProxy(el, id) {
    if (cache.has(id)) {
      return cache.get(id)
    }
    cache.set(id, {
      contentProxy: this.createProxy(proxy, id, 'content'),
      fillProxy: this.createProxy(proxy, id, 'fill'),
      wordProxy: this.createProxy(proxy, id, 'word')
    })
    return cache.get(id)
  },
  /**
   * Proxy should always invisible, and no wrap, and no word-break
   * @param el
   * @param style
   */
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
  /**
   * Get styles of specified element.
   * Note: this may cause performance issue
   * @param el
   * @return {CSSStyleDeclaration}
   */
  getStyle(el) {
    return window.getComputedStyle(el)
  },
  /**
   * Get element rectangle, this is better option than getStyle when we need just the size and position
   * @param el
   * @return {DOMRect}
   */
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
   * Get the prev word in english.
   *
   * Call this method(and getNextWord) to make sure to keep words will not be break into two lines
   *
   * Note: Support English only, not works for all languages.
   * @param content
   * @param index
   */
  getPrevWord(content, index) {
    if (this.isSeparator(content[index])) {
      return content[index]
    }
    let temp = []
    for (; index >= 0; index--) {
      let ch = content[index]
      if (this.isSeparator(ch)) {
        break
      }
      temp.unshift(ch)

      if (this.isNumeric(ch) || this.isAlphabet(ch)) {
        continue
      }
      break
    }
    return temp.join('')
  },

  /**
   * 获取英文的后一个词(按空格/.,?等字符分隔)
   * Get the next word in english
   * Note: Support English only, not works for all languages.
   * @param content
   * @param index
   */
  getNextWord(content, index) {
    if (this.isSeparator(content[index])) {
      return content[index]
    }
    let temp = []
    for (; index < content.length; index++) {
      let ch = content[index]
      if (this.isSeparator(ch)) {
        break
      }
      temp.push(ch)

      if (this.isNumeric(ch) || this.isAlphabet(ch)) {
        continue
      }
      break
    }
    return temp.join('')
  },
  /**
   * Get an english word width
   * @param wordProxy
   * @param word
   * @return {number}
   */
  getWordWidth(wordProxy, word) {
    // 使用 &nbsp; 作为空格来计算字符长度
    wordProxy.innerHTML = word === ' ' ? '&nbsp;' : word
    return this.getRect(wordProxy).width
  },
  /**
   * container: the element will be left out or parent (recursive)
   * Try to get actual width from percentage value.
   * @param {HTMLElement} el
   * @param {CSSStyleDeclaration} style
   * @return {number}
   */
  getContainerWidth(el, style) {
    if (!el) {
      return 0
    }

    const width = style.width
    if (width.endsWith('%')) {
      // 通过父容器计算
      // width: (parentage / 100) * parentWidth
      return (parseFloat(width) / 100) * this.getContainerWidth(el.parentElement, window.getComputedStyle(el))
    }

    if (width !== 'auto') {
      // 判断盒子模型
      if (style.boxSizing !== 'border-box') {
        return parseInt(width)
      }
      // 是 border-box ，此时要减去 padding 和 border-width
      const pl = parseInt(style.paddingLeft) || 0
      const pr = parseInt(style.paddingRight) || 0
      const bl = parseInt(style.borderLeftWidth) || 0
      const br = parseInt(style.borderRightWidth) || 0
      return parseInt(width) - pl - pr - bl - br
    }

    // 当宽度为 auto 时
    // 若此元素是块级元素时，直接使用其父元素宽度
    // Return parent width for elements which display as block
    if (!style.display.startsWith('inline')) {
      return this.getContainerWidth(el.parentElement, window.getComputedStyle(el))
    }

    return 0
  },
  /**
   * Compute width with content/fill
   * @param el
   * @param id
   * @param content
   * @param fill
   * @return {{contentWidth: number, fillWidth: number, contentProxy, containerStyle: CSSStyleDeclaration, containerWordbreak: boolean, containerMaxWidth: number, wordProxy, containerWidth: number}|{}}
   */
  getMeta(el, id, {content, fill}) {
    if (!el) {
      return {}
    }
    // 设置样式
    let {wordProxy, contentProxy, fillProxy} = this.getProxy(el, id)
    contentProxy.innerHTML = content
    let containerStyle = this.getStyle(el)
    this.setProxyStyle(wordProxy, containerStyle)
    this.setProxyStyle(contentProxy, containerStyle)

    let fillWidth = 0
    if (fill.length) {
      fillProxy.innerHTML = fill
      this.setProxyStyle(fillProxy, containerStyle)
      fillWidth = this.getRect(fillProxy).width
    }

    let contentWidth = this.getRect(contentProxy).width
    let containerWidth = this.getContainerWidth(el, containerStyle)
    let containerMaxWidth = parseFloat(containerStyle.maxWidth)
    let containerWordBreak = containerStyle.wordBreak === 'break-all'

    // If container width not available, ellipsis won't work
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
      containerWordBreak,
      containerMaxWidth,
      contentProxy,
      containerStyle,
      wordProxy
    }
  },
  /**
   * Replace all whitespace into space: \t\r\n
   * And merge whitespaces
   * And trim whitespaces
   * @param content
   * @return {string}
   */
  clearContent(content) {
    return content.replace(/[\r\n\t]/g, ' ').trim().replace(/\s\s+/g, ' ')
  },
  /**
   * Get scale info for svg element
   * @param containerWidth
   * @param contentProxy
   * @param contentWidth
   * @param containerStyle
   * @return {{viewBox: string, scaled: boolean, style: string, baseline: number}}
   */
  // eslint-disable-next-line no-unused-vars
  getScaleInfo({containerWidth, contentProxy, contentWidth, containerStyle}) {
    // 原始高度
    const height = this.getRect(contentProxy).height
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
  /**
   * Ellipsis at left
   * @param containerWidth
   * @param fillWidth
   * @param wordProxy
   * @param containerWordBreak
   * @param content
   * @param fill
   * @param rows
   * @return {string}
   */
  makeLeft({containerWidth, fillWidth, wordProxy, containerWordBreak}, {content, fill, rows}) {
    let suffix = ''
    let i = content.length - 1
    for (let row = rows; row >= 1; row--) {
      // 第一行才设置省略
      // If there are more than one lines, left out the 1st line only.
      let size = row === 1 ? (containerWidth - fillWidth) : containerWidth
      for (; i >= 0;) {
        let word = containerWordBreak ? content[i] : this.getPrevWord(content, i)
        i -= word.length
        size -= this.getWordWidth(wordProxy, word)
        if (size < 0) {
          break
        }
        suffix = word + suffix
      }
    }

    return `${fill}${suffix}`
  },
  /**
   * Ellipsis at middle
   * @param containerWidth
   * @param fillWidth
   * @param wordProxy
   * @param content
   * @param fill
   * @return {string}
   */
  makeCenter({containerWidth, fillWidth, wordProxy}, {content, fill}) {
    let size = containerWidth - fillWidth
    let contentLength = content.length

    let prefix = ''
    let suffix = ''

    for (let i = 0; i < contentLength; i++) {
      let ch = content[i]
      size -= this.getWordWidth(wordProxy, ch)
      if (size < 0) {
        break
      }
      prefix = prefix + ch
      ch = content[contentLength - 1 - i]
      size -= this.getWordWidth(wordProxy, ch)
      if (size < 0) {
        break
      }
      suffix = ch + suffix
    }

    return `${prefix}${fill}${suffix}`
  },
  /**
   * Ellipsis at right
   * @param containerWidth
   * @param fillWidth
   * @param wordProxy
   * @param containerWordBreak
   * @param content
   * @param fill
   * @param rows
   * @return {string}
   */
  makeRight({containerWidth, fillWidth, wordProxy, containerWordBreak}, {content, fill, rows}) {
    let contentLength = content.length
    let prefix = ''
    let i = 0
    for (let row = 0; row < rows; row++) {
      // 最后一行才设置省略
      // If there are more than one lines, left out the last line only.
      let size = row === rows - 1 ? (containerWidth - fillWidth) : containerWidth
      for (; i < contentLength;) {
        let word = containerWordBreak ? content[i] : this.getNextWord(content, i)
        i += word.length
        size -= this.getWordWidth(wordProxy, word)
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
  /**
   * The entry
   * @param meta
   * @param option
   * @return {(boolean|*)[]|(boolean|string)[]}
   */
  make(meta, option) {
    if (meta.contentWidth <= meta.containerWidth ||
      meta.contentWidth + meta.fillWidth <= meta.containerWidth) {
      return [false, option.content]
    }

    switch (option.position) {
      case 'start':
        return [true, this.makeLeft(meta, option)]
      case 'middle':
        return [true, this.makeCenter(meta, option)]
      case 'end':
        return [true, this.makeRight(meta, option)]
      default:
        // This branch will never be executed
        return [false, option.content]
    }
  },
  newId() {
    return `${new Date().getTime()}${Math.round(Math.random() * 1000)}`
  }
}

ellipsis.init()

export default ellipsis
