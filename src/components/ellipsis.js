let cache = new Map()
let proxy = document.querySelector('#vue-ellipsis-proxy')
if (!proxy) {
    proxy = createProxy(document.body)
    proxy.id = 'vue-ellipsis-proxy'
    proxy.style.top = '-99999px'
    proxy.style.left = '0'
    proxy.style.position = 'fixed'
    proxy.style.visibility = 'hidden'
}

function createProxy(parent) {
    let proxy = document.createElement('div')
    parent.appendChild(proxy)
    return proxy
}

function getProxy(el) {
    if (cache.has(el)) {
        return cache.get(el)
    }
    cache.set(el, {
        contentProxy: createProxy(proxy),
        fillProxy: createProxy(proxy),
        wordProxy: createProxy(proxy)
    })
    return cache.get(el)
}

function clearContent(content) {
    return content.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim()
}

function getStyle(el) {
    return window.getComputedStyle(el)
}

function setProxyStyle(el, style) {
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
}

function isAlphabet(ch) {
    return /^[a-z']$/.test(ch)
}

function isSeparator(ch) {
    return /[\s\t\r\n,.+=-_:;"/<>!@#$%^&*()|`~\\[\]{}]/.test(ch)
}

/**
 * 获取英文的前一个词(按空格/.,?等字符分隔)
 * @param content
 * @param index
 */
function getPrevWord(content, index) {
    if (isSeparator(content[index])) {
        return ' '
    }
    let temp = []
    for (; index >= 0; index--) {
        let ch = content[index]
        if (isSeparator(ch)) {
            break
        }
        temp.unshift(ch)

        if (isAlphabet(ch)) {
            continue
        }
        break
    }
    return temp.join('')
}

/**
 * 获取英文的后一个词(按空格/.,?等字符分隔)
 * @param content
 * @param index
 */
function getNextWord(content, index) {
    if (isSeparator(content[index])) {
        return ' '
    }
    let temp = []
    for (; index < content.length; index++) {
        let ch = content[index]
        if (isSeparator(ch)) {
            break
        }
        temp.push(ch)

        if (isAlphabet(ch)) {
            continue
        }
        break
    }
    return temp.join('')
}

function autoSize(content, contentProxy, contentWidth, containerWidth, containerStyle) {
    // 原始的高度
    let height = parseFloat(getStyle(contentProxy).height)
    let rate = containerWidth / contentWidth
    let fontsize = parseFloat(containerStyle.fontSize)
    let scale = fontsize * rate
    // // 使用二分法
    // while (fontsize >= scale > 0) {
    //     contentProxy.style.fontSize = `${scale}px`
    //     let proxyWidth = parseFloat(getStyle(contentProxy).width)
    //     if (0 < containerWidth - proxyWidth < 2) {
    //         break
    //     }
    //     if (proxyWidth > containerWidth) {
    //         scale -= scale / 2
    //     } else {
    //         scale += scale / 2
    //     }
    // }
    return [
        Math.round(fontsize) > Math.round(scale),
        `<svg viewBox="0 -${height / 2}0 ${containerWidth} ${height}" height="${height}px"><text x="0" y="0" style="font-size: ${scale}px;">${content}</text></svg>`
    ]
}

/**
 *
 * @param el
 * @param content
 * @param position
 * @param fill
 * @param rows
 * @param {Boolean} scale 是否自动缩放内容
 * @return {[boolean, String]} 第一个值表示是否进行了省略，第二个值是显示的文本
 */
function makeEllipsis(el, content, position, fill, rows, scale) {
    // 设置样式
    let {wordProxy, contentProxy, fillProxy} = getProxy(el)
    contentProxy.innerHTML = content
    fillProxy.innerHTML = fill
    let containerStyle = getStyle(el)
    setProxyStyle(wordProxy, containerStyle)
    setProxyStyle(contentProxy, containerStyle)
    setProxyStyle(fillProxy, containerStyle)

    let contentWidth = parseFloat(getStyle(contentProxy).width)
    let fillWidth = parseFloat(getStyle(fillProxy).width)
    let containerWidth = parseFloat(containerStyle.width)
    let containerMaxWidth = parseFloat(containerStyle.maxWidth)
    let containerWordbreak = containerStyle.wordBreak === 'break-all'
    if (!containerWidth && !containerMaxWidth) {
        throw new Error('You should specify "width" or "max-width" for ellipsis')
    }
    if (!containerWidth) {
        containerWidth = containerMaxWidth
    }
    if (contentWidth <= containerWidth || contentWidth + fillWidth <= containerWidth) {
        return [false, content]
    }

    // 自动缩放以适应大小
    if (scale) {
        return autoSize(content, contentProxy, contentWidth, containerWidth, containerStyle)
    }

    let result = ''
    switch (position) {
        case 'start':
            result = makeLeftEllipsis(containerWidth, content, fill, fillWidth, wordProxy, rows, containerWordbreak)
            break
        case 'middle':
            result = makeCenterEllipsis(containerWidth, content, fill, fillWidth, wordProxy, rows, containerWordbreak)
            break
        case 'end':
            result = makeRightEllipsis(containerWidth, content, fill, fillWidth, wordProxy, rows, containerWordbreak)
            break
        default:
            throw new Error(`Invalid ellipse position value "${position}", available: start, middle, end`)
    }

    return [true, result]
}

function makeLeftEllipsis(containerWidth, content, fill, fillWidth, wordProxy, rows, wordBreak) {
    let suffix = ''
    let i = content.length - 1
    for (let row = rows; row >= 1; row--) {
        // 第一行才设置省略
        let size = row === 1 ? (containerWidth - fillWidth) : containerWidth
        for (; i >= 0;) {
            let word = wordBreak ? content[i] : getPrevWord(content, i)
            i -= word.length
            size -= getWordWidth(wordProxy, word)
            if (size < 0) {
                break
            }
            suffix = word + suffix
        }
    }

    return `${fill}${suffix}`
}

function makeCenterEllipsis(containerWidth, content, fill, fillWidth, wordProxy) {
    let size = containerWidth - fillWidth
    let contentLength = content.length

    let prefix = ''
    let suffix = ''
    for (let i = 0; i < contentLength; i++) {
        let ch = content[i]
        size -= getWordWidth(wordProxy, ch)
        if (size < 0) {
            break
        }
        prefix = prefix + ch
        ch = content[contentLength - 1 - i]
        size -= getWordWidth(wordProxy, ch)
        if (size < 0) {
            break
        }
        suffix = ch + suffix
    }

    return `${prefix}${fill}${suffix}`
}

function makeRightEllipsis(containerWidth, content, fill, fillWidth, wordProxy, rows, wordBreak) {
    let contentLength = content.length
    let prefix = ''
    let i = 0
    for (let row = 0; row < rows; row++) {
        // 最后一行才设置省略
        let size = row === rows - 1 ? (containerWidth - fillWidth) : containerWidth
        for (; i < contentLength;) {
            let word = wordBreak ? content[i] : getNextWord(content, i)
            i += word.length
            size -= getWordWidth(wordProxy, word)
            if (size < 0) {
                break
            }
            prefix = prefix + word
        }
    }

    return `${prefix}${fill}`
}

function getWordWidth(wordProxy, word) {
    // 使用 &nbsp; 作为空格来计算字符长度
    wordProxy.innerHTML = word === ' ' ? '&nbsp;' : word
    return parseFloat(window.getComputedStyle(wordProxy).width)
}

function destroy(el) {
    if (!cache.has(el)) {
        return
    }
    cache.delete(el)
}

export default {
    make: makeEllipsis,
    destroy,
    clear: clearContent
}
