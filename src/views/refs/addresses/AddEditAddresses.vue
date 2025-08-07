<template>
    <a-modal
      :open="open"
      :title="address_id ? $t('l_Edit_address') : $t('l_Add_address')"
      @ok="handleSubmit"
      @cancel="handleCancel"
      :confirm-loading="loading"
      :destroyOnClose="true"
      width="600px"
      class="bg-[#F3F6F8]"
    >
      <a-form :model="form" layout="vertical">
        <a-form-item :label="$t('l_Region')" name="region_id" required>
          <a-select
            v-model:value="form.region_id"
            :options="regions"
            :field-names="{ label: 'name', value: 'id' }"
            @change="onRegionChange"
          />
        </a-form-item>
  
        <a-form-item :label="$t('l_City')" name="city_id" required>
          <a-select
            v-model:value="form.city_id"
            :options="cities"
            :field-names="{ label: 'name', value: 'id' }"
            @change="onCityChange"
          />
        </a-form-item>
  
        <a-form-item :label="$t('l_District')" name="district_id" required>
          <a-select
            v-model:value="form.district_id"
            :options="districts"
            :field-names="{ label: 'name', value: 'id' }"
          />
        </a-form-item>
  
        <a-form-item :label="$t('l_Street')" name="street_id" required>
          <a-select
            v-model:value="form.street_id"
            :options="streets"
            :field-names="{ label: 'name_ru', value: 'id' }"
          />
        </a-form-item>
  
        <a-form-item :label="$t('l_House_number')" name="house_number" required>
          <a-input v-model:value="form.house_number" />
        </a-form-item>
  
        <a-form-item :label="$t('l_Block')" name="block">
          <a-input v-model:value="form.block" />
        </a-form-item>
  
        <a-form-item :label="$t('l_Apartment_number')" name="apartment_number">
          <a-input-number v-model:value="form.apartment_number" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { message } from 'ant-design-vue'
  import { useI18n } from 'vue-i18n'
  
  import {
    getRegions,
    getCities,
    getDistricts,
    getStreets,
    createAddress,
    updateAddress,
    getAddressById,
  } from '../../../api/ref'
  
  const props = defineProps<{
    open: boolean
    address_id: string | null
  }>()
  
  const emit = defineEmits(['update:open', 'submit'])
  
  const { t: $t } = useI18n()
  
  const loading = ref(false)
  
  const form = ref({
    region_id: '',
    city_id: '',
    district_id: '',
    street_id: '',
    house_number: '',
    block: '',
    apartment_number: null,
  })
  
  const regions = ref<any[]>([])
  const cities = ref<any[]>([])
  const districts = ref<any[]>([])
  const streets = ref<any[]>([])
  
  const resetForm = () => {
    form.value = {
      region_id: '',
      city_id: '',
      district_id: '',
      street_id: '',
      house_number: '',
      block: '',
      apartment_number: null,
    }
  }
  
  const fetchRegions = async () => {
    const { data } = await getRegions()
    regions.value = data.items || []
  }
  
  const fetchCities = async (region_id?: string) => {
    const { data } = await getCities(region_id ? { region_id } : {})
    cities.value = data.items || []
  }
  
  const fetchDistricts = async (city_id?: string) => {
    const { data } = await getDistricts(city_id ? { city_id } : {})
    districts.value = data.items || []
  }
  
  const fetchStreets = async () => {
    const { data } = await getStreets() // реализуй getStreets в API, если нет
    streets.value = data.items || []
  }
  
  const onRegionChange = async () => {
    form.value.city_id = ''
    form.value.district_id = ''
    cities.value = []
    districts.value = []
    await fetchCities(form.value.region_id)
  }
  
  const onCityChange = async () => {
    form.value.district_id = ''
    districts.value = []
    await fetchDistricts(form.value.city_id)
  }
  
  watch(
    () => props.open,
    async (val) => {
      if (val) {
        await fetchRegions()
        await fetchStreets()
  
        if (props.address_id) {
          loading.value = true
          try {
            const { data } = await getAddressById(props.address_id)
            form.value = {
              region_id: data.region_id ?? '',
              city_id: data.city_id ?? '',
              district_id: data.district_id ?? '',
              street_id: data.street_id ?? '',
              house_number: data.house_number ?? '',
              block: data.block ?? '',
              apartment_number: data.apartment_number ?? null,
            }
            await fetchCities(data.region_id)
            await fetchDistricts(data.city_id)
          } catch (error) {
            message.error($t('l_Load_error') || 'Load error')
          } finally {
            loading.value = false
          }
        } else {
          resetForm()
        }
      }
    }
  )
  
  const handleSubmit = async () => {
    loading.value = true
    try {
      if (props.address_id) {
        await updateAddress(props.address_id, form.value)
        message.success($t('l_Updated_successfully') || 'Updated successfully')
      } else {
        await createAddress(form.value)
        message.success($t('l_Added_successfully') || 'Added successfully')
      }
      emit('update:open', false)
      emit('submit')
    } catch (error) {
      message.error($t('l_Save_error') || 'Save error')
    } finally {
      loading.value = false
    }
  }
  
  const handleCancel = () => {
    emit('update:open', false)
    resetForm()
  }
  </script>
  