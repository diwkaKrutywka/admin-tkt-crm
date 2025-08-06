<template>
    <div>
      <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Call_types')">
        <template #extra>
          <a-button type="primary" @click="onAdd">
            <span class="material-symbols-outlined">
              add
              <span class="ml-2">{{ $t('l_Add_call_type') }}</span>
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
        <template #bodyCell="{ record, column }">
          <template v-if="column.key === 'Action'">
            <a-space>
              <span
                class="icon material-symbols-outlined"
                style="color: black; font-size: 21px; cursor: pointer"
                @click="onEdit(record)"
              >
                edit
              </span>
              <a-popconfirm
                placement="leftBottom"
                :title="$t('l_Confirm_delete_call_type')"
                :ok-text="$t('l_Yes')"
                :cancel-text="$t('l_No')"
                @confirm="onDelete(record.id)"
              >
                <span
                  style="color:red; font-size: 21px"
                  class="icon material-symbols-outlined"
                >
                  delete
                </span>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
  
      <add-edit-call-type
        v-model:open="modalVisible"
        :call_type_id="editingItem?.id"
        @submit="fetchCallTypes"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, h } from 'vue'
  import { message } from 'ant-design-vue'
  import { useI18n } from 'vue-i18n'
  
  import AddEditCallType from './AddEditCallType.vue'
  import { getCallTypes, deleteItems } from '../../../api/ref'
  import type { CallType } from '../../../types/ref'
  import type { TableRenderProps } from '../../../types/table'
  
  const { t: $t } = useI18n()
  
  const tableData = ref<CallType[]>([])
  const loading = ref(false)
  const modalVisible = ref(false)
  const editingItem = ref<CallType | null>(null)
  
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    showQuickJumper: true,
    showTotal: (total: number) => $t('l_Total_records', { total }),
  })
  
  const columns = [
    {
      title: '#',
      key: 'index',
      width: '50px',
      customRender: ({ index }: { index: number }) =>
        (pagination.value.current - 1) * pagination.value.pageSize + index + 1,
    },
    {
      title: $t('l_Name'),
      dataIndex: 'name',
    },
    {
      title: $t('l_Code'),
      dataIndex: 'code',
    },
    {
      title: $t('l_Description'),
      dataIndex: 'description',
    },
    {
      title: $t('l_Complaint'),
      dataIndex: 'is_complaint',
      customRender: ({ text }: TableRenderProps<CallType>) =>
        text
          ? h('span', { style: 'color: orange' }, $t('l_Yes'))
          : h('span', { style: 'color: gray' }, $t('l_No')),
    },
    {
      title: $t('l_Status'),
      dataIndex: 'is_active',
      customRender: ({ text }: TableRenderProps<CallType>) =>
        text
          ? h('span', { style: 'color: green' }, $t('l_Active'))
          : h('span', { style: 'color: red' }, $t('l_Inactive')),
    },
    {
      title: $t('l_Actions'),
      key: 'Action',
      align: 'center',
      width: 100,
    },
  ]
  
  const fetchCallTypes = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
      }
      const { data } = await getCallTypes(params)
      tableData.value = data.items
      pagination.value.total = data.total
    } catch (error) {
      message.error($t('l_Load_error') || 'Failed to load call types')
    } finally {
      loading.value = false
    }
  }
  
  const handleTableChange = (pag: any) => {
    pagination.value.current = pag.current
    pagination.value.pageSize = pag.pageSize
    fetchCallTypes()
  }
  
  const onDelete = async (id: string) => {
    try {
      loading.value = true
      await deleteItems('call-types', id)
      message.success($t('l_Delete_success') || 'Call type deleted successfully')
      fetchCallTypes()
    } catch (error) {
      message.error($t('l_Delete_error') || 'Failed to delete call type')
    } finally {
      loading.value = false
    }
  }
  
  const onAdd = () => {
    editingItem.value = null
    modalVisible.value = true
  }
  
  const onEdit = (item: CallType) => {
    editingItem.value = item
    modalVisible.value = true
  }
  
  onMounted(() => {
    fetchCallTypes()
  })
  </script>
  