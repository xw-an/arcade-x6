<template>
  <div style="width: 100%;height: 100%">
    <a-row style="width: 100%;height: 100%;margin-bottom: 12px;margin-top: 15px">
      <a-col :span="24" style="text-align: center">
        <h2 style="font-size: 26px; color: rgb(24, 24, 24); line-height: 42px;">{{toolItem?.testTool?.toolName}}</h2>
      </a-col>
    </a-row>
    <div class="wrap">
      <div class="tabGroup">
        <div class="swiper-container">
          <div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px); transition: all 250ms linear 0s;">
            <div :class="{'tab': true, 'off':item!=activeKey,'on': item===activeKey,'swiper-slide':true}" style="width: 25%;"
                 v-for="item in tabList" :key="item"
                 @click="handleTab(item)"
            >
              <span class="innerText">{{item}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="contents">
        <div class="content" v-if="activeKey==='工具请求'">
          <tool-detail-run :data="toolItem"></tool-detail-run>
        </div>
        <div class="content" v-else-if="activeKey==='工具详情'">
          <tool-detail-info :data="toolItem"></tool-detail-info>
        </div>
        <div class="content" v-else-if="activeKey==='运行记录'">
          <tool-detail-record :data="toolItem"></tool-detail-record>
        </div>
        <div class="content" v-else-if="activeKey==='辅助功能'">
          <tool-detail-other :data="toolItem"></tool-detail-other>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import ToolDetailInfo from "@/views/tools/ToolDetailInfo";
import ToolDetailRun from "@/views/tools/ToolDetailRun";
import ToolDetailRecord from "@/views/tools/ToolDetailRecord";
import ToolDetailOther from "@/views/tools/ToolDetailOther";
import {getToolDetail} from "@/api/request";
import {useRouter} from "vue-router";

const useDetailEffect = ()=>{
  const toolItem = ref({})
  const getDetail = async (req)=>{
    await getToolDetail(req).then(res=>{
      if (res.code === 0) {
        toolItem.value = res.data
      }
    })
  }
  return {toolItem,getDetail}
}

const useTabEffect = ()=>{
  const tabList = ref(['工具请求', '工具详情', '运行记录','辅助功能']);
  const activeKey = ref('工具请求');
  const handleTab = (item) => {
    activeKey.value = item
  }
  return {activeKey,tabList,handleTab}
}

export default {
  name: "ToolDetail",
  components: {ToolDetailOther, ToolDetailRecord, ToolDetailRun, ToolDetailInfo},
  setup() {
    const {toolItem,getDetail} = useDetailEffect()
    const {activeKey,tabList,handleTab} = useTabEffect()
    const router = useRouter()
    const req = {toolId: router.currentRoute.value.params.id}
    getDetail(req)
    return {toolItem,getDetail,activeKey,tabList,handleTab}
  }
}
</script>

<style scoped>
.wrap {
  margin: 0 auto;
  padding-bottom: 10px;
  width: 95%;
}
.tabGroup {
  border: 1px solid #ededed;
  display: flex;
}
.swiper-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  z-index: 1;
}
.swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  box-sizing: content-box;
}
.on {
  position: relative;
  color: #181818;
}
.on:before {
  position: absolute;
  top: -1px;
  left: 0;
  display: block;
  content: "";
  width: 100%;
  height: 4px;
  transform: scale(1);
  background-color: #ff6a00;
}
.on:after {
  position: absolute;
  display: block;
  transform: scale(1);
  content: "";
  width: 100%;
  height: 50px;
  z-index: 5;
  background-color: #fff;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, .1);
}
.tab {
  display: inline-block;
  vertical-align: middle;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border-right: 1px solid #ededed;
  background-color: #fff;
  transition: all .1s ease-in;
}
.tab:before {
  z-index: 10;
}
.tab:after{
  top: 0;
  left: 0;
}
.off {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  border-right: 1px solid #ededed;
  background-color: #fff;
  transition: all .1s ease-in;
}
.off:before {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  display: block;
  content: "";
  width: 100%;
  height: 4px;
  background-color: transparent;
}
.off:after {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  content: "";
  width: 100%;
  height: 100%;
}
.tab:hover:before {
  position: absolute;
  top: -1px;
  left: 0;
  display: block;
  content: "";
  width: 100%;
  height: 4px;
  transform: scale(1);
  background-color: #ff6a00;
}
.tab:hover {
  color: #181818;
}
.swiper-slide{
  flex-shrink: 0;
}
.innerText {
  position: relative;
  z-index: 10;
}
.contents {
  display: block;
  background: #fafafa;
  width: 100%!important;
  height: auto;
  border: 1px solid #ededed;
  border-top: none;
}
.content {
  display: block;
  width: 100%;
  height: auto;
}
</style>
