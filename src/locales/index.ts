// i18n.ts
import { createI18n } from 'vue-i18n'
import kk from './language/kk'
import ru from './language/ru'
import en from './language/en'

type MessageSchema = typeof kk

// Определим доступные языки
const messages = {
  kk,
  ru,
  en
}

const i18n = createI18n<[MessageSchema], 'kk' | 'ru' | 'en'>({
  legacy: false,
  globalInjection: true,
  locale: 'kk', // временно, позже установим из Pinia
  fallbackLocale: 'kk',
  warnHtmlMessage: false,
  messages
})

export default i18n
