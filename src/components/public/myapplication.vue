<template>
  <div>
    <div class="current">
      <span style="color:black">当前应用：</span>
      <el-dropdown trigger="click" placement="bottom" @command="handleCommand">
        <span class="el-dropdown-link">
          {{currentapplication.appName}}
          <span v-if="currentapplication.uploadCert==false" style="color:red">[尚无推送证书]</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="addapp" divided>创建应用</el-dropdown-item>
          <el-dropdown-item v-for="item in application" :key="item.appName" :command=item.appId>
            <span style="display:none">{{item.appId}}</span>
            {{item.appName}}<span v-if="item.uploadCert==false">[尚无推送证书]</span>
            <span class="del" @click="delapplication($event)">删除</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 创建应用 -->
    <el-dialog title="创建应用" :visible.sync="dialogFormVisible" width="560px"  @close='closeForm' :close-on-click-modal="false">
      <div class="create">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="应用名称" prop="appName">
            <el-input v-model="form.appName"></el-input>
          </el-form-item>
          <el-form-item label="所属行业" prop="industryId">
            <el-select v-model="form.industryId" clearable placeholder="请选择">
              <el-option
                v-for="item in industry"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联API包" prop="relativeApiType">
            <el-select v-model="form.relativeApiType" disabled placeholder="请选择">
              <el-option
                v-for="item in apitype"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用能力" prop="appAbilityId">
            <el-select v-model="form.appAbilityId" clearable placeholder="请选择">
              <el-option
                v-for="item in ability"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接入方式" prop="accessTypeId">
            <el-select v-model="form.accessTypeId" clearable placeholder="请选择">
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
  </div>
  
  
</template>

<script>
import Qs from 'qs'
export default {
  data(){
    return{
      //当前应用列表
      application: [],
      //当前的应用
      currentapplication:{
        appName:'当前无应用',
        uploadCert: '',
      },
      form: {
        appName: '',
        industryId: '',
        relativeApiType: 7,
        appAbilityId: '',
      },
      dialogFormVisible: false,
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
      //所属行业
      industry: [],
      //应用能力
      ability: [],
      //接入方式
      access:[],
      //关联api包
      apitype:[],
      userId:this.$store.getters.userId,
    }
  },
  created(){
    this.getinfo();
  },
  methods:{
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
          this.industry=res.data.returnData
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'APP_ABILITY'}))
        .then(res => {
          this.ability=res.data.returnData
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'ACCESS'}))
        .then(res => {
          this.access=res.data.returnData
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'API_TYPE'}))
        .then(res => {
          this.apitype=res.data.returnData
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
            this.$emit('ievent',this.application[i].appId+','+this.application[i].appName);
          }
        }
        this.$axios.get(process.env.API_HOST+'abutment/queryCurrentApplicationInfo?'+Qs.stringify({'userId':this.userId,'appId':command}))
          .then(res => {
            this.applicationdetail=res.data.returnData[0];
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .current{
    cursor: pointer;
    display: inline-block;
    margin-bottom: 20px;
    .el-dropdown{
      span{
        font-weight: normal;
      }
    }
  }
  .el-dropdown-menu{
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
    font-size: 12px;
    font-weight: normal;
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
    width: 300px;
    >span{
      width: 90%;
      display: inline-block;
    }
  }
</style>
<style lang="scss">
  .el-icon--right{
    float: right!important;
  }
  // .el-dropdown{
  //   >span{
  //     width: 90%;
  //     display: inline-block;
  //   }
  // }
</style>




