<template>
  <a-form ref="formRule" :model="formConditionParam" :label-col="{span: 5}" :wrapper-col="{span: 18,offset: 1}" style="overflow: auto">
    <a-card style="margin-left: 10px;margin-right: 10px;margin-top:15px;" v-for="(item,index) in formConditionParam.conditionList" :key="index">
      <a-row style="width: 100%;">
        <a-col :span="23"></a-col>
        <a-col :span="1" style="text-align: right;margin-bottom: 10px">
          <MinusCircleOutlined style="color: #1890ff" @click="removeCondition(item)"/>
        </a-col>
      </a-row>
      <a-form-item label="分支条件变量" :name="['conditionList',index,'jsonName']" :rules="{required: true,message: '条件变量必填'}">
        <a-select v-model:value="item.jsonName" :options="jsonNameOption"></a-select>
      </a-form-item>
      <a-form-item label="分支条件表达式" :name="['conditionList',index,'expression']" :rules="{required: true,message: '表达式必填'}">
        <a-input v-model:value="item.expression" placeholder="JsonPath表达式" style="width: 60%;margin-right: 5px"></a-input>
        <a-select v-model:value="item.operator" :options="operatorOption" style="width: 17%;text-align:center;margin-right: 5px"></a-select>
        <a-input v-model:value="item.expectedValue" placeholder="期望值" style="width: 20%"></a-input>
      </a-form-item>
      <a-form-item label="执行组件" :name="['conditionList',index,'componentId']" :rules="{required: true,message: '执行组件必填'}">
<!--        <a-cascader v-model:value="item.component" :options="componentOptions" placeholder="请选择执行组件"/>-->
        <a-select v-model:value="item.componentId" :options="componentOptions"></a-select>
      </a-form-item>
    </a-card>
  </a-form>
  <a-row style="width: 100%;margin-top: 15px;">
    <a-button v-if="formConditionParam.conditionList.length<3" type="dashed" block style="color: #ff6a00;margin-left: 10px;margin-right: 10px" @click="addCondition"><PlusOutlined/>添加条件</a-button>
  </a-row>
  <a-button type="primary" style="bottom: 10px;right:25px;position: fixed" @click="saveParams(node)">保存</a-button>
</template>

<script>
import {reactive, ref, watchEffect} from "vue";
import {message} from "ant-design-vue";
import {getAllComponent, queryNodes, queryVariables, updateNode} from "@/api/request";
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from "vuex";

const processInstanceId = ref(0)
const author = ref('')

// 条件分支选择对应的组件
const useComponentEffect = (props)=>{
  const componentOptions =  ref([])
  const getOptions = async ()=>{
    await queryNodes(props.versionId,processInstanceId.value).then(res=>{
      if (res.code===0 && res.data) {
        res.data.forEach(item=>{
          componentOptions.value.push({
            value: item.id,
            label: item.name
          })
        })
      }
    })
  }
  const initOptions = async ()=>{
    await getAllComponent().then(res=>{
      if (res.code===0 && res.data){
        res.data.forEach((item,index)=>{
          componentOptions.value.push({
            value: item.category,
            label: item.category,
            children: []
          })
          item.children.forEach((child,ind)=>{
            componentOptions.value[index].children.push({
              value: child.businessName,
              label: child.businessName,
              children: []
            })
            child.children.forEach(ch=>{
              componentOptions.value[index].children[ind].children.push({...ch,
                value: ch.id,
                label: ch.toolName?ch.toolName:ch.name,
              })
            })
          })
        })
      }
    })
  }
  watchEffect(()=>{
    if(props.activeKey == '1'){
      getOptions()
    }
  })
  return {componentOptions,initOptions,getOptions}

}

// 条件分支选择对应的变量
const useNamesEffect = (props)=>{
  const jsonNameOption = ref([])
  const queryVariablesList = async ()=>{
    await queryVariables(props.versionId,processInstanceId.value).then(res=>{
      if (res.code===0 && res.data){
        res.data.forEach(item=>{
          jsonNameOption.value.push({
            value: item,
            label: item
          })
        })
      }
    })
  }
  watchEffect(()=>{
    if(props.activeKey == '1'){
      queryVariablesList()
    }
  })
  return {jsonNameOption,queryVariablesList}
}

// 分支条件组件
const useConditionEffect = (props,ctx)=>{
  const formRule = ref({})
  const formConditionParam = reactive({conditionList: [{jsonName:'',expression:'',operator:'==',expectedValue:'',componentId:''}]})
  const operatorOption = [{
    value: '==',
    label: '=='
  },{
    value: '!=',
    label: '!='
  },{
    value: '<',
    label: '<'
  },{
    value: '<=',
    label: '<='
  },{
    value: '>',
    label: '>'
  },{
    value: '>=',
    label: '>='
  },{
    value: 'contains',
    label: 'contains'
  },{
    value: 'startsWith',
    label: 'startsWith'
  },{
    value: 'endsWith',
    label: 'endsWith'
  }]
  watchEffect(()=>{
    if(props.activeKey == '1' && props.nodeParams){
      let jsonParams = props.nodeParams.processInstanceParameter.parameterValue?JSON.parse(props.nodeParams.processInstanceParameter.parameterValue):null
      formConditionParam.conditionList = jsonParams?jsonParams.conditionList:[{jsonName:'',expression:'',operator:'==',expectedValue:'',componentId:''}]
    }
  })
  // const formConditionParam = reactive(props.nodeParams.processInstanceParameter.parameterValue?JSON.parse(props.nodeParams.processInstanceParameter.parameterValue) :{conditionList: [{expression:'',component:''}]})
  const addCondition = ()=>{
    if (formConditionParam.conditionList.length<3){
      formConditionParam.conditionList.push({expression:'',component:''})
    } else {
      message.error('最多只能添加3个分支条件')
    }
  }
  const removeCondition = (item)=>{
    let index = formConditionParam.conditionList.indexOf(item)
    if (index !== -1) {
      formConditionParam.conditionList.splice(index, 1);
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
              conditionList: formConditionParam.conditionList
            }),
            "updatedBy": author.value
          }]
      }
      await updateNode(req).then(res=>{
        if(res.code === 0){
          message.success("参数更新成功;"+"id:"+node.id)
          ctx.emit('close')
        } else {
          message.error("参数更新失败:"+res.message)
        }
      })
    }).catch(()=>{
      message.error('请填写完必填项')
    })
  }
  return {formRule,formConditionParam,addCondition,removeCondition,saveParams,operatorOption}
}

export default {
  name: "ConditionParamConfig",
  props: ['node','nodeParams','activeKey','versionId'],
  emits:['close'],
  setup(props,ctx){
    const router = useRouter()
    const store = useStore()
    processInstanceId.value = router.currentRoute.value.params.processInstanceId
    author.value = store.state.user.account
    const {componentOptions} = useComponentEffect(props)
    const {jsonNameOption} = useNamesEffect(props)
    const {formRule,formConditionParam,addCondition,removeCondition,saveParams,operatorOption} = useConditionEffect(props,ctx)
    // getOptions()
    return {formRule,formConditionParam,componentOptions,addCondition,removeCondition,saveParams,operatorOption,jsonNameOption}
  }
}
</script>

<style scoped>

</style>
