<template lang="html">
  <div class="online">
    <div class="onlinenav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/simulator/FNBsimulator' }">设备模拟器列表</el-breadcrumb-item>
        创建设备模拟器
        <el-tooltip class="item" effect="light" content="simularot-develop.add-service.titileTips" placement="right">
          <i class="iconfont icon-question"></i>
        </el-tooltip>
      </el-breadcrumb>
    </div>
    <div class="onlinebody">
      <h3>请选择您需要模拟的设备型号</h3>
      <profilelist></profilelist>
    </div>


  </div>
</template>

<script>

import profilelist from "../public/profilelist.vue";

export default {
    data() {
      return {

      };
    },
    methods: {

    },
    // 调用public组件
    components: {
      'profilelist': profilelist
    },
  };
</script>

<style lang="scss" scoped>
  .onlinenav{
    height: 28px;
    border-bottom: 1px solid #f2f2f2;
    padding-top: 18px;
    padding-left: 50px;
  }
  .onlinebody{
    padding: 24px;
    padding-left: 50px;
    >h3{
      color: #000;
      font-size: 14px;
      font-weight: bold;
      margin: 10px 0;
    }
  }

</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
</style>
