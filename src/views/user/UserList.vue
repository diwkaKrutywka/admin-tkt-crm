<template>
  <div>
    <a-page-header :title="$t('l_Users')">
      <template #extra>
        <a-button type="primary" @click="onAdd()">
          <span class="material-symbols-outlined">
            add <span class="ml-2"> {{ $t("l_Add_user") }}</span>
          </span>
        </a-button>
      </template>
    </a-page-header>

    <filter-user></filter-user>

    <a-table
      bordered
      :dataSource="tableData"
      :columns="columns"
      :pagination="pagination"
      rowKey="id"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, index }">
        <template v-if="column.key === 'Action'">
          <a-space>
            <span
              style="color: black; font-size: 21px"
              class="icon material-symbols-outlined"
              @click="onEdit(index)"
            >
              edit
            </span>
            <a-popconfirm
              placement="leftBottom"
              title="Сіз расымен қолданушыны тоқтатқыңыз келеді ме?"
              :ok-text="$t('l_Yes')"
              :cancel-text="$t('l_No')"
              @confirm="onDeactivate(index)"
            >
              <span
                style="color: rgb(0, 100, 250); font-size: 21px"
                class="icon material-symbols-outlined"
              >
                cancel
              </span>
            </a-popconfirm>
            <a-popconfirm
              placement="leftBottom"
              title="Сіз расымен қолданушыны өшіргіңіз келеді ме?"
              :ok-text="$t('l_Yes')"
              :cancel-text="$t('l_No')"
              @confirm="onDelete(index)"
            >
              <span
                style="color: red; font-size: 21px"
                class="icon material-symbols-outlined"
              >
                delete
              </span>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <add-edit-user
      v-model:open="modalVisible"
      :user="editingUser"
      @submit="fetchUsers"
    />
  </div>

  <a-modal
    v-model:open="open"
    :title="$t('l_Lock_user')"
    :ok-text="$t('l_Lock')"
    :cancel-text="$t('l_Cancel')"
    @ok="lockUser"
  >
    <a-form layout="vertical">
      <a-form-item :label="$t('l_Reason')">
        <a-input v-model:value="reason" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import { Avatar, message, Tag } from "ant-design-vue";
import { SafetyOutlined, BankOutlined } from "@ant-design/icons-vue";
import type { User } from "../../types/user";
import type { TableRenderProps } from "../../types/table";
import FilterUser from "./FilterUser.vue";
import AddEditUser from "./AddEditUser.vue";
import { UserApi } from "../../api/user"; // ← your API utility
const open = ref<boolean>(false);
const reason = ref<string>("");
// State
const tableData = ref<User[]>([]);
const loading = ref(false);
const modalVisible = ref(false);
const editingUser = ref<User | null>(null);
const lockingUserId = ref<string | null>(null);

// Pagination
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showQuickJumper: true,
  showTotal: (total: number) => `Всего ${total} записей`,
});

// Columns
const columns = [
  {
    title: "#",
    key: "index",
    width: "50px",
    customRender: ({ index }: { index: number }) => {
      return (
        (pagination.value.current - 1) * pagination.value.pageSize + index + 1
      );
    },
  },
  {
    title: "Пользователь",
    dataIndex: "full_name",
    customRender: ({ text }: TableRenderProps<User>) => {
      const initials = (text as string)
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return h("div", { class: "flex items-center gap-2" }, [
        h(
          Avatar,
          {
            style: {
              backgroundColor: "#E5EDFF",
              color: "#2B4EFF",
              fontWeight: "600",
            },
          },
          () => initials
        ),
        h("span", text),
      ]);
    },
  },
  {
    title: "Роль",
    dataIndex: "user_role",
    customRender: ({ text }: TableRenderProps<User>) => {
      return h(
        "div",
        {
          class:
            "inline-flex items-center px-3 py-1 rounded-full border border-gray-300 text-gray-800 text-sm gap-2",
        },
        [h(SafetyOutlined, { style: { color: "#2B4EFF" } }), h("span", text)]
      );
    },
  },
  {
    title: "Организация",
    dataIndex: "organization_name",
    customRender: ({ text }: TableRenderProps<User>) => {
      return h("div", { class: "flex items-center gap-2 text-gray-800" }, [
        h(BankOutlined, { style: { color: "#2B4EFF" } }),
        h("span", text),
      ]);
    },
  },
  {
    title: "Статус",
    dataIndex: "is_active",
    customRender: ({ text }: TableRenderProps<User>) => {
      return text
        ? h(Tag, { color: "green" }, () => "Активен")
        : h(Tag, { color: "red" }, () => "Неактивен");
    },
  },
  {
    title: "Последний вход",
    dataIndex: "last_login_at",
  },
  {
    title: "Действия",
    key: "Action",
    width: 110,
    align: "center",
  },
];

// Fetch Users
const fetchUsers = async () => {
  loading.value = true;
  try {
    const { data } = await UserApi<{ users: User[]; total: number }>(
      "",
      {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
      },
      "GET"
    );

    tableData.value = Object.values(data.users);
    pagination.value.total = data.total;
  } catch (error) {
    message.error("Не удалось загрузить список пользователей");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Table Events
const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchUsers();
};

// Add/Edit/Delete actions
function onAdd() {
  editingUser.value = null;
  modalVisible.value = true;
}

function onEdit(index: number) {
  editingUser.value = tableData.value[index];
  modalVisible.value = true;
}

function onDelete(index: number) {
  const user = tableData.value[index];
  message.success(`Пользователь ${user.full_name} удалён`);
  // TODO: API call to delete
}

function onDeactivate(index: number) {
  const user = tableData.value[index];
  console.log(user);
  if (!user || !user.id) {
    message.error("Пользователь не найден");
    return;
  }

  lockingUserId.value = user.id;
  open.value = true;
}

const lockUser = async () => {
  if (!lockingUserId.value) {
    message.error("Пользователь не выбран");
    return;
  }

  try {
    await UserApi(
      `${lockingUserId.value}/lock`,
      { reason: reason.value, is_locked: true },
      "POST"
    );
    message.success("Пользователь деактивирован");
    open.value = false;
    reason.value = "";
    lockingUserId.value = null;
    fetchUsers();
  } catch (err) {
    message.error("Не удалось деактивировать пользователя");
  }
};

// Fetch on mount
onMounted(() => {
  fetchUsers();
});
</script>
