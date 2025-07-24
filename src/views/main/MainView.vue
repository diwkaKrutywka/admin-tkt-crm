<template>
  <div>
    <a-page-header :title="$t('l_Main_page')">
      <template #extra>
        <a-button type="primary" @click="onAdd()">
          <span class="material-symbols-outlined">
            add <span class="ml-2"> Создать обращение </span>
          </span>
        </a-button>
      </template>
    </a-page-header>
    <CardsList />

  </div>
</template>
<script setup lang="ts">
import CardsList from '../../components/CardsList.vue'
const onAdd = () => {

}
</script>