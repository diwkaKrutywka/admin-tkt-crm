<template>
    <div>
      <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Cities')">
        <template #extra>
          <a-button type="primary" @click="onAdd">
            <span class="material-symbols-outlined">
              add
              <span class="ml-2">{{ $t('l_Add_city') }}</span>
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
                :title="$t('l_Confirm_delete_city')"
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
  
      <add-edit-city
        v-model:open="modalVisible"
        :city_id="editingCity?.id"
        @submit="fetchCities"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, h } from 'vue'
  import { message } from 'ant-design-vue'
  import { useI18n } from 'vue-i18n'
  
  import AddEditCity from './AddEditCity.vue'
  import { getCities, deleteItems } from '../../../api/ref'
  import type { City } from '../../../types/ref'
  import type { TableRenderProps } from '../../../types/table'
  
  const { t: $t } = useI18n()
  
  const tableData = ref<City[]>([])
  const loading = ref(false)
  const modalVisible = ref(false)
  const editingCity = ref<City | null>(null)
  
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
      title: $t('l_City_code'),
      dataIndex: 'city_code',
    },
    {
      title: $t('l_City_type'),
      dataIndex: 'city_type',
    },
    {
      title: $t('l_Regional_center'),
      dataIndex: 'is_regional_center',
      customRender: ({ text }: TableRenderProps<City>) =>
        text
          ? h('span', { style: 'color: green' }, $t('l_Yes'))
          : h('span', { style: 'color: red' }, $t('l_No')),
    },
    {
      title: $t('l_District_center'),
      dataIndex: 'is_district_center',
      customRender: ({ text }: TableRenderProps<City>) =>
        text
          ? h('span', { style: 'color: green' }, $t('l_Yes'))
          : h('span', { style: 'color: red' }, $t('l_No')),
    },
    {
      title: $t('l_Postal_code'),
      dataIndex: 'postal_code',
    },
    {
      title: $t('l_Status'),
      dataIndex: 'is_active',
      customRender: ({ text }: TableRenderProps<City>) =>
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
  
  const fetchCities = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.value.current,
        page_size: pagination.value.pageSize,
      }
      const { data } = await getCities(params)
      tableData.value = data.items
      pagination.value.total = data.total
    } catch (error) {
      message.error($t('l_Load_error') || 'Failed to load cities')
    } finally {
      loading.value = false
    }
  }
  
  const handleTableChange = (pag: any) => {
    pagination.value.current = pag.current
    pagination.value.pageSize = pag.pageSize
    fetchCities()
  }
  
  const onDelete = async (id: string) => {
    try {
      loading.value = true
      await deleteItems('cities', id)
      message.success($t('l_Delete_success') || 'City deleted successfully')
      fetchCities()
    } catch (error) {
      message.error($t('l_Delete_error') || 'Failed to delete city')
    } finally {
      loading.value = false
    }
  }
  
  const onAdd = () => {
    editingCity.value = null
    modalVisible.value = true
  }
  
  const onEdit = (city: City) => {
    editingCity.value = city
    modalVisible.value = true
  }
  
  onMounted(() => {
    fetchCities()
  })
  </script>
  