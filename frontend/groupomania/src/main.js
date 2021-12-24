//import Vue from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import store from './store'

library.add(fas);

//Vue.forceUpdate();

createApp(App).config.productionTip = false

createApp(App)
    .use(store)
    .use(router)
    .component('fa', FontAwesomeIcon)
    .mount('#app')

/*new Vue({
    el: '#app',
    components: { App },
    template: '<App/>' 
})*/
