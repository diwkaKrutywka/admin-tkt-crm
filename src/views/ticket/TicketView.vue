<template>
  <div>
    <a-page-header :title="$t('l_Tickets')">
      <template #extra>
        <div style="display: flex; justify-content: center; align-items: center;">
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
            style="width: 400px; vertical-align: middle;"
            class="align-middle search-input"
            @search="fetchTickets"
            allowClear
          />
        </div>
        <a-button @click="openFilter">
          <span class="material-symbols-outlined">
            filter_alt <span class="ml-2"> {{ $t("l_Filter") }}</span>
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
      :loading="loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, index }">
        <template v-if="column.key === 'actions'">
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

    <a-modal
      v-model:open="contactModalVisible"
      :title="t('l_Contact_info')"
      width="500px"
      footer
    >
      <a-descriptions bordered column="2" size="small" layout="vertical">
        <a-descriptions-item :label="t('l_Full_name')">
          {{ selectedContact?.full_name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('l_Phone')">
          <p class="text-blue-500">
            {{ selectedContact?.phone_number || "-" }}
          </p>
        </a-descriptions-item>

        <a-descriptions-item :label="t('l_iin')">
          {{ selectedContact?.iin || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('l_Gender')">
          <a-tag v-if="selectedContact?.gender === 'male'" color="blue">
            {{ t("l_Male") }}
          </a-tag>
          <a-tag v-else-if="selectedContact?.gender === 'female'" color="pink">
            {{ t("l_Female") }}
          </a-tag>
          <a-tag v-else color="default">
            {{ t("l_Other") }}
          </a-tag>
        </a-descriptions-item>

        <a-descriptions-item :label="t('l_Birth_date')">
          {{
            selectedContact?.birth_date
              ? $formatIsoDate(selectedContact.birth_date)
              : "-"
          }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <!-- модалки -->
    <ticket-detail
      v-model:open="detailModalVisible"
      :ticket-id="selectedTicketId"
    />

    <!-- Filter Modal -->
    <a-modal
      v-model:open="filterModalVisible"
      :title="$t('l_Filter_tickets')"
      @ok="handleFilterOk"
      @cancel="handleFilterCancel"
      destroyOnClose
      :width="600"
    >
      <a-form :model="filterForm" layout="vertical">
        <a-form-item :label="$t('l_Status')" name="status">
          <a-select 
            v-model:value="filterForm.status" 
            :placeholder="$t('l_Select_status')"
            allow-clear
          >
            <a-select-option value="open">Открыт</a-select-option>
            <a-select-option value="in_progress">В работе</a-select-option>
            <a-select-option value="closed">Закрыт</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item :label="$t('l_Source')" name="source">
          <a-select 
            v-model:value="filterForm.source" 
            :placeholder="$t('l_Select_source')"
            allow-clear
          >
            <a-select-option value="incoming_call">Входящий звонок</a-select-option>
            <a-select-option value="email">Email</a-select-option>
            <a-select-option value="web_form">Веб форма</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

      <template #footer>
        <a-space>
          <a-button @click="resetFilterForm">
            {{ $t('l_Reset_filter') }}
          </a-button>
          <a-button @click="handleFilterCancel">
            {{ $t('l_Cancel') }}
          </a-button>
          <a-button type="primary" @click="handleFilterOk">
            {{ $t('l_Apply_filter') }}
          </a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, watch } from "vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import { Tag } from "ant-design-vue";
import TicketDetail from "./TicketDetail.vue";
import { TicketApi } from "../../api/ticket";
import { useGlobal } from "../../composables/useGlobal";
import type { TableRenderProps } from "../../types/table";
import type { Ticket } from "../../types/ticket";

const { t } = useI18n();
const { $formatIsoDate } = useGlobal();

const search = ref("");
const statusFilter = ref("");
const tableData = ref<Ticket[]>([]);
const loading = ref(false);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ["10", "20", "50"],
  showTotal: (total: number) => t("l_Total_records", { total }),
});

const filterModalVisible = ref(false);
const detailModalVisible = ref(false);
const selectedTicketId = ref<string | null>(null);
const currentFilters = ref<any>({});
const router = useRouter();
const route = useRoute();

// Filter form data
const filterForm = ref({
  status: '',
  source: ''
});

watch(
  () => route.query.id,
  (id) => {
    if (id) {
      selectedTicketId.value = id as string;
      detailModalVisible.value = true;
      router.replace({ path: "/tickets" });
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchTickets();
});
// новая модалка для отображения контакта
const contactModalVisible = ref(false);
const selectedContact = ref<any>(null);

const openContactModal = (contact: any) => {
  selectedContact.value = contact;
  contactModalVisible.value = true;
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
    title: t("l_Status"),
    dataIndex: ["ticket_content", "status", "name"],
    key: "status",
    customRender: ({ text }: TableRenderProps<Ticket>) => {
      if (!text) return null;

      let color = "gray";

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
    title: t("l_Source"),
    dataIndex: "source",
    customRender: ({ text }: TableRenderProps<Ticket>) => {
      if (!text) return null;

      // статус incoming_call
      if (text === "incoming_call") {
        return h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "6px" } },
          [
            h(
              "span",
              {
                style: {
                  color: "green",
                  fontSize: "13px",
                  fontWeight: "500",
                },
              },
              "Входящий звонок"
            ),
          ]
        );
      }

      // дефолтный вывод
      return h(
        "span",
        {
          style: {
            color: "gray",
            fontSize: "13px",
          },
        },
        text
      );
    },
  },
  {
    title: t("l_Client"),
    dataIndex: ["contact", "phone_number"],
    key: "client",
    customRender: ({ text, record }: TableRenderProps<Ticket>) => {
      if (!text) return null;
      return h(
        Tag,
        {
          color: "blue",
          style: {
            fontSize: "13px",
            padding: "2px 10px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          },
          onClick: () => openContactModal(record.contact),
          onMouseenter: (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#e6f7ff";
          },
          onMouseleave: (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "";
          },
        },
        {
          default: () => [
            h(
              "span",
              {
                class: "icon material-symbols-outlined",
                style: { fontSize: "18px", color: "#1890ff" },
              },
              "call"
            ),
            text,
          ],
        }
      );
    },
  },
  {
    title: t("l_Initiator"),
    dataIndex: ["ticket_content", "initiator", "full_name"],
    key: "initiator",
  },
  {
    title: t("l_Manager"),
    dataIndex: ["ticket_content", "assignee", "full_name"],
    key: "manager",
  },
  {
    title: t("l_Created_at"),
    dataIndex: ["ticket_content", "created_at"],
    key: "created_at",
    customRender: ({ text }: TableRenderProps<Ticket>) => {
      return $formatIsoDate(text);
    },
  },
  {
    title: t("l_Actions"),
    key: "actions",
    align: "center",
    width: 100,
  },
];

const fetchTickets = async () => {
  loading.value = true;
  try {
    const params: any = {
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
      search: search.value,
      ...currentFilters.value,
    };

    if (statusFilter.value) {
      params.status__in = statusFilter.value;
    }

    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    const { data } = await TicketApi<{ items: Ticket[]; total_count: number }>(
      "",
      params,
      "GET"
    );

    tableData.value = data.items;
    pagination.value.total = data.total_count;
  } catch (err) {
    message.error(t("l_Load_error_message"));
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current;
  pagination.value.pageSize = pag.pageSize;
  fetchTickets();
};



const applyFilter = (filters: any) => {
  currentFilters.value = filters;
  pagination.value.current = 1;
  fetchTickets();
};

const openFilter = () => {
  filterModalVisible.value = true;
};

const handleFilterOk = () => {
  const filters: any = {};
  if (filterForm.value.status) filters.status = filterForm.value.status;
  if (filterForm.value.source) filters.source = filterForm.value.source;
  
  applyFilter(filters);
  filterModalVisible.value = false;
};

const handleFilterCancel = () => {
  filterModalVisible.value = false;
};

const resetFilterForm = () => {
  filterForm.value.status = '';
  filterForm.value.source = '';
  currentFilters.value = {};
  pagination.value.current = 1;
  fetchTickets();
};

const openDetail = (id: string) => {
  selectedTicketId.value = id;
  detailModalVisible.value = true;
};
</script>

<style scoped>
.search-input :deep(.ant-input-search-button) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
