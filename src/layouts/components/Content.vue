<template>
  <router-view v-if="isRouterAlive"/>
</template>

<script>
import { provide,ref,nextTick } from 'vue'

// 对content路由内容处理
const useRouterAliveEffect = () => {
  const isRouterAlive = ref(true)
  const reload = () =>{
    isRouterAlive.value = false
    nextTick(() => {
      isRouterAlive.value = true
    })
  }
  return { isRouterAlive,   reload }
}

export default {
  name: 'BaseContent',
  setup() {
    const { isRouterAlive,reload } = useRouterAliveEffect()
    provide('reload',reload)
    return { isRouterAlive,reload }
  }
}
</script>

<style scoped>

</style>
