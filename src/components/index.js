import directive from "./directive";

/**
 *
 * @param Vue
 */
directive.install = function (Vue) {
    Vue.directive('ellipsis', directive)
}

export default directive
