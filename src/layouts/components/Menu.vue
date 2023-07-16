<template>
  <a-menu mode="horizontal"
          :open-keys="openKeys"
          :selectedKeys="selectedKeys"
          @openChange="onOpenChange"
  >
    <template v-for="item of menuList">
      <!-- 存在children子菜单情况 -->
      <a-sub-menu v-if="item.childrenList" :key="item.id">
        <template #icon>
          <component :is="$icons[item.icon]" />
        </template>
        <template #title>
          <span>{{ item.name }}</span>
        </template>
        <!-- 子菜单 -->
        <a-menu-item :key="child.id" v-for="child of item.childrenList"
                     @click="handleMenuItem(child.path, child.id)"
        >
          <component :is="$icons[child.icon]" />
          <span>{{ child.name }}</span>
        </a-menu-item>
      </a-sub-menu>
      <!-- 不存在子菜单情况 -->
      <a-menu-item v-else @click="handleMenuItem(item.path, item.id)" :key="item.id" >
        <component :is="$icons[item.icon]" />
        <span>{{ item.name }}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
import { ref } from 'vue'
import { useRouter,useRoute } from 'vue-router'

// 对menu的处理逻辑
const useMenuEffect = () =>{
  const route = useRoute()
  const router = useRouter()
  const menuList = [
    {
      id: 1,
      icon: 'ToolOutlined',
      name: '工具列表',
      path: '/tools'
    },
    {
      id: 2,
      icon: 'ClusterOutlined',
      name: '流程列表',
      path: '/flows'
    },
    {
      id: 3,
      icon: 'BarsOutlined',
      name: '任务管理',
      path: '/task',
    },
    // {
    //   id: 3,
    //   icon: 'QrcodeOutlined',
    //   name: '流量管理',
    //   childrenList:
    //   [{
    //     id: 31,
    //     icon: 'PlaySquareOutlined',
    //     name: '录制流量',
    //     path: '/traffic/record'
    //   },
    //   {
    //     id: 32,
    //     icon: 'VideoCameraOutlined',
    //     name: '回放流量',
    //     path: '/traffic/playback'
    //   }]
    // }
  ]
  const selectedKeys = ref([])
  const openKeys = ref([])
  const rootSubmenuKeys = []
  const handleMenuItem = (path, id) =>{
    selectedKeys.value = [id]
    router.push({path: path})
  }
  const curSelectKey = () =>{
    let path = route.path.toString()
    let id = 1
    selectedKeys.value = [id]
    menuList.forEach(obj => {
      if (obj.path) {
        if (path.indexOf(obj.path) != -1) {
        // if (obj.path.includes(path)) {
          id = obj.id
          selectedKeys.value = [id]
        }
      } else {
        obj.childrenList.forEach(child => {
          if (path.indexOf(child.path) != -1) {
          // if (child.path.includes(path)) {
            id = child.id
            selectedKeys.value = [id]
          }
        })
      }
    })

  }
  const curOpenKey = () => {
    let path = route.path.toString().split('/')[1]
    let id = 1
    openKeys.value = []
    menuList.forEach(obj => {
      if (obj.path) {
        if (path.indexOf(obj.path) != -1) {
          id = obj.id
          openKeys.value = [id]
        }
      } else {
        obj.childrenList.forEach(child => {
          if (path.indexOf(child.path) != -1) {
            id = obj.id
            openKeys.value = [id]
          }
        })
      }
    })
  }
  const onOpenChange = (openKeys) =>{
    const latestOpenKey = openKeys.find(key => openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      openKeys.value = openKeys
    } else {
      openKeys.value = latestOpenKey ? [latestOpenKey] : []
    }
  }
  return { menuList, openKeys,selectedKeys,handleMenuItem, onOpenChange,curSelectKey, curOpenKey }
}

export default {
  name: 'BaseMenu',
  setup() {
    const { menuList, openKeys,selectedKeys,handleMenuItem, onOpenChange,curSelectKey, curOpenKey } = useMenuEffect()
    curSelectKey()
    curOpenKey()
    return { menuList, openKeys,selectedKeys,handleMenuItem, onOpenChange }
  }
}
</script>

<style scoped>
/*.ant-menu-item-selected {*/
/*  background-color: #ff6f22 !important;*/
/*  color: white !important;*/
/*}*/

</style>
