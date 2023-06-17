/* eslint-disable import/order */
import router from '@/router'
import '@styles/styles.scss'
import 'uno.css'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.mount('#app')
