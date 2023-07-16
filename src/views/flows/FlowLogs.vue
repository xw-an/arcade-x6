<template>
  <div style="width: 100%;height: 100%" class="flow-logs">
    <a-row style="width: 100%;height: 100%;margin-bottom: 12px;margin-top: 15px">
      <a-col :span="24" style="text-align: center">
        <h2 style="font-size: 26px; color: rgb(24, 24, 24); line-height: 42px;">{{$router.currentRoute.value.params.name+' (版本ID:'+$router.currentRoute.value.params.versionId+')'}}</h2>
      </a-col>
    </a-row>
    <div class="wrap">
    <div class="tabGroup">
      <div class="swiper-container">
        <div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px); transition: all 250ms linear 0s;">
          <div :class="{'tab': true, 'off':item!=activeKey,'on': item===activeKey,'swiper-slide':true}" style="width: 50%;"
               v-for="item in tabList" :key="item"
               @click="handleTab(item)"
          >
            <span class="innerText">{{item}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="contents">
      <div class="content" v-if="activeKey==='最新日志'">
        <a-spin :spinning="!stopPolling">
          <a-row style="width: 100%;height: 100%">
            <a-col :span="24">
              <a-table :columns="columns" :data-source="lastLogs" :scroll="{ x: 1500,y: 1000}" :pagination="false">
                <template #bodyCell="{ column, text }">
                  <template v-if="column.dataIndex === 'createdTime'">
                    <span>{{$moment(text).format('YYYY-MM-DD HH:mm:ss')}}</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'processParameter'">
                    <span v-if="text">{{text}}</span>
                    <span v-else>--</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'processResult'">
                    <span v-if="text">{{text}}</span>
                    <span v-else>--</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'processType'">
                    <span v-if="text">{{text}}</span>
                    <span v-else>--</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'processNodeId'">
                    <span v-if="text">{{text}}</span>
                    <span v-else>--</span>
                  </template>
                </template>
              </a-table>
            </a-col>
          </a-row>
        </a-spin>
      </div>
      <div class="content" v-else-if="activeKey==='历史日志'">
        <div style="width: 100%;height: 100%;background: #fff">
          <a-timeline class="timeline—group" v-if="timeLineList.length">
            <a-timeline-item v-for="(item,index) of timeLineList" :key="index">
              <p>
                <span>{{'日志ID:'+item.taskId+'\n'+item.createdBy+'\n'+$moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')+'\n'}}</span>
                <a v-if="item.status==0" @click="showLogDetail(item)">执行状态: 已经启动</a>
                <a v-else-if="item.status==1" @click="showLogDetail(item)">执行状态: 正在运行</a>
                <a v-else-if="item.status==2" @click="showLogDetail(item)">执行状态: 执行成功</a>
                <a v-else-if="item.status==3" @click="showLogDetail(item)">执行状态: 执行失败</a>
              </p>
            </a-timeline-item>
          </a-timeline>
          <div v-else class="system-no-content">
            <img src="@/assets/images/noDataDefault.svg" class="system-no-content-image"><br/>
            <span class="system-no-content-text">暂无运行记录</span>
          </div>
          <a-modal v-model:visible="visible" title="日志详情"
                   :footer="null"
                   style="height: 100%;width: 100%;"
                   wrap-class-name="log-full-modal"
                   :destroyOnClose=true
                   @cancel="handleCancel"
          >
            <div style="width: 100%;height:100%;">
              <a-table :columns="columns" :data-source="logDetail" :scroll="{ x: 1500,y: 1000}" :pagination="false">
                <template #bodyCell="{ column, text }">
                  <template v-if="column.dataIndex === 'createdTime'">
                    <span>{{$moment(text).format('YYYY-MM-DD HH:mm:ss')}}</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'processParameter'">
                    <span v-if="text">{{text}}</span>
                    <span v-else>--</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'processResult'">
                    <span v-if="text">{{text}}</span>
                    <span v-else>--</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'processType'">
                    <span v-if="text">{{text}}</span>
                    <span v-else>--</span>
                  </template>
                  <template v-else-if="column.dataIndex === 'processNodeId'">
                    <span v-if="text">{{text}}</span>
                    <span v-else>--</span>
                  </template>
                </template>
              </a-table>
            </div>
          </a-modal>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import {queryLogs, queryTaskLogs} from "@/api/request";
import {ref, watchEffect,onMounted} from "vue";
import {useRouter} from "vue-router/dist/vue-router";
import {message} from "ant-design-vue";

const columns = [
  {
    title: '版本Id',
    dataIndex: 'versionId',
    key: 'versionId',
    fixed: 'left',
    width: 100
  },
  {
    title: '节点Id',
    dataIndex: 'processNodeId',
    key: 'processNodeId',
    fixed: 'left',
    width: 100
  },
  {
    title: '组件类型',
    dataIndex: 'processType',
    key: 'processType',
    fixed: 'left',
    width: 200
  },
  {
    title: '内容',
    dataIndex: 'message',
    key: 'message',
    width: 500
  },
  {
    title: '执行参数',
    dataIndex: 'processParameter',
    key: 'processParameter',
    width: 500
  },
  {
    title: '执行结果',
    dataIndex: 'processResult',
    key: 'processResult',
    width: 380
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    width: 200
  }
]
const lastLogs = ref([])

// tab页切换
const useTabEffect = ()=>{
  const tabList = ref(['最新日志', '历史日志']);
  const activeKey = ref('最新日志');
  const handleTab = (item) => {
    activeKey.value = item
  }
  return {activeKey,tabList,handleTab}
}

// 获取日志
const useLogEffect = ()=>{
  const timeLineList = ref([])
  const getLogs = async (versionId,processInstanceId)=>{
    await queryLogs(versionId,processInstanceId).then(res=>{
      if (res.code === 0 && res.data?.length){
        timeLineList.value = res.data
      }
    })
  }
  return {timeLineList,getLogs}
}

// 弹出历史日志的modal
const useModalEffect = () => {
  const visible = ref(false)
  const logDetail = ref([])
  const showLogDetail = (item)=>{
    logDetail.value = item.processInstanceLogs
    visible.value = true
  }
  const handleCancel = ()=>{
    visible.value = false
    logDetail.value = []
  }
  return {visible,logDetail,showLogDetail,handleCancel}
}

export default {
  name: "FlowLogModal",
  setup(){
    let stopPolling = ref(false)
    // 获取最新日志的函数
    const fetchLogs = async () => {
      if (router.currentRoute.value.params.taskId) {
        while (!stopPolling.value) {
          try {
            await queryTaskLogs(router.currentRoute.value.params.taskId).then(res=>{
              if (res.data.status === 2 || res.data.status === 3) {
                stopPolling.value = true; // 当后端接口返回的status为2或者3时，停止轮询
                res.data.status === 2?message.success('执行成功'):message.error('执行失败')
              }
              if (res.code == 0){
                lastLogs.value = res.data?.processInstanceLogs
              }
            })
          }
          catch (error) {
            console.error('获取日志异常:', error)
          }
          await new Promise(resolve => setTimeout(resolve, 2000)); // 每隔1秒进行一次轮询
        }
      }
    }
    const {activeKey,tabList,handleTab} = useTabEffect()
    const {timeLineList,getLogs} = useLogEffect()
    const {visible,logDetail,showLogDetail,handleCancel} = useModalEffect()
    const router = useRouter()
    watchEffect(()=>{
      if(activeKey.value==='历史日志') {
        getLogs(router.currentRoute.value.params.versionId,router.currentRoute.value.params.processInstanceId)
      }
    })
    onMounted(fetchLogs); // 组件挂载时开始调用fetchLogs函数进行轮询
    return {
      columns,lastLogs,queryTaskLogs,activeKey,tabList,handleTab,timeLineList,
      visible,logDetail,showLogDetail,handleCancel,stopPolling
    }
  }
}
</script>

<style lang="less">
.flow-logs .wrap {
  margin: 0 auto;
  padding-bottom: 10px;
  width: 95%;
}
.flow-logs .tabGroup {
  border: 1px solid #ededed;
  display: flex;
}
.flow-logs .swiper-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  z-index: 1;
}
.flow-logs .swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  box-sizing: content-box;
}
.flow-logs .on {
  position: relative;
  color: #181818;
}
.flow-logs .on:before {
  position: absolute;
  top: -1px;
  left: 0;
  display: block;
  content: "";
  width: 100%;
  height: 4px;
  transform: scale(1);
  background-color: #ff6a00;
}
.flow-logs .on:after {
  position: absolute;
  display: block;
  transform: scale(1);
  content: "";
  width: 100%;
  height: 50px;
  z-index: 5;
  background-color: #fff;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, .1);
}
.flow-logs .tab {
  display: inline-block;
  vertical-align: middle;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border-right: 1px solid #ededed;
  background-color: #fff;
  transition: all .1s ease-in;
}
.flow-logs .tab:before {
  z-index: 10;
}
.flow-logs .tab:after{
  top: 0;
  left: 0;
}
.flow-logs .off {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  border-right: 1px solid #ededed;
  background-color: #fff;
  transition: all .1s ease-in;
}
.flow-logs .off:before {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  display: block;
  content: "";
  width: 100%;
  height: 4px;
  background-color: transparent;
}
.flow-logs .off:after {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  content: "";
  width: 100%;
  height: 100%;
}
.flow-logs .tab:hover:before {
  position: absolute;
  top: -1px;
  left: 0;
  display: block;
  content: "";
  width: 100%;
  height: 4px;
  transform: scale(1);
  background-color: #ff6a00;
}
.flow-logs .tab:hover {
  color: #181818;
}
.flow-logs .swiper-slide{
  flex-shrink: 0;
}
.flow-logs .innerText {
  position: relative;
  z-index: 10;
}
.flow-logs .contents {
  display: block;
  background: #fafafa;
  width: 100%!important;
  height: auto;
  border: 1px solid #ededed;
  border-top: none;
}
.flow-logs .content {
  display: block;
  width: 100%;
  height: auto;
}
.flow-logs .timeline—group {
  padding-top: 25px;
  padding-left: 20px;
}
.log-full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: calc(100vh);
    overflow: auto;
  }
  .ant-modal-body {
    flex: 1;
  }
}
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
