<template>
  <a-row style="width: 100%">
    <a-button type="primary" style="margin-top:15px;margin-bottom:15px;margin-left: 5px" @click="executeTool(data)">运行工具</a-button>
  </a-row>
  <div style="width: 100%;display: flex">
    <div class="left">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="1" tab="必填参数">
          <a-row>
            <a-col :span="8" style="padding-left: 20px">
              <a-tag color="green">参数名</a-tag>
            </a-col>
            <a-col :span="13" style="text-align: left">
              <a-tag color="green">参数值</a-tag>
            </a-col>
            <a-col :span="2"></a-col>
          </a-row>
          <a-row  v-for="(item,index) of paramList" :key="index" style="padding-top: 10px">
            <a-col :span="8" style="padding-left: 20px">
              <span>{{item.paramName}}</span>
            </a-col>
            <a-col :span="13" style="text-align: left">
              <a-input v-model:value="item.paramValue" v-if="item.options.length<2"></a-input>
              <a-select v-model:value="item.paramValue" v-else
                        style="width: 100%"
                        :options="item.options.map(obj=>({value: obj}))">
              </a-select>
            </a-col>
            <a-col :span="2"></a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="2" tab="非必填参数">
          <div v-if="optionalParamList.length">
            <a-row>
              <a-col :span="8" style="padding-left: 20px">
                <a-tag color="green">参数名</a-tag>
              </a-col>
              <a-col :span="13" style="text-align: left">
                <a-tag color="green">参数值</a-tag>
              </a-col>
              <a-col :span="2"></a-col>
            </a-row>
            <a-row v-for="(item,index) of optionalParamList" :key="index" style="padding-top: 10px">
              <a-col :span="8" style="padding-left: 20px">
                <span>{{item.paramName}}</span>
              </a-col>
              <a-col :span="13" style="text-align: left">
                <a-input v-model:value="item.paramValue" v-if="item.options.length<2"></a-input>
                <a-select v-model:value="item.paramValue" v-else
                          style="width: 100%"
                          :options="item.options.map(obj=>({value: obj}))">
                </a-select>
              </a-col>
              <a-col :span="2"></a-col>
          </a-row>
          </div>
          <div v-else class="system-no-content">
            <img src="@/assets/images/noDataDefault.svg" class="system-no-content-image"><br/>
            <span class="system-no-content-text">暂无数据</span>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="请求json参数">
          <codemirror
              v-model="requestCode"
              :style="{ width: '100%', height: '600px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tabSize="2"
              :extensions="extensionsRequest"/>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="right">
      <a-tabs type="card">
        <a-tab-pane key="1" tab="返回结果">
          <codemirror
              v-model="responseCode"
              :style="{ width: '100%', height: '600px' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tabSize="2"
              :extensions="extensionsResponse"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import {Codemirror} from "vue-codemirror";
import {ref, watchEffect} from "vue";
import {json} from "@codemirror/lang-json";
import {oneDark} from "@codemirror/theme-one-dark";
import { runTool} from "@/api/request";
import {message} from "ant-design-vue";
import {formatValue,formatValueByType} from "@/utils/toolDataFormat";

const useDataEffect = ()=>{
  let paramList = ref([])
  let optionalParamList = ref([])
  let requestBody = ref({})
  const requestCode = ref()
  const responseCode = ref()
  const requestRequired = (data) =>{
    // paramList:必填参数 optionalParamList:非必填参数
    if (data?.testToolDetail?.requestParam) {
      let obj = JSON.parse(data.testToolDetail.requestParam);
      obj.forEach(item=>{
        if (item.required) {
          paramList.value.push({paramName:item.name,paramValue:formatValue(item?.defaultValue),options:item.options?item.options:[],type:item.type})
        } else {
          optionalParamList.value.push({paramName:item.name,paramValue:formatValue(item?.defaultValue),options:item.options?item.options:[],type:item.type})
        }
      })
    }
  }
  const executeTool = async (data)=>{
    let req = {
      toolId: data.testToolDetail.toolId,
      requestParam: requestCode.value.toString().replaceAll('\t','').replaceAll('\n',''),
      operator: "amy.xue" // todo 当前登录用户
    }
    await runTool(req).then(res=>{
      if (res.code === 0) {
        responseCode.value = JSON.stringify(res.data.responseParam,null, '\t')
      } else {
        message.error('工具执行失败：'+res.message)
      }
    })
  }
  return {paramList,optionalParamList,requestBody,requestCode,responseCode,requestRequired,formatValueByType,executeTool}
}

export default {
  name: "ToolDetailRun",
  components: {Codemirror},
  props: ['data'],
  setup(props) {
    const activeKey = ref('1')
    const extensionsRequest = [json()]
    const extensionsResponse = [json(), oneDark]
    const {paramList,optionalParamList,requestBody,requestCode,responseCode,executeTool,requestRequired,formatValueByType} = useDataEffect()
    watchEffect(()=>{
      paramList.value = []
      optionalParamList.value = []
      requestRequired(props.data)
    })
    watchEffect(()=>{
      paramList.value.concat(optionalParamList.value).forEach(item=>{
        requestBody.value[item.paramName] = formatValueByType(item.paramValue,item.type)
      })
      requestCode.value = JSON.stringify(requestBody.value,null, '\t')
    })
    return {activeKey,paramList,optionalParamList,requestCode,responseCode,executeTool,extensionsRequest,extensionsResponse}
  }
}
</script>

<style scoped>
.left {
  width: 50%;
  height: auto;
  background: #fff;
  border-right: 1px solid #ededed;
  min-height: 600px;
}
.right {
  width: 50%;
  height: auto;
  background: #fff;
  min-height: 600px;
}
.system-no-content {
  width: 100%;
  text-align: center;
  margin-top: 150px;
  margin-bottom: 50px;
  font-size: 15px;
}
.system-no-content-image {
  margin: 10px;
}
.system-no-content-text {
  color: #999;
}
</style>
