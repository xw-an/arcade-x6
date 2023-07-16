<template>
  <div style="width: 100%;height: 100%;background: #fff" class="tool-detail-record">
    <a-timeline class="timeline—group" v-if="timeLineList.length">
      <a-timeline-item v-for="(item,index) of timeLineList" :key="index">
        <p>
          <span>{{item.operator+'\n'+$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')+'\n'}}</span>
          <a @click="showReqAndRes(item)">请求参数&响应参数</a>
        </p>
      </a-timeline-item>
    </a-timeline>
    <div v-else class="system-no-content">
      <img src="@/assets/images/noDataDefault.svg" class="system-no-content-image"><br/>
      <span class="system-no-content-text">暂无运行记录</span>
    </div>
    <a-modal v-model:visible="visible" title="请求参数&响应参数"
             :footer="null"
             width="100%"
             wrap-class-name="full-params-modal"
             :destroyOnClose=true
             @cancel="handleCancel"
    >
      <div style="width: 100%;display: flex">
        <div class="record-req-left">
          <a-button type="primary" ghost>请求报文</a-button>
          <codemirror
              v-model="reqCode"
              :style="{ width: '100%', height: '100%' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tabSize="2"
              :extensions="extensionsReq"/>
        </div>
        <div class="record-res-right">
          <a-button type="primary" ghost>返回报文</a-button>
          <codemirror
              v-model="resCode"
              :style="{ width: '100%', height: '100%' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tabSize="2"
              :extensions="extensionsRes"
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {Codemirror} from "vue-codemirror";
import {ref} from "vue";
import {json} from "@codemirror/lang-json";
import {oneDark} from "@codemirror/theme-one-dark";
import {getLog} from "@/api/request";
import {useRouter} from "vue-router";

// 弹出的modal
const useModalEffect = () => {
  const visible = ref(false);
  const reqCode = ref('')
  const resCode = ref('')
  const showReqAndRes = (item)=>{
    visible.value = true
    reqCode.value = item.requestParam?JSON.stringify(JSON.parse(item.requestParam),null,2):''
    resCode.value = item.responseParam?JSON.stringify(JSON.parse(item.responseParam),null,2):''
  }
  const handleCancel = ()=>{
    visible.value = false
    reqCode.value = ''
    resCode.value = ''
  }
  const extensionsReq = [json()]
  const extensionsRes = [json(),oneDark]
  return {
    visible,
    reqCode,
    resCode,
    showReqAndRes,
    handleCancel,
    extensionsReq,
    extensionsRes
  }
}

// 获取日志
const useLogEffect = ()=>{
  const timeLineList = ref([])
  const getLogs = async (id)=>{
    let req = {toolId: id}
    await getLog(req).then(res=>{
      if (res.code === 0 && res.data?.testToolRunRecord.length){
        timeLineList.value = res.data.testToolRunRecord
      }
    })
  }
  return {
    timeLineList,getLogs
  }
}

export default {
  name: "ToolDetailRecord",
  components: {Codemirror},
  setup() {
    const { visible, reqCode, resCode, extensionsReq, extensionsRes, showReqAndRes, handleCancel } = useModalEffect()
    const { timeLineList,getLogs } = useLogEffect()
    const router = useRouter()
    getLogs(router.currentRoute.value.params.id)
    return {
      timeLineList,visible, reqCode, resCode, extensionsReq, extensionsRes, showReqAndRes, handleCancel
    }
  }
}
</script>

<style lang="less">
.tool-detail-record .timeline—group {
  padding-top: 25px;
  padding-left: 20px;
}
.record-req-left {
  width: 49%;
  height: auto;
  background: #fff;
  border-right: 1px solid #ededed;
  min-height: 600px;
}
.record-res-right {
  width: 49%;
  height: auto;
  background: #fff;
  min-height: 600px;
}
.full-params-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
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
