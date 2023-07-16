<template>
  <a-tabs v-model:activeKey="activeKey" size="default" v-if="type!='start'&&type!='end'">
    <a-tab-pane key="1" tab="参数">
      <div style="height: 100%;width: 100%;overflow: auto">
        <a-row style="margin-bottom: 12px">
          <a-col :span="24" style="text-align: right;">
            <a type="default" @click="deleteNode(node)">删除节点</a>
          </a-col>
        </a-row>
        <tool-param-config v-if="type==='tool'" :node="node" :nodeParams="nodeParams" :activeKey="activeKey" :versionId="versionId"  @close="$emit('close')"></tool-param-config>
        <extract-param-config v-else-if="type==='extract'" :node="node" :nodeParams="nodeParams" :activeKey="activeKey" :versionId="versionId"  @close="$emit('close')"></extract-param-config>
        <condition-param-config v-else-if="type==='condition'" :node="node" :nodeParams="nodeParams" :activeKey="activeKey" :versionId="versionId"  @close="$emit('close')"></condition-param-config>
      </div>
    </a-tab-pane>
    <a-tab-pane key="2" tab="样式">
      <a-row style="margin-bottom: 12px">
        <a-col :span="24" style="text-align: right;">
          <a type="default" @click="deleteNode(node)">删除节点</a>
        </a-col>
      </a-row>
      <tool-style-config :node="node" :versionId="versionId" @close="$emit('close')"></tool-style-config>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import {ref, watchEffect} from "vue";
import ToolParamConfig from "@/views/flows/components/param/ToolParamConfig";
import ToolStyleConfig from "@/views/flows/components/ToolStyleConfig";
import {queryParameter} from "@/api/request";
import {useRouter} from "vue-router/dist/vue-router";
import {message} from "ant-design-vue";
import ConditionParamConfig from "@/views/flows/components/param/ConditionParamConfig";
import ExtractParamConfig from "@/views/flows/components/param/ExtractParamConfig";

const activeKey = ref('1')
const processInstanceId = ref(0)

// 右侧面板删除操作
const useParamsEffect = (props,ctx)=>{
  // 删除节点
  const deleteNode = (node)=>{
    // node.remove()
    ctx.emit('delete',node)
  }
  // 组件类型
  const type = ref('')
  // 参数数据
  const nodeParams = ref()
  // 获取参数tab数据
  const getToolParam  = async (node)=>{
    let req = {
      "processInstanceId": Number(processInstanceId.value),
      "processNodeUuid": node.id,
      "parameterType": "参数信息"
    }
    await queryParameter(req).then(res=>{
      if(res.code === 0){
        type.value = res.data.type
        nodeParams.value = res.data
      } else {
        message.error("参数获取失败;"+res.message)
      }
    })
  }
  watchEffect(()=>{
    if(props.visible){
      activeKey.value = '1'
      getToolParam(props.node)
    }
  })
  watchEffect(()=>{
    if (type.value ==='start' || type.value ==='end') {
      activeKey.value = '2'
    }
  })
  return {
    deleteNode,
    getToolParam,
    type,
    nodeParams
  }
}

export default {
  name: 'NodeConfigContainer',
  props: ['node','visible','versionId'],
  emits: ['delete','close'],
  components: {ExtractParamConfig, ConditionParamConfig, ToolStyleConfig, ToolParamConfig},
  setup(props,ctx){
    const router = useRouter()
    processInstanceId.value = router.currentRoute.value.params.processInstanceId
    const { deleteNode, type, nodeParams } = useParamsEffect(props,ctx)
    return {
      activeKey,deleteNode, type, nodeParams
    }
  }
}
</script>

<style scoped>
</style>
