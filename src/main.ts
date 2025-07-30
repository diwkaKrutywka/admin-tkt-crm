import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import i18n from './locales'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'

import 'ant-design-vue/dist/reset.css'
import './assets/global.css'
import './assets/style/google-font.css'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(Antd)
app.use(createPinia())

// Глобальная функция форматирования ISO-даты в формате dd.mm.yyyy H:mm
app.config.globalProperties.$formatIsoDate = (isoString: string): string => {
  if (!isoString) return '—'
  return dayjs.utc(isoString).format('DD.MM.YYYY H:mm')
}

app.mount('#app')
