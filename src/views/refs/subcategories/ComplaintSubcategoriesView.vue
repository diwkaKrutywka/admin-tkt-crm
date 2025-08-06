<template>
  <div>
    <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Complaint_subcategories')">
      <template #extra>
        <a-button type="primary" @click="onAdd">
          <span class="material-symbols-outlined">add
            <span class="ml-2">{{ $t('l_Add_complaint_subcategory') }}</span>
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
    <AddEditSubcategories
      :open="modalVisible"
      :subcategory="editingSubcategory"
      @update:open="modalVisible = $event"
      @submit="fetchComplaintSubcategories"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import type { TableRenderProps } from '../../../types/table'
import type { ComplaintSubcategory } from '../../../types/ref'
import { useI18n } from 'vue-i18n'
import { getComplaintSubcategories } from '../../../api/ref'
import AddEditSubcategories from './AddEditSubcategories.vue'

const { t: $t } = useI18n()

const tableData = ref<ComplaintSubcategory[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingSubcategory = ref<ComplaintSubcategory | null>(null)

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
    title: $t('l_Complaint_category_id'),
    dataIndex: 'complaint_category_id',
  },
  {
    title: $t('l_Status'),
    dataIndex: 'is_active',
    customRender: ({ text }: TableRenderProps<ComplaintSubcategory>) =>
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

const fetchComplaintSubcategories = async () => {
  loading.value = true
  try {
    const params = {
      include_inactive: true
    }
    const { data } = await getComplaintSubcategories(params)
    tableData.value = data.items
    pagination.value.total = data.total ?? data.items.length
  } catch (error) {
    message.error($t('l_Load_error') || 'Failed to load complaint subcategories')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchComplaintSubcategories()
}

const onAdd = () => {
  editingSubcategory.value = null
  modalVisible.value = true
}

const onEdit = (subcategory: ComplaintSubcategory) => {
  editingSubcategory.value = subcategory
  modalVisible.value = true
}

onMounted(() => {
  fetchComplaintSubcategories()
})
</script>

<style scoped></style>