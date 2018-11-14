import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Start from '@/components/start/start'
import Structure from '@/components/start/structure'
import Information from '@/components/information/information'
import Equipment from '@/components/equipment/equipment'
import Detailinform from '@/components/equipment/detailinform'
import Register from '@/components/equipment/register'
import Equipdetail from '@/components/equipment/equipdetail'
import Online from '@/components/profile/online'
import Prodetail from '@/components/profile/prodetail'
import Development from '@/components/plug/development'
import Designplug from '@/components/plug/designplug'
import Simulator from '@/components/simulator/simulator'
import Equipsimulator from '@/components/simulator/equipsimulator'
import Addsimulator from '@/components/simulator/addsimulator'
import Subscribe from '@/components/subscribe/subscribe'
import store from '@/vuex/index'
import Login from '@/components/login/login'
import Adduser from '@/components/user/adduser'
import Role from '@/components/user/role'

Vue.use(Router)


//所有权限通用路由表
//如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [
  { path: '/', redirect: '/login', hidden: true },
  { path: '/login', component: Login, hidden: true },
  { path: '/designplug', component: Designplug, hidden: true },
  { path: '/main', component: Home, hidden: true ,
    children:[
      { path: '/main/start', component: Start, hidden: true },
      { path: '/main/structure', component: Structure, hidden: true },
      { path: '/main/equipment/register', component: Register, hidden: true },
      { path: '/main/equipment/detailinform', component: Detailinform, hidden: true },
      { path: '/main/equipment/equipdetail', component: Equipdetail, hidden: true },
      { path: '/main/profile/prodetail', component: Prodetail, hidden: true },
      { path: '/main/simulator/equipsimulator', component: Equipsimulator, hidden: true },
      { path: '/main/simulator/addsimulator', component: Addsimulator, hidden: true },
    ]},
]

//实例化 vue 的时候只挂载 constantRouter
export default new Router({
  routes: constantRouterMap
});


export const asyncRouterMap = [
  {
    path: '/main',
    component: Home,
    children:[
      {
        path: '/main/information',
        menu: 'abutment',
        component: Information
      },
      {
        path: '/main/equipment',
        menu: 'device',
        component: Equipment
      },
      {
        path: '/main/profile/online',
        menu:'profile:online',
        component: Online
      },
      {
        path: '/main/plug/development',
        menu: 'plugin:info',
        component: Development
      },
      {
        path: '/main/simulator/simulator',
        menu: 'simulate',
        component: Simulator
      },
      {
        path: '/main/subscribe',
        menu: 'subscription',
        component: Subscribe
      },
      {
        path: '/main/user/adduser',
        menu: 'user',
        component: Adduser
      },
      {
        path: '/main/user/role',
        menu: 'role',
        component: Role
      },
    ]
  },

];


// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.commit('LOGIN', window.localStorage.getItem('token'))
}