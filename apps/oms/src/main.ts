import './assets/main.scss'
import 'primevue/resources/themes/lara-light-teal/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'
import Menu from 'primevue/menu'
import Breadcrumb from 'primevue/breadcrumb'
const app = createApp(App)

app.use(PrimeVue)

// eslint-disable-next-line vue/no-reserved-component-names
app.component('Menu', Menu)
app.component('Breadcrumb', Breadcrumb)

app.use(createPinia())
app.use(router)

app.mount('#app')
