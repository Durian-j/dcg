<template lang="html">
  <div class="subscribe">
    <div class="subscribenav">
      <span>应用订阅</span>
      <el-tooltip class="item" effect="light" content="应用订阅事件，事件被触发时会自动调用事件回调。" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>
    </div>
    <div class="subscribebody">
      <div class="subscribebox">
        <div class="appheader">
          <myapp @ievent = "ievent"></myapp>
        </div>
        
        <div class="minetitle">
          <p>我的订阅</p>
        </div>
        <div class="boxbody" v-for="item in nowsublist" :key="item.type" v-if="hasPermission('subscription:querySubscription')">
          <div class="boxheader">
            <div class="">
              <p class="point">{{item.name}}</p>
            </div>
            <div style="float:right">
              <p class="delsub" @click="deletesub(item.type)" v-if="hasPermission('subscription:deleteSubscription')"><i class="iconfont icon-shanchu"></i>删除订阅</p>
            </div>
          </div>
          <div class="boxmain">
            <div class="">
              <p style="color:#8a8a8a">订阅地址</p>
              <p>{{item.value}}</p>
            </div>
            <!-- <div class="test">
              <a href="javascript:void(0);" @click="test">测试</a>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="morescribe">
      <div class="minetitle">
        <p style="margin-left:-26px;">更多订阅</p>
      </div>
      <div class="moreinform">
        <div class="inform" v-for="item in moresubservice" :key="item.valueAlias">
          <h6>
            <p>{{item.valueAlias}}</p>
            <el-button type="primary" icon="iconfont icon-tainjia" @click="subscr(item.value)" v-if="hasPermission('subscription:addSubscription')">订阅</el-button>
          </h6>
          <div class="informbody">
            {{item.desc}}
          </div>
        </div>
      </div>
    </div>

    <!-- 测试弹出框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="650px">
      <div class="testcon">
        <div class="testheader">
          <div class="" style="padding-top:20px;">
            <i class="iconfont icon-error-1"></i>
          </div>
          <div class="">
            <h4>请处理后再试。</h4>
            <span>http://114.115.143.230:9092/app/notify</span><br>
            <el-button plain>重新检测</el-button>
          </div>
        </div>
        <div class="testbody">
          <span>检测项...</span>
          <i class="iconfont icon-duihao2 green"></i><p>URL格式校验</p><br>
          <i class="iconfont icon-duihao2 green"></i><p>订阅成功</p><br>
          <i class="iconfont icon-chahao red"></i><p>服务器返回HTTP响应码：503</p>
        </div>
        <div class="testfooter">
          <el-button type="primary">确 定</el-button>
        </div>

      </div>
    </el-dialog>

    <!-- 订阅信息弹出框 -->
    <el-dialog title=" 添加新设备" :visible.sync="dialogFormVisible" width="620px" :close-on-click-modal="false" top="25vh">
      <div class="addnew">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="订阅地址:" prop="value">
            <el-input v-model="form.value"></el-input>
            <p>订阅系统将自动检测地址，检测通过后即为订阅成功。</p>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="confirmsub('ruleForm')">订 阅</el-button>
        <el-button class="cancel" plain @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 删除订阅弹出框 -->
    <el-dialog
      :visible.sync="resetkey"
      width="480px"
      top="30vh">
      <div class="success warning">
        <div style="width:50px;float:left;margin-left:10px;margin-right:10px;padding-top:10px">
          <i class="iconfont icon-21"></i></div>
        <div style="width:330px;float:left">
          <h5>删除订阅</h5>
          <p>订阅成功退订后，您将不会收到与该事件相关的任何通知。确定要现在退订该项订阅事件吗?</p>
        </div>
        <span slot="footer" class="dialog-footer" style="width:100%;text-align:center">
          <el-button type="primary" @click="confirmdel">确 定</el-button>
          <el-button class="del" @click="resetkey = false">取 消</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Qs from 'qs'
import myapp from '../public/myapplication.vue';
export default {
  components: {
    'myapp': myapp
  },
  data(){
    return{
      dialogVisible: false,
      dialogFormVisible: false,
      form: {
        value: 'https://',
      },
      resetkey: false,
      appId:'',
      nowsublist:[],
      moresubservice:[],
      rules: {
        value: [
          {
            required: true,
            message: '请输入订阅地址',
            trigger: 'blur'
          },
          { pattern: /^\S+$/, message: '订阅地址禁止包含空格' }
        ],
      },
      // 当前订阅号的Id
      Id:'',
      appName:'',
      nowsubvalue:'',
      nowsubtype:'',
      delsublist:'',
    }
  },
  created(){
    this.getsubservice();
  },
  methods: {
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },
    test(){
      this.dialogVisible=true;
    },
    subscr(value){
      this.$axios.get(process.env.API_HOST+'subscription/checkSubscription?'
      +Qs.stringify({
        'appId':this.appId,
        'type':value
      }))
        .then(res => {
          if(res.data.returnCode=='failure'){
            this.$confirm('该订阅服务类型已存在，订阅失败', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(() => {
            }).catch(() => {       
            });
          }else{
            this.dialogFormVisible=true;
            this.form.value='https://';
            this.nowsubvalue=value;
          }
        })
        .catch(error => {
        });
    },
    deletesub(nt){
      this.resetkey=true;
      this.nowsubtype=nt;
    },
    ievent(data){
      let arr= data.split(',');
      this.appId=arr[0];
      this.appName=arr[1];
      this.getappservice();
    },
    // 获取所有订阅服务
    getsubservice(){
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'SUBSCRIPTION_TYPE'}))
        .then(res => {
          this.moresubservice=res.data.returnData[0];
        })
        .catch(error => {
        });
    },
    // 获取当前应用下的所有订阅服务
    getappservice(){
      this.$axios.get(process.env.API_HOST+'subscription/querySubscription?'+Qs.stringify({'appId':this.appId}))
        .then(res => {
          this.delsublist=res.data.returnData[0];
          this.nowsublist=res.data.returnData[0].app[0].urls;
          for(let i=0;i<this.moresubservice.length;i++){
            for(let j=0;j<this.nowsublist.length;j++){
              if(this.nowsublist[j].type==this.moresubservice[i].value){
                this.nowsublist[j].name=this.moresubservice[i].valueAlias
              }
            }
          }
        })
        .catch(error => {
        });
    },
    // 订阅查询是否重复接口
    checkser(typeval){
      this.$axios.get(process.env.API_HOST+'subscription/subscription/checkSubscription?'
      +Qs.stringify({
        'appId':this.appId,
        'type':typeval
      }))
        .then(res => {
          console.log(res);
        })
        .catch(error => {
        });
    },
    // 确定订阅
    confirmsub(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj={};
          obj.id=this.appId;
          obj.name=this.appName;
          let urls=[];
          let object={};
          object.type=this.nowsubvalue;
          object.value=this.form.value;
          urls.push(object);
          obj.urls=urls;
          let obja={};
          obja.appId=this.appId;
          obja.app=obj;
          console.log(obja);
          this.$axios.post(process.env.API_HOST+'subscription/addSubscription',
            Qs.stringify({
              'subscriptionJson':JSON.stringify(obja)
            }))
            .then(res => {
              console.log(res);
            })
            .catch(error => {
            });
        } else {
          return false;
        }
      });
    },
    // 确认删除订阅
    confirmdel(){
      for(let i=0;i<this.delsublist.app[0].urls.length;i++){
        if(this.nowsubtype==this.delsublist.app[0].urls[i].type){
          this.delsublist.app[0].urls.splice(i,1);
        }
      }
      this.$axios.put(process.env.API_HOST+'subscription/modifySubscription',
        Qs.stringify({
          'subscriptionJson':JSON.stringify(this.delsublist)
        }))
        .then(res => {
          this.resetkey=false;
          this.getappservice();
        })
        .catch(error => {
        });
    },
  },
}
</script>

<style lang="scss" scoped>
  .subscribenav{
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
   .subscribebody{
     padding: 24px;
     .boxbody{
       margin: 0 26px;
       height: 120px;
       margin-top: 20px;
       .boxheader{
         border-bottom: 1px solid #2b78e0;
         height: 25px;
         >div{
           float: left;
           .point::before{
              content: '';
              display: inline-block;
              width: 4px;
              height: 4px;
              border-radius: 4px;
              background-color: #2b78e0;
              margin: 2px 8px 2px 0;
           }
         }
         .delsub{
           cursor: pointer;
         }
         .delsub:hover{
           color: #2b78e0;
         }
       }
       .boxmain{
         background-color: #f7f9fc;
         height: 90px;
         >div{
           float: left;
           p{
             margin-top: 15px;
             margin-left: 50px;
           }
         }
         .test{
           float: right;
           margin-right: 100px;
           margin-top: 30px;
           a{
             color: #2b78e0;
           }
           a:hover{
             color: #a5c8f1;
           }
         }
       }
     }
   }
  .morescribe{
    padding: 10px 50px;
    .moreinform{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 20px;
      .inform{
        width: 28%;
        min-height: 120px;
        border: 1px solid #e6e6e6;
        padding: 20px;
        margin-bottom: 20px;
        >h6{
          height: 36px;
          p{
            display: inline-block;
            font-size: 14px;
            font-weight: bold;
            color: #000;
            line-height: 36px;
          }
          .el-button{
            border: 1px solid #2b78e0;
            color: #2b78e0;
            background-color: #fff;
            padding: 8px 30px;
            border-radius: 0px;
            float: right;
          }
          .el-button:hover{
            color: #a5c8f1;
            border-color: #a5c8f1;
          }
        }
        .informbody{
          margin-top: 15px;
          color: #999999;
        }
      }
    }
  }
  .minetitle{
    padding-left: 26px;
    font-size: 14px;
    font-weight: 700;
    color: #000;
  }
  .testcon{
    height: 350px;
    padding: 0 30px;
    .testheader{
      margin-top: 10px;
      height: 100px;
      border-bottom: 1px solid rgba(0,0,0,.1);
      >div{
        float: left;
        margin-right: 30px;
        i{
          color: #e64545;
          font-size: 40px;
          vertical-align: bottom;
        }
        h4{
          font-size: 16px;
          color: #e64545;
          font-weight: 400;
        }
        span{
          font-size: 12px;
          color: #8a8a8a;
        }
        .el-button{
          font-size: 12px;
          padding: 8px 20px;
          border-radius: 0px;
          margin-top: 10px;
        }
        .el-button:hover{
          color: #2b78e0;
        }
      }
    }
    .testbody{
      padding: 20px 69px;
      p{
        display: inline-block;
        color: #000;
        margin-bottom: 15px;
      }
      span{
        margin-bottom: 10px;
        display: block;
      }
      i{
        margin-right: 8px;
      }
      .green{
        color: #67c23a;
      }
      .red{
        color: #e64545;
        font-size: 19px;
        margin-left: -1px;
      }
    }
    .testfooter{
      text-align: center;
      >.el-button{
        background-color: #2b78e0;
        padding: 10px 30px;
        font-size: 12px;
        border-radius: 0px;
      }
    }

  }
  .addnew{
    padding: 0 30px 0 10px;
    p{
      font-size: 12px;
      color: #8a8a8a;
    }
  }
  .success{
    height: 260PX;
    margin-top: -20px;
    i{
      color: #2dc770;
      font-size: 40px;
      vertical-align: text-top;
    }
    h5{
      color: #2dc770;
      font-size: 16px;
      font-weight: normal;
    }
    span{
      display: inline-block;
      font-size: 12px;
      margin-top: 10px;
      color: #8a8a8a;
      font-weight: 500;
    }
    .con{
      color: black;
      font-weight: 700;
    }
    .el-button{
      background-color: #2b78e0;
      color: #fff;
      font-size: 12px;
      padding: 10px 20px;
      border-radius: 0px;
      margin: 10px auto;
      margin-right: 18px;
    }
  }
  .warning{
    height: 140px;
    i,h5{
      color: #f6bb42;
    }
    .del{
      background-color: #fff;
      color: #333;
    }
    .del:hover{
      color: #2b78e0;
      border-color: #2b78e0;
    }
  }
  .subscribebox{
    .appheader{
      height: 50px;
      margin-top: -10px;
      border-bottom: 1px solid #f2f2f2;
      margin-bottom: 10px;
      line-height: 40px;
      padding-left: 24px;
      font-weight: bold;
      
    }
  }

</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
  .subscribe{
    .dialog-footer{
      margin-top: 0px;
    }
  }
  .appheader{
    .el-icon--right{
      padding-top: 13px;
    }
  }
</style>
