<template>
  <div class="dcgbody">
    <div class="header">
      <div class="logo">
        <img src="../assets/img/logo01-01.png" alt="" height="30px">
      </div>
      <!-- <div class="current">
        <span>当前应用：</span>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            SmokeAlarmNBIoT<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dialogFormVisible = true">创建应用</el-dropdown-item>
            <el-dropdown-item divided>SmokeAlarmNBIoT</el-dropdown-item>
            <el-dropdown-item>SmokeAlarmNB</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
      <div class="icon">
        <span><i class="iconfont icon-xiaoxi"></i></span>
        <span><i class="iconfont icon-yonghu" @click="show3 = !show3"></i></span>
        <el-collapse-transition>
          <el-card shadow="always" class="dropmenu" v-show="show3">
            <div style="height:200px">
              <p>用户名</p>
              <p>{{username}}</p>
              <span @click="logout">退出登录</span>
            </div>
          </el-card>
        </el-collapse-transition>
        <!-- <span><i class="iconfont icon-sort"></i></span> -->
      </div>
    </div>

    <div class="aside">
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#1F232C"
        text-color="#aaaeb2"
        active-text-color="#2b78e0"
        :unique-opened="true"
        router>
        <el-menu-item index="/main/start" class="fromstart">
          <i class="iconfont icon-jiantouyou"></i>
          <span slot="title">从这里开始</span>
        </el-menu-item>
        <el-menu-item index="/main/information" v-if="hasRouter('abutment')">
          <i class="iconfont icon-icon-link"></i>
          <span slot="title">对接信息</span>
        </el-menu-item>
        <el-menu-item index="/main/equipment" v-if="hasRouter('device')">
          <i class="iconfont icon-shebeixinxi"></i>
          <span slot="title">我的设备</span>
        </el-menu-item>
        <el-submenu index="/main/profile" v-if="hasRouter('profile:online')">
          <template slot="title">
            <i class="iconfont icon-sort"></i>
            <span>Profile开发</span>
          </template>
          <el-menu-item index="/main/profile/online">Profile在线开发</el-menu-item>
          <!-- <el-menu-item index="/main/profile/import">Profile导入</el-menu-item> -->
        </el-submenu>
        <el-submenu index="/main/plug" v-if="hasRouter('plugin:info')">
          <template slot="title">
            <i class="iconfont icon-fenpeishebei"></i>
            <span>插件开发</span>
          </template>
          <el-menu-item index="/main/plug/development">插件开发</el-menu-item>
        </el-submenu>
        <!-- <el-submenu index="/main/plugmanger">
          <template slot="title">
            <i class="iconfont icon-guanli"></i>
            <span>插件管理</span>
          </template>
          <el-menu-item index="/main/plugmanger/management">插件管理</el-menu-item>
        </el-submenu> -->
        <el-submenu index="/main/simulator" v-if="hasRouter('simulate')">
          <template slot="title">
            <i class="iconfont icon-moniqi"></i>
            <span>模拟器</span>
          </template>
          <!-- <el-menu-item index="/main/simulator/NBsimulator">NB设备模拟器</el-menu-item>
          <el-menu-item index="/main/simulator/FNBsimulator">非NB设备模拟器</el-menu-item> -->
          <el-menu-item index="/main/simulator/simulator">设备模拟器</el-menu-item>
        </el-submenu>
        <el-submenu index="/main/user" v-if="hasRouter('user')||hasRouter('role')">
          <template slot="title">
            <i class="iconfont icon-quanxianguanli"></i>
            <span>用户设置</span>
          </template>
          <el-menu-item index="/main/user/adduser" v-if="hasRouter('user')">用户管理</el-menu-item>
          <el-menu-item index="/main/user/role" v-if="hasRouter('role')">角色管理</el-menu-item>
          <!-- <el-menu-item index="/main/user/permission">权限管理</el-menu-item> -->
        </el-submenu>
        <el-menu-item index="/main/subscribe" v-if="hasRouter('subscription')">
          <i class="iconfont icon-mn_dingyue"></i>
          <span slot="title">应用订阅</span>
        </el-menu-item>
        
        <!-- <el-menu-item index="/main/autograph">
          <i class="iconfont icon-dianziqianmingyuedingshu201"></i>
          <span slot="title">插件签名</span>
        </el-menu-item> -->

      </el-menu>
    </div>

    <div class="rightbody">
      <div class="rightcon">
        <router-view/>
      </div>
    </div>

    <!-- 创建应用 -->
    <!-- <el-dialog title="创建应用" :visible.sync="dialogFormVisible" width="40%"  @close='closeForm' :close-on-click-modal="false">
      <div class="create">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="应用名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="所属行业">
            <el-select v-model="value4" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联API包">
            <el-input v-model="form.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="应用能力">
            <el-select v-model="value4" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button class="cancel" plain @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: false,
      show3: false,
      username: this.$store.getters.nickname,
    }
  },
  methods: {
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    logout(){
      this.$store.commit('LOGOUT')
      this.$router.push({ path: '/' });
      location.reload(true)
    },
    // 匹配路由
    hasRouter(permission){
      let myPermissions = this.$store.getters.addRouters[0];
      var permissionarr=[];
      for(let i=0;i<myPermissions.children.length;i++){
        permissionarr.push(myPermissions.children[i].menu)
      }
      return permissionarr.indexOf(permission) > -1;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .dcgbody{
    width: 100%;
    height: 100%;
    position: absolute;
    .header{
      width:100%;
      height:60px;
      position:fixed;
      z-index: 10;
      top:0;
      left:0;
      right:0;
      background-color:#2b78e0;
      color:#fff;
      line-height: 60px;
      .logo{
        padding-left: 38px;
        width: 190px;
        // height: 50px;
        float: left;
        vertical-align: middle;
        padding-top: 11px;
      }
      .current{
        float: left;
        .el-dropdown{
          width: 220px;
          cursor: pointer;
          color: #fff;
          padding-left: 40px;
          i{
            float: right;
            line-height: 60px;
          }
          .el-dropdown-menu{
            left: 331px;
            font-size: 12px;
          }
        }
      }
      .icon{
        float: right;
        margin-right: 10px;
        height: 60px;
        span{
          margin-right: 15px;
          .iconfont{
            font-size: 25px;
            cursor: pointer;
          }
        }
      }
    }
    .aside{
      background-color: #1F232C;
      width:240px;
      position:absolute;
      top:60px;
      left:0;
      bottom:0;
      .fromstart{
        height: 70px;
        color: #dee7f3;
        font-weight: 600;
        line-height: 70px;
        font-size: 16px;
        border-bottom: 1px #40444d solid;
      }
      .el-menu{
        border-right:0px;
        i{
          font-size: 18px;
        }
        span{
          margin-left: 10px;
        }
      }
    }
    .rightbody{
      width:100%;
      height:100%;
      padding:60px 0 0 240px;
      box-sizing:border-box;
      .rightcon{
        height:100%;
        overflow:auto;
      }
    }
  }

  .el-dropdown-menu{
    width: 250px;
    .el-dropdown-menu__item{
      font-size: 12px;
    }
  }
  .create{
    width: 90%;
  }
  .dropmenu{
    width: 160px;
    height: 200px;
    background-color: #fff;
    position: absolute;
    top: 60px;
    right: 0;
  }
  .el-card__body{
    p,span{
      line-height: 30px;
      padding-left: 20px;
      color: #000;
      font-weight: 600;
    }
    span{
      cursor: pointer;
      color: #2b78e0;
      font-weight: normal;
      display: inline-block;
      margin-top: 30px;
    }
  }
</style>

<style lang="scss">
  .el-menu-item,.el-submenu__title{
    letter-spacing: 1px;
    padding-left: 40px !important;
  }
  .el-menu--inline{
    .el-menu-item{
      padding-left: 70px !important;
    }
  }
  .el-table th{
    background-color: #f0f2f5;
    font-size: 12px;
    font-weight: 400;
  }
  .el-table td, .el-table th.is-leaf{
    border-bottom: 1px solid #ddd;
    font-size: 12px;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    background-color: #ddd;
  }
  .el-form-item__label{
    font-size: 12px;
  }
  .dialog-footer{
    text-align: center;
  }
  .el-select{
    width: 100%;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
    background-color: #f7f9fc;
    color: #2b78e0;
  }
  .el-step__head.is-success{
    color: #2b78e0;
    border-color: #2b78e0;
  }
  .el-step__title.is-success{
    color: #2b78e0;
  }
  .dialog-footer{
    margin-top: 40px;
    margin-bottom: 10px;
    .confirm{
      background-color: #2b78e0;
      font-size: 12px;
      padding: 10px 30px;
    }
    .cancel{
      font-size: 12px;
      padding: 10px 30px;
    }
    .cancel:hover{
      border-color: #2b78e0;
      color: #2b78e0;
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
  .el-input.is-disabled .el-input__inner{
    color: #606266;
  }
  .el-select-dropdown__item.selected{
    color: #2b78e0;
  }
  .el-message-box{
    padding-bottom: 23px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #2b78e0;
  }
  .el-dropdown-menu{
    height: 200px;
    overflow: auto;
  }
  .el-loading-spinner i{
    font-size: 30px;
  }
  .el-loading-spinner .el-loading-text{
    font-size: 16px;
  }
  .el-submenu.is-active .el-submenu__title{
    color: #fff!important;
    i{
      color: #fff!important;
    }
    // background-color: #2b78e0!important;
  }
</style>
