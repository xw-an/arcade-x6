<template>
  <div style="padding: 20px;height: 100%;line-height: 100%;">
    <div class="main-box">
      <div class="page-bg"/>
      <div class="page-bg-two"/>
      <div class="inner">
        <div class="title">
          <div class="title-txt">编排测试流程，更高效的低代码平台</div>
        </div>
        <div class="desc">
          <span>通过直观界面和低代码功能，您可以快速创建自定义流程，使测试流程更加自动化和高效化</span>
          <!--          <span>使测试流程更加自动化和高效化</span>-->
        </div>
        <!--        <div class="notice">-->
        <!--          <span>通过直观界面和低代码功能，您可以快速创建自定义流程，使测试流程更加自动化和高效化</span>-->
        <!--        </div>-->
      </div>
    </div>
    <a-row style="width: 100%;height: auto;margin-top: 350px;margin-bottom: 18px">
      <a-col :span="11"></a-col>
      <a-col :span="13" style="text-align: right;">
        <a-select
            v-model:value="searchCategory"
            style="width: 180px;text-align: left;margin-right: 10px"
            :options="categoryData.map(obj => ({ value: obj }))"
            placeholder="选择分类"
        >
        </a-select>
        <a-input-search
            v-model:value="searchFlowName"
            placeholder="请输入工具名称"
            enter-button
            style="width: 320px;"
        />
        <a-button type="primary" style="margin-left: 8px" @click="handleAdd">
          <plus-outlined />
          新建流程
        </a-button>
      </a-col>
    </a-row>
    <div class="tab-container">
      <div class="tab" v-for="(item,index) of tabList" :key="index" @click="handleActiveKey(item)">
        <div :class="{'tab-active': activeKey===item}" style="background-image: linear-gradient(90deg, #ff6a00 0%, #FFA500 100%) !important; transform: skewX(20deg); left: -10px;"></div>
        <div :class="{'tab-text':true, 'tab-text-active':activeKey===item}">
          <span style="font-size: 14px;display: block;">{{item}}</span>
        </div>
      </div>
    </div>
    <flow-card :dataList="dataList" :isLastPage="isLastPage" :hotData="hotData" @getMore="handleMore" @refresh="handleRefresh"></flow-card>
  </div>
  <flow-add-modal :visible="isAddVisible" @close="handleClose" @confirm="handleConfirm"></flow-add-modal>
</template>

<script>
import {reactive, ref, toRefs, watchEffect} from "vue";
import FlowCard from "@/views/flows/FlowCard";
import {flowsList, getHots} from "@/api/request";
import FlowAddModal from "@/views/flows/FlowAddModal";

// card列表相关操作
const useCardListEffect = ()=>{
  const tabList = ['业务线1','业务线2','业务线3']
  const activeKey = ref('业务线1')
  const data = reactive({ dataList: []})
  const categoryData = ['全部','新建','生效','失效']
  const searchCategory = ref('全部')
  const searchFlowName = ref('')
  const currentPage = ref(1)
  let isLastPage = ref(false)
  const pageSize = 10
  const handleActiveKey = (val) =>{
    activeKey.value = val
    currentPage.value = 1
  }
  const hotTools = reactive({hotData: {}})
  const getHotTools = async()=>{
    // 获取热门工具
    let req = {category: activeKey.value}
    await getHots(req).then(res=>{
      if (res?.code===0 && res.data) {
        hotTools.hotData = res.data
      }
    })
  }
  watchEffect(()=>{
    getHotTools()
  })
  const getFlows = async (isAppend)=> {
    const req = {
      businessLine: activeKey.value,
      name: searchFlowName.value,
      status: searchCategory.value==='全部'?3 :searchCategory.value==='新建'?0:searchCategory.value==='生效'?1:2,
      pageSize: pageSize,
      currentPage: 1
    }
    isAppend?req.currentPage = currentPage.value:data.dataList = []
    await flowsList(req).then(res=>{
      if (res?.code===0 && res.data?.processInstances?.length) {
        isAppend?data.dataList = data.dataList.concat(res.data.processInstances):data.dataList = res.data.processInstances
        currentPage.value * pageSize>=res.data.total?isLastPage.value=true:isLastPage.value=false
      } else {
        currentPage.value = 1
        isLastPage.value = true
      }
    })
  }
  watchEffect(()=>{
    getFlows(false)
  })
  const handleMore = ()=>{
    currentPage.value++
    getFlows(true)
  }
  const handleRefresh = ()=>{
    getFlows(false)
  }
  return {tabList,activeKey,...toRefs(data),searchCategory,categoryData,searchFlowName,handleActiveKey,...toRefs(hotTools),handleMore,isLastPage,getFlows,handleRefresh}
}

// 新建流程
const useFlowAdd = ()=>{
  const isAddVisible = ref(false)
  const handleAdd = ()=>{
    isAddVisible.value = true
  }
  const handleClose = ()=>{
    isAddVisible.value = false
  }
  return {isAddVisible,handleAdd,handleClose}
}

export default {
  name: "flowsList",
  components: {FlowAddModal, FlowCard},
  setup() {
    const {tabList,activeKey,dataList,searchCategory,categoryData,searchFlowName,handleActiveKey,hotData,handleMore,isLastPage,getFlows,handleRefresh} = useCardListEffect()
    const {isAddVisible,handleAdd,handleClose} = useFlowAdd()
    const handleConfirm = ()=>{
      handleClose()
      getFlows(false)
    }
    return {
      tabList,activeKey,dataList,searchCategory,categoryData,searchFlowName,handleActiveKey,
      hotData,
      handleMore,
      isLastPage,
      isAddVisible,
      handleAdd,
      handleClose,
      handleConfirm,
      handleRefresh
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
  background-image: url("../../assets/images/工具素材图03.png");
}
.page-bg-two {
  position: absolute;
  top: 0;
  width: 36%;
  right: 0;
  height: 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  background-image: url("../../assets/images/工具素材图01.png");
}

.inner {
  min-height: 262px;
  position: relative;
  padding-top: 86px;
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
  /*color: #181818;*/
  color: #FFE7CC;
}
.desc {
  margin-top: 10px;
  font-size: 14px;
  line-height: 24px;
  max-height: 72px;
  overflow: hidden;
  width: 60%;
  /*color: #3d3d3d;*/
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
  width: 20%;
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
