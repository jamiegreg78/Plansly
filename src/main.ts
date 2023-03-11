import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import './styles/colors.css'

import App from './App.vue'
import router from './router'

// import fontawesome core
import { library } from '@fortawesome/fontawesome-svg-core'

// import fontawesome component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import icons
import { faCalendar, faWindowMaximize, faFolder} from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft, faPenToSquare, faBars, faRightFromBracket, faXmark, faPlus, faCheck, faListCheck, faGear, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons'


library.add(faCalendar, faWindowMaximize, faPenToSquare, faFolder, faChevronLeft, faBars, faRightFromBracket, faXmark, faPlus, faCheck, faListCheck, faGear, faEllipsisVertical)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia().use(piniaPersist))
app.use(router)

app.mount('#app')
