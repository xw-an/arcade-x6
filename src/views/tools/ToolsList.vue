<template>
  <div style="padding: 20px 20px 0px 20px;height: 100%;line-height: 100%;">
    <div class="main-box">
      <div class="page-bg"/>
      <div class="inner">
        <div class="title">
          <div class="title-txt">工具一站式生成平台，开箱即用</div>
        </div>
        <div class="desc">
          通过简单流程编排操作，生成自定义的工具是一种快捷且有效的手段，助力产研提高效率
        </div>
<!--        <div class="notice">-->
<!--          <span>通过简单流程编排操作，生成自定义的工具是一种快捷且有效的手段，助力产研提高效率</span>-->
<!--        </div>-->
      </div>
    </div>
    <a-row style="width: 100%;height: auto;margin-top: 350px;margin-bottom: 18px">
      <a-col :span="9"></a-col>
      <a-col :span="15" style="text-align: right;">
        <a-select
            v-model:value="searchBusinessLine"
            style="width: 180px;text-align: left;margin-right: 10px"
            :options="businessLineData"
            placeholder="选择业务线"
        ></a-select>
        <a-input-search
            v-model:value="searchToolName"
            placeholder="请输入工具名称"
            enter-button
            @search="handleToolName"
            style="width: 320px;"
        />
      </a-col>
    </a-row>
    <div class="tab-container">
      <div class="tab" v-for="(item,index) of tabList" :key="index" @click="handleActiveKey(item)">
        <div :class="{'tab-active': activeKey===item.value}" style="background-image: linear-gradient(90deg, rgb(249, 120, 34) 0%, rgb(251, 172, 94) 100%) !important; transform: skewX(20deg); left: -10px;"></div>
        <div :class="{'tab-text':true, 'tab-text-active':activeKey===item.value}">
          <span style="font-size: 14px;display: block;">{{item.label}}</span>
        </div>
      </div>
    </div>
    <tool-card :dataList="dataList" :gutter="16" :column="4" :isLastPage="isLastPage" @getMore="handleMore"></tool-card>
  </div>
</template>

<script>
import {reactive, ref, toRefs, watchEffect} from "vue";
import ToolCard from "@/views/tools/ToolCard";
import {getTools} from "@/api/request";

// tab页相关操作
const useActiveEffect = ()=>{
  const currentPage = ref(1)
  let isLastPage = ref(false)
  // 工具所属部门
  const tabList = [
    {value:'MiddlewareTool',label:'中间件'},
    {value:'FontTool',label:'前台'},
    {value:'MiddleTool',label:'中台'},
    {value:'UserTool',label:'用户'},
    {value:'UtilTool',label:'公共'}
  ]
  // 业务线
  const businessLineData = [
    {value:'',label:'全部'},
  ]
  const data = reactive({dataList: []})
  const searchBusinessLine= ref('全部')
  const searchToolName = ref('')
  const activeKey = ref(tabList[0].value)
  // 切换tab页赋值
  const handleActiveKey = (val) =>{
    activeKey.value = val.value
    currentPage.value = 1
  }
  // 搜索工具名称
  const handleToolName = ()=>{
    currentPage.value = 1
  }
  const getToolList = async (isAppend)=>{
    let req = {
      department: activeKey.value,
      businessLine: searchBusinessLine.value==='全部'?'':searchBusinessLine.value,
      keyword: searchToolName.value,
      "pageSize": 12,
      "currentPage": 1
    }
    isAppend?req.currentPage = currentPage.value:data.dataList = []
    await getTools(req).then(res=>{
      if (res.code === 0 && res.data?.testTools?.length) {
        isAppend?data.dataList = data.dataList.concat(res.data.testTools):data.dataList = res.data.testTools
        currentPage.value * 12>=res.data.total?isLastPage.value=true:isLastPage.value=false
      } else {
        currentPage.value = 1
        isLastPage.value = true
      }
    })
  }
  watchEffect(()=>{
    getToolList(false)
  })
  const handleMore = ()=>{
    currentPage.value++
    getToolList(true)
  }
  return {tabList,activeKey,handleActiveKey,...toRefs(data),searchBusinessLine,businessLineData,searchToolName,handleToolName,handleMore,isLastPage}
}

export default {
  name: "ToolsList",
  components: {ToolCard},
  setup() {
    const {activeKey,tabList,handleActiveKey,dataList,searchBusinessLine,businessLineData,searchToolName,handleToolName,handleMore,isLastPage} = useActiveEffect()
    return {
      activeKey,tabList,handleActiveKey,dataList,
      searchBusinessLine,businessLineData,searchToolName,handleToolName,
      handleMore,isLastPage
    }
  }
}
</script>

<style scoped>
.main-box {
  position: absolute;
  width: 100%;
  top: 60px;
  left: 0;
  transition: all .3s linear 0s;
  overflow: hidden;
  min-height: 370px;
}
.page-bg {
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  height: 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  background-image: url("../../assets/images/工具背景图01.png");
}
.inner {
  min-height: 262px;
  position: relative;
  padding-top: 80px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  z-index: 1;
}
.title {
  margin-top: 50px;
  font-size: 0;
}
.title-txt {
  display: inline-block;
  vertical-align: middle;
  font-size: 36px;
  line-height: 48px;
  color: #FFE7CC;
}
.desc {
  margin-top: 10px;
  font-size: 14px;
  line-height: 24px;
  max-height: 72px;
  overflow: hidden;
  width: 60%;
  color: #FFF0DE;
}
.notice {
  margin-top: 6px;
}
.notice span {
  display: inline-block;
  background-image: linear-gradient(90deg,#ff791a,#ffa400);
  color: #fff;
  font-size: 14px;
  line-height: 24px;
  height: 24px;
  white-space: nowrap;
  padding: 0 10px;
}
.tab-container {
  display: flex;
  height: 48px;
  border-bottom: 2px solid #FF6A00;
  box-sizing: border-box;
  width: 100%;
  margin-top: 20px;
}
.tab {
  width: 25%;
  position: relative;
  float: left;
  height: 48px;
  line-height: 48px;
  overflow: hidden;
}
.tab-active{
  background: #FF6A00;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.tab-text {
  color: rgb(0, 0, 0) !important;
  width: 100%;
  position: relative;
  z-index: 1;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}
.tab-text-active {
  color: rgb(255, 255, 255) !important;
}
</style>
