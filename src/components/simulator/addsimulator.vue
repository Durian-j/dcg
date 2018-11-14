<template lang="html">
  <div class="register">
    <div class="registernav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/simulator/FNBsimulator' }">设备模拟器</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/main/simulator/equipsimulator' }">产品列表</el-breadcrumb-item>
         <el-breadcrumb-item>添加设备模拟器</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <div class="registerbody">
      <profiledetail></profiledetail>

    </div>
    <div class="registerfooter">
      <span>模拟器名称</span>
      <input type="text" name="" value="" placeholder="Simulator Name">
      <span>验证码</span>
      <input type="text" name="" value="" placeholder="Verification Code">
      <el-button type="primary" >创 建</el-button>
    </div>
  </div>
</template>

<script>

import profiledetail from "../public/profiledetail.vue";

export default {
  data(){
    return{

    }
  },
  // 调用public组件
  components: {
    'profiledetail': profiledetail
  },
}
</script>

<style lang="scss" scoped>
  .registernav{
    height: 28px;
    border-bottom: 1px solid #f2f2f2;
    padding-top: 18px;
    padding-left: 50px;
    .el-breadcrumb{
      float: left;
    }
    i{
      color: #8a8a8a;
      line-height: 5px;
    }
  }
  .registerbody{
    padding: 24px;
  }
  .registerfooter{
    height: 70px;
    width: 100%;
    background-color: #232831;
    position: fixed;
    bottom: 0;
    z-index: 10;
    padding: 25px 60px 1px 48px;
    span{
      color: #8a8a8a;
      font-size: 12px;
    }
    input{
      width: 185px;
      height: 30px;
      border-radius: 2px;
      outline: none;
      border: none;
      padding-left: 15px;
      margin-right: 30px;
    }
    .el-button{
      background-color: #0275d8;
      padding: 12px 40px;
      font-size: 12px;
      border-color: #0275d8;
      margin-left: 50px;
    }

  }

</style>
