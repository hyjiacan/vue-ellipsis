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
        throw new Error('Ellipsis: accept one text node only')
    }
    if (vnode.children[0].elm) {
        if (vnode.children[0].elm.nodeType !== 3) {
            throw new Error('Ellipsis: accept text node only')
        }
    }
    let text = vnode.children[0].text
    if (!text) {
        return
    }
    text = ellipsis.clear(text)
    let fill = value ? value : '...'
    let [hasEllipsis, content] = ellipsis.make(el, text, position, fill)
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
