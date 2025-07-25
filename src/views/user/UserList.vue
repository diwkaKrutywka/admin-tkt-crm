<template>
  <div>
    <a-page-header :title="$t('l_Users')">
      <template #extra>
        <a-button type="primary" @click="onAdd">
          <span class="material-symbols-outlined">
            add <span class="ml-2"> {{ $t("l_Add_user") }}</span>
          </span>
        </a-button>
      </template>
    </a-page-header>
    <div class="flex h-screen w-full overflow-hidden">


      <div class="flex-1 flex flex-col h-screen overflow-x-auto">

        <div class="p-3 flex-1 overflow-y-auto">
          <UsersList @openEditModal="onEdit()" :usersList="usersList" :activeUsers="activeUsers"
            :inactiveUsers="inactiveUsers" :organizations="organizations" />
          <!-- <EditUserModal v-model:visible="editModalVisible" @openEditModal="openEditModal(record)"
            :initial-data="selectedUser" "
            @submit="handleUpdateUser" @cancel="handleCancel" /> -->
          <add-edit-user v-model:open="modalVisible" :user="editingUser" @submit="saveUser"></add-edit-user>

        </div>

      </div>

    </div>



  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

import UsersList from '../../components/users/users-list.vue';
import MenuBox from '../../components/menu-bar.vue';
import AdminTopBox from '../../components/top-box.vue';
import AddEditUser from './AddEditUser.vue';

import { useUserStore } from '../../store/index.ts';
import { users } from '../../api/users.js';

// Router
const route = useRoute();
const router = useRouter();

// Store
const userStore = useUserStore();

// Reactive state
const modalVisible = ref(false);
const editingUser = ref<string | null>(null);

// Computed values
const usersList = computed(() => userStore.usersList);
const activeUsers = computed(() => userStore.activeUsers);
const inactiveUsers = computed(() => userStore.inactiveUsers);
const organizations = computed(() => userStore.organizations);

// Methods
const saveUser = (userData: any) => {
  message.success('You added user');
};

const onAdd = () => {
  editingUser.value = null;
  modalVisible.value = true;
};
const onEdit = (record) => {
  console.log(record);

  editingUser.value = 'Edit User'
  modalVisible.value = true;
}
const getUsers = async () => {
  const page = route.query.page || 1;
  try {
    const res = await users(`?page=${page}&page_size=5`, null, 'GET');
    userStore.setUsersList(res);
  } catch (error) {
    console.error('Ошибка запроса:', error);
  }
};

// Lifecycle
onMounted(() => {
  router.push({ query: { page: 1 } });
  getUsers();
});
</script>
