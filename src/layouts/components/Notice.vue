<template>
  <div class="notice-wrap" v-if="isShowNotice">
    <img src="@/assets/images/公告喇叭.png" alt="" class="notice-img-horn">
    <span>最新版本流量回放平台已发布,赶快来体验一波!</span>
<!--    todo 跳转到详情操作手册页，链接待替换-->
    <a class="notice-info" href="https://huolala.feishu.cn/wiki/wikcn98KHWSzQJ6ibe7VvgW9Xse" target="_blank">查看详情</a>
    <img src="@/assets/images/关闭.png" alt="" class="notice-img-close" @click="handleCloseNotice">
  </div>
</template>

<script>
import { ref } from 'vue'
// 对notice的处理
const useNoticeEffect = ()=>{
  const isShowNotice = ref(true)
  const handleCloseNotice = () =>{
    isShowNotice.value = false
  }
  return { isShowNotice,handleCloseNotice }
}
export default {
  name: "BaseNotice",
  setup() {
    const { isShowNotice,handleCloseNotice } = useNoticeEffect()
    return { isShowNotice,handleCloseNotice }
  }
}
</script>

<style scoped>
.notice-wrap {
  margin: 0 auto;
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  background: #fff5d4;
  color: #ff5900;
}
.notice-img-horn {
  display: inline-block;
  width: 22px;
  height: 22px;
  vertical-align: middle;
  margin-right: 10px;
  background-size: 22px;
}
.notice-info {
  display: inline-block;
  font-size: 12px;
  border: 1px solid #ff7c34!important;
  border-radius: 20px;
  line-height: 20px;
  padding: 0 8px;
  color: #ff7c34!important;
  margin-left: 20px;
  text-decoration: none;
}
.notice-img-close {
  position: absolute;
  /*margin-right: 0;*/
  right: 10px;
  top: 8px;
  display: inline-block;
  width: 22px;
  height: 22px;
  vertical-align: middle;
  background-size: 22px;
  cursor:pointer;
}
</style>
