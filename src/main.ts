import { createApp } from 'vue'
import './assets/global.css'
import App from './App.vue'
import router from './router/index'
import  i18n  from "./locales"
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import "./assets/global.css"
import "./assets/style/google-font.css"
import { createPinia } from "pinia"
const app = createApp(App)
app.use(router)
app.use(i18n)
app.use(Antd)
app.use(createPinia())
app.mount('#app')