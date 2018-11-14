<template lang="html">
  <div class="simulator">
    <div class="simulatornav">
      <span>设备模拟器</span>
      <el-tooltip class="item" effect="light" content="通过系统模拟mqtt设备上报数据到CIG，帮助开发者快速验证CIG中编解码插件的功能。" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>
    </div>
    <div class="simulatorbody">
      <div class="simulatorheader">
        <span>IMEI号 : </span>
        <span>{{verificationCode}}</span>
        <el-button type="primary" @click="bindequip" :disabled="binddevice">绑定设备</el-button>
      </div>
      <div class="simulator-left">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="十六进制码流" name="first">
            <span>输入</span>
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入十六进制码流，如：010100101000"
              v-model="uptextarea">
            </el-input>
            <!-- <el-button type="primary" @click="send16">发送</el-button> -->
            <el-button type="primary" :disabled="verificationCode.length==0||uptextarea.length==0" @click="send">发送</el-button>
          </el-tab-pane>
          <el-tab-pane label="JSON消息" name="second">
            <span>输入</span>
            <el-input
              type="textarea"
              :rows="8"
              placeholder="请输入消息"
              v-model="downtextarea">
            </el-input>
            <el-button type="primary" :disabled="verificationCode.length==0||downtextarea.length==0" @click="send">发送</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="simulator-right" ref="blackbox">
        <div>
          <h5>
            设备日志信息
          </h5>
          <el-row>
            <el-col :span="12">
              <div class="grid-content">
                <h6>数据发送</h6>
                <div class="messlist" v-for="item in sendmessagelist" :key="item.createtime">
                  <p>操作时间 : {{item.createtime}}</p>
                  <span>数据上报信息 : {{item.message}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <h6>数据接收</h6>
                <div class="messlist" v-for="item in receivemessagelist" :key="item.receivetime">
                  <p>操作时间 : {{item.receivetime}}</p>
                  <span>数据上报信息 : {{item.receivemessage}}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    
    <!-- 请输入验证码 -->
    <el-dialog title="绑定设备" :visible.sync="field" width="460px"  @close='closedialog' :close-on-click-modal="false" top="25vh">
      <div class="attr">
        <el-form :model="newfield" ref="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="IMEI号" prop="code">
            <el-input v-model="newfield.code" placeholder="须唯一，如IMEI、mac等"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="confirm('ruleForm')">确 定</el-button>
        <el-button class="cancel" plain @click="field = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import Qs from 'qs'
export default {
  data(){
    return{
      activeName: 'first',
      verificationCode: '',
      uptextarea: '',
      downtextarea: '',
      field: false,
      newfield: {
        code: '',
      },
      rules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
      },
      client:'',
      message:'',
      // 发出的消息数组
      sendmessagelist:[],
      // 接收到的消息数组
      receivemessagelist:[],
      // 控制上报的码流为奇数还是偶数
      oddnumber: false,
      client2:'',
      userId:this.$store.getters.userId,
      binddevice: false,
    }
  },
  created(){
    
  },
  mounted(){
    this.setheight();
    window.onresize = () => {
      return (() => {
        this.$refs.blackbox.style.height = document.documentElement.clientHeight-250+'px';
      })()
    };
  },
  methods: {
    setheight(){
      this.$refs.blackbox.style.height = document.documentElement.clientHeight-250+'px';
    },
    closedialog(){
      this.$refs.ruleForm.resetFields();
    },
    bindequip(){
      this.field=true;
    },
    // 确认绑定设备
    confirm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.get(process.env.API_HOST+'device/queryDeviceInfoList?'
          +Qs.stringify({
            'userId':this.userId,
            'pageSize':100,
            'pageNum':1,
          }))
            .then(res => {
              let arr=res.data.returnData[0].itemList;
              let array=[];
              for(let i=0;i<arr.length;i++){
                array.push(arr[i].deviceUniqueNo)
              }
              if(array.includes(this.newfield.code)==true){
                this.field=false;
                this.verificationCode=this.newfield.code
                this.newclient();
              }else{
                this.$confirm('该IMEI号不存在', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(() => {
                }).catch(() => {
                });
              }
              if (this.client.isConnected() == true){
                this.client.disconnect();
              }
              if (this.client2.isConnected() == true) {
                this.client2.disconnect();
              }
            })
            .catch(error => {
            });
        } else {
          return false;
        }
      });
      
    },
    // newclient
    newclient(){
      this.client = new Paho.MQTT.Client('192.168.1.103', Number('1888'), '/ws', 'paho-mqtt-client-'+this.verificationCode);
      this.client2 = new Paho.MQTT.Client('192.168.1.103', Number('1889'), '/ws', 'paho-mqtt-client-'+this.verificationCode);
      this.client.onConnectionLost = this.onConnectionLost;
      this.client.onMessageArrived = this.onMessageArrived;
      this.client2.onConnectionLost = this.onConnectionLost;
      this.client2.onMessageArrived = this.onMessageArrived;
      this.Connect();
    },
    // 连接
    Connect() {
      this.client.connect({onSuccess: this.OnConnect, onFailure: this.onFailure});
      this.client2.connect({onSuccess: this.OnConnect2, onFailure: this.onFailure});
    },
    OnConnect(){
      if(this.activeName=='first'){
        // this.client.subscribe('upgoing/'+this.verificationCode);
        this.binddevice=true;
      }else{
        
        if(this.client.isConnected() == true){
          this.binddevice=true;
          this.client.subscribe('downgoing/'+this.verificationCode);
          
        }else{
          this.$confirm('请重新绑定', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.binddevice=false;
            this.verificationCode='';
            return
          }).catch(() => {
            return     
          });
        }
      }
      
    },
    OnConnect2(){
      if(this.client2.isConnected() == true){
        this.binddevice=true;
        this.client2.subscribe('simulation/upgoing/'+this.verificationCode);
      }else{
        this.$confirm('请重新绑定', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.binddevice=false;
          this.verificationCode='';
          return
        }).catch(() => {
          return     
        });
      }
      
    },
    DisConnect() {
      this.client.disconnect();
      // this.client2.disconnect();
      this.binddevice=false;
      this.verificationCode='';
    },
    send(){
      if(this.activeName=='first'){

        if(this.client.isConnected() == true){
          let obj={};
          obj.createtime=this.getCurrentTime();
          obj.message=this.uptextarea;
          this.sendmessagelist.unshift(obj);
          this.message = new Paho.MQTT.Message(this.stringbuffer(this.uptextarea));
          this.message.destinationName = 'upgoing/'+this.verificationCode;
          this.message.qos = 0;
          this.message.retained = false;
          // this.stringbuffer(this.uptextarea);
          
          this.client.send(this.message);
        }else{
          this.$confirm('请重新绑定', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.binddevice=false;
            this.verificationCode='';
            return
          }).catch(() => {
            return     
          });
        }
      }else{
        
        if(this.client2.isConnected() == true){
          let obj={};
          obj.createtime=this.getCurrentTime();
          obj.message=this.downtextarea;
          this.sendmessagelist.unshift(obj);
          this.$axios.post(process.env.API_HOST+'simulate/sendSimulate2API',
            Qs.stringify({
              'imei':this.verificationCode,
              'message':this.downtextarea,
            }))
            .then(res => {
            })
            .catch(error => {
            });
        }else{
          this.$confirm('请重新绑定', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.binddevice=false;
            this.verificationCode='';
            return
          }).catch(() => {
            return     
          });
        }
        
      }
      
    },
    onFailure(responseObject) {
      if (responseObject.errorCode !== 0) {
        this.$confirm('请重新绑定设备', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.binddevice=false;
          this.verificationCode='';
          return
        }).catch(() => {
          return     
        });
        // if(responseObject.errorCode === 1||responseObject.errorCode === 2||responseObject.errorCode === 5||responseObject.errorCode === 7||responseObject.errorCode === 8){
        //   this.$confirm('请重新绑定设备', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //   }).then(() => {
        //     this.binddevice=false;
        //     this.verificationCode='';
        //     return
        //   }).catch(() => {
        //     return     
        //   });
        // }
      }
    },
    onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        this.binddevice=false;
        this.verificationCode='';
        console.log(responseObject.errorMessage);
      }
    },
    onMessageArrived(message) {
      if(this.activeName=='first'){
        let obj={};
        obj.receivetime=this.getCurrentTime();
        obj.receivemessage=String.fromCharCode.apply(String, message.payloadBytes);
        this.receivemessagelist.unshift(obj);
        let object={};
        object.sendData=this.uptextarea;
        object.pluginType=1;
        object.pluginPrefix=2;
        object.receiveData=String.fromCharCode.apply(String, message.payloadBytes);
        object.imei=this.verificationCode;
        this.$axios.post(process.env.API_HOST+'simulate/addSimulateLog',
          JSON.stringify(object),
          {headers:{'Content-Type': 'application/json'}})
          .then(res => {
          })
          .catch(error => {
          });

      }else{
        let str='';
        for(let i=0;i<message.payloadBytes.length;i++){
          if(message.payloadBytes[i].toString(16).toUpperCase().length==1){
            var string=message.payloadBytes[i].toString(16).toUpperCase();
            string='0'+string
            str=str+string+' '
          }else{
            str=str+message.payloadBytes[i].toString(16).toUpperCase()+' '
          }
        }
        let obj={};
        obj.receivetime=this.getCurrentTime();
        obj.receivemessage=str;
        this.receivemessagelist.unshift(obj);
        let object={};
        object.sendData=this.downtextarea;
        object.pluginType=2;
        object.pluginPrefix=1;
        object.receiveData=message.payloadBytes;
        object.imei=this.verificationCode;
        this.$axios.post(process.env.API_HOST+'simulate/addSimulateLog',
          JSON.stringify(object),
          {headers:{'Content-Type': 'application/json'}})
          .then(res => {
          })
          .catch(error => {
          });

      }
      
    },

    
    getCurrentTime() {
      var date = new Date();//当前时间
      var month = this.zeroFill(date.getMonth() + 1);//月
      var day = this.zeroFill(date.getDate());//日
      var hour = this.zeroFill(date.getHours());//时
      var minute = this.zeroFill(date.getMinutes());//分
      var second = this.zeroFill(date.getSeconds());//秒
      var millisecond = this.zeroMill(date.getMilliseconds());
      
      //当前时间
      var curTime = date.getFullYear() + '/' + month + '/' + day
              + ' ' + hour + ':' + minute + ':' + second + ':' + millisecond;
      return curTime;
    },
    
    zeroFill(i){
      if (i >= 0 && i <= 9) {
        return '0' + i;
      } else {
        return i;
      }
    },
    zeroMill(i){
      if (i >= 0 && i <= 9) {
        return '00' + i;
      } else if(i >= 10 && i <= 99) {
        return '0' + i;
      }else{
        return i;
      }
    },

    handleClick() {
      this.sendmessagelist=[];
      this.receivemessagelist=[];
    },

    // string转arraybuffer
    stringbuffer(str) {
      let string='';
      // for(let i=0;i<str.length;i++){
      //   if(i%2==0){
      //     string=string+str[i]
      //   }else{
      //     string=string+str[i]+','
      //   }
      // }
      var arr=str.split(' ');
      string = arr.join(',');
      // string=string.substring(0,string.length-1);
      
      // 将16进制转化为ArrayBuffer
      return new Uint8Array(string.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      })).buffer

    },
    
  },
  // 用户跳转路由时的回调函数
  beforeRouteLeave (to, from, next) {
    if (this.client!=''&&this.client.isConnected() == true){
      this.client.disconnect();
    }
    if (this.client2!=''&&this.client2.isConnected() == true) {
      this.client2.disconnect();
    }
    next();
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
   .simulatorheader{
     height: 60px;
     line-height: 60px;
     padding-left: 50px;
     border-bottom: 1px solid #f2f2f2;
     >span{
       font-size: 14px;
       font-weight: bold;
       color: #000;
     }
     >button{
       float: right;
       font-size: 12px;
       border-radius: 0px;
       margin-top: 12px;
       margin-right: 15px;
     }
   }
   .simulator-left{
     width: 40%;
     float: left;
     >div{
       padding: 24px;
       padding-left: 50px;
     }
     span{
       font-size: 13px;
       margin-top: 30px;
       display: inline-block;
       margin-bottom: 10px;
     }
     button{
       font-size: 12px;
       border-radius: 0px;
       padding: 12px 40px;
       margin-top: 25px;
     }
   }
   .simulator-right{
     width: 60%;
     background-color: #fff;
     height: 100px;
     float: left;
     >div{
       margin-right: 10px;
       height: 100%;
       background-color: #000;
       padding: 36px 18px 36px 48px;
       color: #fff;
       overflow: auto;
       >h5{
         font-size: 14px;
         font-weight: normal;
       }
       h6{
         font-size: 14px;
         color: #2b78e0;
         font-weight: normal;
         margin-top: 20px;
       }
     }
   }
   .dialog-footer{
     margin-top: 0px;
   }
   .attr{
     width: 90%;
   }
   .messlist{
     font-size: 12px;
     color: #fff;
     p{
       margin-top: 12px;
     }
     span{
       margin-top: 8px;
       color: #47b747;
       display: inline-block;
     }
   }
   .grid-content{
     overflow: hidden;
     text-overflow: ellipsis;
     word-break: break-all;
     padding-right: 30px;
   }
   

</style>

<style lang="scss">
  .el-tabs__item{
    font-weight: 700;
    color: #6F7479;
  }
  .simulator .el-message-box{
     width: 330px;
     p{
       margin: 10px 0;
       i{
          font-size: 40px;
          color:#e64545;
          vertical-align: middle;
          margin-right: 15px;
        }
     }
     
   }
</style>
