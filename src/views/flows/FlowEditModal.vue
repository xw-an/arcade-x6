<template>
  <a-modal :visible="visible"
           title="编辑流程"
           okText="提交"
           cancelText="取消"
           @ok="handleOk($store.state.user.account)"
           @cancel="handleCancel"
           width="680px"
  >
    <a-form :model="formState" ref="formRule" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 ,offset: 1}">
      <a-form-item label="流程名称" name="name" :rules="[{ required: true, message: '流程名称必填项'}]">
        <a-input show-count :maxlength="50" allow-clear v-model:value="formState.name" placeholder="请输入流程名称"/>
      </a-form-item>
      <a-form-item label="流程描述" name="description">
        <a-textarea show-count :maxlength="100" :rows="4" v-model:value="formState.description" placeholder="请输入描述信息"/>
      </a-form-item>
      <a-form-item label="业务线" name="businessLine" :rules="[{ required: true, message: '业务线必填项'}]">
        <a-select v-model:value="formState.businessLine" :options="businessLines" placeholder="请选择业务线"></a-select>
      </a-form-item>
      <a-form-item label="所属类型" name="type" :rules="[{ required: true, message: '所属类型必填项'}]">
        <a-select v-model:value="formState.type" :options="types" placeholder="请选择流程类型"></a-select>
      </a-form-item>
<!--      <a-form-item label="版本号" name="version">-->
<!--        <a-input v-model:value="formState.version"/>-->
<!--      </a-form-item>-->
    </a-form>
  </a-modal>
</template>

<script>
import {reactive, ref, watchEffect} from 'vue'
import {message} from "ant-design-vue";
import {editFlow} from "@/api/request";
const useFormState = (props,ctx)=>{
  const formRule = ref()
  let formState = reactive({
    id: 0,
    name: '',
    description: '',
    businessLine: '',
    type: '',
    // version: ''
  })
  const businessLines = [
    {label: '业务线1', value: '业务线1'},
    {label: '业务线2', value: '业务线2'},
    {label: '业务线3', value: '业务线3'}
  ]
  const types = [
    {label: '工具组件', value: 'tool'},
    {label: '流程组件', value: 'flow'},
    {label: '自动化组件', value: 'autotest'}
  ]
  const handleOk = (userAccount) => {
    formRule.value.validateFields().then(async ()=>{
      let req = {
        id: formState.id,
        name: formState.name,
        description: formState.description,
        businessLine: formState.businessLine,
        type: formState.type,
        // version: formState.version,
        // status: 0, // 更新不修改状态值
        // createdBy: userAccount, // 更新不修改创建人
        updatedBy: userAccount
      }
      //调后端接口添加
      await editFlow(req).then(res=>{
        if (res?.code === 0) {
          formRule.value.resetFields()
          message.success('修改成功')
          ctx.emit('confirm')
        } else {
          message.error('添加失败：'+res?.msg)
        }
      })
    }).catch(() => {
      // console.log(error)
      message.error('请填写完必填项')
    })
  }
  const handleCancel = () => {
    formRule.value.resetFields()
    ctx.emit('close')
  }
  return {
    formState,
    formRule,
    businessLines,
    types,
    handleOk,
    handleCancel
  }
}

export default {
  name: "FlowEditModal",
  props:['visible','data'],
  emits:['close','confirm'],
  setup(props,ctx) {
    let {formState,formRule,businessLines,types,handleOk,handleCancel} = useFormState(props,ctx)
    watchEffect(()=>{
      if(props.visible) {
        formState.id  = props?.data?.id
        formState.name  = props?.data?.name
        formState.description  = props?.data?.description
        formState.businessLine  = props?.data?.businessLine
        formState.type  = props?.data?.type
        // formState.version  = props?.data?.version
      }
    })
    return {
      formState,
      formRule,
      businessLines,
      types,
      handleOk,
      handleCancel
    }
  }
}
</script>

<style scoped>

</style>
