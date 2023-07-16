<template>
  <div style="padding: 20px 20px 0px 20px;height: 100%;line-height: 100%;">
    <div class="main-box">
      <div class="page-bg"/>
      <div class="page-bg-two"/>
      <div class="inner">
        <div class="title">
          <div class="title-txt">任务调度管理，精确掌控执行进程</div>
        </div>
        <div class="desc">
          <span>简单易用的任务调度工具，让流程管理更顺畅</span>
          <!--          <span>使测试流程更加自动化和高效化</span>-->
        </div>
        <!--        <div class="notice">-->
        <!--          <span>简单易用的任务调度工具，让流程管理更顺畅</span>-->
        <!--        </div>-->
      </div>
    </div>
    <a-row style="width: 100%;height: auto;margin-top: 350px;margin-bottom: 18px">
      <a-col :span="22" style="text-align: left">
        <a-input style="width: 10%;margin-right: 6px" allow-clear placeholder="任务ID" v-model:value="taskId"></a-input>
        <a-select style="width: 20%;margin-right: 6px" allow-clear placeholder="业务线" v-model:value="businessLine" :options="businessLineList.map(item=>({value: item,label: item}))"></a-select>
        <a-input style="width: 20%;margin-right: 6px" allow-clear placeholder="流程实例名" v-model:value="processInstanceName"></a-input>
        <a-input style="width: 15%;margin-right: 6px" allow-clear placeholder="实例版本ID" v-model:value="versionId"></a-input>
        <a-select style="width: 15%;margin-right: 6px" allow-clear placeholder="状态" v-model:value="status">
          <a-select-option value=0>未开始</a-select-option>
          <a-select-option value=1>运行中</a-select-option>
          <a-select-option value=2>执行成功</a-select-option>
          <a-select-option value=3>执行失败</a-select-option>
        </a-select>
        <a-input style="width: 15%;margin-right: 6px" allow-clear placeholder="创建人" v-model:value="createdBy"></a-input>
        <!--        <a-range-picker-->
        <!--          style="width: 20%;"-->
        <!--          :show-time="{ format: 'HH:mm' }"-->
        <!--          format="YYYY-MM-DD HH:mm"-->
        <!--          :placeholder="['开始时间', '结束时间']"-->
        <!--        />-->
      </a-col>
      <a-col :span="2" style="text-align: right;">
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </a-col>
    </a-row>
    <a-row style="width: 100%;height: auto;margin-top: 18px;margin-bottom: 18px">
      <a-row class="task-item" v-for="(item,index) in taskList" :key="index">
        <a-col :span="5" class="task-item-left">
          <div class="task-item-left-title">
            <a-tag color="default" v-if="item.status==0" style="width: 70px;text-align: center;align-items: center">
              <template #icon>
                <minus-circle-outlined />
              </template>
              未开始
            </a-tag>
            <a-tag color="processing" v-else-if="item.status==1" style="width: 70px;text-align: center;align-items: center">
              <template #icon>
                <sync-outlined :spin="true" />
              </template>
              运行中
            </a-tag>
            <a-tag color="success" v-else-if="item.status==2" style="width: 70px;text-align: center;align-items: center">
              <template #icon>
                <check-circle-outlined/>
              </template>
              成功
            </a-tag>
            <a-tag color="error" v-else-if="item.status==3"  style="width: 70px;text-align: center;align-items: center">
              <template #icon>
                <close-circle-outlined/>
              </template>
              失败
            </a-tag>
            <a-tooltip placement="topLeft" :title="item.processInstanceName">
              <span>{{item.processInstanceName}}</span>
            </a-tooltip>
          </div>
          <!--          <div class="task-item-left-desc">任务ID:10 版本ID:1</div>-->
        </a-col>
        <a-col :span="16" class="task-item-center">
          <ul class="task-item-center-title">
            <li style="display: inline-block;margin-right: 10px;">
              <span class="task-item-center-label">任务ID</span>
              <span class="task-item-center-text">{{item.id}}</span>
            </li>
            <li style="display: inline-block;margin-right: 10px;">
              <span class="task-item-center-label">流程实例ID</span>
              <span class="task-item-center-text">{{item.processInstanceId}}</span>
            </li>
            <li style="display: inline-block;margin-right: 10px;">
              <span class="task-item-center-label">版本ID</span>
              <span class="task-item-center-text">{{item.versionId}}</span>
            </li>
            <li style="display: inline-block;margin-right: 10px;">
              <span class="task-item-center-label">创建人</span>
              <span class="task-item-center-text">{{item.createdBy}}</span>
            </li>
            <li style="display: inline-block;margin-right: 10px;">
              <span class="task-item-center-label">创建时间</span>
              <span class="task-item-center-text">{{$moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </li>
            <li style="display: inline-block;margin-right: 10px;">
              <span class="task-item-center-label">结束时间</span>
              <span class="task-item-center-text">{{item.updatedTime?$moment(item.updatedTime).format('YYYY-MM-DD HH:mm:ss'):'--'}}</span>
            </li>
          </ul>
        </a-col>
        <a-col :span="3" class="task-item-right">
          <a-button type="primary" style="margin-right: 18px;" @click="handleLog(item)">日志</a-button>
<!--          <a-button type="primary" ghost v-if="item.status==2 || item.status==3">重跑</a-button>-->
<!--          <a-button danger v-else-if="item.status==0 || item.status==1">停止</a-button>-->
        </a-col>
      </a-row>
      <a-row style="width: 100%;text-align: center;margin-top:18px">
        <a-col :span="24">
          <a-button type="primary" ghost v-if="!isLastPage" @click="handleMore">查看更多内容</a-button>
          <span style="color:#fe6a00;cursor: pointer" v-else>没有更多内容了</span>
        </a-col>
      </a-row>
    </a-row>
  </div>
  <a-modal v-model:visible="visible" :footer="null" @ok="handleOk" width="90%">
    <template #title>
      <a-row style="width: 100%;align-items: center;text-align: left">
        <a-col :span="24">
          <a-tag color="#ff9933" v-if="logData.status==3" style="width: 70px;text-align: center;align-items: center">未开始</a-tag>
          <a-tag color="#0cacf3" v-else-if="logData.status==1" style="width: 70px;text-align: center;align-items: center">运行中</a-tag>
          <a-tag color="#74c950" v-else-if="logData.status==2" style="width: 70px;text-align: center;align-items: center">执行成功</a-tag>
          <a-tag color="#f50" v-else-if="logData.status==0" style="width: 70px;text-align: center;align-items: center">执行失败</a-tag>
          <span>{{'任务id：'+logData.taskId}}</span>
        </a-col>
      </a-row>
    </template>
    <a-spin :spinning="!stopPolling">
      <a-row style="width: 100%;height: 100%">
        <a-col :span="24">
          <a-table :columns="columns" :data-source="currentLog" :scroll="{ x: 1300,y: 800}" :pagination="false">
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
  </a-modal>
</template>

<script>

import {onMounted, reactive, ref, toRefs} from "vue";
import {useRouter} from "vue-router/dist/vue-router";
import {queryTaskList, queryTaskLogs} from "@/api/request";
import {message} from "ant-design-vue";

const useDataEffect = ()=>{
  const currentPage = ref(1)
  let isLastPage = ref(false)
  let data = reactive({taskList:[]})
  const businessLineList = ['业务线1','业务线2','业务线3']
  // 获取后端数据
  const getTaskList = async (req,isAppend) => {
    isAppend?req.currentPage = currentPage.value:data.taskList = []
    await queryTaskList(req).then(res => {
      if (res.code === 0 && res.data?.processTaskList?.length) {
        isAppend?data.taskList = data.taskList.concat(res.data.processTaskList):data.taskList = res.data.processTaskList
        currentPage.value * 10>=res.data.total?isLastPage.value=true:isLastPage.value=false
      } else {
        currentPage.value = 1
        isLastPage.value = true
      }
    })
  }
  return {
    ...toRefs(data),
    businessLineList,
    getTaskList,
    currentPage,
    isLastPage
  }
}

const useLogEffect = ()=>{
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
  const currentLog = ref([])
  const logData = ref({})
  const stopPolling = ref(false)
  const visible = ref(false)
  const handleOk = ()=>{
    visible.value = false
    currentLog.value = []
    logData.value = {}
  }
  // 获取最新日志的函数
  const fetchLogs = async (taskId) => {
    stopPolling.value = false
    if (taskId) {
      while (!stopPolling.value) {
        try {
          await queryTaskLogs(taskId).then(res=>{
            if (res.data.status === 2 || res.data.status === 3||res.code!=0) {
              stopPolling.value = true; // 当后端接口返回的status为2或者3时，停止轮询
              // res.data.status === 2?message.success('执行成功'):message.error('执行失败')
            }
            if (res.code == 0){
              currentLog.value = res.data?.processInstanceLogs
              logData.value = res.data
            } else {
              message.error('获取日志异常:', res.message)
            }
          })
        }
        catch (error) {
          message.error('获取日志异常:', error)
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // 每隔1秒进行一次轮询
      }
    }
  }
  return {
    columns,
    currentLog,
    logData,
    stopPolling,
    visible,
    handleOk,
    fetchLogs
  }
}

export default {
  name: "TaskList",
  setup() {
    let {taskList, businessLineList,getTaskList,currentPage,isLastPage} = useDataEffect()
    const {columns,logData,currentLog, stopPolling, visible, handleOk,fetchLogs} = useLogEffect()
    const router = useRouter()
    let filterData = reactive({
      processInstanceName: router.currentRoute.value.query?.processInstanceName,
      versionId: router.currentRoute.value.query?.versionId,
      // processInstanceId: router.currentRoute.value.query?.processInstanceId,
      taskId: router.currentRoute.value?.query?.taskId,
      status: null,
      createdBy: null,
      businessLine: null,
      pageSize: 10,
      currentPage: 1
    })
    // 根据筛选条件查询数据
    const handleSearch = async () => {
      currentPage.value = 1
      filterData.currentPage = 1
      await getTaskList(filterData,false)
    }
    const handleMore = async ()=>{
      currentPage.value++
      await getTaskList(filterData,true)
    }
    // 查看日志
    const handleLog = (item)=>{
      visible.value = true
      // 根据item的id获取日志详细信息
      fetchLogs(item.id)
    }
    onMounted(()=>{
      getTaskList(filterData,false)
    })
    return {
      ...toRefs(filterData),taskList,businessLineList,getTaskList,handleSearch,currentPage,isLastPage,
      handleMore,handleLog,
      columns,logData,visible,handleOk,currentLog,stopPolling
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
  top: 0px;
  width: 100%;
  left: 0;
  height: 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  background-image: url("../../assets/images/任务管理背景图.png");
}
.page-bg-two {
  position: absolute;
  top: 0;
  width: 25%;
  right: 30px;
  height: 100%;
  background-repeat: no-repeat;
  background-position: top;
  background-size: cover;
  background-image: url("../../assets/images/任务时间背景图.png");
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
  background-image: linear-gradient(90deg,#ff8833,#ffad1a);
  color: #fff;
  font-size: 14px;
  line-height: 24px;
  height: 24px;
  white-space: nowrap;
  padding: 0 10px;
}
.task-item {
  width: 100%;
  min-height: 80px;
  margin-top: 10px;
  background-image: linear-gradient(90deg,#f2f2f2,#fcfcfc);
  border: 1px solid #f2f2f2;
  box-shadow: 8px 8px 20px 0 rgba(55,99,170,.1), -8px -8px 20px 0 #f2f2f2;
}
.task-item:hover {
  position: relative;
  /*border: 1px solid #fcfcfc;*/
  /*box-shadow: 6px 6px 15px 0 rgba(55,99,170,.1), -6px -6px 15px 0 #fcfcfc;*/
}

.task-item-left {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18px;
  background-image: linear-gradient(50deg,#ff974d,#ffbf4d);
}
.task-item-left-title {
  font-size: 18px;
  line-height: 25px;
  text-align: left;
  align-items: center;
  display: block;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.task-item-left-desc {
  font-size: 13px;
  color: #3d485d;
  line-height: 20px;
  margin-top: 8px;
}
.task-item-center {
  width: 100%;
  display: flex;
  padding: 10px;
}
.task-item-center-label {
  display: block;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  color: #3d485d;
  /*padding-top: 10px;*/
}
.task-item-center-text {
  min-width: 80px;
  height: 36px;
  background: #fff;
  border: 2px solid #fff;
  box-shadow: 8px 8px 20px 0 rgba(55,99,170,.1), -8px -8px 20px 0 #fff, inset 0 4px 20px 0 hsla(0,0%,100%,.5);
  border-radius: 1px;
  color: #333;
  padding: 7px 8px;
  margin-top: 12px;
  display: block;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
}
.task-item-right:before {
  content: "";
  display: inline-block;
  width: 1px;
  background-color: #ddd;
  position: absolute;
  top: 18px;
  bottom: 18px;
  left: 0;
}
.task-item-right {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
}
</style>
