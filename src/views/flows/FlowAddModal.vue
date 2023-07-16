<template>
  <a-modal :visible="visible"
           title="新建流程"
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
import { reactive,ref} from 'vue'
import {message} from "ant-design-vue";
import {createFlow} from "@/api/request";
const useFormState = (props,ctx)=>{
  const formRule = ref()
  const formState = reactive({
    name: '',
    description: '',
    businessLine: '',
    type: '',
    // version: 1
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
        name: formState.name,
        description: formState.description,
        businessLine: formState.businessLine,
        type: formState.type,
        // version: formState.version,
        status: 0,
        createdBy: userAccount,
        updatedBy: userAccount
      }
      //调后端接口添加
      await createFlow(req).then(res=>{
        if (res?.code === 0 && res.data>0) {
          formRule.value.resetFields()
          message.success('添加成功')
          ctx.emit('confirm')
        } else {
          message.error('添加失败：'+res?.message)
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
  name: "FlowAddModal",
  props:['visible'],
  emits:['close','confirm'],
  setup(props,ctx) {
    const {formState,formRule,businessLines,types,handleOk,handleCancel} = useFormState(props,ctx)
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
