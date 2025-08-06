<template>
  <div>
    <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Call_subtypes')">
      <template #extra>
        <a-button type="primary" @click="onAdd">
          <span class="material-symbols-outlined">add
            <span class="ml-2">{{ $t('l_Add_call_subtype') }}</span>
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
          </a-space>
        </template>
        <template v-else-if="column.dataIndex === 'is_active'">
          <a-tag :color="record.is_active ? 'green' : 'red'">
            {{ record.is_active ? $t('l_Active') : $t('l_Inactive') }}
          </a-tag>
        </template>
      </template>
    </a-table>
    <!-- Модалка для добавления/редактирования — по запросу -->
    <AddEditCallSubtypes
      :open="modalVisible"
      :subtype="editingSubtype"
      @update:open="modalVisible = $event"
      @submit="fetchCallSubtypes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import type { TableRenderProps } from '../../../types/table'
import type { CallSubtype } from '../../../types/ref'
import { useI18n } from 'vue-i18n'
import { getCallSubtypes } from '../../../api/ref'
import AddEditCallSubtypes from './AddEditCallSubtypes.vue'

const { t: $t } = useI18n()

const tableData = ref<CallSubtype[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingSubtype = ref<CallSubtype | null>(null)

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
  },
  {
    title: $t('l_Actions'),
    key: 'Action',
    align: 'center',
    width: 100,
  },
]

const fetchCallSubtypes = async () => {
  loading.value = true
  try {
    const params = {
      include_inactive: true
    }
    const { data } = await getCallSubtypes(params)
    tableData.value = data.items
    pagination.value.total = data.total ?? data.items.length
  } catch (error) {
    message.error($t('l_Load_error') || 'Failed to load call subtypes')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchCallSubtypes()
}

const onAdd = () => {
  editingSubtype.value = null
  modalVisible.value = true
}

const onEdit = (subtype: CallSubtype) => {
  editingSubtype.value = subtype
  modalVisible.value = true
}

onMounted(() => {
  fetchCallSubtypes()
})
</script>

<style scoped></style>