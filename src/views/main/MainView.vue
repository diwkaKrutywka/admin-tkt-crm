<template>
    <div>
        <a-page-header :title="$t('l_Main_page')">
      <template #extra>
        <a-button type="primary" @click="onAdd()">
          <span class="material-symbols-outlined">
            add <span class="ml-2"> {{ $t('l_Create_request') }} </span>
          </span>
        </a-button>
      </template>
    </a-page-header>
    </div>
</template>
<script lang="ts">
</script>