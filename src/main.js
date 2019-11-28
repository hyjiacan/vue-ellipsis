import Vue from 'vue'
import App from './App.vue'

import {ellipsisDirective, ellipsisComponent} from './components'

Vue.config.productionTip = false

Vue.directive(ellipsisDirective.name, ellipsisDirective)
Vue.component(ellipsisComponent.name, ellipsisComponent)

new Vue({
    render: h => h(App)
}).$mount('#app')
