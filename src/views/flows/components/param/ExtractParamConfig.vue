<template>
  <a-form ref="formRule" :model="formExtractParam" :label-col="{span: 4}" :wrapper-col="{span: 19,offset: 1}" style="overflow: auto">
    <a-card style="margin-left: 10px;margin-right: 10px;margin-top:15px;" v-for="(item,index) in formExtractParam.extractList" :key="index">
      <a-row style="width: 100%;">
        <a-col :span="23"></a-col>
        <a-col :span="1" style="text-align: right;margin-bottom: 10px">
          <MinusCircleOutlined style="color: #1890ff" @click="removeCondition(item)"/>
        </a-col>
      </a-row>
      <a-form-item label="原变量" :name="['extractList',index,'oldVariableName']" :rules="{required: true,message: '原变量必选'}">
        <a-select v-model:value="item.oldVariableName" :options="variableOptions"></a-select>
      </a-form-item>
      <a-form-item label="json表达式" :name="['extractList',index,'expression']"  :rules="{required: true,message: '表达式必填'}">
        <a-input v-model:value="item.expression" placeholder="JsonPath表达式"></a-input>
      </a-form-item>
      <a-form-item label="新变量名" :name="['extractList',index,'newVariableName']" :rules="{required: true,message: '新变量名必填'}">
        <a-input v-model:value="item.newVariableName" placeholder="保存结果的变量名"></a-input>
      </a-form-item>
    </a-card>
  </a-form>
  <a-row style="width: 100%;margin-top: 15px;">
    <a-button type="dashed" block style="color: #ff6a00;margin-left: 10px;margin-right: 10px" @click="addCondition"><PlusOutlined/>添加条件</a-button>
  </a-row>
  <a-button type="primary" style="bottom: 10px;right:25px;position: fixed" @click="saveParams(node)">保存</a-button>
</template>

<script>
import {reactive, ref, watchEffect} from "vue"
import {queryVariables, updateNode} from "@/api/request";
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from "vuex";
import {message} from "ant-design-vue";
const processInstanceId = ref(0)
const author = ref('')

// 提取变量名选择器
const useVariableNameEffect = (props)=>{
  const variableOptions = ref([])
  const queryVariablesList = async ()=>{
    await queryVariables(props.versionId,processInstanceId.value).then(res=>{
      if (res.code===0 && res.data){
        res.data.forEach(item=>{
          variableOptions.value.push({
            value: item,
            label: item
          })
        })
      }
    })
  }
  watchEffect(()=>{
    if (props.activeKey == '1') {
      queryVariablesList()
    }
  })
  return {variableOptions}
}

// 提取组件
const useVariableEffect = (props,ctx)=>{
  const formRule = ref({})
  const formExtractParam = reactive({extractList: [{oldVariableName:'',expression:'',newVariableName:''}]})
  watchEffect(()=>{
    if(props.activeKey == '1' && props.nodeParams){
      let jsonParams = props.nodeParams.processInstanceParameter.parameterValue?JSON.parse(props.nodeParams.processInstanceParameter.parameterValue):null
      formExtractParam.extractList = jsonParams?jsonParams.extractList:[{oldVariableName:'',expression:'',newVariableName:''}]
    }
  })
  const addCondition = ()=>{
    formExtractParam.extractList.push({oldVariableName:'',expression:'',newVariableName:''})
  }
  const removeCondition = (item)=>{
    let index = formExtractParam.extractList.indexOf(item)
    if (index !== -1) {
      formExtractParam.extractList.splice(index, 1);
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
              extractList: formExtractParam.extractList
            }),
            "updatedBy": author.value
          }]
      }
      await updateNode(req).then(res=>{
        if(res.code === 0){
          message.success("参数更新成功;"+"id:"+node.id)
          ctx.emit('close')
        } else {
          message.error("参数更新失败;"+res.message)
        }
      })
    }).catch(()=>{
      message.error('请填写完必填项')
    })
  }
  return {formRule,formExtractParam, addCondition, removeCondition,saveParams}
}
export default {
  name: "ExtractParamConfig",
  props: ['node','activeKey','nodeParams','versionId'],
  emits: ['close'],
  setup(props,ctx){
    const router = useRouter()
    const store = useStore()
    processInstanceId.value = router.currentRoute.value.params.processInstanceId
    author.value = store.state.user.account
    const {variableOptions} = useVariableNameEffect(props)
    const {formRule,formExtractParam,addCondition, removeCondition,saveParams} = useVariableEffect(props,ctx)
    return {
      formRule,
      formExtractParam,
      variableOptions,
      addCondition,
      removeCondition,
      saveParams
    }
  }

}
</script>

<style scoped>

</style>
