<template lang="html">
  <div class="register">
    <div class="registernav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/equipment' }">我的设备</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/main/equipment/register' }">注册设备</el-breadcrumb-item>
        Profile详情
        <el-tooltip class="item" effect="light" content="在对接之前需要注册相应设备，然后用设备标识码与编解码插件进行绑定，这里提供注册设备的功能。" placement="right">
          <i class="iconfont icon-question"></i>
        </el-tooltip>
      </el-breadcrumb>

    </div>
    <div class="registerbody">
      <profiledetail></profiledetail>

    </div>
    <div class="registerfooter">
      <span>设备名称</span>
      <input type="text" name="" value="" placeholder="请输入设备名称" v-model="registerlist.deviceName">
      <span v-show="warning" style="position:absolute;color:red;left:48px;top:67px">设备名称及验证码不能包含空格</span>
      <span>验证码</span>
      <input type="text" v-model="registerlist.deviceUniqueNo" name="" value="" placeholder="必须唯一，如IMEI，mac等" title="验证码是指设备的唯一标识，智慧家庭设备需填入mac地址，NB类型设备则填入IMEI号">
      <span>选择应用</span>
      <el-select v-model="registerlist.appId" placeholder="请选择应用">
        <el-option
          v-for="item in options"
          :key="item.appId"
          :label="item.appName"
          :value="item.appId">
        </el-option>
      </el-select>
      
      <span v-show="registerlist.encryptDeviceStatus=='1'">PSK</span>
      <input type="text" name="" value="" placeholder="请输入16进制PSK(可选)" v-show="registerlist.encryptDeviceStatus=='1'">
      <div style="float:right;margin-right:330px;">
        <!-- <span>加密设备</span>
        <el-radio v-model="registerlist.encryptDeviceStatus" label="0">否</el-radio>
        <el-radio v-model="registerlist.encryptDeviceStatus" label="1">是</el-radio> -->
        <el-button type="primary" @click="registerequ"
        :disabled="registerlist.deviceName==''||registerlist.deviceUniqueNo==''||registerlist.appId==''">注册</el-button>
      </div>
    </div>

    <!-- 创建成功 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="600px">
      <div class="success">
        <h3>注册设备成功</h3>
        <p>请根据设备指导说明书为设备接通电源，配置好网络，开启设备，观察设备是否成功接入到平台。如果状态是在线（online）表示设备已经成功的接入到平台，接着就可以接收设备的数据。</p>
        <p>以下是您的设备信息，请牢记</p>
        <p>设备Id</p>
        <span>{{successlist.deviceId}}</span>
        <!-- <p>PSK码 (使用DTLS协议时需要使用到该psk码，请您牢记!)</p> -->
        <span style="color:red">{{successlist.psk}}</span></br>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resuccess">确 定</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import profiledetail from '../public/profiledetail.vue';
import Qs from 'qs'

export default {
  data(){
    return{
      registerlist:{
        userId:this.$store.getters.userId,
        deviceName:'',
        deviceUniqueNo:'',
        profileId:'',
        status:'',
        appId:'',
        encryptDeviceStatus:'0'
      },
      options:[],
      dialogVisible:false,
      successlist:{
        deviceId:'',
        psk:''
      },
      userId:this.$store.getters.userId,
      warning:false,
    }
  },
  created(){
    this.getinfo();
    this.registerlist.profileId=this.$route.query.profileId;
  },
  methods:{
    registerequ(){
      var text = this.registerlist.deviceName+this.registerlist.deviceUniqueNo;
      var reg = /\s/;
      if(reg.exec(text)==null){
        this.warning=false;
        this.registerlist.encryptDeviceStatus=parseInt(this.registerlist.encryptDeviceStatus);
        this.$axios.post(process.env.API_HOST+'device/addDeviceInfo',
          JSON.stringify(this.registerlist),
          {headers:{'Content-Type': 'application/json'}}
        ).then(res => {
          if(res.data.returnCode=='success'){
            this.dialogVisible=true;
            this.successlist=res.data.returnData[0];
          }else{
            this.$confirm(res.data.returnMsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
            }).catch(() => {      
            });
          }
          
        }).catch(error => {
        });
      }else{
        this.warning=true;
      }
       
      
    },
    //获取所有应用
    getinfo(){
      this.$axios.get(process.env.API_HOST+'abutment/queryApplicationList?'+Qs.stringify({'userId':this.userId}))
        .then(res => {
          this.options=res.data.returnData;
          console.log(this.options);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //设备注册成功
    resuccess(){
      this.$router.push({path:'/main/equipment'})
    },
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
    .el-radio+.el-radio{
      margin-left: 10px;
    }
    .el-button{
      background-color: #0275d8;
      padding: 12px 40px;
      font-size: 12px;
      border-color: #0275d8;
      margin-left: 50px;
    }
  }
  .el-select-dropdown__item{
    font-size: 12px;
  }
  .success{
      padding: 0 30px;
      h3{
        color: #000;
        font-size: 16px;
        margin-top: -30px;
        margin-bottom: 20px;
      }
      p{
        color: #8a8a8a;
        font-size: 12px;
        margin-top: 20px;
      }
      span{
        color: #000;
        font-size: 12px;
        font-weight: 500;
      }
      button{
        font-size: 12px;
        padding: 12px 30px;
        margin: 0px auto;
      }
      .dialog-footer{
        width: 100%;
        display: block;
      }
    }

</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: #0275d8!important;
  }
  .el-radio__input.is-checked .el-radio__inner{
    border-color: #0275d8;
    background: #0275d8;
  }
  .el-radio__label{
    font-size: 12px;
  }
  .registerfooter{
    .el-input{
      width:200px;
    }
    input::-webkit-input-placeholder{
      color:#8a8a8a;
    }
    .el-input__inner{
      height: 32px;
      border-radius:2px;
      font-size: 13px;
      color: #000;
    }
    .el-select{
      width:200px;
    }
    
    
  }
  
  
</style>
