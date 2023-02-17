import Vue from 'vue';
import App from './App.vue';
import router from './router';

// import "echarts"
// import Echarts from "vue-echarts"
// Vue.component("Echarts", Echarts)

import store from './store';
import { requireImg } from '@/utils/requireImg';

Vue.prototype.requireImg = requireImg;

import '@/assets/css/common.scss';
import Loading from 'element-ui/lib/loading';
Vue.use(Loading.directive);
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/notification.css';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
Vue.use(VXETable);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
