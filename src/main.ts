/* eslint-disable import/order */
import router from '@/router'
import '@styles/styles.scss'
import 'uno.css'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.mount('#app')
