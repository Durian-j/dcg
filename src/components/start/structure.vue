<template lang="html">
  <div class="start">
    <div class="startnav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/start' }">从这里开始</el-breadcrumb-item>
        <el-breadcrumb-item>开发指导</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="guide">
      <h2>应用开发</h2>
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
            <router-link :to="{path:'/main/start'}">Mqtt类设备指导</router-link><br>
            <router-link :to="{path:'/main/start'}">树莓派设备指导</router-link><br>
            <div class="two">
              <a class="title">构建应用</a><br>
            </div>
            <router-link :to="{path:'/main/structure'}" style="color:#2b78e0">构建应用指导</router-link>
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
            <el-step title="应用对接开发"></el-step>
            <el-step title="对接测试"></el-step>
            <el-step title="指导完成"></el-step>
          </el-steps>
        </div>
        <!-- step1 -->
        <div class="description" v-show="active==0">
          <div class="destitle">
            <p>您可以通过两种方式完成应用开发:</p>
          </div>
          <div class="desdetail">
            <p class="smalltitle">快速创建 <i>Coming soon...</i></p>
            <p>选用应用程序模型快速创建您自己的应用。</p>
          </div>
          <div class="desdetail" style="margin-top:20px">
            <p class="smalltitle">下载相关的开发文档，快速熟悉和启动开发:</p>
            <p>我们提供了完整的开发指南以帮助您快速的了解我们的开发流程及规则要求:</p>
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
            <p>我们已为您配置了开发环境，和应用对接地址 。</p>
          </div>
        </div>
        <!-- step-4 -->
        <div class="description" v-show="active==3">
          <div class="destitle">
            <p>我们提供易操作的测试工具，以及多样的设备资源，以帮助您进行应用功能的验证测试。</p>
            <p>您可以通过两种方式对应用进行测试：</p>
          </div>
          <div class="desdetail">
            <p class="smalltitle">设备模拟器</p>
            <p>通过NB设备模拟器 或者 非NB设备模拟器模拟真实设备对应用进行测试。</p>
          </div>
          <div class="desdetail" style="margin-top:20px">
            <p class="smalltitle">真实设备</p>
            <p>通过导入设备Profile接入您自己的真实设备进行应用测试。接入我的设备</p>
          </div>
        </div>
        <!-- step-5 -->
        <div class="description" v-show="active==4">
          <div class="destitle">
            <p>完成应用开发与测试之后，请联系电信开发人员。我们将为合作伙伴提供技术、营销和销售资源，帮助伙伴构建和发布解决方案。</p>
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
        i{
          color: #8a8a8a;
        }
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
