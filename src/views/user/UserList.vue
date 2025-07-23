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
    <a-table
      bordered
      :dataSource="tableData"
      :columns="columns"
      :pagination="pagination"
      rowKey="id"
    >
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import { Avatar, Tag } from "ant-design-vue";
import { SafetyOutlined, BankOutlined } from "@ant-design/icons-vue";
import type { User } from "../../types/user";
import type { TableRenderProps } from "../../types/table";

// Sample data
const tableData = ref<User[]>([
  {
    id: "1",
    username: "diana",
    full_name: "Omarbayeva Diana",
    user_role: "Администратор",
    organization_id: "1",
    organization_name: "Jana Post",
    department: "IT",
    position: "Разработчик",
    is_active: true,
    is_locked: false,
    must_change_password: false,
    last_login_at: "2025-07-22",
    created_at: "2025-01-01",
    updated_at: "2025-07-01",
  },
]);

// Columns
const columns = [
  {
    title: "#",
    key: "index",
    width: "50px",
    customRender: ({ index }: { index: number }) => {
      return (pagination.current - 1) * pagination.pageSize + index + 1;
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
];

// Pagination config
const pagination = {
  current: 1,
  pageSize: 10,
  total: tableData.value.length,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showQuickJumper: true,
  showTotal: (total: number) => `Всего ${total} записей`,
};

function onAdd() {}
</script>
