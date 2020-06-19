import Ellipsis from './ellipsis'

export default {
  name: 'Ellipsis',
  props: {
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
      default: 'auto'
    },
    rows: {
      type: Number,
      default: 1
    },
    scale: {
      type: Boolean,
      default: false
    },
    content: {
      type: String
    }
  },
  data() {
    return {
      ellipsis: null
    }
  },
  mounted() {
    if (!this.content) {
      this.$forceUpdate()
    }
  },
  computed: {
    rawContent() {
      return this.content || this.getText()
    }
  },
  render(createElement) {
    if (!this.$el) {
      return createElement('div')
    }

    const ellipsis = this.ellipsis = new Ellipsis(this.rawContent, {
      el: this.$el,
      fill: this.fill,
      rows: this.rows,
      position: this.position,
      scale: this.scale,
      showTitle: this.showTitle
    })

    const meta = ellipsis.meta

    if (this.rows === 0 || !meta) {
      return this.doRender(createElement, false, ellipsis.content)
    }

    let hasEllipsis
    let ellipsisContent

    if (this.scale) {
      [hasEllipsis, ellipsisContent] = this.makeSvg(createElement)
    } else {
      [hasEllipsis, ellipsisContent] = ellipsis.make()
    }

    return this.doRender(createElement, hasEllipsis, ellipsisContent)
  },
  methods: {
    doRender(createElement, hasEllipsis, ellipsisContent) {
      this.ellipsis.destroy()
      let title = undefined
      if (this.showTitle === 'always' || (hasEllipsis && this.showTitle !== 'none')) {
        title = this.rawContent
      }
      return createElement('div', {
        attrs: {
          title
        }
      }, [ellipsisContent])
    },
    getText() {
      const content = this.$slots.default
      if (!content || content.length === 0) {
        return ''
      }
      return content.map(i => i.text).join('')
    },
    makeSvg(h) {
      const {baseline, viewBox, style, scaled} = this.ellipsis.getScaleInfo()

      return [scaled, h('svg', {
        attrs: {viewBox}
      }, [h('text', {
        attrs: {x: '0', y: baseline, style}
      }, this.ellipsis.content)])]
    }
  },
  beforeDestroy() {
    if (this.ellipsis) {
      this.ellipsis.destroy()
    }
  }
}
