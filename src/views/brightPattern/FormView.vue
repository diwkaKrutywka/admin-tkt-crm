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

                <a-form-item label="Birth Date" name="birth_date">
                    <a-date-picker v-model:value="form.birth_date" class="w-full" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>

</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { AppealApi } from "../../api/appeal";


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



const callTypeLoading = ref(false);


const form = reactive({
    reason: "",
    full_name: "",
    birth_date: '',
    iin: "",
    gender: "not_specified",
    // call_type_id: "",
    home_address: "",
});
const appealId = ref('')
const genderOptions = [
    { label: "Мужчина", value: "male" },
    { label: "Женщина", value: "female" },
    { label: "Не указано", value: "not_specified" },
];

const formRef = ref<FormInstance>();
const loading = ref(false);

const handleOk = async () => {
    form.birth_date = dayjs(form.birth_date).format('YYYY-MM-DD');
    try {
        console.log(appealId.value,'asdasdas');

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
