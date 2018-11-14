<template lang="html">
  <div class="register">
    <div class="registernav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/equipment' }">我的设备</el-breadcrumb-item>
        <el-breadcrumb-item>注册设备</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="registerbody">
      <h4>请选择您需要注册设备的Profile!</h4>
      <profilelist></profilelist>
    </div>
  </div>
</template>

<script>

import profilelist from '../public/profilelist.vue';

export default {
  data(){
    return{

    }
  },
  // 调用public组件
  components: {
    'profilelist': profilelist
  },
}
</script>

<style lang="scss" scoped>
  .registernav{
    height: 28px;
    border-bottom: 1px solid #f2f2f2;
    padding-top: 18px;
    padding-left: 50px;
  }
  .registerbody{
    padding: 24px;
    padding-left: 50px;
    h4{
      color: #000;
      padding: 8px 0;
    }
  }
</style>
