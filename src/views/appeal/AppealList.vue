<template>
  <div>
    <a-page-header :title="$t('l_Appeals')">
      <template #extra>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <a-input-search
            v-model:value="search"
            placeholder="Search by username, fullname"
            style="width: 400px; vertical-align: middle"
            class="align-middle search-input"
            @search="fetchUsers"
            allowClear
          />
        </div>
        <a-button type="primary" @click="openFilter">
          <span class="material-symbols-outlined">
            filter_alt <span class="ml-2"> {{ $t("l_Filter") }}</span>
          </span>
        </a-button>
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
              @click="toDetails(index)"
            >
              expand_content
            </span>
          </a-space>
        </template>
      </template>
    </a-table>
    <filter-contact
      v-model:open="filterModalVisible"
      @filter="applyFilter"
    ></filter-contact>
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
import { SafetyOutlined, BankOutlined } from "@ant-design/icons-vue";
import type { Appeal } from "../../types/appeal";
import FilterContact from "./FilterContact.vue";
import type { TableRenderProps } from "../../types/table";
import EditContact from "./EditContact.vue";
import { AppealApi } from "../../api/appeal"; // ← your API utility
const open = ref<boolean>(false);
const filterModalVisible = ref<boolean>(false);
const reason = ref<string>("");
const search = ref<string>("");
const lockingStatus = ref<string>("");
const currentFilters = ref<any>({});
const tableData = ref<Appeal[]>([]);
const loading = ref(false);
const modalVisible = ref(false);
const editingUser = ref<Appeal | null>(null);
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

const expandedReasons = ref<string[]>([]);

const toggleReasonExpansion = (id: string) => {
  if (expandedReasons.value.includes(id)) {
    expandedReasons.value = expandedReasons.value.filter((i) => i !== id);
  } else {
    expandedReasons.value.push(id);
  }
};

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
    title: "Phone number",
    dataIndex: ["contact","called_by"],
    key: ["contact","called_by"],
    customRender: ({ text, record }: TableRenderProps<Appeal>) => {
      if (!text) return null; // если номера нет — ничего не выводим

      let color = "blue";
      if (record.status === "new") color = "red";
      else if (record.status === "on_process") color = "green";

      return h(
        Tag,
        {
          color,
          style: {
            fontSize: "13px",
            padding: "2px 10px",
            borderRadius: "10px",
          },
        },
        { default: () => text }
      );
    },
  },
  {
    title: "call_type_id",
    dataIndex: "call_type_id",
  },
  {
    title: "call_sub_type_id",
    dataIndex: "call_sub_type_id",
  },
  {
    title: "Reason",
    dataIndex: "reason",
    customRender: ({ text, record }: TableRenderProps<Appeal>) => {
      const reasonText = text ?? ""; // ← если null, будет пустая строка
      const id = String(record.id);
      const isExpanded = expandedReasons.value.includes(id);
      const displayText = isExpanded ? reasonText : reasonText.slice(0, 100);

      return h("div", [
        h("span", displayText),
        reasonText.length > 100 &&
          h(
            "a",
            {
              style: "margin-left: 6px; color: #1890ff; cursor: 'pointer'",
              onClick: () => toggleReasonExpansion(id),
            },
            isExpanded ? " меньше" : " дальше"
          ),
      ]);
    },
  },

  {
    title: "Manager",
    dataIndex: "employee_id",
  },
  {
    title: "Address",
    key: "address",
    customRender: ({ record }: TableRenderProps<Appeal>) => {
      const parts = [];

      if (record.city_id) {
        parts.push(
          h("div", [h("span", "Город: "), h("strong", record.city_id)])
        );
      }


      if (record.district_id) {
        parts.push(
          h("div", [h("span", "Район: "), h("strong", record.district_id)])
        );
      }

      return parts.length > 0
        ? h("div", { class: "text-gray-800 space-y-1" }, parts)
        : null;
    },
  },
  {
    title: "Create date",
    dataIndex: "date",
    customRender: ({ text }: TableRenderProps<Appeal>) => {
      const { $formatIsoDate } = useGlobal();
      return $formatIsoDate(text);
    },
  },
  {
    title: "Действия",
    key: "Action",
    width: 110,
    align: "center",
  },
];
const applyFilter = (filters: any) => {
  currentFilters.value = filters;
  pagination.value.current = 1;
  fetchUsers();
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const { data } = await AppealApi<{
      items: Appeal[];
      total_count: number;
    }>(
      "",
      {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
        q: search.value,
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
  console.log(editingUser);
}
const openFilter = () => {
  filterModalVisible.value = true;
};
// Fetch on mount
onMounted(() => {
  fetchUsers();
});
</script>
<style scoped>
.search-input :deep(.ant-input-search-button) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input :deep(.ant-input-search-button .anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
