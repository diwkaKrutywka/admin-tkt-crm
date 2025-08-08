<template>
  <a-drawer
    v-model:open="modalVisible"
    :title="$t('l_Ticket_details')"
    :width="drawerWidth"
    :footer="null"
  >
    <a-spin :spinning="loading">

      <!-- 1. Основная информация -->
      <a-descriptions
       
        bordered
        size="small"
        :column="1"
      >
        <a-descriptions-item :label="$t('l_Title')">
          {{ ticketData?.title || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Status')">
         <a-tag color="green"> {{ ticketData?.status?.name || "-" }}</a-tag>
        </a-descriptions-item>
        <!-- <a-descriptions-item :label="$t('l_Created_at')">
          {{ ticketData?.appeal?.date ? $formatIsoDate(ticketData.appeal.date) : "-" }}
        </a-descriptions-item> -->
        <a-descriptions-item :label="$t('l_Description')" :span="2">
          {{ ticketData?.description || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Created_at')">
          {{ ticketData?.created_at ? $formatIsoDate(ticketData.created_at) : "-" }}
        </a-descriptions-item>
        <!-- <a-descriptions-item :label="$t('l_Updated_at')">
          {{ ticketData?.updated_at ? $formatIsoDate(ticketData.updated_at) : "-" }}
        </a-descriptions-item>
    -->
        <a-descriptions-item :label="$t('l_Initiator')">
          {{ ticketData?.initiator?.full_name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Manager')">
          {{ ticketData?.assignee?.full_name || "-" }}
        </a-descriptions-item>
     
       
        <!-- <a-descriptions-item :label="$t('l_Appeal_status')">
          {{ ticketData?.appeal?.status || "-" }}
        </a-descriptions-item> -->
        <a-descriptions-item :label="$t('l_City')">
          {{ ticketData?.appeal?.city?.name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_District')">
          {{ ticketData?.appeal?.district?.name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Organization')" :span="2">
          {{ ticketData?.appeal?.healthcare_facility?.name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Call_type')">
          {{ ticketData?.appeal?.call_type?.name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Call_subtype')">
          {{ ticketData?.appeal?.call_sub_type?.name || "-" }}
        </a-descriptions-item>
      </a-descriptions>


      <div class="my-4 font-bold text-lg">{{ $t('l_Contact_info') }}</div>
      <!-- 4. Данные клиента -->
      <a-descriptions
      
        bordered
        size="small"
        :column="1"
        class="my-4"
      >
        <a-descriptions-item :label="$t('l_Client')">
          {{ ticketData?.appeal?.contact?.full_name || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Phone')">
          <a-tag color="blue">{{ ticketData?.appeal?.contact?.called_by || "-" }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_IIN')">
          {{ ticketData?.appeal?.contact?.iin || "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Birth_date')">
          {{ ticketData?.appeal?.contact?.birth_date ? $formatIsoDate(ticketData.appeal.contact.birth_date) : "-" }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('l_Gender')">
          <a-tag
            v-if="ticketData?.appeal?.contact?.gender === 'male'"
            color="blue"
          >
            {{ t("l_Male") }}
          </a-tag>
          <a-tag
            v-else-if="ticketData?.appeal?.contact?.gender === 'female'"
            color="pink"
          >
            {{ t("l_Female") }}
          </a-tag>
          <a-tag v-else color="gray">
            {{ t("l_Other") }}
          </a-tag>
        </a-descriptions-item>
      </a-descriptions>

    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { TicketApi } from "../../api/ticket";
import { useGlobal } from "../../composables/useGlobal";

const props = defineProps<{
  open: boolean;
  ticketId: string | null;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const { t } = useI18n();
const { $formatIsoDate } = useGlobal();

const modalVisible = ref(false);
const ticketData = ref<any>(null);
const loading = ref(false);
// Реактивная ширина экрана
const screenWidth = ref(window.innerWidth);

// Адаптивная ширина drawer в зависимости от размера экрана
const drawerWidth = computed(() => {
  const width = screenWidth.value;
  if (width < 576) return "100%"; // xs - мобильные устройства
  if (width < 768) return "90%"; // sm - планшеты
  if (width < 992) return "70%"; // md - маленькие экраны
  if (width < 1200) return "50%"; // lg - средние экраны
  return "40%"; // xl - большие экраны
});
// Следим за пропсом open
watch(
  () => props.open,
  (val) => {
    modalVisible.value = val;
    if (val && props.ticketId) {
      fetchTicketDetail(props.ticketId);
    }
  }
);

// Двусторонняя привязка для v-model:open
watch(modalVisible, (val) => {
  emit("update:open", val);
});

// Получение данных тикета
const fetchTicketDetail = async (id: string) => {
  loading.value = true;
  try {
    const { data } = await TicketApi(`${id}`, {}, "GET");
    ticketData.value = data.ticket_content; // берём ticket_content
    console.log(ticketData);
  } catch (err) {
    console.error("Ошибка загрузки тикета", err);
  } finally {
    loading.value = false;
  }
};
</script>
