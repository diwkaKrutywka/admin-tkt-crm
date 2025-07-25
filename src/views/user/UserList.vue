<template>
  <div>
    <a-page-header :title="$t('l_Users')">
      <template #extra>
        <a-button type="primary">
          <span class="material-symbols-outlined">
            add <span class="ml-2"> {{ $t("l_Add_user") }}</span>
          </span>
        </a-button>
      </template>
    </a-page-header>
    <div class="flex h-screen w-full overflow-hidden">


      <div class="flex-1 flex flex-col h-screen overflow-x-auto">

        <div class="p-3 flex-1 overflow-y-auto">
          <UsersList v-model:visible="editModalVisible" :usersList="usersList" :activeUsers="activeUsers"
            :inactiveUsers="inactiveUsers" :organizations="organizations" />
          <EditUserModal v-model:visible="editModalVisible" @openEditModal="openEditModal(record)"
            :initial-data="selectedUser" "
            @submit="handleUpdateUser" @cancel="handleCancel" />

        </div>

      </div>

    </div>



  </div>
</template>
<script>
import UsersList from '../../components/users/users-list.vue';
import MenuBox from "../../components/menu-bar.vue"
import AdminTopBox from "../../components/top-box.vue"
import EditUserModal from '../../components/users/userForm.vue'
import { useUserStore } from '../../store/index.ts'
import { users } from "../../api/users.js"

export default {
  components: {
    EditUserModal,
    AdminTopBox,
    MenuBox,
    UsersList,
    userStore: '',
  },
  data() {
    return {
      editModalVisible: false
    }
  },
  methods: {
    openEditModal(record) {
      this.editModalVisible = true
      console.log('Редактировать:', record);
    },
    async getUsers() {

      const page = this.$route.query.page || 1;
      try {

        const res = await users(`?page=${page}&page_size=5`, null, 'GET');
        this.state.setUsersList(res);

      } catch (error) {
        console.error('Ошибка запроса:', error);
      }
    }
  },
  computed: {
    state() {
      return useUserStore()
    },
    usersList() {
      const store = useUserStore(); // <-- правильно

      return store.usersList
    },
    activeUsers() {
      const store = useUserStore(); // <-- правильно

      return store.activeUsers

    },
    inactiveUsers() {
      const store = useUserStore(); // <-- правильно

      return store.inactiveUsers

    },
    organizations() {
      const store = useUserStore(); // <-- правильно

      return store.organizations

    }
  },
  mounted() {
    this.$router.push({ query: { page: 1 } })
    this.userStore = useUserStore();
    this.getUsers()
  }

}
</script>
