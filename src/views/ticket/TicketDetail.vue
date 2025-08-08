<template>
  <a-drawer
    v-model:open="modalVisible"
    :title="$t('l_Ticket_detail')"
    width="700px"
    :footer="null"
  >
    <a-spin :spinning="loading">
     
        <a-descriptions bordered column="1" size="small" layout="horizontal">
          <!-- Основная информация -->
          <a-descriptions-item :label="$t('l_Title')">
            {{ ticketData?.title || "-" }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('l_Status')">
            {{ ticketData?.status?.name || "-" }}
          </a-descriptions-item>

          <a-descriptions-item :label="$t('l_Description')" :span="2">
            {{ ticketData?.description || "-" }}
          </a-descriptions-item>

          <a-descriptions-item :label="$t('l_Initiator')">
            {{ ticketData?.initiator?.full_name || "-" }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('l_Manager')">
            {{ ticketData?.assignee?.full_name || "-" }}
          </a-descriptions-item>

          <a-descriptions-item :label="$t('l_Created_at')">
            {{
              ticketData?.created_at
                ? $formatIsoDate(ticketData.created_at)
                : "-"
            }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('l_Updated_at')">
            {{
              ticketData?.updated_at
                ? $formatIsoDate(ticketData.updated_at)
                : "-"
            }}
          </a-descriptions-item>

          <!-- Информация об обращении -->
          <a-descriptions-item :label="$t('l_Appeal_date')">
            {{
              ticketData?.appeal?.date
                ? $formatIsoDate(ticketData.appeal.date)
                : "-"
            }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('l_Appeal_status')">
            {{ ticketData?.appeal?.status || "-" }}
          </a-descriptions-item>

          <a-descriptions-item :label="$t('l_City')">
            {{ ticketData?.appeal?.city?.name || "-" }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('l_District')">
            {{ ticketData?.appeal?.district?.name || "-" }}
          </a-descriptions-item>

          <a-descriptions-item :label="$t('l_Healthcare_facility')" :span="2">
            {{ ticketData?.appeal?.healthcare_facility?.name || "-" }}
          </a-descriptions-item>

          <!-- Тип обращения -->
          <a-descriptions-item :label="$t('l_Call_type')">
            {{ ticketData?.appeal?.call_type?.name || "-" }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('l_Call_sub_type')">
            {{ ticketData?.appeal?.call_sub_type?.name || "-" }}
          </a-descriptions-item>

          <!-- Контактная информация -->
          <a-descriptions-item :label="$t('l_Contact_name')">
            {{ ticketData?.appeal?.contact?.full_name || "-" }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('l_Phone')">
            {{ ticketData?.appeal?.contact?.called_by || "-" }}
          </a-descriptions-item>

          <a-descriptions-item :label="$t('l_IIN')">
            {{ ticketData?.appeal?.contact?.iin || "-" }}
          </a-descriptions-item>
          <a-descriptions-item :label="$t('l_Birth_date')">
            {{
              ticketData?.appeal?.contact?.birth_date
                ? $formatIsoDate(ticketData.appeal.contact.birth_date)
                : "-"
            }}
          </a-descriptions-item>

          <a-descriptions-item :label="$t('l_Gender')">
            {{ ticketData?.appeal?.contact?.gender || "-" }}
          </a-descriptions-item>
        </a-descriptions>
    
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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
    console.log(ticketData)
  } catch (err) {
    console.error("Ошибка загрузки тикета", err);
  } finally {
    loading.value = false;
  }
};
</script>
