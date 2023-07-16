<template>
  <a-layout>
<!--    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%',background: '#fff' }">-->
    <a-layout-header :style="{ position: 'relative', zIndex: 1,width: '100%',background: '#fff' }">
      <!--logo组件-->
      <div class="logo">
        <base-logo/>
      </div>
      <!-- menu组件 -->
      <base-menu/>
    </a-layout-header>
    <!-- 下方content-->
    <a-layout-content >
      <div :style="{ background: '#fff', padding: '24px', minHeight: '380px' }">
        <base-content/>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import BaseContent from "@/layouts/components/Content";
import BaseLogo from "@/layouts/components/Logo";
import BaseMenu from "@/layouts/components/Menu";
export default {
  name: "BaseLayout",
  components:{BaseMenu, BaseLogo, BaseContent },
  setup() {}
}
</script>

<style scoped>
.logo {
  width: 130px;
  height: 50px;
  margin-top: 5px;
  margin-right: 5px;
  float: left;
}
</style>
