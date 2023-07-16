<template>
  <div class="logo-container">
    <img src="@/assets/images/工具logo.png" alt="" class="logo-img">
    <h1 class="logo-title">Arcade</h1>
  </div>
</template>

<script>
export default {
  name: 'BaseLogo'
}
</script>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  height: 100%;
  weight: 100%;
  /*padding-left: 18px;*/
  /*height: 85px;*/
  /*line-height: 85px;*/
  overflow: hidden;
  white-space: nowrap
}
.logo-container .logo-img {
  height: 35px;
  width: 39px;
  /*margin-left: 5px;*/
  margin-right: 5px;
}
.logo-container .logo-title {
  /*color: #fff;*/
  margin-bottom: 0;
  font-size: 25px;
  font-weight: 480;
  line-height: 50px;
  /*font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;*/
  font-family:  站酷高端黑 Regular;
  vertical-align: middle;
  /*color:#e16531;*/
  background-image:-webkit-linear-gradient(bottom,red,#fd8403,yellow);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}
</style>
