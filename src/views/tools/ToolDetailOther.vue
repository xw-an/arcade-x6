<template>
  <div class="system-no-content">
    <img src="@/assets/images/noDataDefault.svg" class="system-no-content-image"><br/>
    <span class="system-no-content-text">当前分类下功能暂未开放，敬请期待！</span>
  </div>
</template>

<script>
export default {
  name: "ToolDetailOther",
  setup(){}
}
</script>

<style scoped>
.system-no-content {
  width: 100%;
  text-align: center;
  padding-top: 120px;
  margin-bottom: 50px;
  font-size: 15px;
  min-height: 380px;
}
.system-no-content-image {
  margin: 10px;
}
.system-no-content-text {
  color: #999;
}
</style>
