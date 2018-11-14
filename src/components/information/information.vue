<template lang="html">
  <div class="information">
    <div class="informnav">
      <span>对接基本信息</span>
      <el-tooltip class="item" effect="light" content="该界面是对接地址查询界面" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>

    </div>
    <div class="informbody">
      <div class="usedetail">
        应用详情
        <div class="current">
          <span style="color:black">当前应用：</span>
          <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
            <span class="el-dropdown-link">
              {{currentapplication.appName}}
              <span v-if="currentapplication.uploadCert==false" style="color:red">[尚无推送证书]</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addapp" divided v-if="hasPermission('abutment:addApplicationInfo')">创建应用</el-dropdown-item>
              <el-dropdown-item v-for="item in application" :key="item.appName" :command=item.appId v-if="hasPermission('abutment:queryApplicationList')">
                <span style="display:none">{{item.appId}}</span>
                {{item.appName}}<span v-if="item.uploadCert==false">[尚无推送证书]</span>
                <span class="del" @click="delapplication($event)" v-if="hasPermission('abutment:removeApplicationInfo')">删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="informone" v-if="hasPermission('abutment:queryCurrentApplicationInfo')">
        <div class="">
          <div class="informheader">
            主要信息
            <i class="iconfont icon-bianji" @click="mainmodify" v-show="mainedit" v-if="hasPermission('abutment:modifyApplicationInfo')"></i>
            <i class="iconfont icon-duihao" v-show="mainadd" @click="mainconfirm"></i>
            <i class="iconfont icon-cuohao" v-show="mainadd" @click="maincancel"></i>
          </div>
          <div class="informleft">
            <span>应用名称</span>
            <p>{{applicationdetail.appName}}</p>
            <span>创建时间</span>
            <p>{{applicationdetail.createTime}}</p>
          </div>
          <div class="informleft">
            <span>应用ID</span>
            <p>{{applicationdetail.appId}}</p>
            <span style="margin-bottom:20px;">应用描述</span>
            <el-input
              type="textarea"
              :rows="3"
              v-model="applicationdetail.appDesc"
              :disabled="textareactive"
              style="resize:none">
            </el-input>
          </div>
        </div>
        <div class="" style="padding-left:50px;">
          <div class="informheader">
            应用安全
          </div>
          <div class="informleft">
            <span>应用密钥</span>
            <p style="color:red;cursor:pointer" @click="resetkey=true" v-if="hasPermission('abutment:modifyAppSecretKey')">重置</p>
            <span>推送证书</span>
            <p v-if="applicationdetail.uploadCert==true">推送证书已上传</p>
            <p style="color:red" v-if="applicationdetail.uploadCert==false">尚无推送证书</p>
            <a href="javascript:void(0);" @click="change" v-if="hasPermission('abutment:uploadAppCertificate')&&applicationdetail.uploadCert==true">更换</a>
            <a href="javascript:void(0);" @click="change" v-if="hasPermission('abutment:uploadAppCertificate')&&applicationdetail.uploadCert==false">
              上传
            </a>
          </div>
        </div>
      </div>
      <div class="informone informtwo" v-if="hasPermission('abutment:queryCurrentApplicationInfo')">
        <div class="">
          <div class="informheader">
            接入信息
          </div>
          <div class="informleft">
            <span>接入方式</span>
            <p><el-checkbox v-model="checked" disabled>mqtt 接入</el-checkbox></p>
            <span>应用接入地址</span>
            <p>180.101.147.89:8743</p>
          </div>
          <div class="informleft">
            <span>设备接入地址</span>
            <p>加密地址：<br>
              180.101.147.115:5684<br>
              <br>
              非加密地址：<br>
              180.101.147.115:5683</p>
          </div>
        </div>
        <div class="" style="padding-left:50px;">
          <div class="informheader">
            行业信息
            <i class="iconfont icon-bianji" @click="industrymodify" v-show="industryedit" v-if="hasPermission('abutment:modifyApplicationInfo')"></i>
            <i class="iconfont icon-duihao" v-show="industryadd" @click="industryconfirm"></i>
            <i class="iconfont icon-cuohao" v-show="industryadd" @click="industrycancel"></i>
          </div>
          <div class="informleft">
            <span>所属行业</span>
            <p v-show="industryedit">{{applicationdetail.dictionaryIndustry.value}}</p>
            <el-select v-model="applicationdetail.dictionaryIndustry.value" placeholder="请选择" v-show="industryadd">
              <el-option
                v-for="item in industry"
                :key="item.id"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
            <span>历史数据存储天数：</span>
            <p v-show="industryedit">{{applicationdetail.saveHisDay}}天</p>
            <div class="number">
              <input v-show="industryadd" type="number" min="1" max="10" v-model="applicationdetail.saveHisDay" />
            </div>
          </div>
          <div class="informleft">
            <span>应用能力</span>
            <p v-show="industryedit">{{applicationdetail.dictionaryAppAbility.value}}</p>
            <el-select v-model="applicationdetail.dictionaryAppAbility.value" placeholder="请选择" v-show="industryadd">
              <el-option
                v-for="item in ability"
                :key="item.id"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>

    </div>
    <!-- 上传证书 -->
    <el-dialog title="上传证书" :visible.sync="certificate" width="500px" :close-on-click-modal="false" class="uploadcertificate">
      <div class="uploadcertificate">
        <p style="margin-top:-15px;">该应用尚未上传应用证书，订阅功能将无法使用</p>
        <p style="margin-top:20px;margin-bottom:10px;">上传证书文件</p>
        <div class="xlsfile">
          <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="/gp/abutment/uploadAppCertificate"
                  :on-preview="handlePreview"
                  :before-upload="beforeAvatarUpload"
                  :headers="headers"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :auto-upload = 'false'
                  :on-success = 'handleSuccess'
                  :data="uploadform"
                  name="uploadCert">
              <el-button slot="trigger" size="small" type="primary" class="selectfile">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件<i class="el-icon-upload el-icon--right"></i></el-button>
              <div slot="tip" class="el-upload__tip">文件大小不超过1M,且必须为PEM文件</div>
            </el-upload>
          </el-upload>
        </div>
      </div>
    </el-dialog>

    <!-- 创建应用 -->
    <el-dialog title="创建应用" :visible.sync="dialogFormVisible" width="560px"  @close='closeForm' :close-on-click-modal="false">
      <div class="create">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="应用名称" prop="appName">
            <el-input v-model="form.appName"></el-input>
          </el-form-item>
          <el-form-item label="所属行业" prop="industryId">
            <el-select v-model="form.industryId" placeholder="请选择">
              <el-option
                v-for="item in industry"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联API包" prop="relativeApiType">
            <el-select v-model="form.relativeApiType" placeholder="请选择">
              <el-option
                v-for="item in apitype"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用能力" prop="appAbilityId">
            <el-select v-model="form.appAbilityId" placeholder="请选择">
              <el-option
                v-for="item in ability"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接入方式" prop="accessTypeId">
            <el-select v-model="form.accessTypeId" placeholder="请选择">
              <el-option
                v-for="item in access"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="appconfirm('ruleForm')">确 定</el-button>
        <el-button class="cancel" plain @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 创建成功 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="480px">
      <div class="success">
        <div style="width:50px;float:left;margin-left:10px;margin-right:10px;padding-top:10px"><i class="iconfont icon-duihaocheckmark17"></i></div>
        <div style="width:330px;float:left">
          <h5>应用创建成功</h5>
          <p>请妥善保管密钥信息。遗忘密钥可通过对接信息 > “重置密钥”进行重置。</p>
          <span>应用ID</span><br>
          <span class="con">{{createsuccess.appId}}</span><br>
          <span>应用密钥</span><br>
          <span class="con">{{createsuccess.appSecretKey}}</span>
        </div>
        <span slot="footer" class="dialog-footer" style="width:100%;text-align:center">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 重置密钥的警告 -->
    <el-dialog
      :visible.sync="resetkey"
      width="480px"
      top="30vh">
      <div class="success warning">
        <div style="width:50px;float:left;margin-left:10px;margin-right:10px;padding-top:10px">
          <i class="iconfont icon-21"></i></div>
        <div style="width:330px;float:left">
          <h5>警告</h5>
          <p>重置密钥后，之前的密钥将不能使用，你确实要对密钥进行重置?</p>
        </div>
        <span slot="footer" class="dialog-footer" style="width:100%;text-align:center">
          <el-button type="primary" @click="reset">确 定</el-button>
          <el-button class="del" @click="resetkey = false">取 消</el-button>
        </span>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Qs from 'qs'
export default {
  data() {
    return {
      checked: true,
      textareactive: true,
      // 编辑按钮的显示和隐藏
      mainedit: true,
      // 添加按钮的显示和隐藏
      mainadd: false,
      // 行业编辑按钮的显示和隐藏
      industryedit: true,
      // 行业添加按钮的显示和隐藏
      industryadd: false,

      //所属行业
      industry: [],
      //应用能力
      ability: [],
      //接入方式
      access:[],
      //关联api包
      apitype:[],

      certificate: false,

      fileList:[],
      dialogFormVisible: false,
      form: {
        appName: '',
        industryId: '',
        relativeApiType: '13',
        appAbilityId: '',
      },
      rules: {
        appName: [
          {
            required: true,
            message: '请输入应用名称',
            trigger: 'blur'
          },
          { pattern: /^\S+$/, message: '应用名称禁止包含空格' },
          { min: 0, max: 15, message: '长度不超过15个字符', trigger: 'blur' }
        ],
        industryId: [
          {
            required: true,
            message: '请选择所属行业',
            trigger: 'change'
          }
        ],
        relativeApiType: [
          {
            required: true,
            message: '请输入关联API包',
            trigger: 'blur'
          }
        ],
        appAbilityId: [
          {
            required: true,
            message: '请选择应用能力',
            trigger: 'change'
          }
        ],
        accessTypeId: [
          {
            required: true,
            message: '请选择接入方式',
            trigger: 'change'
          }
        ],
      },
      //当前应用列表
      application: [],

      dialogVisible: false,
      //创建成功参数
      createsuccess:{
        appId:'',
        appSecretKey:''
      },
      //当前的应用
      currentapplication:{
        appName:'当前无应用',
        uploadCert: '',
      },
      //当前应用详细信息
      applicationdetail:{
        appName: '',
        appId: '',
        createTime: '',
        appDesc: '',
        dictionaryIndustry: {value:''},
        dictionaryAppAbility: {value:''},
        saveHisDay: 7,
        uploadCert: true,
        industry:'',
        ability:'',
      },
      //主要信息描述
      decraption:'',
      resetkey: false,
      //行业信息未修改的值
      industryinform:{
        industry:'',
        ability:'',
        hisday:''
      },
      uploadform:{},
      userId:this.$store.getters.userId,
    }
  },
  created(){
    this.getinfo();
  },
  methods:{
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },
    // 主要信息的修改
    mainmodify(){
      this.mainedit=false;
      this.mainadd=true;
      this.textareactive=false;
      this.decraption=this.applicationdetail.appDesc;
    },
    // 主要信息的确认
    mainconfirm(){
      this.mainedit=true;
      this.mainadd=false;
      this.textareactive=true;

      this.$confirm('你是否要保存已修改信息？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.applicationdetail.accessTypeId=this.applicationdetail.dictionaryAccessType.id;
        this.applicationdetail.appAbilityId=this.applicationdetail.dictionaryAppAbility.id;
        this.applicationdetail.industryId=this.applicationdetail.dictionaryIndustry.id;
        this.applicationdetail.relativeApiType=this.applicationdetail.dictionaryApiType.id;
        this.$axios.put(process.env.API_HOST+'abutment/modifyApplicationInfo',
          JSON.stringify(this.applicationdetail),
          {headers:{'Content-Type': 'application/json'}})
          .then(res => {
            this.$message({
              showClose: true,
              message: res.data.returnMsg,
              type: 'success'
            });
          })
          .catch(error => {
            this.applicationdetail.appDesc=this.decraption;
          });
      }).catch(() => {
                
      });

      
    },
    // 主要信息的取消
    maincancel(){
      this.mainedit=true;
      this.mainadd=false;
      this.textareactive=true;
      this.applicationdetail.appDesc=this.decraption;
    },
    // 行业信息的修改
    industrymodify(){
      this.industryedit=false;
      this.industryadd=true;
      this.industryinform.industry=this.applicationdetail.dictionaryIndustry.value;
      this.industryinform.ability=this.applicationdetail.dictionaryAppAbility.value;
      this.industryinform.hisday=this.applicationdetail.saveHisDay;
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'INDUSTRY'}))
        .then(res => {
          this.industry=res.data.returnData[0]
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'APP_ABILITY'}))
        .then(res => {
          this.ability=res.data.returnData[0]
        })
        .catch(error => {
        });
    },
    // 行业信息的确认
    industryconfirm(){
      this.industryedit=true;
      this.industryadd=false;
      this.$confirm('你是否要保存已修改信息？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.applicationdetail.accessTypeId=this.applicationdetail.dictionaryAccessType.id;
        this.applicationdetail.appAbilityId=this.applicationdetail.dictionaryAppAbility.value;
        this.applicationdetail.industryId=this.applicationdetail.dictionaryIndustry.value;
        this.applicationdetail.relativeApiType=this.applicationdetail.dictionaryApiType.id;
        for(let i=0;i<this.industry.length;i++){
          if(this.applicationdetail.industryId==this.industry[i].value){
            this.applicationdetail.industryId=this.industry[i].id
          }
        }
        for(let i=0;i<this.ability.length;i++){
          if(this.applicationdetail.appAbilityId==this.ability[i].value){
            this.applicationdetail.appAbilityId=this.ability[i].id;
          }
        }
        this.$axios.put(process.env.API_HOST+'abutment/modifyApplicationInfo',
          JSON.stringify(this.applicationdetail),
          {headers:{'Content-Type': 'application/json'}})
          .then(res => {
            this.$message({
              showClose: true,
              message: res.data.returnMsg,
              type: 'success'
            });
          })
          .catch(error => {
            this.applicationdetail.dictionaryIndustry.value=this.industryinform.industry;
            this.applicationdetail.dictionaryAppAbility.value=this.industryinform.ability;
            this.applicationdetail.saveHisDay=this.industryinform.hisday;
          });
      }).catch(() => {
        this.applicationdetail.dictionaryIndustry.value=this.industryinform.industry;
        this.applicationdetail.dictionaryAppAbility.value=this.industryinform.ability;
        this.applicationdetail.saveHisDay=this.industryinform.hisday; 
      });
    },
    // 行业信息的取消
    industrycancel(){
      this.industryedit=true;
      this.industryadd=false;
      this.applicationdetail.dictionaryIndustry.value=this.industryinform.industry;
      this.applicationdetail.dictionaryAppAbility.value=this.industryinform.ability;
      this.applicationdetail.saveHisDay=this.industryinform.hisday;
    },
    // 更换推送证书
    change(){
      this.certificate=true;
    },

    // 上传表格的方法
    submitUpload() {
      this.$refs.upload.submit();
    },

    beforeAvatarUpload(file) {
      this.uploadform.userId=this.userId;
      this.uploadform.appId=this.applicationdetail.appId;
      let Xls = file.name.split('.');
      if(Xls[1] === 'pem'){
        return file
      }else {
        this.$message.error('上传文件只能是 pem 格式!')
        return false
      }
      
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleSuccess(res,file,fileList){
      if(res.returnCode=='success'){
        this.certificate=false;
        this.$message({
          message: '上传成功！',
          type: 'success'
        });
      }else {
        this.$message({
          message: '上传失败',
          type: 'error'
        });
      }

    },

    //获取所有应用
    getinfo(){
      this.$axios.get(process.env.API_HOST+'abutment/queryApplicationList?'+Qs.stringify({'userId':this.userId}))
        .then(res => {
          this.application=res.data.returnData;
          this.handleCommand(this.application[0].appId)
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    //删除应用
    delapplication(e){
      this.$confirm('删除应用会同步删除该应用的关联数据,确定删除吗?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let str=e.target.parentNode.firstElementChild.innerText;
        this.$axios.delete(process.env.API_HOST+'abutment/removeApplicationInfo?'+Qs.stringify({'appId':str}))
          .then(res => {
            if(res.data.returnCode=='success'){
              this.getinfo();
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
            }
          })
          .catch(error => {
          });
      }).catch(() => {
                
      });
    },
    //创建应用
    addapp(){
      this.dialogFormVisible=true;
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'INDUSTRY'}))
        .then(res => {
          this.industry=res.data.returnData[0]
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'APP_ABILITY'}))
        .then(res => {
          this.ability=res.data.returnData[0]
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'ACCESS'}))
        .then(res => {
          this.access=res.data.returnData[0]
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'API_TYPE'}))
        .then(res => {
          this.apitype=res.data.returnData[0]
        })
        .catch(error => {
        });
    },
    //增加应用的确定按钮
    appconfirm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.userId=this.userId;
          this.$axios.post(process.env.API_HOST+'abutment/addApplicationInfo',
            JSON.stringify(this.form),
            // 把请求头设置为json形式
            {headers:{'Content-Type': 'application/json'}}
          )
            .then(res => {
              if(res.data.returnCode=='success'){
                this.dialogFormVisible=false;
                this.dialogVisible=true;
                this.createsuccess=res.data.returnData[0];
                this.getinfo();
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.returnMsg,
                  type: 'error',
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
    //选择当前应用
    handleCommand(command) {
      if(command!=undefined){
        for(let i=0;i<this.application.length;i++){
          if(command==this.application[i].appId){
            this.currentapplication=this.application[i];
          }
        }
        this.$axios.get(process.env.API_HOST+'abutment/queryCurrentApplicationInfo?'+Qs.stringify({'userId':this.userId,'appId':command}))
          .then(res => {
            this.applicationdetail=res.data.returnData[0];
            this.applicationdetail.saveHisDay=7;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //重置密钥
    reset(){
      this.resetkey=false;
      this.$axios.put(process.env.API_HOST+'abutment/modifyAppSecretKey',
        Qs.stringify({
          'userId':this.userId,
          'appId':this.applicationdetail.appId
        }))
        .then(res => {
          this.dialogVisible=true;
          this.createsuccess.appSecretKey=res.data.returnData[0];
          this.createsuccess.appId=this.applicationdetail.appId;
        })
        .catch(error => {
        });
    },
    
  },
  computed: {
    headers(){
      return{
        'HEAD_AUTHORIZATION_CODE': this.$store.getters.token
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .information{
    height: 100%;
    // background-color: #f7f9fc;
  }
  .informnav{
    height: 46px;
    border-bottom: 1px solid #f2f2f2;
    line-height: 46px;
    padding-left: 50px;
    background-color: #fff;
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
  .informbody{
    padding: 24px;
    .usedetail{
      height: 36px;
      border-bottom: 1px #e6e6e6 solid;
      color: #6F7479;
      font-weight: 700;
      padding-left: 30px;
    }
    .informone{
      min-height: 250px;
      background-color: #f7f9fc;
      >div{
        width: 45%;
        padding-left: 30px;
        float: left;
      }
      .informheader{
        height: 40px;
        border-bottom: 1px solid #e6e6e6;
        line-height: 50px;
        font-weight: 700;
        color: black;
        font-size: 14px;
        i{
          margin-left: 5px;
          cursor: pointer;
        }
        i:hover{
          color: #2b78e0;
        }
      }
      .informleft{
        width: 50%;
        float: left;
        p{
          font-weight: 500;
          color: black;
          font-size: 14px;
          margin-top: 10px;
          margin-bottom: 30px;
          >b{
            color: #2b78e0;
          }
        }
        span{
          font-size: 12px;
          font-weight: 700;
          color: #8a8a8a;
          margin-top: 10px;
          display: block;
        }
        textarea{
          margin-top: 100px;
          color: #000;
        }
        
        a{
          color: black;
        }
        a:hover{
          color: #2b78e0;
        }
        .el-select{
          width: 80%;
          height: 30px;
          margin-top: 13px;
          margin-bottom: 20px;
        }
        .number{
          margin-top: 13px;
          input{
            width: 160px;
            height: 25px;
            border: 1px solid #dcdfe6;
            border-radius: 3px;
            padding-left: 15px;
            outline: none;
          }
        }
      }
    }
    .informtwo{
      background-color: #fff;
      margin-top: 30px;
    }
  }
  .uploadcertificate{
    //height: 450px;
    p{
      font-size: 12px;
      color: #8a8a8a;
    }
    .el-button{
      background-color: #2b78e0;
      color: #fff;
      border-color: #2b78e0;
    }
  }
  .current{
    cursor: pointer;
    display: inline-block;
    margin-left: 50px;
    .el-dropdown{
      span{
        font-weight: normal;
      }
    }
  }
  .el-dropdown-menu{
    // width: 300px;
    // left: 400px!important;
    min-width: 300px;
    .el-dropdown-menu__item{
      font-size: 12px;
    }
    span{
      color: red;
      margin-left: 5px;
      
    }
    .del{
      margin-left: 80px;
      float: right;
    }
  }
  .create{
    width: 90%;
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
  .el-dropdown{
    width: 240px;
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
  .xlsfile{
    height: 200px;
  }


</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
  .informleft textarea{
    max-height: 82px;
  }
  .uploadcertificate{
    padding: 0 30px!important;
  }
  .informleft{
    .el-select .el-input__inner{
      height: 35px;
      font-size: 14px;
    }
    .el-input__inner{
      height: 35px;
      color: #000;
    }
    .el-input-number{
      line-height: 35px;
    }
    .el-input-number.is-controls-right .el-input-number__decrease, .el-input-number.is-controls-right .el-input-number__increase{
      line-height: 17px;
    }
  }
  .el-dropdown-menu__item--divided{
    border-top: 0;
    border-bottom: 1px solid #ebeef5;
    margin-top:0;
  }
  .el-message-box__content{
    i{
      color: #e64545;
      font-size: 40px;
      vertical-align: middle;
      margin-right: 20px;
    }
  }
  .el-message--error{
    color: #e64545;
  }
  .el-message--error .el-message__content,.el-message .el-icon-error{
    color: #e64545;
  }
  .el-icon--right{
    float: right!important;
  }
  .informleft{
    .el-textarea.is-disabled .el-textarea__inner,.el-textarea__inner{
      color: #000;
    }
  }
  .el-checkbox__input.is-disabled+span.el-checkbox__label{
    color: black;
  }
  .el-dropdown>span{
    display: inline-block;
    width: 240px;
  }
  .current .el-icon--right{
    padding-top: 3px;
  }
</style>
