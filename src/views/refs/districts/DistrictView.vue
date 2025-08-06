<template>
    <div>
      <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Districts')">
        <template #extra>
          <a-button type="primary" @click="onAdd">
            <span class="material-symbols-outlined">add
            <span class="ml-2">{{ $t('l_Add_district') }}</span></span>
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
  
      <add-edit-district
        v-model:open="modalVisible"
        :district_id="editingDistrict?.id"
        @submit="fetchDistricts"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, h } from 'vue'
  import { message } from 'ant-design-vue'
  import { useI18n } from 'vue-i18n'
  import type { TableRenderProps } from '../../../types/table'
  import type { District } from '../../../types/ref'
  
  import AddEditDistrict from './AddEditDistrict.vue'
  import { getDistricts, deleteItems } from '../../../api/ref'
  
  const { t: $t } = useI18n()
  
  const tableData = ref<District[]>([])
  const loading = ref(false)
  const modalVisible = ref(false)
  const editingDistrict = ref<District | null>(null)
  
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
      title: $t('l_District_code'),
      dataIndex: 'district_code',
    },
    {
      title: $t('l_District_type'),
      dataIndex: 'district_type',
    },
    {
      title: $t('l_Administrative_center'),
      dataIndex: 'administrative_center',
    },
    {
      title: $t('l_Status'),
      dataIndex: 'is_active',
      customRender: ({ text }: TableRenderProps<District>) =>
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
  
  const fetchDistricts = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
      }
      const { data } = await getDistricts(params)
      tableData.value = data.items
      pagination.value.total = data.total
    } catch (error) {
      message.error($t('l_Load_error') || 'Failed to load districts')
    } finally {
      loading.value = false
    }
  }
  
  const handleTableChange = (pag: any) => {
    pagination.value.current = pag.current
    pagination.value.pageSize = pag.pageSize
    fetchDistricts()
  }
  
  const onDelete = async (id: string) => {
    try {
      loading.value = true
      await deleteItems('districts', id)
      message.success($t('l_Delete_success') || 'District deleted successfully')
      fetchDistricts()
    } catch (error) {
      message.error($t('l_Delete_error') || 'Failed to delete district')
    } finally {
      loading.value = false
    }
  }
  
  const onAdd = () => {
    editingDistrict.value = null
    modalVisible.value = true
  }
  
  const onEdit = (district: District) => {
    editingDistrict.value = district
    modalVisible.value = true
  }
  
  onMounted(() => {
    fetchDistricts()
  })
  </script>
  