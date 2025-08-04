<template>
    <a-modal
      v-model:open="visible"
      :title="$t('l_Filter_appeals')"
      @ok="handleOk"
      :confirm-loading="loading"
      @cancel="handleCancel"
      destroyOnClose
      width="700px"
      :getContainer="false"
      :wrapClassName="'filter-modal-wrapper'"
    >
      <a-form :model="form" layout="vertical">
        <!-- Status -->
        <a-form-item :label="$t('l_Status')" name="status_in">
          <a-select 
            v-model:value="form.status_in" 
            :placeholder="$t('l_Select_status')"
            allow-clear
          >
            <a-select-option value="new">{{ $t('l_New') }}</a-select-option>
            <a-select-option value="in_progress">{{ $t('l_In_progress') }}</a-select-option>
            <a-select-option value="transferred">{{ $t('l_Transferred') }}</a-select-option>
            <a-select-option value="completed">{{ $t('l_Completed') }}</a-select-option>
            <a-select-option value="closed">{{ $t('l_Closed') }}</a-select-option>
          </a-select>
        </a-form-item>

        <!-- City ID -->
        <a-form-item :label="$t('l_City_id')" name="city_id_in">
          <a-select 
            v-model:value="form.city_id_in" 
            :placeholder="$t('l_Select_city')"
            allow-clear
          >
            
          </a-select>
        </a-form-item>

        <!-- District ID -->
        <a-form-item :label="$t('l_District_id')" name="district_id_in">
          <a-select 
            v-model:value="form.district_id_in" 
            :placeholder="$t('l_Select_district')"
            allow-clear
          >
            
          </a-select>
        </a-form-item>

        <!-- Healthcare Facility ID -->
        <a-form-item :label="$t('l_Healthcare_facility_id')" name="healthcare_facility_id_in">
          <a-select 
            v-model:value="form.healthcare_facility_id_in" 
            :placeholder="$t('l_Select_healthcare_facility')"
            allow-clear
          >
            
          </a-select>
        </a-form-item>

        <!-- Даты в одной строке на больших экранах -->
        <a-row :gutter="[8, 8]">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item :label="$t('l_Created_date_from')" name="date_gte">
              <a-date-picker
                v-model:value="form.date_gte"
                :placeholder="$t('l_From')"
                format="DD.MM.YYYY"
                allow-clear
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item :label="$t('l_Created_date_to')" name="date_lte">
              <a-date-picker
                v-model:value="form.date_lte"
                :placeholder="$t('l_To')"
                format="DD.MM.YYYY"
                allow-clear
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template #footer>
        <a-space>
          <a-button @click="handleReset">
            {{ $t('l_Reset_filter') }}
          </a-button>
          <a-button @click="handleCancel">
            {{ $t('l_Cancel') }}
          </a-button>
          <a-button type="primary" @click="handleOk" :loading="loading">
            {{ $t('l_Apply_filter') }}
          </a-button>
        </a-space>
      </template>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { message } from 'ant-design-vue'
  import { useI18n } from 'vue-i18n'
  
  const { t: $t } = useI18n()
  
  interface FilterForm {
    status_in: string
    city_id_in: string
    district_id_in: string
    healthcare_facility_id_in: string
    date_gte: any
    date_lte: any
  }
  
  const props = defineProps<{
    open: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'update:open', val: boolean): void
    (e: 'filter', payload: FilterForm): void
  }>()
  
  const visible = computed({
    get: () => props.open,
    set: (val: boolean) => emit('update:open', val),
  })
  
  const loading = ref(false)
  
  const form = reactive<FilterForm>({
    status_in: '',
    city_id_in: '',
    district_id_in: '',
    healthcare_facility_id_in: '',
    date_gte: null,
    date_lte: null,
  })
  
  // Сброс формы при открытии модального окна
  watch(
    () => props.open,
    (val) => {
      if (val) {
        resetForm()
      }
    }
  )
  
  const resetForm = () => {
    form.status_in = ''
    form.city_id_in = ''
    form.district_id_in = ''
    form.healthcare_facility_id_in = ''
    form.date_gte = null
    form.date_lte = null
  }
  
  const handleOk = async () => {
    loading.value = true
    
    try {
      // Проверяем, что хотя бы одно поле заполнено
      const hasFilters = form.status_in || form.city_id_in || form.district_id_in || 
                        form.healthcare_facility_id_in || form.date_gte || form.date_lte
      
      if (!hasFilters) {
        message.warning($t('l_Choose_filter_criteria'))
        return
      }

      // Подготавливаем данные для отправки
      const filterData = { ...form }
      
      // Конвертируем даты в нужный формат если они есть
      if (form.date_gte) {
        filterData.date_gte = form.date_gte.format('YYYY-MM-DD')
      }
      if (form.date_lte) {
        filterData.date_lte = form.date_lte.format('YYYY-MM-DD')
      }

      // Эмитим событие с данными фильтра
      emit('filter', filterData)
      
      message.success($t('l_Filter_applied'))
      visible.value = false
    } catch (error) {
      message.error('Ошибка при применении фильтра')
    } finally {
      loading.value = false
    }
  }
  
  const handleCancel = () => {
    visible.value = false
  }
  
  const handleReset = () => {
    resetForm()
    message.info($t('l_Filter_reset'))
  }
  
  // Позиционирование модального окна под кнопкой фильтра
  onMounted(() => {
    // Добавляем стили для позиционирования модального окна
    const style = document.createElement('style')
    style.textContent = `
      .filter-modal-wrapper .ant-modal {
        position: absolute !important;
        top: 190px !important;
        right: 60px !important;
        left: auto !important;
        transform: none !important;
        margin: 0 !important;
        z-index: 1000 !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
      }
      .filter-modal-wrapper .ant-modal-mask {
        position: fixed !important;
      }
    `
    document.head.appendChild(style)
  })
  </script>
  