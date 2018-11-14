<template>
  <div class="login">
    <div class="leftlogin">
      <!-- <h1><span>DCG</span>开发者平台</h1> -->
    </div>
    <div class="rightlogin">
        <el-main>
            <el-form
                :model="LoginForm"
                ref="LoginForm"
                label-width="80px"
                class="login-form"
                :label-position="labelPosition">
                
                <div class="user">

                    <el-form-item prop="username" label="用户名">
                        <el-input
                        type="text"
                        v-model="LoginForm.username"
                        class="username">
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password" label="密码">
                        <el-input
                        @keyup.native.enter="login"
                        type="password"
                        v-model="LoginForm.password"
                        class="password">
                        </el-input>
                    </el-form-item>
                    <el-form-item style="text-align:center">
                        <!-- <el-button
                        class="submitBtn"
                        :loading="logining"
                        @click="login">
                        <i class="iconfont icon-jiantouyou"></i>
                        </el-button> -->
                        <div class="loginbtn">
                          <img src="../../assets/img/button.png" alt="" height="64px" @click="login">
                        </div>
                    </el-form-item>
                </div>

            </el-form>
        </el-main>
    </div>
    
  </div>
</template>

<script>
import Qs from 'qs'
export default {
  data () {
    return {
      labelPosition: 'top',
      LoginForm: {
        username: '',
        password: ''
      },
      logining: false,
      checked: false,
      btnpermission:[],
      menuList:[],
      permissionList:[],
    }
  },
  // 监听获得权限之后再进行跳转
  watch: {
    btnpermission(newValue, oldValue) {
      if(newValue!=oldValue){
        this.$router.push('/main/start')
      }
    }
  },
  methods: {
    login(){
      if(this.LoginForm.username==''||this.LoginForm.password==''){
        this.$confirm('请输入用户名或密码', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
        }).catch(() => {         
        });
      }else{
        this.$axios.post(process.env.API_HOST+'login/loginOption',
          Qs.stringify({
            'userName':this.LoginForm.username,
            'password':this.LoginForm.password}))
          .then( res => {
            if(res.data.returnCode=='success'){
              this.$store.commit('SAVE_NAME',res.data.returnData[0].nickName);
              this.$store.commit('SAVE_ID',res.data.returnData[0].id);
              // this.$store.commit('SAVE_ID','S123456');
              this.$store.commit('LOGIN',res.data.returnData[1].token);
              // 查询该用户的权限
              this.$axios.get(process.env.API_HOST+'login/findPermission?'
              +Qs.stringify({
              }))
                .then(res => {
                  this.menuList=[];this.permissionList=[];
                  for(let i=0;i<res.data.returnData.length;i++){
                    if(res.data.returnData[i].requiredPermission==1){
                      this.menuList.push(res.data.returnData[i].menuCode)
                    }else{
                      this.permissionList.push(res.data.returnData[i].permissionCode)
                    }
                  }
                  let obj={};
                  obj.menuList=this.menuList;
                  obj.permissionList=this.permissionList;
                  this.$store.commit('SAVE',obj);
                  this.$store.commit('SET_USER',obj.permissionList);
                  this.btnpermission=this.$store.getters.permissions;
                })
                .catch(error => {
                });
            }else{
              this.$confirm('用户名或密码错误，请重试', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
              }).catch(() => {         
              });
            }
            
          })
          .catch( error => {
          });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login{
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    background-image: url(../../assets/img/login_bg.jpg);
    background-size: cover;
    // .leftlogin{
    //     width: 62%;
    //     height: 100%;
    //     background-color: #000;
    //     float: left;
    //     background-image: url(../../assets/img/login_bg.jpg);
    //     background-size: cover;
    //     color: #fff;
    //     h1{
    //       font-weight: 400;
    //       font-size: 32px;
    //       margin-top: 160px;
    //       margin-left: 200px;
    //       span{
    //         font-size: 46px;
    //         margin-right: 20px;
    //         font-weight: 400;
    //       }
    //     }
    // }
    .rightlogin{
        float: right;
        width: 36%;
        height: 100%;
        // background-color: #202d44;
        background-color: #fff;
        color: #636c7c;
        
        .user{
            width: 60%;
            margin: 36% auto;
            font-size: 18px;
            .el-button{
              background-color: #636c7c;
              border-radius: 50%;
              width: 48px;
              height: 48px;
              border-color: #636c7c;
              padding-left: 16px;
              margin-top: 40px;
              i{
                color: #202d44;
              }
            }
            .el-button:hover{
              background-color: #fff;
            }
        }
    }
    .loginbtn img{
      cursor: pointer;
      margin-top: 25px;
    }
  }

  

</style>

<style lang="scss">
  .login{
    .user{
      input{
        background-color: #fff;
        border-color: #d3d3d3;
        color: #1b426b;
        border-radius: 0px;
      }
      input:focus{ 
        background-color: #edf5ff;
        border-color: #a1cbff;
      }
      
    }
    .el-form--label-top .el-form-item__label{
        padding: 0px;
        color: #636c7c;
        margin-bottom: 10px;
        font-size: 16px;
      }
  }
  .el-message-box{
    width: 480px;
    .el-message-box__header{
      padding: 23px 33px 10px;
    }
    .el-message-box__content{
      text-align: center;
    }
    .el-message-box__btns{
      padding: 22px 113px 0;
      .el-button{
        float: right;
        margin-right: 15px;
        border: 1px #d9d9d9 solid;
        background-color: #fff;
        color: #333;
        padding: 11px 40px;
      }
      .el-button:hover{
        color: #2b78e0;
        border-color: #2b78e0;
      }
      .el-button--primary{
        border-color: #2b78e0;
        background-color: #2b78e0;
        color: #fff;
      }
      .el-button--primary:hover{
        color: #fff;
      }
    }
  }
  .el-form-item__label{
    font-size: 12px;
  }
  .el-loading-spinner i{
    font-size: 30px;
  }
  .el-loading-spinner .el-loading-text{
    font-size: 16px;
  }
</style>