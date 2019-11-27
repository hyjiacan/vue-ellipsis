import directive from './directive'
import component from './component'

/**
 *
 * @param Vue
 */
directive.install = function (Vue) {
    Vue.directive('ellipsis', directive)
    Vue.component('ellipsis', component)
}

export default directive
