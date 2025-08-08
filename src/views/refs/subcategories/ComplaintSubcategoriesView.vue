<template>
  <div>
    <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Subtypes')">
      <template #extra>
        <a-button type="primary" @click="onAdd">
          <span class="material-symbols-outlined">add
            <span class="ml-2">{{ $t('l_Add_subtype') }}</span>
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
              :title="$t('l_Delete_confirm_subcategories')"
              :ok-text="$t('l_Yes')"
              :cancel-text="$t('l_No')"
              @confirm="onDelete(record.id)"
            >
              <span
                style="color: red; font-size: 21px"
                class="icon material-symbols-outlined"
              >
                delete
              </span>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <add-edit-subtype
      v-model:open="modalVisible"
      :subtype_id="editingSubtype?.id ?? null"
      @submit="fetchSubtypes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'

import type { TableRenderProps } from '../../../types/table'
import type { Subtype } from '../../../types/ref'

import { getCallSubtypes, deleteItems } from '../../../api/ref'
import AddEditSubtype from './AddEditSubcategories.vue'

const { t: $t } = useI18n()

const tableData = ref<Subtype[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingSubtype = ref<Subtype | null>(null)

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
    title: $t('l_Status'),
    dataIndex: 'is_active',
    customRender: ({ text }: TableRenderProps<Subtype>) =>
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

const fetchSubtypes = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
    }
    const { data } = await getCallSubtypes(params)
    tableData.value = data.items
    pagination.value.total = data.total
  } catch (error) {
    message.error($t('l_Load_error') || 'Failed to load subtypes')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchSubtypes()
}

const onDelete = async (id: string) => {
  try {
    loading.value = true
    await deleteItems('call-subtypes', id)
    message.success($t('l_Delete_success') || 'Subtype deleted successfully')
    fetchSubtypes()
  } catch (error) {
    message.error($t('l_Delete_error') || 'Failed to delete subtype')
  } finally {
    loading.value = false
  }
}

const onAdd = () => {
  editingSubtype.value = null
  modalVisible.value = true
}

const onEdit = (subtype: Subtype) => {
  editingSubtype.value = subtype
  modalVisible.value = true
}

onMounted(() => {
  fetchSubtypes()
})
</script>
