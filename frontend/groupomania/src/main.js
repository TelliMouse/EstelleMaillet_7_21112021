import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowCircleLeft, faArrowCircleRight, faFastBackward, faFastForward, faHome, faPlusCircle, faSignInAlt, faSignOutAlt, faThumbsDown, faThumbsUp, faUserPlus, faInfoCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import store from './store'

library.add(faArrowCircleLeft, faArrowCircleRight, faFastBackward, faFastForward, faHome, faPlusCircle, faSignInAlt, faSignOutAlt, faThumbsDown, faThumbsUp, faUserPlus, faInfoCircle, faUserCircle);

createApp(App).config.productionTip = false

createApp(App)
    .use(store)
    .use(router)
    .component('fa', FontAwesomeIcon)
    .mount('#app')