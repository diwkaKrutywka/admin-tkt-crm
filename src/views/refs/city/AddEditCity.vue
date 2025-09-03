<template>
  <a-modal :title="isEdit ? $t('l_Edit_city') : $t('l_Add_city')" :visible="visible" @ok="handleOk"
    @cancel="handleCancel" :confirm-loading="loading" destroy-on-close width="600px">
    <a-form layout="vertical" :model="form" :rules="rules" ref="formRef">
      <a-form-item :label="$t('l_Name_kz')" name="name_kk">
        <a-input v-model:value="form.name_kk" />
      </a-form-item>

      <a-form-item :label="$t('l_Name_ru')" name="name_ru">
        <a-input v-model:value="form.name_ru" />
      </a-form-item>

      <a-form-item :label="$t('l_Name_en')" name="name_en">
        <a-input v-model:value="form.name_en" />
      </a-form-item>

      <a-form-item :label="$t('l_Region')" name="region_id">
        <a-select v-model:value="form.region_id" :options="regionOptions" :loading="regionsLoading" show-search
          option-filter-prop="label" @focus="loadRegions" />
      </a-form-item>

      <a-form-item :label="$t('l_City_code')" name="city_code">
        <a-input v-model:value="form.city_code" />
      </a-form-item>

      <a-form-item :label="$t('l_City_type')" name="city_type">
        <a-select v-model:value="form.city_type">
          <a-select-option value="city">City</a-select-option>
          <a-select-option value="town">Town</a-select-option>
          <a-select-option value="village">Village</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-row :gutter="[20, 0]" align="middle">
          <a-col>
            <a-form-item :label="$t('l_Regional_center')" name="is_regional_center" :colon="false"
              style="margin-bottom: 0">
              <a-switch v-model:checked="form.is_regional_center" />
            </a-form-item>
          </a-col>

          <a-col>
            <a-form-item :label="$t('l_District_center')" name="is_district_center" :colon="false"
              style="margin-bottom: 0">
              <a-switch v-model:checked="form.is_district_center" />
            </a-form-item>
          </a-col>


        </a-row>
      </a-form-item>

      <a-form-item :label="$t('l_Postal_code')" name="postal_code">
        <a-input v-model:value="form.postal_code" />
      </a-form-item>

      <a-form-item :label="$t('l_Display_order')" name="display_order">
        <a-input-number v-model:value="form.display_order" :min="0" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import {
  createCity,
  updateCity,
  getCityById,
  getRegions,
} from "../../../api/ref";

interface Props {
  visible: boolean;
  cityId?: string | null;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "success"]);

const isEdit = ref(false);
const loading = ref(false);
const regionsLoading = ref(false);

const formRef = ref();

const form = ref({
  name_kk: "",
  name_ru: "",
  name_en: "",
  region_id: undefined as string | undefined,
  city_code: "",
  city_type: "city",
  is_regional_center: false,
  is_district_center: false,
  postal_code: "",
  display_order: 0,
});

const regionOptions = ref<{ label: string; value: string }[]>([]);

const rules = {
  name_kk: [{ required: true, message: "Введите название на казахском" }],
  name_ru: [{ required: true, message: "Введите название на русском" }],
  name_en: [{ required: true, message: "Введите название на английском" }],
  region_id: [{ required: true, message: "Выберите регион" }],
  city_code: [{ required: true, message: "Введите код города" }],
  city_type: [{ required: true, message: "Выберите тип города" }],
};

const loadRegions = async () => {
  try {
    regionsLoading.value = true;
    const { data } = await getRegions({

      page: 1,
      page_size: 100,
    });
    regionOptions.value = data.items.map((r: any) => ({
      label: r.name,
      value: r.id,
    }));
  } catch {
    message.error("Ошибка при загрузке регионов");
  } finally {
    regionsLoading.value = false;
  }
};

const loadCity = async (id: string) => {
  try {
    loading.value = true;
    const res = await getCityById(id);
    Object.assign(form.value, res);
  } catch (e) {
    message.error("Ошибка при загрузке города");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    name_kk: "",
    name_ru: "",
    name_en: "",
    region_id: '',
    city_code: "",
    city_type: "city",
    is_regional_center: false,
    is_district_center: false,
    postal_code: "",
    display_order: 0,

  };
};

watch(
  () => props.visible,
  (val) => {
    if (val) {
      resetForm();
      isEdit.value = !!props.cityId;
      loadRegions();
      if (props.cityId) loadCity(props.cityId);
    }
  },
  { immediate: true }
);

const handleOk = async () => {
  await formRef.value?.validate();
  loading.value = true;
  try {
    if (isEdit.value && props.cityId) {
      await updateCity(props.cityId, form.value);
      message.success("Город обновлен успешно");
    } else {
      await createCity(form.value);
      message.success("Город добавлен успешно");
    }
    emit("success");
    emit("update:visible", false);
  } catch (e) {
    message.error("Ошибка при сохранении");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emit("update:visible", false);
};
</script>
