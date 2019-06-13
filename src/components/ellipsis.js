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
    el.style.whiteSpace = 'nowrap'
    el.style.wordBreak = 'keep-all'
    el.style.top = '-99999px'
    el.style.left = '0'
    el.style.position = 'fixed'
}

/**
 *
 * @param el
 * @param content
 * @param position
 * @param fill
 * @return {[boolean, String]} 第一个值表示是否进行了省略，第二个值是显示的文本
 */
function makeEllipsis(el, content, position, fill) {
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
    if (!containerWidth && !containerMaxWidth) {
        throw new Error('Ellipsis: You should specify one of "width" and "max-width"')
    }
    if (!containerWidth) {
        containerWidth = containerMaxWidth
    }
    if (contentWidth + fillWidth <= containerWidth) {
        return [false, content]
    }
    let result = ''
    switch (position) {
        case 'start':
            result = makeLeftEllipsis(containerWidth, content, fill, fillWidth, wordProxy)
            break
        case 'middle':
            result = makeCenterEllipsis(containerWidth, content, fill, fillWidth, wordProxy)
            break
        case 'end':
            result = makeRightEllipsis(containerWidth, content, fill, fillWidth, wordProxy)
            break
        default:
            throw new Error(`Ellipse: Invalid position value "${position}", available: start, middle, end`)
    }

    return [true, result]
}

function makeLeftEllipsis(containerWidth, content, fill, fillWidth, wordProxy) {
    let size = containerWidth - fillWidth
    let suffix = ''
    for (let i = content.length - 1; i >= 0; i--) {
        let ch = content[i]
        size -= getWordWidth(wordProxy, ch)
        if (size < 0) {
            break
        }
        suffix = ch + suffix
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

function makeRightEllipsis(containerWidth, content, fill, fillWidth, wordProxy) {
    let size = containerWidth - fillWidth
    let contentLength = content.length
    let prefix = ''
    for (let i = 0; i < contentLength; i++) {
        let ch = content[i]
        size -= getWordWidth(wordProxy, ch)
        if (size < 0) {
            break
        }
        prefix = prefix + ch
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
