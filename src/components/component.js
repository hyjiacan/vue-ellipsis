import ellipsis from './ellipsis'

export default {
    name: 'Ellipsis',
    props: {
        title: {
            type: String
        },
        fill: {
            type: String,
            default: '...'
        },
        position: {
            type: String,
            default: 'end'
        },
        showTitle: {
            type: String,
            default: ''
        },
        rows: {
            type: Number,
            default: 1
        },
        scale: {
            type: Boolean,
            default: false
        },
        delay: {
            type: Boolean,
            default: false
        },
        content: {
            type: String
        }
    },
    data () {
        return {
            id: ellipsis.newId()
        }
    },
    mounted () {
        ellipsis.validate(this.rows, this.position, this.scale)
        if (!this.content) {
            this.$forceUpdate()
        }
    },
    render (createElement) {
        let text = ellipsis.clearContent(this.content || this.getText())
        const option = {
            content: text,
            fill: this.fill,
            rows: this.rows,
            position: this.position
        }
        let meta = ellipsis.getMeta(this.$el, this.id, option)

        if (this.rows === 0 || !Object.keys(meta).length) {
            return this.doRender(createElement, false, text, text)
        }

        let hasEllipsis
        let ellipsisContent

        if (this.scale) {
            [hasEllipsis, ellipsisContent] = this.makeSvg(createElement, meta, option)
        } else {
            [hasEllipsis, ellipsisContent] = ellipsis.make(meta, option)
        }

        return this.doRender(createElement, hasEllipsis, text, ellipsisContent)
    },
    methods: {
        doRender (createElement, hasEllipsis, rawText, ellipsisContent) {
            ellipsis.destroy(this.id)
            let title = undefined
            if (this.showTitle === 'always' || (hasEllipsis && this.showTitle !== 'none')) {
                title = rawText
            }
            return createElement('div', {
                attrs: {
                    'class': 'vue-ellipsis',
                    'data-ellipsis-id': this.id,
                    title
                }
            }, [ellipsisContent])
        },
        getText () {
            const content = this.$slots.default
            if (!content || content.length === 0) {
                return ''
            }
            return content.map(i => i.text).join('')
        },
        makeSvg (h, meta, {content}) {
            const {height, viewBox, scale, scaled} = ellipsis.getScaleInfo(meta)

            return [scaled, h('svg', {
                attrs: {viewBox, height: `${height}px`}
            }, [h('text', {
                attrs: {x: '0', y: '0', style: `font-size: ${scale}px;`}
            }, content)])]
        }
    },
    beforeDestroy () {
        ellipsis.destroy(this.id)
    }
}
