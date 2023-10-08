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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import vue3GoogleLogin from 'vue3-google-login'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import Avatar from 'primevue/avatar'
import OverlayPanel from 'primevue/overlaypanel'
import { VueQueryPlugin } from '@tanstack/vue-query'
import Dropdown from 'primevue/dropdown'

// App
const app = createApp(App)

// PrimeVue
app.use(PrimeVue)
app.use(ToastService)
// eslint-disable-next-line vue/no-reserved-component-names
app.component('Menu', Menu)
app.component('Breadcrumb', Breadcrumb)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Card', Card)
app.component('InputText', InputText)
app.component('Password', Password)
// eslint-disable-next-line vue/no-reserved-component-names
app.component('Button', Button)
app.component('Divider', Divider)
app.component('Toast', Toast)
app.component('Avatar', Avatar)
app.component('OverlayPanel', OverlayPanel)
app.component('Dropdown', Dropdown)

// Pinia
app.use(createPinia())

// Router
app.use(router)

// Google Login
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  popupType: 'CODE'
})

// Vue Query
app.use(VueQueryPlugin)

app.mount('#app')
