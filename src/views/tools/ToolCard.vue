<template>
  <a-row style="width: 100%;height: auto;background-color: rgb(252, 241, 230)">
    <div class="base-card">
      <a-list :grid="{ gutter: gutter, column: column }"
              :data-source="dataList"
              class="base-card-list"
              v-if="dataList.length>0"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <div class="item-pack-card">
              <div v-if="item.tags&&item.tags.indexOf('hot')!=-1" class="corner">
                <span class="corner-text-up">热门推荐</span>
                <img src="../../assets/images/右上角标签.png" style="height: 32px; width: 125px; position: absolute; top: -3px; right: 15px;">
              </div>
              <div class="top-head">
                <p class="item-title">{{item.toolName}}</p>
                <p class="item-desc">{{item.description}}</p>
              </div>
              <div class="item-content">
                <div class="tag-wrap" v-if="item.tags">
                  <span class="tag" style="margin-right: 5px" v-for="(it,index) of item.tags.split(',')" :key="index">
                    <b>{{it}}</b>
                  </span>
                </div>
                <div class="tag-wrap" v-else>
                  <span class="tag">
                    <b>暂无</b>
                  </span>
                </div>
                <div class="or-price">
                  {{item.developer+' | '+  $moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}}
                </div>
              </div>
              <div class="item-operation">
                <button type="button" class="item-btn" style="width: 100%;" @click="handleDetail(item)">
                  <span class="ace-btn-helper">去试试</span>
                </button>
              </div>
            </div>
          </a-list-item>
        </template>
      </a-list>
      <div v-else class="system-no-content">
        <img src="@/assets/images/noDataDefault.svg" class="system-no-content-image"><br/>
        <span class="system-no-content-text">当前分类下无数据</span>
      </div>
    </div>
    <div style="text-align: center;padding-top:10px;width: 100%;padding-bottom: 15px">
      <a-button type="primary" ghost v-if="!isLastPage" @click="$emit('getMore')">查看更多内容</a-button>
      <span style="color:#fe6a00;cursor: pointer" v-else-if="dataList.length>0&&isLastPage">没有更多内容了</span>
    </div>
  </a-row>
</template>

<script>
import {useRouter} from "vue-router/dist/vue-router";

export default {
  name: "ToolCard",
  props: ['dataList','gutter','column','isLastPage'],
  emits: ['getMore'],
  setup() {
    const router = useRouter()
    const handleDetail = (item)=>{
      router.push('/tools/detail/'+item.id)
    }
    return {
      handleDetail
    }
  }
}
</script>

<style scoped>
.base-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 20px;
}
.base-card-list {
  margin-top: 10px;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.item-pack-card {
  background: #fff;
  width: 100%;
}
.top-head {
  min-height: 90px;
  width: 100%;
  padding: 24px 20px;
  background-repeat: no-repeat;
  background-size: auto 100%;
  background-position: 100% 0;
  background-image: url('../../assets/images/cardHead工具背景图.png');
}
.item-title {
  font-family: PingFangSC-Medium;
  font-weight: 700;
  font-size: 18px;
  color: #181818;
  line-height: 30px;
  letter-spacing: .55px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-desc {
  margin-top: 6px;
  font-size: 14px;
  color: #181818;
  letter-spacing: .43px;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.corner {
  top: -8px;
  right: -7px;
  position: absolute;
  width: 78px;
}
.corner-text-up {
  position: absolute;
  text-align: center;
  font-weight: 600;
  width: 120px;
  height: 20px;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
  top: 5px;
  right: 4px;
  z-index: 1;
}
.item-content {
  min-height: 115px;
  padding: 16px 20px;
  border-top: none;
  border-bottom: none;
  border: 1px solid #ebecec;
}
.tag-wrap {
  margin-bottom: 20px;
  line-height: normal;
}
.tag {
  padding: 0 4px;
  font-size: 10px;
  color: #f16a3c;
  line-height: 17px;
  display: inline-block;
  letter-spacing: .42px;
  border: 1px solid #f16a3c;
}
.or-price {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
  line-height: 24px;
  letter-spacing: .7px;
}
.item-operation {
  margin: 0;
  padding: 0;
}
.item-btn {
  color: rgb(255, 255, 255);
  border: none;
  background-image: linear-gradient(90deg, rgb(249, 120, 34) 0%, rgb(251, 172, 94) 100%);
  height: 40px;
  font-weight: 900;
  letter-spacing: .57px;
  background-color: transparent;
  border-radius: 0;
  padding: 0 36px;
  position: relative;
  display: inline-block;
  box-shadow: none;
  text-decoration: none;
  text-align: center;
  text-transform: none;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  transition: all .1s linear;
  line-height: 1;
  cursor: pointer;
  outline: 0;
}
.ace-btn-helper {
  text-decoration: inherit;
  display: inline-block;
  vertical-align: middle;
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
