<template>
    <div>
      <a-dropdown>
        <span
          class="icon m-0 p-0 material-symbols-outlined text-blue-500"
          @click.prevent
        >
          translate
        </span>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a
                :style="{ color: langTag.valueOf === 'kk' ? '#40a9ff' : '#000' }"
                href="#"
                @click.prevent="setLanguage('kk')"
              >Қазақша</a>
            </a-menu-item>
            <a-menu-item>
              <a
                :style="{ color: langTag.valueOf === 'ru' ? '#40a9ff' : '#000' }"
                href="#"
                @click.prevent="setLanguage('ru')"
              >Русский</a>
            </a-menu-item>
            <a-menu-item>
              <a
                :style="{ color: langTag.valueOf === 'en' ? '#40a9ff' : '#000' }"
                href="#"
                @click.prevent="setLanguage('en')"
              >English</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  
  const { locale } = useI18n()
  
  const langTag = computed(() => locale.value)
  
  function setLanguage(lang) {
    locale.value = lang
    localStorage.setItem('currentLang', lang)
    window.location.reload()
  }
  </script>
  