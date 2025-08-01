import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import i18n from './locales'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import { useLanguageStore } from './store/index'

import 'ant-design-vue/dist/reset.css'
import './assets/global.css'
import './assets/style/google-font.css'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const app = createApp(App)

// 👉 Сначала создаём pinia и подключаем
const pinia = createPinia()
app.use(pinia)

// 👉 Теперь получаем доступ к languageStore
const langStore = useLanguageStore()

// 👉 Синхронизируем i18n с текущим языком из store
i18n.global.locale.value = langStore.currentLang as any

// 👉 Подключаем остальные модули
app.use(router)
app.use(i18n)
app.use(Antd)

// 👉 Добавляем глобальную функцию форматирования дат
app.config.globalProperties.$formatIsoDate = (isoString: string): string => {
  if (!isoString) return '—'
  return dayjs.utc(isoString).format('DD.MM.YYYY')
}

// 👉 Монтируем приложение
app.mount('#app')
