import ellipsis from './ellipsis'

function makeEllipsis(el, text, position, rows, modifiers) {
  let fill = el.dataset.ellipsis
  fill = fill ? fill : '...'

  let id = ellipsis.newId()
  el.classList.add('vue-ellipsis')
  el.setAttribute('data-ellipsis-id', id)

  const option = {
    content: text,
    fill: fill,
    rows: rows,
    position
  }

  let meta = ellipsis.getMeta(el, id, option)

  if (rows === 0 || !Object.keys(meta).length) {
    doRender(el, false, text, text, modifiers, id)
    return
  }

  let hasEllipsis
  let ellipsisContent
  if (modifiers.scale) {
    [hasEllipsis, ellipsisContent] = makeSvg(meta, option)
  } else {
    [hasEllipsis, ellipsisContent] = ellipsis.make(meta, option)
  }
  doRender(el, hasEllipsis, text, ellipsisContent, modifiers, id)
}

function doRender(el, hasEllipsis, rawText, ellipsisContent, modifiers, id) {
  ellipsis.destroy(id)
  el.innerHTML = ellipsisContent

  if (modifiers.always) {
    el.title = rawText
    return
  }

  if (!hasEllipsis || modifiers.none) {
    el.title = ''
    return
  }
  el.title = rawText
}

function makeSvg(meta, {content}) {
  const {baseline, viewBox, style, scaled} = ellipsis.getScaleInfo(meta)

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
  let position = 'end'
  if (modifiers.start) {
    position = 'start'
  } else if (modifiers.middle) {
    position = 'middle'
  } else if (modifiers.end) {
    position = 'end'
  }
  if (!ellipsis.validate(rows, position, modifiers.scale)) {
    return
  }
  let text = getText(vnode)
  if (!text) {
    return
  }

  // 值为0表示显示所有行
  // Show all rows
  if (value === 0) {
    el.innerHTML = text
    // reset title: Show title when modifiers.always is true
    el.title = modifiers.always ? text : ''
    return
  }

  // 显示的行数，默认为1行
  let rows = value || 1
  text = ellipsis.clearContent(text)

  if (!ellipsis.validate(rows, position, modifiers.scale)) {
    return
  }

  if (!el.dataset.delay || el.dataset.delay === '0') {
    makeEllipsis(el, text, position, rows, modifiers)
    return
  }
  setTimeout(() => {
    makeEllipsis(el, text, position, rows, modifiers)
  }, parseInt(el.dataset.delay) || 200)
}

function destroy(el) {
  ellipsis.destroy(el)
}

export default {
  inserted: render,
  update: render,
  unbind: destroy,
  name: 'ellipsis'
}
