export default {
    props: {
        fill: {
            type: String,
            default: '...'
        },
        text: {
            type: String
        },
        /**
         * 是否在文本超长时显示 title
         */
        showTitle: {
            type: Boolean,
            default: true
        },
        /**
         * 可选值: start middle end
         */
        position: {
            type: String,
            default: 'end'
        }
    },
    data() {
        let proxy = document.querySelector('#vue-ellipsis-proxy')
        if (!proxy) {
            proxy = this.createProxy(document.body)
            proxy.id = 'vue-ellipsis-proxy'
            proxy.style.top = '-99999px'
            proxy.style.left = '0'
            proxy.style.position = 'fixed'
            proxy.style.visibility = 'hidden'
        }
        // 代理元素用于计算文本长度
        return {
            content: '',
            tipText: '',
            proxy,
            contentProxy: this.createProxy(proxy),
            fillProxy: this.createProxy(proxy),
            wordProxy: this.createProxy(proxy)
        }
    },
    beforeDestroy() {
        this.proxy.removeChild(this.contentProxy)
        this.proxy.removeChild(this.fillProxy)
        this.proxy.removeChild(this.wordProxy)
    },
    mounted() {
        this.update()
    },
    watch: {
        fill() {
            this.update()
        },
        text() {
            this.update()
        }
    },
    methods: {
        update() {
            this.content = this.text ? this.text : this.slotContent
            this.$el.innerHTML = ''
            this.contentProxy.innerHTML = this.content
            this.fillProxy.innerHTML = this.fill
            this.$nextTick(() => {
                this.$el.innerHTML = this.makeEllipsis()
            })
        },
        createProxy(parent) {
            let proxy = document.createElement('div')
            parent.appendChild(proxy)
            return proxy
        },
        clearContent(content) {
            return content.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim()
        },
        setProxyStyle(el, style) {
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
        },
        makeEllipsis() {
            // 设置样式
            let contentStyle = this.getContainerStyle()
            this.setProxyStyle(this.wordProxy, contentStyle)
            this.setProxyStyle(this.contentProxy, contentStyle)
            this.setProxyStyle(this.fillProxy, contentStyle)

            let contentWidth = parseFloat(this.getContentProxyStyle().width)
            let fillWidth = parseFloat(this.getFillProxyStyle().width)
            let contentLength = this.content.length
            let containerWidth = parseFloat(contentStyle.width)
            if (contentWidth + fillWidth <= containerWidth) {
                return this.content
            }
            if (this.showTitle) {
                this.tipText = this.content
            }
            switch (this.position) {
                case 'start':
                    return this.makeLeftEllipsis(containerWidth, contentLength, fillWidth)
                case 'middle':
                    return this.makeCenterEllipsis(containerWidth, contentLength, fillWidth)
                case 'end':
                    return this.makeRightEllipsis(containerWidth, contentLength, fillWidth)
                default:
                    throw new Error(`Ellipse: Invalid position value "${this.position}"`)
            }

        },
        makeLeftEllipsis(containerWidth, contentLength, fillWidth) {
            let size = containerWidth - fillWidth
            let suffix = ''
            for (let i = contentLength - 1; i >= 0; i--) {
                let ch = this.content[i]
                size -= this.getWordWidth(ch)
                if (size < 0) {
                    break
                }
                suffix = ch + suffix
            }

            return `${this.fill}${suffix}`
        },
        makeCenterEllipsis(containerWidth, contentLength, fillWidth) {
            let size = containerWidth - fillWidth

            let prefix = ''
            let suffix = ''
            for (let i = 0; i < contentLength; i++) {
                let ch = this.content[i]
                size -= this.getWordWidth(ch)
                if (size < 0) {
                    break
                }
                prefix = prefix + ch
                ch = this.content[contentLength - 1 - i]
                size -= this.getWordWidth(ch)
                if (size < 0) {
                    break
                }
                suffix = ch + suffix
            }

            return `${prefix}${this.fill}${suffix}`
        },
        makeRightEllipsis(containerWidth, contentLength, fillWidth) {
            let size = containerWidth - fillWidth
            let prefix = ''
            for (let i = 0; i < contentLength; i++) {
                let ch = this.content[i]
                size -= this.getWordWidth(ch)
                if (size < 0) {
                    break
                }
                prefix = prefix + ch
            }

            return `${prefix}${this.fill}`
        },
        getWordWidth(word) {
            // 使用 &nbsp; 作为空格来计算字符长度
            this.wordProxy.innerHTML = word === ' ' ? '&nbsp;' : word
            return parseFloat(window.getComputedStyle(this.wordProxy).width)
        },
        getContentProxyStyle() {
            return window.getComputedStyle(this.contentProxy)
        },
        getFillProxyStyle() {
            return window.getComputedStyle(this.fillProxy)
        },
        getContainerStyle() {
            return window.getComputedStyle(this.$el)
        }
    },
    computed: {
        slotContent() {
            if (!this.$slots.default) {
                return ''
            }
            let elm = this.$slots.default[0].elm
            if (elm.nodeType === 3) {
                // text node
                return this.clearContent(elm.textContent)
            }
            return this.clearContent(elm.outerHTML)
        },
    }
}
