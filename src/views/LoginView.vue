<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <a-card class="w-full max-w-md shadow-md">
        <h2 class="text-2xl font-semibold mb-6 text-center">Вход</h2>
        <a-form layout="vertical" @submit.prevent="onLogin">
          <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Введите email' }]">
            <a-input v-model:value="info.username" type="email" />
          </a-form-item>
  
          <a-form-item label="Пароль" name="password" :rules="[{ required: true, message: 'Введите пароль' }]">
            <a-input
              :type="passwordVisible ? 'text' : 'password'"
              v-model:value="info.password"
              :suffix="passwordVisible ? '🙈' : '👁️'"
              @click:suffix="togglePasswordVisibility"
            />
          </a-form-item>
  
          <a-button type="primary" html-type="submit" class="w-full" @click="onLogin">
            Войти
          </a-button>
        </a-form>
      </a-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  // import your store
  // import { useUserStore } from '@/stores/user'
  import {ApiApi} from '../api/auth' // Adjust the path to your ApiApi function
  
  const router = useRouter()
  // const userStore = useUserStore()
  
  const info = ref({
    username: '',
    password: ''
  })
  
  const passwordVisible = ref(false)
  
  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value
  }
  
  const onLogin = async () => {
    // Optional: mock admin login values
    // info.value.username = 'admin'
    // info.value.password = 'admin_EKC1'
  
    if (!info.value.username || !info.value.password) return
  
    try {
      const res = await ApiApi('login', info.value, 'POST')
      if (res.data.success === true) {
        // userStore.setUser(res)
        router.push('/')
      } else {
        console.error('Login error:', res)
      }
    } catch (error) {
      console.error('API error:', error)
    }
  }
  </script>
  
  <style scoped>
  </style>
  