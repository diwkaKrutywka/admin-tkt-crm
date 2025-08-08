<template>
  <a-modal
    :title="isEdit ? $t('l_Edit_street') : $t('l_Add_street')"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirm-loading="loading"
    destroy-on-close
    width="600px"
  >
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

      <a-form-item :label="$t('l_City')" name="city_id">
        <a-select
          v-model:value="form.city_id"
          :options="cityOptions"
          :loading="citiesLoading"
          show-search
          option-filter-prop="label"
          @focus="loadCities"
        />
      </a-form-item>

      <a-form-item :label="$t('l_Districts')" name="district_ids">
        <a-select
          mode="multiple"
          v-model:value="form.district_ids"
          :options="districtOptions"
          :loading="districtsLoading"
          show-search
          option-filter-prop="label"
          @focus="loadDistricts"
        />
      </a-form-item>

      <a-form-item :label="$t('l_Street_type')" name="street_type">
        <a-select
          v-model:value="form.street_type"
          :options="streetTypeOptions"
          show-search
          option-filter-prop="label"
          :placeholder="$t('l_Street_type')"
        />
      </a-form-item>

      <a-form-item :label="$t('l_Street_code')" name="street_code">
        <a-input v-model:value="form.street_code" />
      </a-form-item>

      <a-form-item :label="$t('l_Description')" name="description">
        <a-textarea v-model:value="form.description" :rows="3" />
      </a-form-item>

      <a-form-item :label="$t('l_Display_order')" name="display_order">
        <a-input-number
          v-model:value="form.display_order"
          :min="0"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import {
  createStreet,
  updateStreet,
  getStreetById,
  getCities,
  getDistricts,
} from "../../../api/ref";
import type { Street } from "../../../types/ref";

const { t: $t } = useI18n();

interface Props {
  visible: boolean;
  street_id?: string | null;
}
const props = defineProps<Props>();
const emit = defineEmits(["update:visible", "submit"]);

const isEdit = ref(false);
const loading = ref(false);
const streetTypeOptions = [
  { label: "Street", value: "street" },
  { label: "Avenue", value: "avenue" },
  { label: "Boulevard", value: "boulevard" },
  { label: "Lane", value: "lane" },
  { label: "Square", value: "square" },
  { label: "Road", value: "road" },
  { label: "Drive", value: "drive" },
];

const formRef = ref();
const form = ref({
  name_kk: "",
  name_ru: "",
  name_en: "",
  city_id: null as string | null,
  district_ids: [] as string[],
  street_type: "",
  street_code: "",
  description: "",
  display_order: 0,
  is_custom: true,
});

const cityOptions = ref<{ label: string; value: string }[]>([]);
const districtOptions = ref<{ label: string; value: string }[]>([]);
const citiesLoading = ref(false);
const districtsLoading = ref(false);

const rules = {
  name_kk: [{ required: true, message: "Введите название на казахском" }],
  name_ru: [{ required: true, message: "Введите название на русском" }],
  name_en: [{ required: true, message: "Введите название на английском" }],
  city_id: [{ required: true, message: "Выберите город" }],
  district_ids: [{ required: true, message: "Выберите район(ы)" }],
  street_type: [{ required: true, message: "Введите тип улицы" }],
  street_code: [{ required: true, message: "Введите код улицы" }],
};

const loadCities = async () => {
  try {
    citiesLoading.value = true;
    const { data } = await getCities({ page: 1, page_size: 100 });
    cityOptions.value = data.items.map((c: any) => ({
      label: c.name,
      value: c.id,
    }));
  } catch {
    message.error("Ошибка при загрузке городов");
  } finally {
    citiesLoading.value = false;
  }
};

const loadDistricts = async () => {
  try {
    districtsLoading.value = true;
    const { data } = await getDistricts({ page: 1, page_size: 100 });
    districtOptions.value = data.items.map((d: any) => ({
      label: d.name,
      value: d.id,
    }));
  } catch {
    message.error("Ошибка при загрузке районов");
  } finally {
    districtsLoading.value = false;
  }
};

const loadStreet = async (id: string) => {
  try {
    loading.value = true;
    const res = await getStreetById(id);
    const s = (res as any).data as Street;
    form.value = {
      name_kk: s.name_kk ?? "",
      name_ru: s.name_ru ?? "",
      name_en: s.name_en ?? "",
      city_id: s.city_id ?? null,
      district_ids: s.district_ids ?? [],
      street_type: s.street_type ?? "",
      street_code: s.street_code ?? "",
      description: s.description ?? "",
      display_order: s.display_order ?? 0,
      is_custom: s.is_custom ?? true,
    };
  } catch {
    message.error("Ошибка при загрузке данных улицы");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    name_kk: "",
    name_ru: "",
    name_en: "",
    city_id: null,
    district_ids: [],
    street_type: "",
    street_code: "",
    description: "",
    display_order: 0,
    is_custom: true,
  };
};

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      resetForm();
      isEdit.value = !!props.street_id;
      await Promise.all([loadCities(), loadDistricts()]);
      if (props.street_id) await loadStreet(props.street_id);
    }
  },
  { immediate: true }
);

const handleOk = async () => {
  await formRef.value?.validate();
  loading.value = true;
  try {
    const buildPayload = (): Partial<Street> => {
      const { city_id, ...rest } = form.value as any;
      const payload: any = { ...rest };
      if (city_id != null) payload.city_id = city_id;
      return payload as Partial<Street>;
    };
    if (isEdit.value && props.street_id) {
      await updateStreet(props.street_id, buildPayload());
      message.success($t("l_Updated_successfully"));
    } else {
      await createStreet(buildPayload());
      message.success($t("l_Added_successfully"));
    }
    emit("submit");
    emit("update:visible", false);
  } catch {
    message.error($t("l_Save_error") || "Ошибка при сохранении");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emit("update:visible", false);
};
</script>
