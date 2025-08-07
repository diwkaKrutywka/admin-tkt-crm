<template>
    <div>
      <a-page-header :title="$t('l_Tickets')">
   
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
  
      <!-- модалки -->
      <ticket-detail v-model:open="detailModalVisible" :ticket-id="selectedTicketId" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, h, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { message } from 'ant-design-vue';
  import { useRouter, useRoute } from 'vue-router';
  
  import TicketDetail from './TicketDetail.vue';
  import { TicketApi } from '../../api/ticket';
  import { useGlobal } from '../../composables/useGlobal';
  import type { TableRenderProps } from '../../types/table';
  import type { Ticket } from '../../types/ticket';
  
  const { t } = useI18n();
  const { $formatIsoDate } = useGlobal();
  
  const search = ref('');
  const statusFilter = ref('');
  const tableData = ref<Ticket[]>([]);
  const loading = ref(false);
  
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50'],
    showTotal: (total: number) => t('l_Total_records', { total }),
  });
  
  const filterModalVisible = ref(false);
  const detailModalVisible = ref(false);
  const selectedTicketId = ref<string | null>(null);
  const currentFilters = ref<any>({});
  const router = useRouter();
  const route = useRoute();
  
  watch(
    () => route.query.id,
    (id) => {
      if (id) {
        selectedTicketId.value = id as string;
        detailModalVisible.value = true;
        router.replace({ path: '/tickets' });
      }
    },
    { immediate: true }
  );
  
  onMounted(() => {
    fetchTickets();
  });
  
  const columns = [
    {
      title: '#',
      key: 'index',
      width: '50px',
      customRender: ({ index }: { index: number }) => {
        return (pagination.value.current - 1) * pagination.value.pageSize + index + 1;
      },
    },
    {
      title: t('l_Status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('l_Source'),
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: t('l_Initiator'),
      dataIndex: 'initiator',
      key: 'initiator',
    },
    {
      title: t('l_Created_at'),
      dataIndex: ['complaint', 'created_at'],
      key: 'created_at',
      customRender: ({ text }: TableRenderProps<Ticket>) => {
        return $formatIsoDate(text);
      },
    },
    {
      title: t('l_Actions'),
      key: 'actions',
      align: 'center',
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
        '',
        params,
        'GET'
      );
  
      tableData.value = data.items;
      pagination.value.total = data.total_count;
    } catch (err) {
      message.error(t('l_Load_error_message'));
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
  
  const handleStatusChange = (value: string) => {
    statusFilter.value = value;
    pagination.value.current = 1;
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
  