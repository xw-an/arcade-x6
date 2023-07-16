<template>
  <a-form :model="formNodeStyle" :label-col="{ span: 3}" :wrapper-col="{ span: 20 ,offset: 1 }" style="margin-top: 5px">
    <a-form-item label="uuid">
      <a-input :value="node.id" disabled/>
    </a-form-item>
    <a-form-item label="标题">
      <a-input v-model:value="formNodeStyle.label" @change="handleLabel(node)"/>
    </a-form-item>
    <a-form-item label="字号" >
      <a-input-number v-model:value="formNodeStyle.fontSize" @change="handleFontSize(node)"/>
    </a-form-item>
    <a-form-item label="文字">
      <a-popover :visible="textColorVisible" placement="leftTop" trigger="click" title="修改边框色">
        <template #content>
          <a-row style="margin-bottom: 10px">
            <sketch-picker v-model="textColors"/>
          </a-row>
          <a-row>
            <a-col :span="17">
              <a-button @click="cancelTextFill">取消</a-button>
            </a-col>
            <a-col :span="7">
              <a-button type="primary" @click="handleTextFill(node)">确定</a-button>
            </a-col>
          </a-row>
        </template>
        <div class="color-container">
          <div class="edit-color" :style="{backgroundColor: node.attrs?node.attrs.text.fill:''}" @click="showTextFill"/>
        </div>
      </a-popover>
    </a-form-item>
    <a-form-item label="填充">
      <a-popover :visible="fillColorVisible" placement="leftTop" trigger="click" title="修改填充色">
        <template #content>
          <a-row style="margin-bottom: 10px">
            <sketch-picker v-model="bodyFillColors"/>
          </a-row>
          <a-row>
            <a-col :span="17">
              <a-button @click="cancelBodyFill">取消</a-button>
            </a-col>
            <a-col :span="7">
              <a-button type="primary" @click="handleBodyFill(node)">确定</a-button>
            </a-col>
          </a-row>
        </template>
        <div class="color-container">
          <div class="edit-color" :style="{backgroundColor: node.attrs?node.attrs.body.fill:''}" @click="showBodyFill"></div>
        </div>
      </a-popover>
    </a-form-item>
    <a-form-item label="边框">
      <a-popover :visible="strokeColorVisible" placement="leftTop" trigger="click" title="修改边框色">
        <template #content>
          <a-row style="margin-bottom: 10px">
            <sketch-picker v-model="strokeColors"/>
          </a-row>
          <a-row>
            <a-col :span="17">
              <a-button @click="cancelBodyStroke">取消</a-button>
            </a-col>
            <a-col :span="7">
              <a-button type="primary" @click="handleBodyStroke(node)">确定</a-button>
            </a-col>
          </a-row>
        </template>
        <div class="color-container">
          <div class="edit-color" :style="{backgroundColor: node.attrs?node.attrs.body.stroke:''}" @click="showBodyStroke"></div>
        </div>
      </a-popover>
    </a-form-item>
  </a-form>
  <a-button type="primary" style="bottom: 10px;right:25px;position: fixed" @click="saveStyle(node)">保存</a-button>
</template>

<script>

import {reactive, ref, watchEffect} from "vue";
import {updateNode} from "@/api/request";
import {message} from "ant-design-vue";
import { Sketch } from '@ckpack/vue-color';
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from "vuex";

const formNodeStyle = reactive({
  label: '',
  fontSize: 0,
  textFill: '',
  bodyFill: '',
  bodyStroke: ''
})

// 文字颜色
const useTextColorEffect = ()=>{
  // 文字选色器是否显示
  const textColorVisible = ref(false)
  const textColors = ref('')
  // 取消文字颜色
  const cancelTextFill = () => {
    textColorVisible.value = false
  }
  // 显示文字颜色
  const showTextFill = () => {
    textColorVisible.value = true
  }
  // 更新文字颜色
  const handleTextFill = (node) => {
    node.setAttrs({
      text: {
        fill: formNodeStyle.textFill
      }}
    )
    textColorVisible.value = false
  }
  watchEffect(() => {
    formNodeStyle.textFill = textColors?.value?.hex
  })
  return {
    textColorVisible,
    textColors,
    cancelTextFill,
    showTextFill,
    handleTextFill
  }
}

// 填充颜色
const useBodyFillColorEffect = ()=>{
  // 填充色选色器是否显示
  const fillColorVisible = ref(false)
  const bodyFillColors = ref('')
  // 显示填充色选色器
  const showBodyFill = () => {
    fillColorVisible.value = true
  }
  // 取消填充色选色器
  const cancelBodyFill = () => {
    fillColorVisible.value = false
  }
  // 选择填充选色器颜色
  const handleBodyFill = (node) => {
    node.setAttrs({
      body: {
        fill: formNodeStyle.bodyFill
      },
      top: {
        fill: formNodeStyle.bodyFill
      }
    })
    fillColorVisible.value = false
  }
  watchEffect(() => {
    formNodeStyle.bodyFill = bodyFillColors?.value?.hex
  })
  return {
    fillColorVisible,
    bodyFillColors,
    cancelBodyFill,
    showBodyFill,
    handleBodyFill
  }
}

// 边框颜色
const useStrokeColorEffect = ()=>{
  // 边框色选色器是否显示
  const strokeColorVisible = ref(false)
  const strokeColors = ref('')
  // 显示边框色选色器
  const showBodyStroke = () => {
    strokeColorVisible.value = true
  }
  // 取消边框色选色器
  const cancelBodyStroke = () => {
    strokeColorVisible.value = false
  }
  // 选择边框选色器颜色
  const handleBodyStroke = (node) => {
    node.setAttrs({
      body: {
        stroke: formNodeStyle.bodyStroke
      },
      top: {
        stroke: formNodeStyle.bodyStroke
      }
    })
    strokeColorVisible.value = false
  }
  watchEffect(() => {
    formNodeStyle.bodyStroke = strokeColors?.value?.hex
  })
  return {
    strokeColorVisible,
    strokeColors,
    showBodyStroke,
    cancelBodyStroke,
    handleBodyStroke
  }
}

// 标题
const useLabelEffect = ()=>{
  const handleLabel = (node)=>{
    if (node.attrs?.label) {
      node.setAttrs({
        label: {
          text: formNodeStyle.label
        }
      })
    } else {
      node.setLabel(formNodeStyle.label)
    }
  }
  return {
    handleLabel
  }
}

// 字体大小
const useFontSizeEffect = ()=>{
  const handleFontSize = (node)=>{
    node.setAttrs({
      text: {
        fontSize: Number(formNodeStyle.fontSize)
      }
    })
  }
  return {
    handleFontSize
  }
}

const processInstanceId = ref(0)
const author = ref('')

// 右侧样式面板操作
const useParamsEffect = (props,ctx)=>{
  // 保存修改的样式参数
  const saveStyle = async(node)=> {
    const pos = node?.position()
    const name = node.shape==="custom-text"?node.attrs.label?.text:node.attrs.text?.text
    let req = {
      "processNode": {
        "versionId": props.versionId,
        "processInstanceId": processInstanceId.value,
        "uuid": node.id,
        "name": name,
        // "type": node.shape,
        "position": pos.x+","+pos.y,
        "updatedBy": author.value
      },
      "processInstanceParameter": [
        {
          "versionId": props.versionId,
          "parameterType": "样式信息",
          "parameterName": "style",
          "parameterValue": "{" +
              "\"label\": \""+name+"\", " +
              "\"fontSize\": \""+node.attrs.text?.fontSize+"\", " +
              "\"textFill\": \""+node.attrs.text?.fill+"\", " +
              "\"bodyFill\": \""+node.attrs.body?.fill+"\", " +
              "\"strokeColor\": \""+node.attrs.body?.stroke+"\"}",
          "updatedBy": author.value
        }]
    }
    await updateNode(req).then(res=>{
      if(res.code === 0){
        message.success("["+req.processNode.name+"]样式更新成功;"+"id:"+node.id)
        ctx.emit('close')
      } else {
        message.error("["+req.processNode.name+"]样式更新失败："+res.message)
      }
    })
  }
  return {
    saveStyle
  }
}

export default {
  name: "ToolStyleConfig",
  props: ['node','versionId'],
  emits: ['close'],
  components: { SketchPicker: Sketch},
  setup(props,ctx){
    const router = useRouter()
    const store = useStore()
    processInstanceId.value = router.currentRoute.value.params.processInstanceId
    author.value = store.state.user.account
    const {textColorVisible, textColors, cancelTextFill, showTextFill, handleTextFill} = useTextColorEffect()
    const {fillColorVisible, bodyFillColors, cancelBodyFill, showBodyFill, handleBodyFill} = useBodyFillColorEffect()
    const {strokeColorVisible, strokeColors, showBodyStroke, cancelBodyStroke, handleBodyStroke} = useStrokeColorEffect()
    const {handleLabel} = useLabelEffect()
    const {handleFontSize} = useFontSizeEffect()
    const {saveStyle} = useParamsEffect(props,ctx)
    watchEffect( () => {
      if(props.node?.attrs){
        formNodeStyle.label = props.node.label? props.node.label : props.node.attrs.label?.text
        formNodeStyle.fontSize = props.node.attrs ? props.node.attrs.text.fontSize : ''
      }
    })
    return {
      formNodeStyle,handleLabel,handleFontSize,
      textColorVisible,textColors,cancelTextFill,showTextFill,handleTextFill,
      fillColorVisible,bodyFillColors,handleBodyFill,showBodyFill,cancelBodyFill,
      strokeColorVisible,strokeColors,handleBodyStroke,showBodyStroke,cancelBodyStroke,
      saveStyle
    }
  }
}
</script>

<style scoped>
.color-container {
  margin-top: 8px;
  width: 24px;
  height: 24px;
  padding: 4px;
  border: 1px solid #dfe3e8;
  border-radius: 2px;
}
.edit-color {
  cursor: pointer;
  height: 100%;
}
</style>
