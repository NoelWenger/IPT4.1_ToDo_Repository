import './assets/main.css' // Nur lassen, wenn die Datei noch existiert

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Wir importieren den Router, den wir erstellt haben

const app = createApp(App)

app.use(router) // Hier sagen wir Vue, dass es den Router benutzen soll

app.mount('#app')