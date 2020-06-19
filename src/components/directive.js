import Ellipsis from './ellipsis'

/**
 *
 * @param {Ellipsis} ellipsis
 */
function makeEllipsis(ellipsis) {
  const {options, meta} = ellipsis

  if (options.rows === 0 || !meta) {
    doRender(ellipsis, false)
    return
  }

  let hasEllipsis
  let ellipsisContent
  if (ellipsis.options.scale) {
    [hasEllipsis, ellipsisContent] = makeSvg(ellipsis.getScaleInfo(), ellipsis.content)
  } else {
    [hasEllipsis, ellipsisContent] = ellipsis.make()
  }
  doRender(ellipsis, hasEllipsis, ellipsisContent)
}

function doRender(ellipsis, hasEllipsis, ellipsisContent) {
  ellipsis.destroy()
  const el = ellipsis.options.el
  el.innerHTML = ellipsisContent

  if (ellipsis.options.showTitle === 'always') {
    el.title = ellipsis.rawContent
    return
  }

  if (!hasEllipsis || ellipsis.options.showTitle === 'none') {
    el.title = ''
    return
  }
  el.title = ellipsis.rawContent
}

function makeSvg(scaleInfo, content) {
  const {baseline, viewBox, style, scaled} = scaleInfo

  return [scaled, `<svg viewBox="${viewBox}"><text x="0" y="${baseline}" style="${style}">${content}</text></svg>`]
}

function getText(vnode) {
  let temp = []
  vnode.children.forEach(i => {
    temp.push(i.text)
    if (i.children && i.children.length) {
      temp.push(getText(i))
    }
  })
  return temp.join(' ')
}

function render(el, {modifiers, value}, vnode) {
  const text = getText(vnode)

  if (!text) {
    return
  }

  let position = 'end'
  if (modifiers.start) {
    position = 'start'
  } else if (modifiers.middle) {
    position = 'middle'
  } else if (modifiers.end) {
    position = 'end'
  }
  let showTitle = 'auto'
  if (modifiers.none) {
    showTitle = 'none'
  } else if (modifiers.always) {
    showTitle = 'always'
  }
  // 显示的行数，默认为1行
  let rows = value || 1

  // 值为0表示显示所有行
  // Show all rows
  if (value === 0) {
    el.innerHTML = text
    // reset title: Show title when modifiers.always is true
    el.title = modifiers.always ? text : ''
    return
  }

  const ellipsis = new Ellipsis(text, {
    el,
    fill: el.dataset.ellipsis || '...',
    position,
    rows,
    scale: modifiers.scale,
    showTitle
  })

  const timeout = !el.dataset.delay || el.dataset.delay === '0' ? 0 : (parseInt(el.dataset.delay) || 200)

  setTimeout(() => {
    makeEllipsis(ellipsis)
  }, timeout)
}

function destroy(el) {
  const ellipsis = Ellipsis.get(el)
  if (ellipsis) {
    ellipsis.destroy()
  }
}

export default {
  inserted: render,
  update: render,
  unbind: destroy,
  name: 'ellipsis'
}
