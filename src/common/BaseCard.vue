<!-- BaseCard.vue -->
<template>
  <div class="base-card">
    <!-- Заголовок карточки -->
    <div class="card-header">
      <slot name="header">
        <h3 class="card-title " :class="{ bigCardTitle: bigCard }">{{ title }}</h3>
        <p class="card-subtitle text-left" v-if="subtitle">{{ subtitle }}</p>
      </slot>
    </div>

    <!-- Основное содержимое -->
    <div class="card-content">
      <slot name="content">
        <div class="default-content">
          <slot></slot>
        </div>
      </slot>
    </div>

    <!-- Дополнительные действия (если есть) -->
    <div class="card-actions" v-if="hasActions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
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
  },
  computed: {
    hasActions() {
      return !!this.$slots.actions
    }
  }
}
</script>

<style scoped>
.base-card {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

.base-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 16px;
}

.bigCardTitle {
  text-align: left;
  font-size: 24px !important;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.card-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.card-content {
  flex: 1;
}

.card-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.default-content {
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
}
</style>