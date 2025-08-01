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
    <update-appeal
      v-model:open="modalVisible"
      :id="editingUser"
      @submit="fetchUsers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message, Tag } from "ant-design-vue";
import { AppealApi } from "../../api/appeal";
import FilterContact from "./FilterContact.vue";
import UpdateAppeal from "./UpdateAppeal.vue";
import type { Appeal } from "../../types/appeal";
import type { TableRenderProps } from "../../types/table";
import { useGlobal } from "../../composables/useGlobal";

const search = ref<string>("");
const tableData = ref<Appeal[]>([]);
const loading = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showQuickJumper: true,
  showTotal: (total: number) => `Всего ${total} записей`,
});
const filterModalVisible = ref(false);
const modalVisible = ref(false);
const editingUser = ref<string>("");
const expandedReasons = ref<string[]>([]);
const currentFilters = ref<any>({});

const route = useRoute();
const { $formatIsoDate } = useGlobal();

// --- Автоматическое открытие модалки по ID из query
onMounted(async () => {
  const id = route.query.id as string;
  console.log(id)
  await fetchUsers();
  if (id) {
   
    console.log(id)
      editingUser.value = id;
      modalVisible.value = true;
      
    
  }
});

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
    message.error("Не удалось загрузить обращения");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchUsers();
};

const applyFilter = (filters: any) => {
  currentFilters.value = filters;
  pagination.value.current = 1;
  fetchUsers();
};

const openFilter = () => {
  filterModalVisible.value = true;
};

const toggleReasonExpansion = (id: string) => {
  if (expandedReasons.value.includes(id)) {
    expandedReasons.value = expandedReasons.value.filter((i) => i !== id);
  } else {
    expandedReasons.value.push(id);
  }
};

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
    dataIndex: ["contact", "called_by"],
    key: ["contact", "called_by"],
    customRender: ({ text, record }: TableRenderProps<Appeal>) => {
      if (!text) return null;

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
  { title: "call_type_id", dataIndex: "call_type_id" },
  { title: "call_sub_type_id", dataIndex: "call_sub_type_id" },
  {
    title: "Reason",
    dataIndex: "reason",
    customRender: ({ text, record }: TableRenderProps<Appeal>) => {
      const reasonText = text ?? "";
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
  { title: "Manager", dataIndex: "employee_id" },
  {
    title: "Address",
    key: "address",
    customRender: ({ record }: TableRenderProps<Appeal>) => {
      const parts = [];

      if (record.city_id) {
        parts.push(h("div", [h("span", "Город: "), h("strong", record.city_id)]));
      }

      if (record.district_id) {
        parts.push(h("div", [h("span", "Район: "), h("strong", record.district_id)]));
      }

      if (record.healthcare_facility_id) {
        parts.push(
          h("div", [h("span", "Поликлиника: "), h("strong", record.healthcare_facility_id)])
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
