<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div class="px-6 py-6 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Список пользователей</h2>
      <!-- <p class="text-sm text-gray-600 mt-1">Показано {{ filteredUsers.length }} из {{ users.length }} пользователей</p> -->
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Организация</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Последний вход
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {{ user.initials }}
                </div>
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </div>
            </td>
            <td class="px-4 py-4 text-sm text-gray-900">{{ user.email }}</td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <span>{{ getRoleIcon(user.role) }}</span>
                {{ user.role }}
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span>🏢</span>
                {{ user.organization }}
              </div>
            </td>
            <td class="px-4 py-4">
              <span :class="[
                'px-2 py-1 rounded-md text-xs font-medium',
                user.status === 'Активен' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ user.status }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm text-gray-900">{{ formatDate(user.lastLogin) }}</td>
            <td class="px-4 py-4">
              <div class="flex gap-2">
                <button @click="editUser(user)"
                  class="w-8 h-8 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  title="Редактировать">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="toggleUserStatus(user)"
                  class="w-8 h-8 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  :title="user.status === 'Активен' ? 'Деактивировать' : 'Активировать'">
                  <svg v-if="user.status === 'Активен'" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button @click="deleteUser(user)"
                  class="w-8 h-8 rounded-md bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
                  title="Удалить">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
  },
  props: {
    paginatedUsers: {
      type: Array,
      default: []
    }
  }
}
</script>