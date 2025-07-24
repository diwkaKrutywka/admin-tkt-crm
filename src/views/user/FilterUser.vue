<template>
    <div class="grid gap-3 my-3 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border border-gray-100 p-4 rounded-lg bg-white">
      <!-- Сортировка -->
      <div class="grid grid-cols-[auto_1fr_1fr] items-center gap-1">
        <span class="whitespace-nowrap">{{ $t("l_Sort") }}</span>
        <a-select  v-model:value="sortList[0].name">
          <a-select-option value="createTime">{{ $t("l_Create_time") }}</a-select-option>
        </a-select>
        <a-select  v-model:value="sortList[0].orderBy">
          <a-select-option value="DESC">{{ $t("l_Descending") }}</a-select-option>
          <a-select-option value="ASC">{{ $t("l_Ascending") }}</a-select-option>
        </a-select>
      </div>
  
      <!-- Время создания -->
      <div class="grid grid-cols-[auto_1fr] items-center gap-1">
        <span class="whitespace-nowrap">{{ $t("l_Create_time") }}</span>
        <a-range-picker
          
          :value="createTime"
          @change="onCreateTimeChange"
          :allow-empty="[true, true]"
          allow-clear
          :show-time="{ format: 'HH:mm' }"
          format="DD-MM-YY HH:mm"
        />
      </div>
  
      <!-- Последний вход -->
      <div class="grid grid-cols-[auto_1fr] items-center gap-1">
        <span class="whitespace-nowrap">{{ $t("l_Last_login") }}</span>
        <a-range-picker
          
          :value="lastLogin"
          @change="onLastLoginChange"
          :allow-empty="[true, true]"
          allow-clear
          :show-time="{ format: 'HH:mm' }"
          format="DD-MM-YY HH:mm"
        />
      </div>
  
      <!-- Телефон -->
      <div class="grid grid-cols-[auto_1fr] items-center gap-1">
        <span class="whitespace-nowrap">{{ $t("l_Organization") }}</span>
        <a-input v-model:value="info.phone" allow-clear  />
      </div>
  
      <!-- Имя пользователя -->
      <div class="grid grid-cols-[auto_1fr] items-center gap-1">
        <span class="whitespace-nowrap">{{ $t("l_Username") }}</span>
        <a-input v-model:value="info.username" allow-clear  />
      </div>
  
      <!-- Кнопки -->
      <div class=" flex items-center gap-2 col-span-full mt-2">
        <a-button  type="primary" @click="onSearch">{{ $t("l_Search") }}</a-button>
        <a-button  @click="onReset">{{ $t("l_Reset") }}</a-button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from "vue"
  import dayjs, { Dayjs } from "dayjs"
  
  type SortItem = {
    name: string
    orderBy: "ASC" | "DESC"
  }
  
  interface FilterInfo {
    phone: string
    username: string
  }
  
  const sortList = ref<SortItem[]>([
    {
      name: "createTime",
      orderBy: "DESC"
    }
  ])
  
  const createTime = ref<[Dayjs | null, Dayjs | null]>([null, null])
  const lastLogin = ref<[Dayjs | null, Dayjs | null]>([null, null])
  
  const info = reactive<FilterInfo>({
    phone: "",
    username: ""
  })
  
  function onCreateTimeChange(dates: [Dayjs, Dayjs] | null) {
    createTime.value = dates ?? [null, null]
  }
  
  function onLastLoginChange(dates: [Dayjs, Dayjs] | null) {
    lastLogin.value = dates ?? [null, null]
  }
  
  function onSearch() {
    console.log("🔍 Search:", {
      sort: sortList.value,
      createTime: createTime.value,
      lastLogin: lastLogin.value,
      info
    })
  }
  
  function onReset() {
    sortList.value = [{ name: "createTime", orderBy: "DESC" }]
    createTime.value = [null, null]
    lastLogin.value = [null, null]
    info.phone = ""
    info.username = ""
  }
  </script>
  
  <style scoped lang="scss"></style>
  