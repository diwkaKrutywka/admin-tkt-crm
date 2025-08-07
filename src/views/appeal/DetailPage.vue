<template>
  <a-drawer
    v-model:open="visible"
    :title="$t('l_Appeal_details')"
    placement="right"
    :width="drawerWidth"
    :closable="true"
    @close="handleClose"
  >
    <div v-if="loading" class="flex justify-center items-center h-64">
      <a-spin size="large" />
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 py-8">
      <a-result
        status="error"
        :title="$t('l_Loading_error')"
        :sub-title="error"
      />
    </div>
    
    <div v-else-if="appealData" class="appeal-detail">
      <!-- Основная информация об обращении -->
      <a-descriptions
        :title="$t('l_Appeal_information')"
        :column="screenWidth < 768 ? 1 : 2"
        bordered
        class="mb-6 mt-4"
      >
        <a-descriptions-item :label="$t('l_Creation_date')">
          {{ formatDate(appealData.date) }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Status')">
          <a-tag :color="getStatusColor(appealData.status)">
            {{ getStatusText(appealData.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Manager')" :span="screenWidth < 768 ? 1 : 2">
          {{ appealData.employee_id }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Reason')" :span="screenWidth < 768 ? 1 : 2">
          <div class="max-h-32 overflow-y-auto">
            {{ appealData.reason || $t('l_Not_specified_f') }}
          </div>
        </a-descriptions-item>
      </a-descriptions>

      <!-- Типы обращений -->
      <a-descriptions
        :title="$t('l_Appeal_types')"
        :column="screenWidth < 768 ? 1 : 2"
        bordered
        class="mb-6 mt-8"
      >
        <a-descriptions-item :label="$t('l_Call_type')">
          {{ appealData.call_type?.name || $t('l_Not_specified_m') }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Call_subtype')">
          {{ appealData.call_sub_type?.name || $t('l_Not_specified_m') }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Appeal_category')">
          {{ appealData.appeal_category?.name || $t('l_Not_specified_f') }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Appeal_subcategory')">
          {{ appealData.appeal_sub_category?.name || $t('l_Not_specified_f') }}
        </a-descriptions-item>
      </a-descriptions>

      <!-- Адресная информация -->
      <a-descriptions
        :title="$t('l_Address_information')"
        :column="1"
        bordered
        class="mb-6 mt-8"
      >
        <a-descriptions-item :label="$t('l_City')">
          {{ appealData.city?.name || $t('l_Not_specified_m') }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_District')">
          {{ appealData.district?.name|| $t('l_Not_specified_m') }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Polyclinic')">
          {{ appealData.healthcare_facility?.name || $t('l_Not_specified_f') }}
        </a-descriptions-item>
      </a-descriptions>

      <!-- Контактная информация -->
      <a-descriptions
        v-if="appealData.contact"
        :title="$t('l_Contact_information')"
        :column="screenWidth < 768 ? 1 : 2"
        bordered
        class="mt-8"
      >
        <a-descriptions-item :label="$t('l_Full_name')">
          {{ appealData.contact.full_name || $t('l_Not_specified') }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Phone_number')">
          <a-tag color="blue">
            {{ appealData.contact.called_by }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_IIN')">
          {{ appealData.contact.iin || $t('l_Not_specified_m') }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Birth_date')">
          {{ formatDate(appealData.contact.birth_date) }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Gender')">
          <a-tag :color="getGenderColor(appealData.contact.gender)">
            {{ getGenderText(appealData.contact.gender) }}
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { AppealApi } from '../../api/appeal'
import type { Appeal } from '../../types/appeal'
import { useI18n } from 'vue-i18n'

// Реактивная ширина экрана
const screenWidth = ref(window.innerWidth)

// Адаптивная ширина drawer в зависимости от размера экрана
const drawerWidth = computed(() => {
  const width = screenWidth.value
  if (width < 576) return '100%' // xs - мобильные устройства
  if (width < 768) return '90%'  // sm - планшеты
  if (width < 992) return '70%'  // md - маленькие экраны
  if (width < 1200) return '50%' // lg - средние экраны
  return '40%' // xl - большие экраны
})

interface Props {
  open: boolean
  appealId?: string
}

interface AppealDetail extends Appeal {
  appeal_category_id: string
  appeal_sub_category_id: string
}

const { t: $t } = useI18n()

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const visible = computed({
  get: () => props.open,
  set: (val: boolean) => emit('update:open', val)
})

const loading = ref(false)
const error = ref<string | null>(null)
const appealData = ref<AppealDetail | null>(null)

// Получение детальной информации об обращении
const fetchAppealDetail = async (id: string) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await AppealApi<AppealDetail>(id, {}, 'GET')
    appealData.value = response.data
  } catch (err: any) {
    console.error('Ошибка при загрузке деталей обращения:', err)
    error.value = err?.response?.data?.detail || $t('l_Load_error_message')
    message.error($t('l_Load_error_message'))
  } finally {
    loading.value = false
  }
}

// Обработчик закрытия drawer
const handleClose = () => {
  visible.value = false
  appealData.value = null
  error.value = null
}

// Форматирование даты
const formatDate = (dateString: string): string => {
  if (!dateString) return '—'
  return dayjs.utc(dateString).format('DD.MM.YYYY HH:mm')
}

// Получение цвета статуса
const getStatusColor = (status: string): string => {
  if (!status) return 'default'
  switch (status.toLowerCase()) {
    case 'new':
      return 'red'
    case 'on_process':
      return 'green'
    case 'completed':
      return 'blue'
    case 'cancelled':
      return 'orange'
    default:
      return 'default'
  }
}

// Получение текста статуса
const getStatusText = (status: string): string => {
  if (!status) return $t('l_Not_specified')
  switch (status.toLowerCase()) {
    case 'new':
      return $t('l_New')
    case 'on_process':
      return $t('l_In_process')
    case 'completed':
      return $t('l_Completed')
    case 'cancelled':
      return $t('l_Cancelled')
    default:
      return status
  }
}

// Получение цвета пола
const getGenderColor = (gender: string): string => {
  if (!gender) return 'default'
  switch (gender) {
    case 'male':
      return 'blue'
    case 'female':
      return 'pink'
    default:
      return 'default'
  }
}

// Получение текста пола
const getGenderText = (gender: string): string => {
  switch (gender) {
    case 'male':
      return $t('l_Male')
    case 'female':
      return $t('l_Female')
    case 'not_specified':
      return $t('l_Not_specified_m')
    default:
      return $t('l_Not_specified_m')
  }
}

// Следим за изменением props
watch(
  () => [props.open, props.appealId],
  ([isOpen, id]) => {
    if (isOpen && id && typeof id === 'string') {
      fetchAppealDetail(id)
    }
  },
  { immediate: true }
)

// Слушатель изменения размера окна для адаптивности drawer
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

// Добавляем и удаляем слушатель события resize
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.appeal-detail {
  padding: 0;
}

.appeal-detail :deep(.ant-descriptions-title) {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
  margin-top: 8px;
  padding-top: 8px;
}

.appeal-detail :deep(.ant-descriptions-item-label) {
  font-weight: 500;
  background-color: #fafafa;
}

.appeal-detail :deep(.ant-descriptions-bordered .ant-descriptions-item-label) {
  background-color: #fafafa;
  border-right: 1px solid #f0f0f0;
}
</style>