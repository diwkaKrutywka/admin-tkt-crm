<template>
    <div>
      <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Streets')">
        <template #extra>
          <a-button type="primary" @click="onAdd">
            <span class="material-symbols-outlined">add
            <span class="ml-2">{{ $t('l_Add_street') }}</span></span>
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
                :title="$t('l_Confirm_delete')"
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
  
      <add-edit-street
        v-model:visible="modalVisible"
        :street_id="editingStreet?.id ?? null"
        @submit="fetchStreets"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, h } from 'vue'
  import { message } from 'ant-design-vue'
  import { useI18n } from 'vue-i18n'
  import type { TableRenderProps } from '../../../types/table'
  import type { Street } from '../../../types/ref'
  
  import AddEditStreet from './AddEditStreet.vue'
  import { getStreets, deleteItems } from '../../../api/ref'
  
  const { t: $t } = useI18n()
  
  const tableData = ref<Street[]>([])
  const loading = ref(false)
  const modalVisible = ref(false)
  const editingStreet = ref<Street | null>(null)
  
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
      dataIndex: 'full_name',
    },
   
   
    {
      title: $t('l_Status'),
      dataIndex: 'is_active',
      customRender: ({ text }: TableRenderProps<Street>) =>
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
  
  const fetchStreets = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
      }
      const { data } = await getStreets(params)
      tableData.value = data.items
      pagination.value.total = data.total
    } catch (error) {
      message.error($t('l_Load_error') || 'Failed to load streets')
    } finally {
      loading.value = false
    }
  }
  
  const handleTableChange = (pag: any) => {
    pagination.value.current = pag.current
    pagination.value.pageSize = pag.pageSize
    fetchStreets()
  }
  
  const onDelete = async (id: string) => {
    try {
      loading.value = true
      await deleteItems('streets', id)
      message.success($t('l_Delete_success') || 'Street deleted successfully')
      fetchStreets()
    } catch (error) {
      message.error($t('l_Delete_error') || 'Failed to delete street')
    } finally {
      loading.value = false
    }
  }
  
  const onAdd = () => {
    editingStreet.value = null
    modalVisible.value = true
  }
  
  const onEdit = (street: Street) => {
    editingStreet.value = street
    modalVisible.value = true
  }
  
  onMounted(() => {
    fetchStreets()
  })
  </script>
  