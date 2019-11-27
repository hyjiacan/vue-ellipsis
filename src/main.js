import Vue from 'vue'
import App from './App.vue'

import Ellipsis from './components'

Vue.config.productionTip = false

Vue.use(Ellipsis)

new Vue({
    render: h => h(App),
}).$mount('#app')
