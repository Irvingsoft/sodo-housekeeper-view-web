/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router'
import {getSignature, serialize, uuid} from '@/util/util'
import {getToken} from '@/util/auth'
import website from '@/config/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import auth from "@/store/modules/auth";
import {message} from "../../public/util/resetMessage";

axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});
//HTTP request拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {});

  if (getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }

  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }

  config.headers['Client_ID'] = `${website.clientId}`;
  config.headers['Nonce'] = uuid();
  config.headers['Timestamp'] = new Date().getTime();
  config.headers['Signature_Key'] = auth.state.signatureInfo.id;
  config.headers['Signature'] = getSignature(
    config.headers['Client_ID'],
    config.headers['Nonce'],
    config.headers['Timestamp'],
    config.data ? JSON.stringify(config.data) : "",
    auth.state.signatureInfo.signatureKey
  );
  return config
}, error => {
  return Promise.reject(error)
});
//HTTP response拦截
axios.interceptors.response.use(res => {
  NProgress.done();
  const status = res.data.code || res.status || 200
  const statusWhiteList = website.statusWhiteList || [];
  const messageContent = res.data.detail || res.data.description || "服务器走丢了，正在紧急找回！";
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401 || status === 402) store.dispatch('FedLogOut').then(() => router.push({path: '/login'}));
  // 如果请求为非200否者默认统一处理
  if (status !== 200) {
    message({
      message: messageContent,
      type: 'error',
      showClose: true
    })
    return Promise.reject(new Error(messageContent))
  }
  return res;
}, error => {
  NProgress.done();
  return Promise.reject(new Error(error));
})

export default axios;
