import Template from './Template.vue'

function setDefaultProps(customize) {
    for (let prop in customize) {
        if (!customize.hasOwnProperty(prop)) {
            continue
        }
        // 处理带下划线格式成驼峰
        prop = prop.replace(/-[a-z]/g, match => {
            return match[1].toUpperCase()
        })
        if (!Template.props.hasOwnProperty(prop)) {
            continue
        }
        Template.props[prop]['default'] = customize[prop]
    }
}

/**
 *
 * @param Vue
 * @param defaults 通过 Vue.use 注册组件时，设置的组件默认值
 */
Template.install = function (Vue, defaults) {
    if (defaults) {
        setDefaultProps(defaults)
    }
    Vue.component(Template.name, Template)
}

export default Template
