import { getCurrentInstance } from 'vue'

export function useGlobal() {
  const instance = getCurrentInstance()
  const global = instance?.appContext.config.globalProperties

  return {
    $formatIsoDate: global?.$formatIsoDate as (date: string) => string,
  }
}
