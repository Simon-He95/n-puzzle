import { VividTyping } from 'vivid-typing'
import { createApp } from 'vue'
import App from './App.vue'
import 'vivid-typing/dist/index.css'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)

app.component('VividTyping', VividTyping)

app.mount('#app')
