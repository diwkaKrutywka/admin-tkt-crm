<template>
  <div>
    <a-page-header :title="$t('l_Appeals')">
      <template #extra>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
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
      <!-- Фильтр по видам обращений -->
      <div style="margin-top: -8px; margin-bottom: 8px">
        <span style="margin-right: 12px; font-weight: 500"
          >{{ $t("l_Appeal_types_label") }}:</span
        >
        <a-space>
          <a-button
            :type="statusFilter === '' ? 'primary' : 'default'"
            size="small"
            @click="handleStatusChange('')"
            style="border-radius: 6px"
          >
            {{ $t("l_All") }}
          </a-button>
          <a-button
            :type="statusFilter === 'new' ? 'primary' : 'default'"
            size="small"
            @click="handleStatusChange('new')"
            style="border-radius: 6px"
          >
            {{ $t("l_Unprocessed") }}
          </a-button>
          <a-button
            :type="statusFilter === 'in_progress' ? 'primary' : 'default'"
            size="small"
            @click="handleStatusChange('in_progress')"
            style="border-radius: 6px"
          >
            {{ $t("l_Processed") }}
          </a-button>
        </a-space>
      </div>
    </a-page-header>
    <a-table
      bordered
      :scroll="{ x: 'max-content' }"
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
              style="color: black; font-size: 21px; cursor: pointer"
              class="icon material-symbols-outlined"
              @click="openDetail(tableData[index].id)"
            >
              expand_content
            </span>
          </a-space>
        </template>
      </template>
    </a-table>
    <filter-appeal
      v-model:open="filterModalVisible"
      @filter="applyFilter"
    ></filter-appeal>

    <update-appeal
      v-model:open="modalVisible"
      :id="editingUser"
      @submit="fetchUsers"
    />
    <detail-page
      v-model:open="detailModalVisible"
      :appeal-id="selectedAppealId || undefined"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from "vue";
import { message, Tag } from "ant-design-vue";
import type { Appeal } from "../../types/appeal";
import FilterAppeal from "./FilterAppeal.vue";
import type { TableRenderProps } from "../../types/table";
//import EditAppeal from "./EditAppeal.vue";
import UpdateAppeal from "./UpdateAppeal.vue";
import DetailPage from "./DetailPage.vue";
import { AppealApi } from "../../api/appeal"; // ← your API utility
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
const { t } = useI18n();
const search = ref<string>("");
const statusFilter = ref<string>(""); // Добавляем переменную для фильтра статуса
const tableData = ref<Appeal[]>([]);
const loading = ref(false);
const router = useRouter();
const detailModalVisible = ref(false);
const selectedAppealId = ref<string | null>(null);
import { useGlobal } from "../../composables/useGlobal";
// Pagination

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50"],
  showQuickJumper: true,
  showTotal: (total: number) => t("l_Total_records", { total }),
});
const filterModalVisible = ref(false);
const modalVisible = ref(false);
const editingUser = ref<string>("");
const expandedReasons = ref<string[]>([]);
const currentFilters = ref<any>({});

const route = useRoute();
const { $formatIsoDate } = useGlobal();
import { watch } from "vue";

watch(
  () => route.query.id,
  (id) => {
    if (id) {
      editingUser.value = id as string;
      modalVisible.value = true;
      router.replace({ path: "/appeals" }); 
    }
  },
  { immediate: true }
);
onMounted(async () => {
  await fetchUsers();
});

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
    title: t("l_Phone_number"),
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
            cursor: "pointer",
          },
          onClick: () => openDetail(record.id),
        },
        { default: () => text }
      );
    },
  },
  {
    title: t("l_Call_type_id"),
    dataIndex: ["call_type","name"],
  },
  {
    title: t("l_Call_sub_type_id"),
    dataIndex: ["call_sub_type", "name"],
  },

  {
    title: t("l_Reason"),
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

  {
    title: t("l_Manager"),
    dataIndex: ["employee", "name"],
  },

  {
    title: t("l_Address"),
    key: "address",
    customRender: ({ record }: TableRenderProps<Appeal>) => {
      const parts = [];

      if (record.city_id) {
        parts.push(
          h("div", [h("span", t("l_City") + ": "), h("strong", record.city?.name)])
        );
      }

      if (record.district_id) {
        parts.push(
          h("div", [
            h("span", t("l_District") + ": "),
            h("strong", record.district?.name),
          ])
        );
      }

      if (record.healthcare_facility_id) {
        parts.push(
          h("div", [
            h("span", t("l_Polyclinic") + ": "),
            h("strong", record.healthcare_facility?.name),
          ])
        );
      }

      return parts.length > 0
        ? h("div", { class: "text-gray-800 space-y-1" }, parts)
        : null;
    },
  },
  {
    title: t("l_Create_date"),
    dataIndex: "date",
    customRender: ({ text }: TableRenderProps<Appeal>) => {
      return $formatIsoDate(text);
    },
  },
  {
    title: t("l_Actions"),
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
    const params: any = {
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
      search: search.value,
      ...currentFilters.value,
    };

    if (params.status_in) {
      params.status__in = params.status_in;
      delete params.status_in;
    }
    if (statusFilter.value) {
      params.status__in = statusFilter.value;
    }

    // Удаляем пустые параметры
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] == null) {
        delete params[key];
      }
    });

    const { data } = await AppealApi<{
      items: Appeal[];
      total_count: number;
    }>("", params, "GET");

    tableData.value = Object.values(data.items);
    pagination.value.total = data.total_count;
  } catch (error) {
    message.error(t("l_Load_error_message"));
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

const openDetail = (appealId: string) => {
  selectedAppealId.value = appealId;
  detailModalVisible.value = true;
};

const openFilter = () => {
  filterModalVisible.value = true;
};

const handleStatusChange = (value: string) => {
  statusFilter.value = value;
  pagination.value.current = 1;
  fetchUsers();
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
