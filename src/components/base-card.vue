<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: any
}>()

defineSlots<{
  header?: () => any
  content?: () => any
  actions?: () => any
  default?: () => any
}>()
</script>

<template>
  <div class="base-card">
    <div class="card-header">
      <slot name="header">
        <h3>{{ title }}</h3>
        <p v-if="subtitle">{{ subtitle }}</p>
      </slot>
    </div>

    <div class="card-body">
      <slot name="content">
        <slot /> <!-- fallback -->
      </slot>
    </div>

    <div class="card-footer" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>
