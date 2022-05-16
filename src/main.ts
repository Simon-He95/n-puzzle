import { createApp } from 'vue'
import App from './App.vue'
import { VividTyping } from 'vivid-typing'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.component('vivid-typing', VividTyping)
app.use(router)

app.mount('#app')
