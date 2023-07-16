<template>
  <div class="card-list">
    <div class="list-item">
      <div class="list-left">
        <div class="list-left-title">
          <h3>{{hotData.category}}</h3>
        </div>
        <div class="list-left-info" v-if="hotData.processInstances?.length">
          热门工具：
          <span v-for="item of hotData.processInstances" :key="item.id">{{item.name}}</span>
        </div>
        <div class="list-left-info" v-else-if="!hotData.processInstances?.length">
          热门工具：暂无
        </div>
      </div>
      <i class="arrow" @click="handleOpen">
        <span v-if="isOpen" class="iconfont open">&#xe651;</span>
        <span v-else class="iconfont close">&#xe63f;</span>
      </i>
    </div>
    <div class="list-body">
      <template v-if="isOpen">
        <div class="body-item" v-for="item in dataList" :key="item.id">
          <div class="item-left">
            <div class="item-left-icon">
              <a-tag color="blue" style="width: 80px;text-align: center" v-if="item.type==='tool'">
                <span class="iconfont" style="font-size: 13px">&#xe694;</span>
                <span style="padding-left: 3px;font-size: 13px">工具</span>
              </a-tag>
              <a-tag color="green" style="width: 80px;text-align: center" v-else-if="item.type==='flow'">
                <span class="iconfont" style="font-size: 13px">&#xe60b;</span>
                <span style="padding-left: 3px;font-size: 13px">全链路</span>
              </a-tag>
              <a-tag color="red" style="width: 80px;text-align: center" v-else>
                <span class="iconfont" style="font-size: 13px">&#xe677;</span>
                <span style="padding-left: 3px;font-size: 13px">自动化</span>
              </a-tag>
            </div>
            <div class="item-left-content">
              <h4 class="item-left-content-name">{{item.name}}</h4>
            </div>
          </div>
          <div class="item-right">
            <span class="item-right-desc">{{item.description}}</span>
            <span class="item-right-audit">{{item.updatedBy}}</span>
            <span class="item-right-time">{{dateFormat(item.updatedTime)}}</span>
            <a-popconfirm
                placement="top"
                :title="item.status===1?'需要失效该流程么':'需要生效该流程么'"
                ok-text="确定"
                cancel-text="取消"
                @confirm="changeStatus(item)"
            >
              <a class="item-right-status">{{item.status===0?'新建':item.status===1?'生效':'失效'}}</a>
            </a-popconfirm>
            <a-button type="primary" ghost style="margin-right: 10px" @click="handleEdit(item)">编辑</a-button>
            <a-button type="primary" style="margin-right: 10px" @click="handleDetail(item)">去查看</a-button>
          </div>
        </div>
        <div style="text-align: center;padding-top:15px">
          <a-button type="primary" ghost v-if="!isLastPage" @click="$emit('getMore')">查看更多内容</a-button>
          <span style="color:#fe6a00;cursor: pointer" v-else>没有更多内容了</span>
        </div>
      </template>
    </div>
  </div>
  <flow-edit-modal :visible="isEditVisible" :data="editData" @close="handleClose" @confirm="handleConfirm"></flow-edit-modal>
</template>

<script>
import {ref} from "vue";
import moment from 'moment'
import {useRouter} from "vue-router";
import {disableFlow, enableFlow} from "@/api/request";
import {message} from "ant-design-vue";
import FlowEditModal from "@/views/flows/FlowEditModal";

// 公共方法
const commonFunc = ()=>{
  const dateFormat = (val)=>{
    return moment(val).format('YYYY-MM-DD HH:mm:ss')
  }
  return {dateFormat}
}

// 列表展开收起
const listOpen = ()=>{
  const isOpen = ref(true)
  const handleOpen = () => {
    isOpen.value = !isOpen.value
  }
  return {isOpen,handleOpen}
}

// 更新流程工具状态
const useUpdateStatus = (ctx)=>{
  const changeStatus = (item)=>{
    // todo 需要传入修改人
    // 判断当前状态为新建、失效——》生效
    let req = {
      processInstanceId: item.id,
      updatedBy:'amy.xue'
    }
    if(item.status===0 || item.status===2){
      // 调生效流程接口
      enableFlow(req).then(res=>{
        if(res.code===0){
          message.success('生效成功')
          // 重新刷新
          ctx.emit('refresh')
        }
      })
    }else{
      // 调失效流程接口
      disableFlow(req).then(res=>{
        if(res.code===0){
          message.success('失效成功')
          // 重新刷新
          ctx.emit('refresh')
        }
      })
    }
  }
  return {changeStatus}
}

// 编辑流程
const useFlowEdit = (ctx)=>{
  const editData = ref()
  const isEditVisible = ref(false)
  const handleEdit = (item)=>{
    editData.value = item
    isEditVisible.value = true
  }
  const handleClose = ()=>{
    isEditVisible.value = false
  }
  const handleConfirm = ()=>{
    isEditVisible.value = false
    ctx.emit('refresh')
  }
  return {isEditVisible,editData,handleConfirm,handleEdit,handleClose}
}

export default {
  name: "flowCard",
  components: {FlowEditModal},
  props: ['dataList','hotData','isLastPage'],
  emits: ['getMore','refresh'],
  setup(props,ctx){
    const router = useRouter()
    const {isOpen,handleOpen} = listOpen()
    const {dateFormat} = commonFunc()
    const {isEditVisible,editData,handleConfirm,handleEdit,handleClose} = useFlowEdit(ctx)
    const handleDetail = (item)=>{
      router.push('/flows/detail/'+item.name+'/'+item.id)
    }

    const {changeStatus} = useUpdateStatus(ctx)
    return {
      isOpen,
      handleOpen,
      dateFormat,
      handleDetail,
      changeStatus,
      isEditVisible,editData,handleEdit,handleClose,handleConfirm
    }
  }
}
</script>

<style scoped>
.card-list {
  padding: 30px 0;
  font-family: PingFangSC sans-serif;
}
.list-item {
  height: 108px;
  background-color: #fff;
  box-shadow: 0 0 15px 0 rgba(0,0,0,.1);
  border-radius: 4px;
  padding: 22px 33px;
  display: flex;
  justify-content: space-between;
}
.list-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.list-left-title {
  display: flex;
  font-weight: 500;
  height: 28px;
  line-height: 28px;
  font-size: 18px;
  color: #333;
  margin: 0;
}
.list-left-info {
  font-weight: 400;
  font-size: 14px;
  color: #333;
  height: 28px;
  line-height: 28px;
}
.list-left-info span :first-child {
  margin-left: 8px;
}
.list-left-info span {
  font-size: 12px;
  color: #838383;
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 2px 12px;
  margin-right: 10px;
}
.arrow {
  align-self: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fe6a00;
  background-color: #fcf0e6;
  cursor: pointer;
  transition: .3s;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
}
.arrow:hover {
  background-color: #fe6a00;
  color: #fff;
}
.open {
  position: absolute;
  margin-top: 8px;
  font-size: 20px;
  margin-left: 5px;

}
.close {
  position: absolute;
  margin-top: 8px;
  font-size: 18px;
  margin-left: 6px;
}
.list-body {
  overflow: hidden;
  transition: .3s;
  min-height: 550px;
  height: auto;
}
.body-item {
  height: 100px;
  margin-top: 10px;
  padding: 22px 33px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fcfcfc;
  border-radius: 4px;
}
.body-item:hover {
  background-color: #f8f8f8;
}
.item-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-left-icon {
  width: 84px;
  flex: none;
  display: flex;
  align-items: center;
  margin-right: 8px;
}
.item-left-content {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.item-left-content-name {
  height: 28px;
  line-height: 28px;
  font-weight: 500;
  font-size: 16px;
  color: #333;
  margin: 0;
}
.item-right {
  display: flex;
  align-items: center;
}
.item-right-desc {
  /*margin-right: 60px;*/
  color: #333;
  font-size: 14px;
  font-weight: 400;
  width: 380px;
  text-align: center;
}
.item-right-audit {
  margin-right: 10px;
  color: #333;
  font-size: 14px;
  font-weight: 400;
  width: 80px;
  text-align: center;
}
.item-right-time {
  /*margin-right: 25px;*/
  color: #333;
  font-size: 14px;
  font-weight: 400;
  width: 150px;
  text-align: center;
}
.item-right-status {
  /*margin-right: 20px;*/
  color: #ff4600;
  font-size: 14px;
  font-weight: 400;
  width: 110px;
  text-align: center;
}
.item-right-button {
  width: 90px;
}
.item-right-button:hover{
  color: #fff;
  background-color: #fe6a00;
  border-color: #fe6a00;
}
</style>
