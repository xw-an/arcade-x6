<template>
  <a-row style="width: 100%;text-align: right;padding-bottom: 5px">
    <a-col :span="24">
      <a-button size="small" type="primary" @click="testRequest">测试请求</a-button>
    </a-col>
  </a-row>
  <a-form ref="formRule" :model="formNodeParam" :label-col="{ span: 3 }" :wrapper-col="{ span: 20,offset: 1  }" style="margin-top: 5px;">
    <a-form-item label="部门" name="department" :rules="{required: true,message: '部门必选'}">
      <a-select v-model:value="formNodeParam.department" :options="departmentOptions"></a-select>
    </a-form-item>
    <a-form-item label="工具名" name="toolId" :rules="{required: true,message: '工具必选'}">
      <a-select
          v-model:value="formNodeParam.toolId"
          :options="toolNameOptions"
          show-search
          allow-clear
          :filterOption="filterOption"
      >
      </a-select>
    </a-form-item>
    <a-form-item label="请求json" name="requestJson" :rules="{required: true,message: '请求json必填'}">
      <codemirror v-model="formNodeParam.requestJson" style="height: 260px;width:100%;"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tabSize="2"
                  :extensions="extensionsRequest"/>
    </a-form-item>
    <a-form-item label="返回json">
      <codemirror v-model="formNodeParam.responseJson" style="height: 260px;width:100%;"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tabSize="2"
                  :extensions="extensionsResponse"/>
    </a-form-item>
    <a-form-item label="响应变量名">
      <a-input v-model:value="formNodeParam.responseParamName"/>
    </a-form-item>
  </a-form>
  <a-button type="primary" style="bottom: 10px;right:25px;position: fixed" @click="saveParams(node)">保存</a-button>
</template>

<script>
// 参数tab页
import {reactive, ref, watchEffect} from "vue";
import {getToolDetail, getToolNames, runTool, updateNode} from "@/api/request";
import {message} from "ant-design-vue";
import {json} from "@codemirror/lang-json";
import {Codemirror} from "vue-codemirror/dist/vue-codemirror.esm";
import {useStore} from "vuex";
import {useRouter} from "vue-router/dist/vue-router";
const processInstanceId = ref(0)
const author = ref('')

const useParamsPanelEffect = (props,ctx)=>{
  const formRule = ref({})
  const formNodeParam = reactive({
    department: null,
    toolId: null,
    requestJson: null,
    responseParamName: null,
    responseJson: null
  })
  const departmentOptions = [
    {value:'MiddlewareTool',label:'中间件'},
    {value:'FontTool',label:'前台'},
    {value:'MiddleTool',label:'中台'},
    {value:'UserTool',label:'用户'},
    {value:'UtilTool',label:'公共'}
  ]
  const toolNameOptions = ref([])
  const getNames = async ()=>{
    let req = {
      department: formNodeParam.department
    }
    await getToolNames(req).then(res=>{
      if(res.code === 0 && res.data){
        toolNameOptions.value = res.data.map(item=>{
          return {
            value: item.id,
            label: item.toolName.trim()
          }
        })
      }
    })
  }
  const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
    // return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }
  const getRequestJson = async ()=>{
    let req = {toolId: formNodeParam.toolId}
    getToolDetail(req).then(res=>{
      if(res.code === 0 && res.data?.testToolDetail) {
        let obj = JSON.parse(res.data?.testToolDetail?.requestParam)
        let requestJson = {}
        obj.forEach(item=>{
          requestJson[item.name] = item?.defaultValue
        })
        formNodeParam.requestJson = JSON.stringify(requestJson,null,'\t')
      }else{
        message.error(res.message)
      }
    })
  }
  const extensionsRequest = [json()]
  const extensionsResponse = [json()]
  // 测试请求，获取结果
  const testRequest = async()=>{
    // 先判断一下入参报文不为空在调用接口
    if (formNodeParam.requestJson && formNodeParam.toolId){
      // 调后端接口运行工具
      let req = {
        toolId: formNodeParam.toolId,
        requestParam: formNodeParam.requestJson.toString().replaceAll('\t','').replaceAll('\n',''),
        operator: "amy.xue" // todo 当前登录用户
      }
      await runTool(req).then(res=>{
        if (res.code === 0) {
          formNodeParam.responseJson = JSON.stringify(res.data.responseParam,null, '\t')
        } else {
          message.error('工具执行失败：'+res.message)
        }
      })
    }
  }
  const saveParams = async(node)=>{
    formRule.value.validateFields().then(async ()=>{
      let req = {
        "processNode": {
          "versionId": props.versionId,
          "processInstanceId": processInstanceId.value,
          "uuid": node.id,
          "updatedBy": author.value
        },
        "processInstanceParameter": [
          {
            "versionId": props.versionId,
            "parameterType": "参数信息",
            "parameterName": "params",
            "parameterValue": JSON.stringify({
              department: formNodeParam?.department,
              toolId: formNodeParam?.toolId,
              requestJson: formNodeParam?.requestJson.toString().replaceAll('\t','').replaceAll('\n',''),
              responseParamName: formNodeParam?.responseParamName,
            }),
            "updatedBy": author.value
          }]
      }
      await updateNode(req).then(res=>{
        if(res.code === 0){
          message.success("参数更新成功;"+"id:"+node.id)
          ctx.emit('close')
        } else {
          message.error("参数更新失败："+res.message)
        }
      })
    }).catch(() => {
      // console.log(error)
      message.error('请填写完必填项')
    })
  }
  watchEffect(()=>{
    if(props.activeKey == '1' && props.nodeParams){
      let jsonParams = props.nodeParams.processInstanceParameter?.parameterValue?JSON.parse(props.nodeParams.processInstanceParameter.parameterValue):null
      formNodeParam.department = jsonParams?jsonParams?.department:null
      formNodeParam.toolId = jsonParams?jsonParams?.toolId:null
      formNodeParam.requestJson = jsonParams?JSON.stringify(JSON.parse(jsonParams?.requestJson),null, '\t'):null
      formNodeParam.responseParamName = jsonParams?jsonParams?.responseParamName:null
      formNodeParam.responseJson = null
    }
  })
  watchEffect(()=>{
    if (props.activeKey == '1' && formNodeParam.department) {
      getNames()
    }
    if (props.activeKey == '1' && formNodeParam.toolId) {
      getRequestJson()
    }
  })
  return {
    formRule,
    formNodeParam,
    departmentOptions,
    toolNameOptions,
    extensionsRequest,
    extensionsResponse,
    filterOption,
    saveParams,
    testRequest
  }
}
export default {
  name: "ToolParamConfig",
  props: ['node','activeKey','nodeParams','versionId'],
  emits: ['close'],
  components: {Codemirror},
  setup(props,ctx){
    const router = useRouter()
    const store = useStore()
    processInstanceId.value = router.currentRoute.value.params.processInstanceId
    author.value = store.state.user.account
    const {formRule,formNodeParam, departmentOptions, toolNameOptions, extensionsRequest,filterOption,saveParams,extensionsResponse,testRequest} = useParamsPanelEffect(props,ctx)
    return {formRule,formNodeParam, departmentOptions, toolNameOptions, extensionsRequest,filterOption,saveParams,extensionsResponse,testRequest}
  }
}
</script>

<style scoped>

</style>
