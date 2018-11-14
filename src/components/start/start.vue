<template lang="html">
  <div class="start">
    <div class="startnav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/start' }">从这里开始</el-breadcrumb-item>
        <el-breadcrumb-item>开发指导</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="guide">
      <h2>集成开发Mqtt类设备指导</h2>
      <div class="more">
        <el-popover
          placement="bottom"
          width="250"
          trigger="click"
          transition="el-zoom-in-center">
          <div class="guidecont">
            <div class="one">
              <a class="title">集成开发设备</a><br>
            </div>
            <router-link :to="{path:'/main/start'}" style="color:#2b78e0">Mqtt类设备指导</router-link><br>
            <router-link :to="{path:'/main/start'}">树莓派设备指导</router-link><br>
            <div class="two">
              <a class="title">构建应用</a><br>
            </div>
            <router-link :to="{path:'/main/structure'}">构建应用指导</router-link>
          </div>
          <div class="moreguide" slot="reference">
            更多指导<i class="iconfont icon-jiantouxia"></i>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="steptool">
      <div class="steptop">
        <div class="step">
          <el-steps :active="active" finish-status="success">
            <el-step title="准备阶段"></el-step>
            <el-step title="Profile开发"></el-step>
            <el-step title="编解码插件开发"></el-step>
            <el-step title="集成调测"></el-step>
            <el-step title="指导完成"></el-step>
          </el-steps>
        </div>
        <!-- step1 -->
        <div class="description" v-show="active==0">
          <div class="destitle">
            <p>开始您的旅程之前您需要做以下工作：</p>
          </div>
          <div class="desdetail">
            <p class="smalltitle">下载相关的开发文档，快速熟悉和启动开发</p>
            <p>联系电信开发人员下载开发5件套（开发者指南、API文档、样例程序、工具和帮助视频）及开发过程中需要的资料。</p>
          </div>
        </div>
        <!-- step2 -->
        <div class="description" v-show="active==1">
          <div class="destitle">
            <p>设备的Profile文件是用来描述设备类型和设备服务能力的文件。它定义了同一类型的设备具备的服务能力，每个服务具备的属性、命令以及命令的参数。</p>
          </div>
          <p>我们提供了一批系统模板，您可以在<a href="#" class="link">系统模板</a>中查看我们提供的模板样例。如果您新增设备的类型和设备功能服务已经在电信提供的列表中，可以单击立即使用，基于模板自定义产品。如果不在电信提供的列表中，则需要您开发Profile。</p>
          <div class="desdetail">
            <p class="detailtitle">开发步骤：</p>
            1. <a href="#" class="link">定义产品</a>
            <p>2. 完成Profile的开发</p>
          </div>
        </div>
        <!-- step-3 -->
        <div class="description" v-show="active==2">
          <div class="destitle">
            <p>Mqtt设备和物联网平台之间采用COAP协议通讯，COAP消息的数据为应用层数据，应用层数据的格式由设备自行定义。由于Mqtt设备对省电要求较高，所以应用层数据一般采用二进制格式。应用层数据在物联网平台做协议解析时，会转换成统一的json格式，以方便应用服务器调用。要实现二进制消息转换成json格式的功能，物联网平台需要使用编解码插件。</p>
          </div>
          <div class="desdetail">
            <p class="detailtitle">开发:</p>
            <p>我们提供Message Flow 编解码插件开发工具，通过图形化的方式完成设备与平台之间的消息映射。我们预集成了一批丰富的编解码插件模板，您可以根据设备类型和接入协议在<a href="#" class="link">系统插件模板</a>中选择模板，单击立即使用，即可使用该模板进行插件开发。模板中已定义该设备类型常见消息字段、设备Profile及他们之间的映射关系，您只需要做少量的修改，即可完成开发。</p>
            <a href="#" class="link" style="display:block;margin-top:5px;">开始开发</a>
          </div>
          <div class="desdetail">
            <p class="detailtitle">部署:</p>
            <p>开发完成后，我们portal提供自助部署的功能，一键即可完成部署的操作，然后就可以将您的设备接入到IoT平台。</p>
          </div>
        </div>
        <!-- step-4 -->
        <div class="description" v-show="active==3">
          <div class="desdetail">
            <p class="detailtitle">集成调测</p>
            <p>开发部署完成后，您就可以将您的设备接入到IoT平台。通过界面操作，你可以看到设备的基本信息、上报的数据、事件记录。您也可以下发命令的操作，并且在数据报告中查看从设备返回的数据。</p>
            <a href="#" class="link" style="display:block;margin-top:5px;">进入对接基本信息</a>
          </div>
          <div class="desdetail">
            <p class="detailtitle">没有应用？</p>
            <p>如果您没有应用，可以使用我们的模拟器来注册你的设备，它具备基本的应用能力，您不需要自由开发一个应用程序，同样也可以测试设备与平台交互，查看实时设备数据，也可以向设备发送命令并返回数据。</p>
          </div>
        </div>
        <!-- step-5 -->
        <div class="description" v-show="active==4">
          <div class="destitle">
            <p>联系电信开发人员应用到正式开发环境。</p>
          </div>
        </div>
      </div>
      <el-button plain style="margin-left:42%" @click="pre" :disabled="active==0">上一步</el-button>
      <el-button plain style="" @click="next" :disabled="active==4">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },

  methods: {
    // 操作步骤下一步的方法
    next() {
      if (this.active++ > 4) this.active = 0;
    },
    // 操作步骤上一步的方法
    pre(){
      if (this.active-- < 1) this.active = 4;
    },
  }
}
</script>

<style lang="scss" scoped>
  .startnav{
    height: 28px;
    border-bottom: 1px solid #f2f2f2;
    padding-top: 18px;
    padding-left: 50px;
  }
  .guide{
    height: 80px;
    background-color: #f7f9fc;
    line-height: 80px;
    padding-left: 50px;
    h2{
      color: #8a8a8a;
      font-size: 22px;
      font-weight: 400;
      float: left;
    }
    .more{
      float: right;
      cursor: pointer;
      padding-right: 100px;
      color: #000;
      font-size: 16px;
      line-height: 80px;
      .moreguide{
        height: 50px;
        i{
          margin-left: 6px;
          font-size: 12px;
          vertical-align: middle;
        }
      }
    }
  }
  .guidecont{
    padding: 0px 20px;
    height: 200px;
    a{
      font-size: 12px;
      color: #8a8a8a;
      display: inline-block;
      margin-top: 10px;
    }
    .title{
      font-weight: 700;
      color: #000;
    }
    div{
      border-bottom: 1px #e6e6e6 solid;
      height: 49px;
      line-height: 29px;
    }
  }
  .steptool{
    .steptop{
      height: 430px;
    }
    .step{
      width: 800px;
      margin: 60px auto 30px;
    }
    .description{
      padding:0px 100px;
      color: #333;
      p{
        line-height: 1.8;
        font-size: 13px;
      }
      a{
        font-size: 13px;
      }
      .link{
        color: #2b78e0;
      }
      .destitle{
        color: #8a8a8a;
        margin-bottom: 30px;

      }
      .desdetail{
        .smalltitle{
          font-size: 16px;
          color: #000;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .detailtitle{
          font-size: 14px;
          color: #000;
          font-weight: 700;
          margin-bottom: 15px;
          margin-top: 15px;
        }
        .link{
          color: #2b78e0;
        }
      }
    }
    .el-button{
      font-size: 12px;
      padding: 10px 25px;
    }
    .el-button:hover{
      color: #2b78e0;
      border-color: #2b78e0;
    }
  }


</style>

<style lang="scss">
  .steptool{
    .el-step__icon{
      width: 48px;
      height: 48px;
    }
    .el-step.is-horizontal .el-step__line{
      top: 22px;
    }
    .el-step__title{
      font-size: 13px;
      line-height: 70px;
    }
    .el-step__line{

    }
  }
</style>
