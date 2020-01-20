import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import store from './store';
import {loadJs, loadStyle} from './util/util'
import * as urls from '@/config/env';
import {iconfontCssUrl, iconfontJsUrl, iconfontVersion} from '@/config/env';
import Element from 'element-ui';
import ElTreeGrid from 'element-tree-grid'
import i18n from './lang' // Internationalization
import './styles/common.scss';
import * as filters from './filters' // 全局filter
import basicContainer from './components/basicContainer'
import iconSelect from './components/iconSelect'
import messageTemplate from './components/messageTemplate'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Vue.use(router)
Vue.use(VueAxios, axios)
Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(window.AVUE, {
    i18n: (key, value) => i18n.t(key, value)
})
//注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('elTreeGrid', ElTreeGrid)
Vue.component('iconSelect', iconSelect)
Vue.component('messageTemplate', messageTemplate)
// 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key];
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontCssUrl.replace('$key', ele));
    loadJs(iconfontJsUrl.replace('$key', ele));
})

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')
