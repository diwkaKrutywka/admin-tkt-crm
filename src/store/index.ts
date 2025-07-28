import { defineStore } from "pinia";
import type {
  UserDto,
  UserView,
  pagination,
} from "../interfaces/user.interface";
import { paginationConfig } from "ant-design-vue/es/pagination";

export const useUserStore = defineStore("userInfo", {
  state: () => ({
    pagination: {} as pagination,
    user: {},
    statisticsDashboardData: [],
    informationDashboardData: [],
    dashboardData: {},
    activeUsers: [],
    usersList: [] as UserDto[],
    inactiveUsers: [],
    organizations: [],
  }),
  getters: {
    userViews: (state): UserView[] => {
      return state.usersList.map((user) => ({
        id: user.id,
        fullName: user.full_name,
        role: user.user_role,
        organization: user.organization_name,
        isActive: user.is_active,
        lastLogin: user.last_login_at,
        organization_id: user.organization_id,
      }));
    },
  },
  actions: {
    setDashboardData(data) {
      this.statisticsDashboardData = data.dashboardData.cards?.filter(
        (card) => card.category === "statistics"
      );
      this.informationDashboardData = data.dashboardData.cards?.filter(
        (card) => card.category === "information"
      );
    },

    signOut() {
      this.user = {};
    },
    setUser(user) {
      this.user = user.user; // Save the whole object
      console.log(user, 'user');
      
      localStorage.setItem("accessToken", user.access_token);
     },
    setUsersList(data) {
      // сохраняем мете данные для пагинаций
      const { users, ...metaData } = data;
      this.pagination = metaData;

      this.usersList = data.users;

      // сортируем активных и неактивных пользователей, а так же их организаций
      this.activeUsers = data.users.filter((item) => item.is_active);
      this.inactiveUsers = data.users.filter((item) => !item.is_active);
      this.organizations = [
        ...new Set(data.users.map((item) => item.organization_name)),
      ];
    },
    clearUser() {
      this.accessToken = ''
      this.refreshToken = ''
      this.sessionToken = ''
      this.user = null
    }
  },
});
