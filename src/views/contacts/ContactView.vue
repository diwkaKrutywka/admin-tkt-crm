<template>
  <div>
    <a-page-header :title="$t('l_Contacts')">
        <template #extra>
        <div>
          <a-input-search
            v-model:value="search"
            placeholder="Search by username, fullname"
            style="width: 400px;"
            @search="fetchUsers"
          />
        </div>
        <a-dropdown placement="bottomRight">
            <a-button type="primary" @click="onFilter()">
          <span class="material-symbols-outlined">
            filter_alt <span class="ml-2"> {{ $t("l_Filter") }}</span>
          </span>
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
              </a>
            </a-menu-item>
            <a-menu-item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
              </a>
            </a-menu-item>
            <a-menu-item>
              <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
              </a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      </template>
      <br />
    </a-page-header>
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
          </a-space>
        </template>
      </template>
    </a-table>

    <edit-contact
      v-model:open="modalVisible"
      :id="editingUser?.id"
      @submit="fetchUsers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import { Avatar, message, Tag } from "ant-design-vue";
import { SafetyOutlined } from "@ant-design/icons-vue";
import type { Contact } from "../../types/contacts";
import type { TableRenderProps } from "../../types/table";
import EditContact from "./EditContact.vue";
import { ContactApi } from "../../api/contact"; // ← your API utility
const open = ref<boolean>(false);
const reason = ref<string>("");
const search = ref<string>("");
const lockingStatus = ref<string>("");
// State
const tableData = ref<Contact[]>([]);
const loading = ref(false);
const modalVisible = ref(false);
const editingUser = ref<Contact | null>(null);
import { useGlobal } from "../../composables/useGlobal";
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
    title: "ФИО",
    dataIndex: "full_name",
    customRender: ({ text }: TableRenderProps<Contact>) => {
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
    title: "Phone number",
    dataIndex: "phone_number",
    customRender: ({ text }: TableRenderProps<Contact>) => {
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
    title: "ИИН",
    dataIndex: "iin",
  },

  {
    title: "Birth date",
    dataIndex: "birth_date",
    customRender: ({ text }: TableRenderProps<Contact>) => {
      const { $formatIsoDate } = useGlobal();
      return $formatIsoDate(text);
    },
  },
  {
    title: "Gender",
    dataIndex: "gender",
    customRender: ({ text }: TableRenderProps<Contact>) => {
      if (text === "male") {
        return h(Tag, { color: "blue" }, () => "Male");
      } else if (text === "female") {
        return h(Tag, { color: "pink" }, () => "Female");
      } else {
        return h(Tag, { color: "gray" }, () => "Other");
      }
    },
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
    const { data } = await ContactApi<{
      items: Contact[];
      total_count: number;
    }>(
      "",
      {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
        q: search.value
      },
      "GET"
    );

    tableData.value = Object.values(data.items);
    pagination.value.total = data.total_count;
  } catch (error) {
    message.error("Не удалось загрузить список контактов");
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

function onEdit(index: number) {
  editingUser.value = tableData.value[index];
  modalVisible.value = true;
  console.log(editingUser)
}

// Fetch on mount
onMounted(() => {
  fetchUsers();
});
</script>
