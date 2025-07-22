import { defineStore } from 'pinia'

// Типы для карточек на дашборде
interface DashboardCard {
  id: string
  title: string
  value: string | number
  category: 'statistics' | 'information' | string
  [key: string]: any
}

// Тип структуры данных дашборда
interface DashboardData {
  cards: DashboardCard[]
  [key: string]: any
}

// Тип пользователя
interface User {
  username?: string
  email?: string
  avatar?: string
  [key: string]: any
}

// Тип данных при входе
interface UserPayload {
  user: User
  access_token: string
}

export const useUserStore = defineStore('userInfo', {
  state: () => ({
    user: {} as User,
    statisticsDashboardData: [] as DashboardCard[],
    informationDashboardData: [] as DashboardCard[],
    dashboardData: {} as DashboardData,
    usersList: [] as User[],
  }),

  actions: {
    setDashboardData(data: { dashboardData: DashboardData }) {
      this.statisticsDashboardData = data.dashboardData.cards?.filter(
        (card) => card.category === 'statistics'
      )
      this.informationDashboardData = data.dashboardData.cards?.filter(
        (card) => card.category === 'information'
      )
      this.dashboardData = data.dashboardData
    },

    signOut() {
      this.user = {}
      localStorage.removeItem('accessToken')
    },

    setUser(payload: UserPayload) {
      this.user = payload.user
      localStorage.setItem('accessToken', payload.access_token)
    },

    setUsersList(users: User[]) {
      this.usersList = users
    },
  },
})
