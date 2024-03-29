/* eslint-disable vue/no-reserved-component-names */
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
import { appQueryClient } from './configs/appQueryClient'
import MultiSelect from 'primevue/multiselect'
import InputNumber from 'primevue/inputnumber'
import Editor from 'primevue/editor'
import Galleria from 'primevue/galleria'
import Carousel from 'primevue/carousel'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import FileUpload from 'primevue/fileupload'

// App
const app = createApp(App)

// PrimeVue
app.use(PrimeVue)
app.use(ToastService)
app.component('Menu', Menu)
app.component('Breadcrumb', Breadcrumb)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Card', Card)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)
app.component('Divider', Divider)
app.component('Toast', Toast)
app.component('Avatar', Avatar)
app.component('OverlayPanel', OverlayPanel)
app.component('Dropdown', Dropdown)
app.component('MultiSelect', MultiSelect)
app.component('InputNumber', InputNumber)
app.component('Editor', Editor)
app.component('Galleria', Galleria)
app.component('Carousel', Carousel)
app.component('Dialog', Dialog)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('FileUpload', FileUpload)

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
app.use(VueQueryPlugin, {
  queryClient: appQueryClient
})

app.mount('#app')
