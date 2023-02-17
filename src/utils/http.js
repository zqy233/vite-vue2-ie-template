import axios from 'axios';
import store from '../store';
import { ElMessage } from 'element-ui';

// 用于计算所有请求次数，等待所有请求结束后再关闭loading动画
let loadingCount = 0;

const instance = axios.create({
  timeout: window.TIME, // 多长时间请求无果后结束
  baseURL: window.BASE_URL, // 接口地址在config.js中定义
});

// instance.defaults.headers.post = {
//   "Content-Type": "Content-Type:multipart/form-data"
// }

const CancelToken = axios.CancelToken; // 需要通过这个token主动关闭axios请求
instance.interceptors.request.use(
  req => {
    const source = CancelToken.source();
    req.cancelToken = source.token;
    store.commit('addRequest', source);
    loadingCount++;
    store.commit('loadStatus', true);
    return req;
  },
  error => error,
);
instance.interceptors.response.use(
  res => {
    loadingCount--;
    if (loadingCount == 0) store.commit('loadStatus', false);
    if (res.status == 200) return res;
  },
  err => {
    loadingCount--;
    if (loadingCount == 0) store.commit('loadStatus', false);
    if (
      err.code === 'ECONNABORTED' &&
      err.message.indexOf('timeout') !== -1 &&
      !err.config._retry
    ) {
      return ElMessage.error('请求数据失败，请稍后再试');
    }
    const { response } = err;
    errorHandle(response.status, response.data);
    return response;
  },
);
const errorHandle = (status, other) => {
  switch (status) {
    case 400:
      ElMessage.error('信息校验失败');
      break;
    case 401:
      ElMessage.error('认证失败');
      break;
    case 403:
      ElMessage.error('token校验失败');
      break;
    case 404:
      ElMessage.error('请求的资源不存在');
      break;
    default:
      ElMessage.error(other);
      break;
  }
};

export default instance;
