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
            <slot></slot>
          </div>
        </slot>
      </div>
  
      <!-- Дополнительные действия -->
      <div v-if="hasActions" class="mt-4 pt-4 border-t border-gray-100">
        <slot name="actions"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  // Props
  import { computed, useSlots } from 'vue'
  
  const props = defineProps({
    bigCard: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    }
  })
  
  // Slots
  const slots = useSlots()
  
  // Computed: check if actions slot exists
  const hasActions = computed(() => !!slots.actions)
  </script>
  