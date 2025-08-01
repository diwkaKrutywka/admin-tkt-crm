// stores/user.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  full_name: string
  department: string
  position: string
  user_role: string
  organization_name: string
  [key: string]: any // For other optional props
}

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    refreshToken: '',
    sessionToken: '',
    user: null as User | null,
  }),
  actions: {
    setUser(payload: any) {
      this.accessToken = payload.access_token
      this.refreshToken = payload.refresh_token
      this.sessionToken = payload.session_token
      this.user = payload.user
    },
    clearUser() {
      this.accessToken = ''
      this.refreshToken = ''
      this.sessionToken = ''
      this.user = null
    }
  },
})


export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLang: localStorage.getItem('currentLang') || 'kk'
  }),
  actions: {
    setLang(lang: string) {
      this.currentLang = lang
      localStorage.setItem('currentLang', lang)
    }
  }
})