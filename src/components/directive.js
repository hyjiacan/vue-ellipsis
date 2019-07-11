import ellipsis from "./ellipsis";

function render(el, {modifiers, value}, vnode) {
    let position = 'middle'
    if (modifiers.start) {
        position = 'start'
    } else if (modifiers.middle) {
        position = 'middle'
    } else if (modifiers.end) {
        position = 'end'
    }
    if (vnode.children.length !== 1) {
        console.warn(`Ellipsis accept one text node only, got "${vnode.children.length}" children`)
        return
    }
    if (vnode.children[0].elm) {
        if (vnode.children[0].elm.nodeType !== 3) {
            console.warn(`Ellipsis accept text node only, got "${vnode.children[0].elm.nodeName}"`)
            return
        }
    }
    let text = vnode.children[0].text
    if (!text) {
        return
    }
    // 值为0表示显示所有行
    if (value === 0) {
        el.innerHTML = text
        return
    }

    // 显示的行数，默认为1行
    let rows = value || 1
    text = ellipsis.clear(text)

    if (rows > 1 && position === 'middle') {
        console.warn(`Ellipsis accept single row while position is "middle", got value "${rows}"`)
        return
    }

    if (rows > 1 && modifiers.scale) {
        console.warn(`Ellipsis accept single row while "scale" enabled, got value "${rows}"`)
        return
    }

    let fill = el.dataset.ellipsis
    fill = fill ? fill : '...'
    let [hasEllipsis, content] = ellipsis.make(el, text, position, fill, rows, modifiers.scale)
    el.innerHTML = content
    if (modifiers.always) {
        el.title = text
        return
    }

    if (!hasEllipsis || modifiers.none) {
        return
    }
    el.title = text
}

function destroy(el) {
    ellipsis.destroy(el)
}

export default {
    inserted: render,
    update: render,
    unbind: destroy
}
