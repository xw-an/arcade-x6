<template>
  <a-tabs defaultActiveKey="1" size="default">
    <a-tab-pane key="1" tab="样式">
      <a-row style="margin-bottom: 12px">
        <a-col :span="24" style="text-align: right;">
          <a type="default" @click="deleteEdge(edge)">删除连线</a>
        </a-col>
      </a-row>
      <a-form :model="formEdgeStyle" :label-col="{ span: 3 }" :wrapper-col="{ span: 20,offset: 1 }" style="">
        <a-form-item label="id">
          <a-input :value="edge.id" disabled/>
        </a-form-item>
        <a-form-item label="线形">
          <a-select :default-value="formEdgeStyle.line" @change="handleLine" disabled>
            <a-select-option :value="1">实线</a-select-option>
            <a-select-option :value="2">虚线</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="箭头">
          <a-select :default-value="formEdgeStyle.arrow" @change="handleArrow" disabled>
            <a-select-option :value="1">正向</a-select-option>
            <a-select-option :value="2">逆向</a-select-option>
<!--            <a-select-option :value="3">双向</a-select-option>-->
          </a-select>
        </a-form-item>
        <a-form-item label="边框">
          <a-popover :visible="strokeColorVisible" placement="leftTop" trigger="click" title="修改边框色">
            <template #content>
              <a-row style="margin-bottom: 10px">
                <sketch-picker v-model="strokeColors"/>
              </a-row>
              <a-row>
                <a-col :span="17">
                  <a-button @click="cancelStrokeColor">取消</a-button>
                </a-col>
                <a-col :span="7">
                  <a-button type="primary" @click="handleStrokeStroke(edge)">确定</a-button>
                </a-col>
              </a-row>
            </template>
            <div class="color-container">
              <div class="edit-color" :style="{backgroundColor: edge.attrs?edge.attrs.line.stroke:''}" @click="showStrokeColor"></div>
            </div>
          </a-popover>
        </a-form-item>
        <a-form-item label="文本">
          <a-input v-model:value="formEdgeStyle.label" @change="handleLabel(edge)"></a-input>
        </a-form-item>
      </a-form>
      <a-button type="primary" style="bottom: 10px;right:25px;position: fixed" @click="saveStyle(edge)">保存</a-button>
    </a-tab-pane>
<!--    <a-tab-pane key="2" tab="参数">-->
<!--      Content of Tab Pane 2-->
<!--    </a-tab-pane>-->
  </a-tabs>
</template>

<script>
import { Sketch } from '@ckpack/vue-color';
import {reactive, ref, watchEffect} from "vue";
import {useRouter} from "vue-router/dist/vue-router";
import {useStore} from "vuex";
import {updateLink} from "@/api/request";
import {message} from "ant-design-vue";

const formEdgeStyle = reactive({
  line: 1,
  arrow: 1,
  label: '',
  strokeStroke: '',
  sourceObj: {},
  targetObj: {}
})

// 线形
const useLineEffect = (props)=>{
  const handleLine = (e)=>{
    if (e === 2) {
      // 虚线
      props.edge.setAttrs({
        line: {
          strokeDasharray: 5.5
        }}
      )
      formEdgeStyle.line = 2
    } else {
      props.edge.removeAttrByPath('line/strokeDasharray')
      formEdgeStyle.line = 1
    }
  }
  return {
    handleLine
  }
}

// 箭头
const useArrowEffect = (props)=>{
  const handleArrow = (e) =>{
    switch (e) {
        // 正向箭头
      case 1:
        props.edge.setAttrs({
          line: {
            targetMarker: {
              name: 'block',
              width: 12,
              height: 8
            }
          }
        })
        props.edge.removeAttrByPath('line/sourceMarker')
        formEdgeStyle.arrow = 1
        break
        // 逆向箭头
      case 2:
        props.edge.setAttrs({
          line: {
            sourceMarker: {
              name: 'block',
              width: 12,
              height: 8
            }
          }
        })
        props.edge.removeAttrByPath('line/targetMarker')
        formEdgeStyle.sourceObj =  props.edge.getSource()
        formEdgeStyle.targetObj =  props.edge.getTarget()
        props.edge.setSource(formEdgeStyle.targetObj)
        props.edge.setTarget(formEdgeStyle.sourceObj)
        formEdgeStyle.arrow = 2
        break
        // 双向箭头
      case 3:
        props.edge.setAttrs({
          line: {
            targetMarker: {
              name: 'block',
              width: 12,
              height: 8
            },
            sourceMarker: {
              name: 'block',
              width: 12,
              height: 8
            }
          }
        })
        formEdgeStyle.arrow = 3
        break
    }
  }
  return {
    handleArrow
  }
}

// 边框
const useStrokeColorEffect = ()=>{
  const strokeColorVisible = ref(false)
  const strokeColors = ref(formEdgeStyle.strokeStroke)
  const showStrokeColor = ()=>{
    strokeColorVisible.value = true
  }
  const cancelStrokeColor = ()=>{
    strokeColorVisible.value = false
  }
  const handleStrokeStroke = (edge)=>{
    edge.setAttrs({
      line: {
        stroke: formEdgeStyle.strokeStroke
      }}
    )
    strokeColorVisible.value = false
  }
  watchEffect(() => {
    formEdgeStyle.strokeStroke = strokeColors?.value?.hex
  })
  return {
    strokeColors,
    strokeColorVisible,
    showStrokeColor,
    cancelStrokeColor,
    handleStrokeStroke
  }
}

// 文本
const useLabelEffect = ()=>{
  const handleLabel = (edge) => {
    edge.removeLabelAt(0)
    edge.appendLabel({
      attrs: {
        text: {
          text: formEdgeStyle.label
        }
      }
    })
  }
  return {
    handleLabel
  }
}

const processInstanceId = ref(0)
const author = ref('')

// 右侧面板操作
const useParamsEffect = (props,ctx)=>{
  // 保存修改的参数信息
  const saveStyle = async(edge)=> {
    // let startUuid = edge.getSourceCellId()
    // let nodeUuids = Object.keys(edge._model?.nodes)
    // let endUuid = nodeUuids.filter(obj=>obj != startUuid)[0]
    let req = {
      "sourceNodeId": edge.getSourceCellId(),
      "targetNodeId": edge.getTargetCellId(),
      "processLink": {
        "versionId": props.versionId,
        "processInstanceId": processInstanceId.value,
        "uuid": edge.id,
        "lineCondition": formEdgeStyle.label,
        "updatedBy": author.value,
      },
      "processInstanceParameter": [
        {
          "versionId": props.versionId,
          "parameterType": "样式信息",
          "parameterName": "style",
          "parameterValue": "{" +
              "\"line\": \""+formEdgeStyle.line+"\", " +
              "\"arrow\": \""+formEdgeStyle.arrow+"\", " +
              "\"color\": \""+formEdgeStyle.strokeStroke+"\", " +
              "\"text\": \""+formEdgeStyle.label+"\"" +
              "}",
          "createdBy": author.value,
          "updatedBy": author.value
        }
      ]
    }
    await updateLink(req).then(res=>{
      if(res.code === 0){
        message.success("连线样式更新成功;"+"id:"+edge.id)
      } else {
        message.error("连线样式更新成功;"+"id:"+edge.id)
      }
    })
  }
  // 删除连接线
  const deleteEdge = (edge)=>{
    // edge.remove()
    ctx.emit('delete',edge)
  }
  return {
    saveStyle,
    deleteEdge
  }
}

export default {
  name: 'EdgeConfigContainer',
  props: ['edge','versionId'],
  emits: ['delete'],
  components: {SketchPicker: Sketch},
  setup(props,ctx){
    const router = useRouter()
    const store = useStore()
    processInstanceId.value = router.currentRoute.value.params.processInstanceId
    author.value = store.state.user.account
    const {handleLine} = useLineEffect(props)
    const {handleArrow} = useArrowEffect(props)
    const {strokeColors, strokeColorVisible, showStrokeColor, cancelStrokeColor,handleStrokeStroke} = useStrokeColorEffect(props)
    const {handleLabel} = useLabelEffect(props)
    const {saveStyle,deleteEdge} = useParamsEffect(props,ctx)
    watchEffect(() => {
      if(props.edge?.attrs){
        // formEdgeStyle.label = props.edge.labels && props.edge.labels.length ? props.edge.labels[0].attrs?.text?.text : ''
        formEdgeStyle.label = props.edge.label? props.edge.label:props.edge.attrs?.text?.text
        formEdgeStyle.strokeStroke = props.edge?.attrs?.line?.stroke
      }
    })
    return {
      formEdgeStyle,
      handleLine,
      handleArrow,
      strokeColors,
      strokeColorVisible,
      showStrokeColor,
      cancelStrokeColor,
      handleStrokeStroke,
      handleLabel,
      saveStyle,
      deleteEdge
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
