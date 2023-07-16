<template>
  <div style="width: 100%;height: 100%;background-color: #fff">
    <a-row style="padding-top: 25px">
      <a-col span=24 style="text-align: center;margin-bottom: 6px">
        <h3>基础信息</h3>
      </a-col>
    </a-row>
<!--     通过v-for循环遍历baseInfo数组，每三个一行, 数组需要考虑不为3的倍数情况-->
    <a-row
      style="margin-top: 25px;margin-bottom:25px;padding-left: 60px;"
      v-for="index of baseInfo.length/3"
      :key="index"
    >
      <a-col :span="8" v-for="item of baseInfo.slice((index-1)*3,index*3)" :key="item.title">
        <div class="content-box">
          <span class="content-title">{{item.title}}</span>
          <span class="content-detail">{{item.detail}}</span>
        </div>
      </a-col>
    </a-row>
    <div style="width: 100%;height: 100%;background-color: #f4f4f4;">
      <a-row style="padding-top: 28px;">
        <a-col span=24 style="text-align: center;margin-bottom: 8px">
          <h3>调用信息</h3>
          <div style="width: 100%;height: 100%;padding: 18px">
            <a-tabs>
              <a-tab-pane key="1" tab="请求参数">
                <a-table :columns="reqColumns" :data-source="reqData" :scroll="{ x: 1500 }" :pagination="false">
                  <template #bodyCell="{ column, text }">
                    <template v-if="column.dataIndex === 'required'">
                      <span v-if="text">是</span>
                      <span v-else>否</span>
                    </template>
                    <template v-else-if="column.dataIndex === 'defaultValue'">
                      <span>{{text}}</span>
                    </template>
                  </template>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="2" tab="返回参数">
                <a-table :columns="resColumns" :data-source="resData" :pagination="false"/>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>

</template>

<script>
import {ref} from "vue"
import moment from "moment"

export default {
  name: "ToolDetailInfo",
  props: ['data'],
  setup(props) {
    const baseInfo = ref([
      {
        title: "接口名",
        detail: props.data?.testTool?.toolName,
      },
      {
        title: "部门",
        detail: props.data?.testTool?.department,
      },
      {
        title: "业务线",
        detail: props.data?.testTool?.businessLine,
      },
      {
        title: "开发者",
        detail: props.data?.testTool?.developer,
      },
      {
        title: "工具类型",
        detail: props.data?.testTool?.toolType==='tool'?'工具':'组件',
      },
      {
        title: "工具描述",
        detail: props.data?.testTool?.description,
      },
      {
        title: "工具状态",
        detail: props.data?.testTool?.status==1?'启用':'禁用',
      },
      {
        title: "创建时间",
        detail: moment(props.data?.testToolDetail?.createTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: "类名",
        detail: props.data?.testToolDetail?.className,
      }
  ])
    const reqColumns = [
      {
        title: '参数名',
        dataIndex: 'name',
        width: 200,
        fixed: 'left'
      },
      {
        title: '参数类型',
        dataIndex: 'type',
        width: 150
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        width: 300
      },
      {
        title: '必填',
        dataIndex: 'required',
        width: 100
      },
      {
        title: '参数描述',
        dataIndex: 'description'
      }
    ]
    const reqData = ref(JSON.parse(props.data?.testToolDetail?.requestParam))
    const resColumns = [
      {
        title: '参数名',
        dataIndex: 'name',
      },
      {
        title: '参数类型',
        dataIndex: 'type',
      }]
    const resData = ref(JSON.parse(props.data?.testToolDetail?.responseParam))
    return {baseInfo,reqColumns,reqData,resColumns,resData}
  }
}
</script>

<style scoped>
.content-box {
  display: block;
  border-left: 2px solid #ff6a00;
  padding-left: 13px;
}
.content-title {
  font-weight: 600;
  font-size: 14px;
  color: #3d3d3d;
  display: block;
  margin-bottom: 10px;
}
.content-detail {
  font-size: 14px;
  color: #3d3d3d;
  line-height: 21px;
  display: block;
  max-width: 93%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
