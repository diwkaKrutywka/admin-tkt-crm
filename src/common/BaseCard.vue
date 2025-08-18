<template>
  <div class="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
    <!-- Заголовок карточки -->
    <div class="mb-4">
      <slot name="header">
        <h3 :class="['text-gray-900 font-semibold mb-1', bigCard ? 'text-2xl text-left' : 'text-lg']">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-gray-500 text-left">{{ subtitle }}</p>
      </slot>
    </div>

    <!-- Основное содержимое -->
    <div class="flex-1">
      <slot name="content">
        <div class="text-gray-700 text-sm leading-relaxed">
        
        </div>
      </slot>
    </div>

    <!-- Дополнительные действия -->
    <div v-if="hasActions" class="mt-4 pt-4 border-t border-gray-100">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bigCard?: boolean
  title?: string
  subtitle?: any
}>()

const slots = defineSlots<{
  header?: () => any
  content?: () => any
  actions?: () => any
}>()

const hasActions = computed(() => !!slots.actions)
</script>
