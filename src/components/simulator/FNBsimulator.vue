<template lang="html">
  <div class="simulator">
    <div class="simulatornav">
      <span>设备模拟器</span>
      <el-tooltip class="item" effect="light" content="通过设备模拟器模拟真实设备上报数据的行为，可以帮助应用开发者快速验证功能。" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>
    </div>
    <div class="simulatorbody">
      <div class="bodyhead">
        <h4>通过设备模拟器模拟真实设备上报数据的行为，可以帮助应用开发者快速验证功能</h4>
      </div>
      <div class="bodymiddle">
        <div class="">
          <img src="../../assets/img/simulatorIcon_01.png" alt="">
          <div class="">
            <p>您可以模拟平台集成的任何一款设备，在平台上创建对应的模拟设备，无需考虑连接方式和网络环境</p>
          </div>
        </div>
        <div class="">
          <img src="../../assets/img/simulatorIcon_02.png" alt="">
          <div class="">
            <p>和真实设备一样，您可以查看设备信息，管理设备，对其进行修改和删除操作；对于模拟网关，您还可以绑定其他模拟传感器</p>
          </div>
        </div>
        <div class="">
          <img src="../../assets/img/simulatorIcon_03.png" alt="">
          <div class="">
            <p>您可以通过界面操作，模拟和真实设备一样的各类事件，包括设备状态变化、上报设备数据，还可以查看应用侧下发给设备的命令信息</p>
          </div>
        </div>
      </div>
      <div class="bodyfooter">
        <el-button type="primary" @click="opensim">设备模拟器</el-button>
        <p><a href="#">您是否了解我们的模拟器？</a></p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods: {
    // 打开设备模拟器
    opensim(){
      this.$router.push({path:'/main/simulator/equipsimulator'})
    },
  },
}
</script>

<style lang="scss" scoped>
  .simulatornav{
     height: 46px;
     border-bottom: 1px solid #f2f2f2;
     line-height: 46px;
     padding-left: 50px;
     span{
       font-size: 14px;
       font-weight: 700;
       color: #000;
     }
     i{
       vertical-align: middle;
       color: #8a8a8a;
       margin-right: 5px;
     }
   }
  .simulatorbody{
    .bodyhead{
      text-align: center;
      margin: 50px;
      margin-bottom: 60px;
      h4{
        font-size: 16px;
        color: #000;
        font-weight: bold;
      }
    }
    .bodymiddle{
      width: 100%;
      height: 360px;
      >div{
        width: 33%;
        float: left;
        text-align: center;
        >div{
          padding: 20px 80px;
          font-size: 12px;
          color: #000;
          min-width: 200px;
        }
      }
    }
    .bodyfooter{
      text-align: center;
      .el-button{
        background-color: #4689d6;
        padding: 10px 70px;
        font-size: 12px;
      }
      p{
        margin-top: 10px;
        a{
          font-size: 12px;
          color: #4689d6;
        }
      }
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
