<template>
  <div>
    <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Complaint_categories')">
      <template #extra>
        <a-button type="primary" @click="onAdd">
          <span class="material-symbols-outlined">add
            <span class="ml-2">{{ $t('l_Add_complaint_category') }}</span>
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
      </template>
    </a-table>
    <!-- Модалка для добавления/редактирования — по запросу -->
    <AddEditCategories
      :open="modalVisible"
      :category="editingCategory"
      @update:open="modalVisible = $event"
      @submit="fetchComplaintCategories"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import type { TableRenderProps } from '../../../types/table'
import type { ComplaintCategory } from '../../../types/ref'
import { useI18n } from 'vue-i18n'
import { getComplaintCategories } from '../../../api/ref'
import AddEditCategories from './AddEditCategories.vue'

const { t: $t } = useI18n()

const tableData = ref<ComplaintCategory[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingCategory = ref<ComplaintCategory | null>(null)

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
    title: $t('l_Status'),
    dataIndex: 'is_active',
    customRender: ({ text }: TableRenderProps<ComplaintCategory>) =>
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

const fetchComplaintCategories = async () => {
  loading.value = true
  try {
    const params = {
      include_inactive: true
    }
    const { data } = await getComplaintCategories(params)
    tableData.value = data.items
    pagination.value.total = data.total ?? data.items.length
  } catch (error) {
    message.error($t('l_Load_error') || 'Failed to load complaint categories')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchComplaintCategories()
}

const onAdd = () => {
  editingCategory.value = null
  modalVisible.value = true
}

const onEdit = (category: ComplaintCategory) => {
  editingCategory.value = category
  modalVisible.value = true
}

onMounted(() => {
  fetchComplaintCategories()
})
</script>

<style scoped></style>
