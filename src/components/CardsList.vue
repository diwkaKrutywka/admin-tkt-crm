<template>
    <div class="dashboard">
      <!-- Статистические карточки -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BaseCard
          v-for="card in statisticsData"
          :key="card.id"
          :title="card.title"
        >
          <template #content>
            <div class="stat-block">
              <div class="stat-number">{{ card.data.value }}</div>
              <div class="stat-label">{{ card.data.label }}</div>
            </div>
          </template>
        </BaseCard>
      </div>
  
      <!-- Информационные карточки -->
      <div
        v-if="informationData.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mt-4"
      >
        <!-- Последняя активность -->
        <BaseCard
          :bigCard="true"
          :title="informationData[0].title"
          :subtitle="informationData[0].subtitle"
        >
          <template #content>
            <div class="activity-list text-left">
              <div
                v-for="item in informationData[0].data.activities"
                :key="item.id"
                class="activity-item"
              >
                <div class="activity-indicator" :class="item.status"></div>
                <div class="activity-content">
                  <div class="activity-title">{{ item.title }}</div>
                  <div class="activity-time">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </template>
        </BaseCard>
  
        <!-- Быстрые действия -->
        <BaseCard
          :bigCard="true"
          :title="informationData[1].title"
          :subtitle="informationData[1].subtitle"
        >
          <template #content>
            <div class="quick-actions text-left">
              <button class="action-btn primary">
                <span class="action-icon">+</span>
                Создать новое обращение
              </button>
              <button class="action-btn secondary">
                <span class="action-icon">📋</span>
                Мои обращения
              </button>
              <button class="action-btn secondary">
                <span class="action-icon">📊</span>
                Все обращения
              </button>
            </div>
          </template>
        </BaseCard>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import BaseCard from '../common/BaseCard.vue'
  import dashboardData from '../mockData/mockCardsData.json'
  
  // Интерфейсы
  interface CardData {
    id: string
    category: string
    type: string
    title: string
    subtitle: string | null
    order: number
    data: any
    config: Record<string, any>
  }
  
  // Reactive state
  const statisticsData = ref<CardData[]>([])
  const informationData = ref<CardData[]>([])
  
  onMounted(() => {
    const cards = dashboardData.dashboardData.cards as CardData[]
    statisticsData.value = cards.filter(card => card.category === 'statistics')
    informationData.value = cards.filter(card => card.category === 'information')
  })
  </script>
  
  <style scoped>
  .dashboard {
      padding: 20px;
      background-color: #f9fafb;
      min-height: 100vh;
  }
  
  .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
  }
  
  /* Стили для статистических блоков */
  .stat-block {
      text-align: center;
      padding: 20px 0;
  }
  
  .stat-number {
      font-size: 48px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
  }
  
  .stat-number.urgent {
      color: #dc2626;
  }
  
  .stat-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
  }
  
  /* Стили для списка активности */
  .activity-list {
      space-y: 16px;
  }
  
  .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
  }
  
  .activity-item:last-child {
      border-bottom: none;
  }
  
  .activity-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-top: 6px;
      flex-shrink: 0;
  }
  
  .activity-indicator.new {
      background-color: #ef4444;
  }
  
  .activity-indicator.assigned {
      background-color: #f59e0b;
  }
  
  .activity-indicator.completed {
      background-color: #10b981;
  }
  
  .activity-content {
      flex: 1;
  }
  
  .activity-title {
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
      margin-bottom: 4px;
  }
  
  .activity-time {
      font-size: 12px;
      color: #6b7280;
  }
  
  /* Стили для быстрых действий */
  .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
  }
  
  .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
  }
  
  .action-btn.primary {
      background-color: #3b82f6;
      color: white;
  }
  
  .action-btn.primary:hover {
      background-color: #2563eb;
  }
  
  .action-btn.secondary {
      background-color: #f3f4f6;
      color: #1f2937;
      border: 1px solid #e5e7eb;
  }
  
  .action-btn.secondary:hover {
      background-color: #e5e7eb;
  }
  
  .action-icon {
      font-size: 16px;
  }
  
  /* Адаптивность */  
  @media (max-width: 768px) {
      .dashboard-grid {
          grid-template-columns: 1fr;
      }
  
      .stat-number {
          font-size: 36px;
      }
  }
  </style>
  