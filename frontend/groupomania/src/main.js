//import Vue from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)

createApp().component('font-awesome-icon', FontAwesomeIcon)

createApp().config.productionTip = false

createApp(App).use(router).mount('#app')

/*new Vue({
    el: '#app',
    components: { App },
    template: '<App/>' 
})*/
