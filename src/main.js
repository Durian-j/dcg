// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './element-variables.scss'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import store from './vuex/index'
import { Loading } from 'element-ui';

Vue.prototype.$axios= axios


let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
  loading = Loading.service({
    spinner:'el-icon-loading',
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.3)'
  })
}
// function endLoading() {    //使用Element loading-close 方法
//   loading.close()
// }
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0;

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
  
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    debounce(tryCloseLoading, 300)()
  }
}

const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    loading.close()
  }
}


function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}


Vue.use(ElementUI)
Vue.use(Vuex)

Vue.config.productionTip = false

// http request 拦截器
axios.interceptors.request.use(
  config => {

    if (store.getters.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token

      config.headers.common['HEAD_AUTHORIZATION_CODE'] = store.getters.token;
    }

    showFullScreenLoading()

    return config;

  },
  err => {
    return Promise.reject(err);
  });


let flag = true;
// http response 拦截器
axios.interceptors.response.use(
  response => {
    tryHideFullScreenLoading();
    // console.log(router.apps[0]._route.fullPath);
    flag=true;
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
      case 403:
        // 返回 403 清除token信息并跳转到登录页面
        tryHideFullScreenLoading();
        if(flag == true){
          flag=false;
          Vue.prototype.$confirm('登录超时,请重新登录', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            store.commit('LOGOUT');
            router.replace({
              path: '/login',
              query: {redirect: router.currentRoute.fullPath}
            })
          }).catch(() => {
            store.commit('LOGOUT');
            router.replace({
              path: '/login',
              query: {redirect: router.currentRoute.fullPath}
            })    
          });
        }

      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });

// 导航守卫判断用户的操作
router.beforeEach((to, from, next) => {

  if (to.path === '/login') {
    next();
  } else if (!store.getters.role) {
    
    const userPermission = store.getters.userinfo;

    store.dispatch('GenerateRoutes', userPermission).then(() => {

      //生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
      router.addRoutes(store.getters.addRouters);

      // 防止页面刷新取不到按钮的列表，所以重新赋值
      store.commit('SET_USER', userPermission.permissionList);

    }).catch(err => {
      console.log(err);
    });
    next(); // hack 方法 确保 addRoutes 已完成

  } else {
    next()
  }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
