<template>
  <div>
    <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Organizations')">
      <template #extra>
        <a-button type="primary" @click="onAdd">
          <span class="material-symbols-outlined">add
            <span class="ml-2">{{ $t('l_Add_organization') }}</span>
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

    <AddEditOrganization
      :open="modalVisible"
      :organization="editingOrganization"
      @update:open="modalVisible = $event"
      @submit="fetchOrganizations"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { message } from 'ant-design-vue'
import type { TableRenderProps } from '../../../types/table'
import type { Organization } from '../../../types/ref'
import { useI18n } from 'vue-i18n'
import { getOrganizations } from '../../../api/ref'
import AddEditOrganization from './AddEditOrganization.vue'

const { t: $t } = useI18n()

const tableData = ref<Organization[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingOrganization = ref<Organization | null>(null)

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
    title: $t('l_Short_name'),
    dataIndex: 'short_name',
  },
  {
    title: $t('l_Organization_type'),
    dataIndex: 'organization_type',
    customRender: ({ text }: { text: string }) => {
      if (text === 'private_clinic') {
        return $t('l_Private_clinic')
      } else if (text === 'clinic' || text === 'public_clinic') {
        return $t('l_Public_clinic')
      } else if (text === 'hospital') {
        return $t('l_Hospital')
      } else if (text === "company") {
        return $t('l_Company')
      }
      return text
    },
  },
  {
    title: $t('l_Display_name'),
    dataIndex: 'display_name',
  },
  {
    title: $t('l_Actions'),
    key: 'Action',
    align: 'center',
    width: 100,
  },
]

const fetchOrganizations = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.current,
        page_size: pagination.value.pageSize,
    }
    const { data } = await getOrganizations(params)
    tableData.value = data.items
      pagination.value.total = data.total
  } catch (error) {
    message.error($t('l_Load_error') || 'Failed to load organizations')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchOrganizations()
}

const onAdd = () => {
  editingOrganization.value = null
  modalVisible.value = true
}

const onEdit = (organization: Organization) => {
  editingOrganization.value = organization
  modalVisible.value = true
}

onMounted(() => {
  fetchOrganizations()
})
</script>

<style scoped></style>