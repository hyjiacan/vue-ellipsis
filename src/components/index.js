import ellipsisDirective from './directive'
import ellipsisComponent from './component'

export default {
    install: function (Vue) {
        Vue.directive(ellipsisDirective.name, ellipsisDirective)
        Vue.component(ellipsisComponent.name, ellipsisComponent)
    }
}

export {
    ellipsisDirective,
    ellipsisComponent
}
