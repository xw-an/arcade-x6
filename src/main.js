// import {createApp, nextTick, reactive} from 'vue'
import {createApp, nextTick} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import { useStore } from "vuex";
import Antd from 'ant-design-vue'
import moment from 'moment'
import {setCookie, getCookie, delCookie} from '@/utils'
// import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.less'
import '@/assets/styles/iconfont.css'
import '@/assets/styles/font.css'
import * as Icons from '@ant-design/icons-vue'
import VueScrollTo from 'vue-scrollto'

// 创建对象
const app = createApp(App)
// const store = useStore();
app.config.globalProperties.$moment = moment
app.config.globalProperties.$cookieStore = {
    setCookie,
    getCookie,
    delCookie
}
app.use(store).use(router).use(Antd).use(VueScrollTo).mount('#app')
// 必须使用 nextTick，不然会有加载顺序问题，导致绑定失败
nextTick(() => {
    // 配置全局对象
    app.config.globalProperties.$icons = Icons
    // Antd 注入全部图标（这样注入之后，就可以全局直接使用 icon 组件，不需要每个页面去引入了）
    for (const key in Icons) { app.component(key, Icons[key]) }
})


app.config.productionTip = false

app.directive('preventReClick', {
    inserted: function (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 3000)
            }
        })
    }
});
