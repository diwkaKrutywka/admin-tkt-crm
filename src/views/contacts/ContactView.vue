<template>
  <div>
    <a-page-header :title="$t('l_Contacts')">
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
    <filter-contact
      v-model:open="filterModalVisible"
      @filter="applyFilter"
      @reset="resetFilters"
    ></filter-contact>
    <edit-contact
      v-model:open="modalVisible"
      :id="editingUser?.id"
      @submit="fetchUsers"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, watch, computed } from "vue";
import { Avatar, message, Tag } from "ant-design-vue";
import { SafetyOutlined } from "@ant-design/icons-vue";
import type { Contact } from "../../types/contacts";
import FilterContact from "./FilterContact.vue";
import type { TableRenderProps } from "../../types/table";
import EditContact from "./EditContact.vue";
import { ContactApi } from "../../api/contact"; // ← your API utility
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();
const open = ref<boolean>(false);
const filterModalVisible = ref<boolean>(false);
const reason = ref<string>("");
const search = ref<string>("");
const lockingStatus = ref<string>("");
const currentFilters = ref<any>({});
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
  showTotal: (total: number) => $t('l_Total_records', { total }),
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
    title: $t("l_Full_name"),
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
    title: $t("l_Phone_number"),
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
    title: $t("l_IIN"),
    dataIndex: "iin",
  },
  {
    title: $t("l_Birth_date"),
    dataIndex: "birth_date",
    customRender: ({ text }: TableRenderProps<Contact>) => {
      const { $formatIsoDate } = useGlobal();
      return $formatIsoDate(text);
    },
  },
  {
    title: $t("l_Gender"),
    dataIndex: "gender",
    customRender: ({ text }: TableRenderProps<Contact>) => {
      if (text === "male") {
        return h(Tag, { color: "blue" }, () => $t("l_Male"));
      } else if (text === "female") {
        return h(Tag, { color: "pink" }, () => $t("l_Female"));
      } else {
        return h(Tag, { color: "gray" }, () => $t("l_Other"));
      }
    },
  },
  {
    title: $t("l_Actions"),
    key: "Action",
    width: 110,
    align: "center",
  },
];
const applyFilter = (filters: any) => {
  
  const processedFilters: any = {};
  
  
  if (filters.order_by) {
    processedFilters.order_by = filters.order_by;
  }
  if (filters.order) {
    processedFilters.order = filters.order;
  }
  
  
  if (filters.gender__eq) {
    processedFilters.gender__eq = filters.gender__eq;
  }
  
  
  if (filters.birth_date__gte) {
    processedFilters.birth_date__gte = filters.birth_date__gte.format('YYYY-MM-DD');
  }
  if (filters.birth_date__lte) {
    processedFilters.birth_date__lte = filters.birth_date__lte.format('YYYY-MM-DD');
  }
  
  
  if (filters.created_at__gte) {
    processedFilters.created_at__gte = filters.created_at__gte.format('YYYY-MM-DD');
  }
  if (filters.created_at__lte) {
    processedFilters.created_at__lte = filters.created_at__lte.format('YYYY-MM-DD');
  }
  
  currentFilters.value = processedFilters;
  pagination.value.current = 1;
  fetchUsers();
};

const resetFilters = () => {
  currentFilters.value = {};
  pagination.value.current = 1;
  fetchUsers();
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    
    const queryParams: any = {
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
    };
    
    
    if (search.value.trim()) {
      queryParams.search = search.value.trim();
    }
    
    
    if (Object.keys(currentFilters.value).length > 0) {
      Object.assign(queryParams, currentFilters.value);
    }
    
    // Удаляем пустые параметры
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] == null) {
        delete queryParams[key];
      }
    });
    
    const { data } = await ContactApi<{
      items: Contact[];
      total_count: number;
    }>(
      "",
      queryParams,
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

let searchTimeout: ReturnType<typeof setTimeout>;

watch(search, (newValue) => {
  clearTimeout(searchTimeout);
  if (!newValue) {
    resetFilters();
  } else {
    pagination.value.current = 1;
    searchTimeout = setTimeout(() => {
      fetchUsers();
    }, 300);
  }
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
