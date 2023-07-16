<template>
  <div id="header">
    <a-tooltip title="放大">
      <span class="iconfont header-iconfont" @click="()=>{graphConfig.zoom(0.2)}">&#xe898;</span>
    </a-tooltip>
    <a-tooltip title="缩小">
      <span class="iconfont header-iconfont" @click="()=>{graphConfig.zoom(-0.2)}">&#xe897;</span>
    </a-tooltip>
<!--    <a-tooltip title="撤销">-->
<!--      <span class="iconfont header-iconfont" @click="()=>{graphConfig.history.undo()}">&#xe739;</span>-->
<!--    </a-tooltip>-->
<!--    <a-tooltip title="取消撤销">-->
<!--      <span class="iconfont header-iconfont" @click="()=>{graphConfig.history.redo()}">&#xe652;</span>-->
<!--    </a-tooltip>-->
    <a-tooltip title="导出svg">
      <span class="iconfont header-iconfont" @click="saveToSvg">&#xe64a;</span>
    </a-tooltip>
    <a-tooltip title="运行">
      <span class="iconfont header-iconfont" @click="handleRun">&#xe616;</span>
    </a-tooltip>
<!--    <a-tooltip title="日志详情">-->
<!--      <span class="iconfont header-iconfont" @click="handleLog">&#xe649;</span>-->
<!--    </a-tooltip>-->
    <a-tooltip title="版本管理">
      <span class="iconfont header-iconfont" @click="handleVersion">&#xe68b;</span>
    </a-tooltip>
  </div>
  <a-modal v-model:visible="versionVisible" title="版本管理" :footer="null" width="95%">
    <a-table :columns="versionColumns" :data-source="versionData" :scroll="{ x: 1500, y: 500 }" class="version-table" :customRow="handleRowClick" :rowClassName="rowClassName">
      <template #bodyCell="{ column,record }">
        <template v-if="column.key === 'createdTime'">
          <span>{{dateFormat(record.createdTime)}}</span>
        </template>
        <template v-else-if="column.key === 'updatedTime'">
          <span>{{dateFormat(record.updatedTime)}}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <a-tag color="orange" v-if="record.status==0">未发布</a-tag>
          <a-tag color="green" v-else-if="record.status==1">已发布</a-tag>
          <a-tag color="red" v-else-if="record.status==2">已下线</a-tag>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-button type="link" @click="handleCopy(record)">复制</a-button>
          <a-divider type="vertical"/>
          <a-button type="link" @click="handlePublish(record)">发布</a-button>
          <a-divider type="vertical"/>
          <a-button type="link" @click="handleOffline(record)">下线</a-button>
          <a-divider type="vertical"/>
          <a-button type="link" @click="handleLog(record)">日志</a-button>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import {DataUri} from '@antv/x6'
import {copyVersion, executeFlow, offlineVersion, publishVersion, queryLastTaskId, queryVersions} from "@/api/request";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router/dist/vue-router";
import {ref} from "vue";
import moment from "moment";

// 公共方法
const commonFunc = ()=>{
  const dateFormat = (val)=>{
    return moment(val).format('YYYY-MM-DD HH:mm:ss')
  }
  return {dateFormat}
}

// 版本管理模块
const useVersionEffect = (props,ctx)=>{
  const selectedRow  = ref(null)
  const versionVisible = ref(false)
  // 版本管理
  const handleVersion = ()=>{
    // 弹出一个modal
    versionVisible.value = true
    // 获取版本数据
    getVersionData()
  }
  // 版本管理表格
  const versionColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      // fixed: 'left',
      width: 80
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: 80
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 130
    },
    {
      title: '修改人',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 100
    },
    {
      title: '修改时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 130
    },
    {
      title: '操作',
      key: 'operation',
      // fixed: 'right',
      width: 200,
    }]
  const versionData = ref([])
  // 调后端接口获取数据
  const getVersionData = async ()=>{
    const res = await queryVersions(props.processInstanceId)
    if(res.code == 0){
      versionData.value = res.data
    }
  }
  // 发布当前版本
  const handlePublish = async (record)=>{
    let req = {
      id: record.id,
      processInstanceId: props.processInstanceId,
      updatedBy: 'amy.xue'
    }
    const res = await publishVersion(req)
    if(res.code == 0){
      message.success('发布成功')
      getVersionData()
    }else {
      message.error('发布失败：'+res.message)
    }
  }
  // 下线当前版本
  const handleOffline = async (record)=>{
    let req = {
      id: record.id,
      processInstanceId: props.processInstanceId,
      updatedBy: 'amy.xue'
    }
    const res = await offlineVersion(req)
    if(res.code == 0){
      message.success('下线成功')
      getVersionData()
    }else {
      message.error('下线失败：'+res.message)
    }
  }
  // 复制当前版本
  const handleCopy = async (record)=>{
    let req = {
      id: record.id,
      processInstanceId: props.processInstanceId,
      createdBy: 'amy.xue',
      updatedBy: 'amy.xue'
    }
    const res = await copyVersion(req)
    if(res.code == 0){
      message.success('复制成功')
      getVersionData()
    }else {
      message.error('复制失败：'+res.message)
    }
  }
  // 鼠标点击
  const handleRowClick = (record) => {
    return {
      // onMouseenter: () => {
      //   // 鼠标移入行时的处理逻辑
      //   console.log('鼠标移入行时的处理逻辑')
      // },
      // onMouseleave: () => {
      //   // 鼠标移出行时的处理逻辑
      //   console.log('鼠标移出行时的处理逻辑')
      // },
      onClick: () => {
        // 行点击事件的处理逻辑
        // console.log(record)
        // console.log(index)
        console.log('行点击事件的处理逻辑')
        selectedRow.value = record
        // 获取当前的版本号，更新props中的versionId
        ctx.emit('updateVersion',record)
        versionVisible.value = false
      }
    }
  }
  const rowClassName = (record) => {
    if (record.id === props.versionId) {
      return 'change-row-bg'
    }
    if (selectedRow.value && selectedRow.value.id === record.id) {
      return 'change-row-bg'
    }
  }
  return {versionVisible,handleVersion,versionColumns,versionData,getVersionData,handlePublish,handleOffline,handleCopy,handleRowClick,rowClassName}
}

export default {
  name: "GraphConfigContainer",
  props: ['graphConfig','versionId','processInstanceId'],
  emits: ['updateVersion'],
  setup(props,ctx) {
    const {dateFormat} = commonFunc()
    const router = useRouter()
    // 保存成svg图片
    const saveToSvg = ()=> {
     props.graphConfig.toSVG(dataUri => {
        // 下载
        DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg')
        // }, {
        //   preserveDimensions: {
        //     width: 800,
        //     height: 800
        //   }
        // })
      })
   }
    // 运行流程
    const handleRun = () =>{
    let req = {
      "versionId": props.versionId,
      "processInstanceId": router.currentRoute.value.params.processInstanceId,
      "author": "amy.xue" // todo 需要替换变量
    }
    // 调执行流程接口
    executeFlow(req).then(res=>{
      if (res.code == 0) {
        message.success('执行发起成功')
        // 跳转到任务管理页面，并携带任务id参数
        const {href} = router.resolve({
          path: '/task',
          query: {
            processInstanceName: router.currentRoute.value.params.name,
            versionId: req.versionId,
            // processInstanceId: res.data.processInstanceId,
            taskId: res.data.id
          }
        })
        window.open(href, '_blank')
        // router.push('/flows/log/'+router.currentRoute.value.params.name+'/'+res.data.processInstanceId+'/'+res.data.id)
      } else {
        message.error(res.message)
      }
    })
  }
    // 日志详情
    const handleLog = (record)=>{
      queryLastTaskId(record.id,router.currentRoute.value.params.processInstanceId).then(res=>{
        if(res.data){
          const {href} = router.resolve({
            path: '/flows/log/'+router.currentRoute.value.params.name+'/'+record.id+'/'+router.currentRoute.value.params.processInstanceId+'/'+res.data
          })
          window.open(href, '_blank')
          // router.push('/flows/log/'+router.currentRoute.value.params.name+'/'+router.currentRoute.value.params.processInstanceId+'/'+res.data)
        }else {
          message.error('该流程版本下暂无日志')
        }
      })
    }
    const {versionVisible,handleVersion,versionColumns,versionData,handlePublish,handleOffline,handleCopy,handleRowClick,rowClassName} = useVersionEffect(props,ctx)
    return {saveToSvg,handleRun,handleLog,handleVersion,versionVisible,versionColumns,versionData,dateFormat,handlePublish,handleOffline,handleCopy,handleRowClick,rowClassName}
  }
}
</script>

<style scoped>
#header {
  display: flex;
  border-top: 1px solid #dfe3e8;
  padding-top: 5px;
  margin:0;
  height: 35px;
  width: 100%;
}
.header-iconfont{
  margin-left: 20px;
  cursor: pointer;
  color: #595959;
}

/deep/ .change-row-bg {
  background-color: #FCF0E6 !important;
  cursor: pointer;
}

/deep/ .ant-table-tbody > tr > td {
  background-color: unset !important;
}
/deep/ .ant-table-tbody > tr:hover > td {
  background-color: #FCF0E6 !important;
  cursor: pointer;
}
</style>
