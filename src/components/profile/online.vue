<template lang="html">
  <div class="online">
    <div class="onlinenav">
      <span>产品列表</span>
      <el-tooltip class="item" effect="light" content="设备的Profile是用来描述设备类型和设备服务能力的文件。它定义了设备具备的服务能力，每个服务具备的属性、命令以及命令参数。这里提供在线定义profile功能。" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>
      <div class="optionbutton">
        <!-- <div class="" v-show="activeName=='first'">
          <a href="javascript:void(0);" @click="custom"><i class="iconfont icon-tainjia"></i>自定义产品</a>
        </div> -->
        <div class="">
          <a href="javascript:void(0);" @click="createpro" v-if="hasPermission('profile:addProfile')"><i class="iconfont icon-tainjia"></i>创建全新产品</a>
        </div>
        <div class="">
          <a href="javascript:void(0);" @click="guide"><i class="iconfont icon-question"></i>新手指导</a>
        </div>
      </div>
    </div>
    <div class="onlinebody">
      <!-- <myapp @ievent = "ievent"></myapp> -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <el-tab-pane label="我的产品" name="first">
          <profilelist v-bind:appId="appId" ref="c1"></profilelist>
        </el-tab-pane> -->
        <el-tab-pane label="我的产品" name="first">
          <profilelist ref="c1" v-if="hasPermission('profile:queryProfileList')"></profilelist>
        </el-tab-pane>
        <!-- <el-tab-pane label="产品模板" name="second">
          <p class="defintion">请基于模板开始定义您的产品!</p>
          <div class="productionmodule">

            <el-row :gutter="20">
              <el-col :span="4.8">
                <div class="grid-content bg-purple">
                  <div class="module">
                    <div class="icon">
                      <i class="iconfont icon-shezhi"></i>
                    </div>
                    <img src="../../assets/img/default.png" alt="">
                    <div class="onlinedetail">
                      <span>设备型号 :</span><p>SE01</p><br>
                      <span>厂商名称 : </span><p>ZGX</p>
                    </div>
                    <div class="learnmore">
                      <el-button plain class="learn">了解详情</el-button>
                      <el-button type="primary" plain class="use">立即使用</el-button>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>


          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>

    <!-- 创建全新产品弹出框 -->
    <el-dialog title="创建全新产品" :visible.sync="dialogFormVisible" width="600px"  @close='closeForm' :close-on-click-modal="false">
      <div class="newpro">
        <div class="create">
          <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
            <el-form-item label="设备类型" prop="deviceTypeId">
              <el-select v-model="form.deviceTypeId" placeholder="请选择">
                <el-option
                  v-for="item in devicetype"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备型号" prop="deviceModelId">
              <el-input v-model="form.deviceModelId"></el-input>
            </el-form-item>
            <el-form-item label="厂商ID" prop="vendorId">
              <el-input v-model="form.vendorId"></el-input>
            </el-form-item>
            <el-form-item label="厂商名称" prop="vendorName">
              <el-input v-model="form.vendorName"></el-input>
            </el-form-item>
            <el-form-item label="协议类型" prop="protocolTypeId">
              <el-select v-model="form.protocolTypeId" placeholder="请选择">
                <el-option
                  v-for="item in prototype"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设置图片:">
              <p style="font-size:12px;margin-bottom:15px;">(图片格式：png，图片大小不超过200kb)</p>
              <div class="upload">
                <input class="uppic" v-model="pictext" placeholder="请选择上传文件"></input>
                <input type="file" @change="getFile" ref="file" id="file">
                <div class="img-container" style="width:230px;border:2px dashed #b2b2b2;height:230px;position: relative;">
                  <img :src="src" alt="user image" width="230px" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="confirm" type="primary" @click="confirmpro('ruleForm')">确 定</el-button>
          <el-button class="cancel" plain @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新手指导 -->
    <el-dialog title="新手指导" :visible.sync="newguide" width="1140px" top="7vh" :close-on-click-modal="false" class="newguide">
      <div class="newer">
        <h4>设备的Profile是用来描述设备类型和设备服务能力的文件。它定义了设备具备的服务能力，每个服务具备的属性、命令以及命令参数。</h4>
        <div class="explain">
          <img src="../../assets/img/profileEmpty.png" alt="" width="800">
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="newguide = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>


  </div>
</template>

<script>

import profilelist from '../public/profilelist.vue';
import myapp from '../public/myapplication.vue';
import Qs from 'qs'

export default {
  // 调用public组件
  components: {
    'profilelist': profilelist,
    'myapp': myapp
  },
  data() {
    return {
      activeName: 'first',
      dialogFormVisible: false,
      form: {
        deviceTypeId: '',
        vendorId:'',
        vendorName:'',
        protocolTypeId:'',
        productImagePath:'',
        deviceModelId:'',
      },
      rules: {
        deviceTypeId: [
          {
            required: true,
            message: '请选择设备类型',
            trigger: 'blur'
          }
        ],
        deviceModelId: [
          {
            required: true,
            message: '输入设备型号',
            trigger: 'blur'
          }
        ],
        vendorId: [
          {
            required: true,
            message: '请输入厂商Id',
            trigger: 'blur'
          }
        ],
        vendorName: [
          {
            required: true,
            message: '请输入厂商名称',
            trigger: 'blur'
          }
        ],
        protocolTypeId: [
          {
            required: true,
            message: '请选择协议类型',
            trigger: 'blur'
          }
        ],
      },
      // 新手指导
      newguide: false,
      //当前的appId
      appId:'',
      //设备类型
      devicetype:[],
      //协议类型
      prototype:[],
      src: '../../../static/img/default.png',
      pic:'',
      formFile:'',
      pictext:'',
    };
  },
  methods: {
    handleClick(tab, event) {
      if(event.target.innerText=='我的产品'){
        this.$refs.c1.getprofilelist(); 
      }
    },
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },
    // custom(){
    //   this.activeName = 'second';
    // },
    createpro(){
      this.dialogFormVisible = true;
      if(this.$refs.file!=undefined){
        this.$refs.file.value ='';
      }
      this.pictext='';
      this.src='../../../static/img/default.png';
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'DEVICE_TYPE'}))
        .then(res => {
          this.devicetype=res.data.returnData[0]
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'PROTOCOL_TYPE'}))
        .then(res => {
          this.prototype=res.data.returnData[0]
        })
        .catch(error => {
        });
    },
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    guide(){
      this.newguide=true;
    },
    
    // ievent(data){
    //   this.appId=data;
    // },
    getFile (e) {
      let _this = this
      var files = e.target.files[0]
      if (!e || !window.FileReader) return  // 看支持不支持FileReader
      let reader = new FileReader()
      reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
      reader.onloadend = function () {
        _this.src = this.result
      }
      this.pic=files;
      this.pictext=files.name;
    },

    confirmpro(formName){

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formFile = new FormData();
          this.formFile.append('profileImageFile', this.pic);
          this.form.userId=this.$store.getters.userId;
          // this.formFile.append('appId', this.appId);
          this.formFile.append('profileJson', JSON.stringify(this.form));
          this.$axios.post(process.env.API_HOST+'profile/addProfile',
            this.formFile)
            .then(res => {
              if(res.data.returnCode=='success'){
                this.dialogFormVisible=false;
                this.$confirm('添加产品成功！', '添加提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(() => {
                  this.$router.push({path:'/main/profile/prodetail?profileId='+res.data.returnData[0].profileId})
                }).catch(() => {
                           
                });
              }
            })
            .catch(error => {
            });
        } else {
          return false;
        }
      });
    },
    

  },
  
};
</script>

<style lang="scss" scoped>
  .onlinenav{
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
    .optionbutton{
      float: right;
      div{
        float: left;
        margin-right: 20px;
        a{
          color: #000;
          font-weight: 500;
          i{
            color: #000;
            vertical-align: top;
          }
        }
        a:hover{
          color: #2b78e0;
          i{
            color: #2b78e0;
          }
        }

      }
    }
  }
  .onlinebody{
    padding: 24px;
    padding-left: 50px;
    #pane-second{
      .module{
        width: 220px;
        height: 380px;
        border:1px #e8e8e8 solid;
        margin-top: 15px;
        float: left;
        cursor: pointer;
        transition: all 0.3s ease-out;
        .icon{
          margin-top: 20px;
          float: right;
          margin-right: 20px;
          i{
            color: #d6d6d6;
            cursor: pointer;
          }
        }
        img{
          margin-left: 10px;
        }
        .onlinedetail{
          font-size: 12px;
          margin-left: 40px;
          span{
            color: #b3b3b3;
          }
          p{
            color: #000;
            font-weight: 600;
            display:inline-block;
            margin-bottom: 10px;
          }
        }
        .learnmore{
          margin-top: 10px;
          margin-left: 25px;
          button{
            font-size: 12px;
            padding: 10px 15px;
          }
          .use{
            background-color: #fff;
            border-color: #2b78e0;
            color: #2b78e0;
          }
          .learn:hover{
            color: #606266;
            border-color: #dcdfe6;
          }
        }
      }
      .module:hover{
        box-shadow: 0 0 10px #ccc;
      }
      .defintion{
        color: #000;
        font-size: 14px;
        font-weight: bold;
        margin-top: 20px;
      }
    }
  }
  .newpro{
    height: 420px;
    overflow: auto;
    .create{
      width: 85%;
    }
    .dialog-footer{
      .el-button{
        padding: 10px 40px;
        font-size: 12px;
      }
      .confirm{
        background-color: #4689d6;
      }
      .cancel:hover{
        color: #4689d6;
        border-color: #4689d6;
      }
    }
  }

  .newguide{
    .newer{
      text-align: center;
      h4{
        font-size: 16px;
        color: #000;
        font-weight: bold;
        line-height: 24px;
      }
      .explain{
        p{
          font-size: 12px;
          padding: 0 50px;
          color: black;
        }
      }
      .dialog-footer{
        text-align:right;
        margin-top: 20px;
        border-top: 1px solid #eceeef;
        .el-button{
          font-size: 12px;
          background-color: #2b78e0;
          padding: 10px 30px;
          margin-right: 30px;
          margin-top: 20px;
        }
      }
    }
  }
  
  .upload{
    position: relative;
    padding-top: 60px;
    #file{
      opacity: 0;
      position: absolute;
      width: 340px;
      height: 40px;
      left: 0;
      top: 0;
      cursor: pointer;
    }
    .uppic{
      width: 325px;
      height: 36px;
      border: 1px solid #dcdfe6;
      display: inline-block;
      border-radius:4px;
      position: absolute;
      left: 0;
      top: 0;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      padding-left: 15px;
    }
    
  }
  



</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
  .el-tabs__item{
    font-weight: 700;
    color: #6F7479;
  }
  .el-tabs__content{
    overflow: visible!important;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
