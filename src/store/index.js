import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 全局loading动画
    loading: false,
    // 记录所有请求，用于切换页面时取消
    requests: []
  },
  mutations: {
    loadStatus(state, boolean) {
      state.loading = boolean
    },
    addRequest(state, string) {
      state.requests.push(string)
    }
  }
})
