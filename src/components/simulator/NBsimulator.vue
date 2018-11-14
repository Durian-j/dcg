<template lang="html">
  <div class="simulator">
    <div class="simulatornav">
      <span>NB设备模拟器</span>
      <el-tooltip class="item" effect="light" content="通过系统模拟NB-IoT设备上报数据到CIG，帮助开发者快速验证CIG中编解码插件的功能。" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>
    </div>
    <div class="simulatorbody">
      <div class="bodyhead">
        <h4>通过系统模拟NB-IoT设备上报数据到CIG，帮助开发者快速验证CIG中编解码插件的功能</h4>
      </div>
      <div class="bodymiddle">
        <div class="">
          <img src="../../assets/img/CIGTest1.png" alt="">
          <div class="">
            <p>通过在平台上创建模拟NB-IoT设备，无需考虑连接方式和网络环境，通过VerifyCode和应用设备地址填写一致，确保模拟设备被平台识别</p>
          </div>
        </div>
        <div class="">
          <img src="../../assets/img/CIGTest2.png" alt="">
          <div class="">
            <p>根据厂商设备的实际情况，灵活选择上报数据的输入类型（十六进制或JSON），验证CIG编解码插件功能是否正常</p>
          </div>
        </div>
        <div class="">
          <img src="../../assets/img/CIGTest3.png" alt="">
          <div class="">
            <p>可以选择是否开启接受应用下发的命令，在显示框中查看应用命令下发结果是否成功</p>
          </div>
        </div>
      </div>
      <div class="bodyfooter">
        <el-button type="primary" @click="binding">绑定设备</el-button>
        <p><a href="#">您是否了解我们的模拟器？</a></p>
      </div>

    </div>

    <!-- 绑定设备 -->
    <el-dialog title="绑定设备" :visible.sync="dialogFormVisible" width="480px"  @close='closeForm' :close-on-click-modal="false">
      <div class="bind">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="验证码" prop="name">
            <el-radio v-model="radio" label="1">加密</el-radio>
            <el-radio v-model="radio" label="2">不加密</el-radio>
          </el-form-item>
          <el-form-item label="验证码" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="PSK" v-show="radio==1">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button class="cancel" plain @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 验证码选择框
      radio: '1',
      // 绑定设备弹出框
      dialogFormVisible: false,
      form: {
          name: '基础API包',
        },
      rules: {
        name: [
          {
            required: true,
            message: '请输入经度',
            trigger: 'blur'
          }
        ],
      },
    }
  },
  methods: {
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    binding(){
      this.dialogFormVisible=true;
    },
  }
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
  .bind{
    padding: 0px 30px 0px 10px;

  }
</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
  .bind{
    .el-radio__label{
      font-size: 12px;
    }
    .el-radio__input.is-checked+.el-radio__label{
      color: #2b78e0;
    }
    .el-radio__input.is-checked .el-radio__inner{
      border-color: #2b78e0;
      background-color: #2b78e0;
    }
  }
</style>
