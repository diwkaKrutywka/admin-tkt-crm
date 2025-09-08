<template>
    <div>
        <a-modal :open="true" :title="isEdit ? 'Update Appeal' : 'Add Contact'" @ok="handleOk"
            :confirm-loading="loading" @cancel="handleCancel" destroyOnClose>
            <a-form :model="form" ref="formRef" layout="vertical">
                <a-form-item label="Reason" name="reason">
                    <a-textarea v-model:value="form.reason" />
                </a-form-item>
                <!-- <a-form-item label="Call Type" name="call_type_id">
                    <a-select v-model:value="form.call_type_id" :options="callTypeOptions"
                        placeholder="Выберите тип звонка" :loading="callTypeLoading" show-search
                        option-filter-prop="label" />
                </a-form-item> -->

                <a-form-item label="Full Name" name="full_name">
                    <a-input v-model:value="form.full_name" />
                </a-form-item>
                <a-form-item label="IIN" name="iin">
                    <a-input v-model:value="form.iin" />
                </a-form-item>

                <a-form-item label="Gender" name="gender">
                    <a-select v-model:value="form.gender" :options="genderOptions" />
                </a-form-item>

                <a-form-item label="Address" name="home_address">
                    <a-input v-model:value="form.home_address" />
                </a-form-item>
                <a-form-item v-if="cities.length" label="City" name="city">
                    <a-select v-model:value="form.city_id" :options="citiesOptions" />
                </a-form-item>
                <a-form-item v-if="districts.length" label="District" name="district">
                    <a-select v-model:value="form.district_id" :options="districtsOptions" />
                </a-form-item>
                <a-form-item v-if="healthcare_facility.length" label="Healthcare Facility" name="HCF">
                    <a-select v-model:value="form.healthcare_facility_id" :options="healthcareFacilityOptions" />
                </a-form-item>
                <a-form-item label="Birth Date" name="birth_date">
                    <a-date-picker v-model:value="form.birth_date" class="w-full" />
                </a-form-item>
                <a-form-item label="Call type" name="Calltype">
                    <a-select v-model:value="form.call_type_id" :options="callTypeOptions" />
                </a-form-item>
                <a-form-item v-if="callSubTypes.length" label="Call Subtype" name="CallSubtype">
                    <a-select v-model:value="form.call_subtype_id" :options="callSubTypeOptions" />
                </a-form-item>
                <a-form-item v-if="complaintCategories.length" label="Appeal category" name="complaintCategories">
                    <a-select v-model:value="form.appeal_category_id" :options="complaintCategoriesOptions" />
                </a-form-item>
                <a-form-item v-if="complaintSubcategories.length" label="Appeal subcategory" name="name">
                    <a-select v-model:value="form.appeal_sub_category_id" :options="complaintSubcategoriesOptions" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>

</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { AppealApi } from "../../api/appeal";
import { getCallTypes, getCallSubtypes, getComplaintCategories, getComplaintSubcategories, getCities, getDistricts, getOrganizations } from "../../api/ref"
import type { CallType, CallSubtype, ComplaintCategory, ComplaintSubcategory, City, District, Organization } from '../../types/ref'


import { useRoute } from "vue-router";
import { useUserStore } from '../../store/index'
import { getAppealBpGiid } from '../../api/brightPattern'
const userStore = useUserStore()

const route = reactive(useRoute())



const props = defineProps<{
    open: true;
    id?: string;
}>();

const isEdit = computed(() => !!props.id);

const cities = ref<City[]>([])
const districts = ref<District[]>([])
const callTypes = ref<CallType[]>([])
const callSubTypes = ref<CallSubtype[]>([])
const complaintCategories = ref<ComplaintCategory[]>([])
const complaintSubcategories = ref<ComplaintSubcategory[]>([])
const healthcare_facility = ref<Organization[]>([])




const callTypeOptions = computed(() => {
    return callTypes.value?.map(item => ({
        label: item.name,
        value: item.id
    })) || [];
});

const callSubTypeOptions = computed(() => {
    return callSubTypes.value?.map(item => ({
        label: item.name,
        value: item.id
    })) || [];
});


const complaintCategoriesOptions = computed(() => {
    return complaintCategories.value?.map(item => ({
        label: item.name,
        value: item.id
    })) || [];
});

const complaintSubcategoriesOptions = computed(() => {
    return complaintSubcategories.value?.map(item => ({
        label: item.name,
        value: item.id
    })) || [];
});

const citiesOptions = computed(() => {
    return cities.value?.map(item => ({
        label: item.name,
        value: item.id
    })) || [];
});

const districtsOptions = computed(() => {
    return districts.value?.map(item => ({
        label: item.name,
        value: item.id
    })) || [];
});

const healthcareFacilityOptions = computed(() => {
    return healthcare_facility.value?.map(item => ({
        label: item.full_name,
        value: item.id
    })) || [];
});


const callTypeLoading = ref(false);

const form = reactive({
    // Contact info
    full_name: "",
    birth_date: '',
    iin: "",
    gender: "not_specified",
    home_address: "",
    // Call info  
    reason: "",
    call_type_id: "",
    call_subtype_id: "",
    appeal_category_id: "", // TODO: if call_type.code == "CT_8"
    appeal_sub_category_id: "",
    // Organization info (not required if call_type.code != "CT_8" or != "CT_4")
    city_id: "",
    district_id: "",
    healthcare_facility_id: "",
});
const appealId = ref('')
const genderOptions = [
    { label: "Мужчина", value: "male" },
    { label: "Женщина", value: "female" },
    { label: "Не указано", value: "not_specified" },
];

const formRef = ref<FormInstance>();
const loading = ref(false);

watch(() => form.call_type_id, async () => {
    const params = {
        include_inactive: true,
        call_type_id: form.call_type_id
    }
    const { data } = await getCallSubtypes(params)
    callSubTypes.value = data.items


    const target = callTypes.value.find(
        (item) => item.id === form.call_type_id && item.code === 'CT_8'
    )

    if (target) {
        const complaintRes = await getComplaintCategories()
        complaintCategories.value = complaintRes.data.items
    }
    else {
        complaintCategories.value = []
        form.appeal_category_id = ''
        complaintSubcategories.value = []
        form.appeal_sub_category_id = ''
    }


})


watch(
    () => form.appeal_category_id,
    async (newVal) => {
        if (!newVal) return // если пусто/null/undefined → ничего не делаем

        const subComplaintRes = await getComplaintSubcategories({})
        complaintSubcategories.value = subComplaintRes.data.items
    }
)


const handleOk = async () => {
    form.birth_date = dayjs(form.birth_date).format('YYYY-MM-DD');
    try {
        console.log(appealId.value, 'asdasdas');

        await AppealApi(`${appealId.value}`, form, "PATCH");

        alert('Обращение заполнено')
    } catch (err) {
        message.error("Не удалось загрузить Call Types");
    } finally {
        callTypeLoading.value = false;
    }
};

const handleCancel = async () => {

};
onMounted(async () => {
    const { data } = await getCallTypes()
    callTypes.value = data.items

    const citiesData = await getCities()
    cities.value = citiesData.data.items

    const districtsData = await getDistricts()
    districts.value = districtsData.data.items

    const organizationData = await getOrganizations()
    healthcare_facility.value = organizationData.data.items

    if (!userStore.accessToken) {
        userStore.getUserInfo()
    }

    try {
        const res = await getAppealBpGiid({
            bp_giid: route.query.bp_giid as string

        });
        const resItem = res.data.items[0]
        form.reason = resItem.reason as string
        form.full_name = resItem.contact.full_name
        form.birth_date = resItem.contact.birth_date
            ? dayjs(resItem.contact.birth_date).format('YYYY-MM-DD')
            : '';

        form.iin = resItem.contact.iin as string
        form.gender = resItem.contact.gender
        form.home_address = resItem.contact.home_address as string
        appealId.value = resItem.id
    } catch (err) {
        message.error("Не удалось загрузить Call Types");
    } finally {
        callTypeLoading.value = false;
    }

})
</script>
