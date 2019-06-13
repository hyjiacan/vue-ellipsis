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
    let text = vnode.children[0].text
    if(!text) {
        console.log(vnode, text)
    }
    let fill = value ? value : '...'
    let [eclipsed, content] = ellipsis.make(el, text, position, fill)
    el.innerHTML = content
    if (eclipsed) {
        el.title = text
    }
}

function destroy(el) {
    ellipsis.destroy(el)
}

export default {
    inserted: render,
    update: render,
    unbind: destroy
}
