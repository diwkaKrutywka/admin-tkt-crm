<template>
  <div>
    <a-page-header :title="$t('l_Settings') + ' / ' + $t('l_Organizations')">
      <template #extra>
        <div style="display: flex; justify-content: center; align-items: center;">
          <a-input-search
            v-model:value="search"
            :placeholder="$t('l_Search_placeholder')"
            style="width: 400px; vertical-align: middle;"
            class="align-middle search-input"
            @search="fetchOrganizations"
            allowClear
          />
        </div>
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
              @click="onEdit(record.id)"
            >
              edit
            </span>
            <a-popconfirm
              placement="leftBottom"
              :title="$t('l_Delete_confirm_organization')"
              :ok-text="$t('l_Yes')"
              :cancel-text="$t('l_No')"
              @confirm="onDelete(record.id)"
            >
              <span
                style="color: red; font-size: 21px; cursor: pointer;"
                class="icon material-symbols-outlined"
              >
                delete
              </span>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <AddEditOrganization
      :open="modalVisible"
      :organization_id="editingOrganizationId"
      @update:open="modalVisible = $event"
      @submit="fetchOrganizations"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { Organization } from '../../../types/ref'
import { useI18n } from 'vue-i18n'
import { getOrganizations, deleteItems } from '../../../api/ref'
import AddEditOrganization from './AddEditOrganization.vue'

const { t: $t } = useI18n()

const tableData = ref<Organization[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingOrganizationId = ref<string | null>(null)
const search = ref<string>('')

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
      if (text === 'private_clinic') return $t('l_Private_clinic')
      if (text === 'public_clinic') return $t('l_Public_clinic')
      if (text === 'hospital') return $t('l_Hospital')
      if (text === 'government_agencyy') return $t('l_government_agency')
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
    const params: any = {
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
    }
    if (search.value.trim()) {
      params.search = search.value.trim()
    }
    const { data } = await getOrganizations(params)
    tableData.value = data.items
    pagination.value.total = data.total
  } catch {
    message.error($t('l_Load_error'))
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
  editingOrganizationId.value = null
  modalVisible.value = true
}

const onEdit = (id: string) => {
  editingOrganizationId.value = id
  modalVisible.value = true
}

const onDelete = async (id: string) => {
  try {
    loading.value = true
    await deleteItems('organizations', id)
    message.success($t('l_Delete_success'))
    fetchOrganizations()
  } catch {
    message.error($t('l_Delete_error'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrganizations()
})

let searchTimeout: ReturnType<typeof setTimeout>
watch(search, (newValue) => {
  clearTimeout(searchTimeout)
  pagination.value.current = 1
  if (!newValue) {
    fetchOrganizations()
  } else {
    searchTimeout = setTimeout(() => {
      fetchOrganizations()
    }, 300)
  }
})
</script>

<style scoped>
.search-input :deep(.ant-input-search-button) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-input :deep(.ant-input-search-button .anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
