<template lang="html">
  <div class="adduser">
    <div class="addusernav">
      <span>用户管理</span>
    </div>

    <div class="tablebody">
      <div class="searchbox">
        <el-button type="primary" @click="adduser" v-if="hasPermission('user:addUser')">新增用户</el-button>
      </div>
      <div class="equiptable" v-if="hasPermission('user:findUser')">
        <el-table
          :data="tableData"
          :height="450"
          style="width: 100%">
          <el-table-column
            prop="userName"
            label="用户名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="昵称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="roles[0].roleName"
            label="所属角色"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作按钮"
            align="center">
            <template slot-scope="scope">
              <i class="iconfont icon-tubiao09" title="编辑" @click="edituser(scope.row)" v-if="hasPermission('user:modifyUser')"></i>
              <i class="iconfont icon-shanchu" title="删除" @click="deluser(scope.row)" v-if="hasPermission('user:removeUser')"></i>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页器 -->
        <div class="pagin">
          <el-pagination
            background
            :current-page.sync="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="this.pagesize"
            :page-sizes="[10, 20, 30]"
            layout="total, sizes, prev, pager, next ,jumper"
            :total="this.totalnum">
          </el-pagination>
        </div>

      </div>
      
    </div>

    <!-- 用户信息 -->
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible" width="560px"  @close='closeForm' :close-on-click-modal="false">
      <div class="formtab">
          <!-- 消防泵参数配置 -->
          <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" ref="ruleForm" :rules="rules">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="formLabelAlign.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passWord" v-if="this.flag">
              <el-input v-model="formLabelAlign.passWord"></el-input>
            </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="formLabelAlign.nickName"></el-input>
          </el-form-item>
          <el-form-item label="角色类型" prop="role">
            <el-select v-model="formLabelAlign.role" placeholder="请选择">
              <el-option
                v-for="item in roletype"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmadd('ruleForm')">确 定</el-button>
        <el-button @click="dialogFormVisible = false" class="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import Qs from 'qs'
export default {
  data(){
    return{
      tableData:[],
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      dialogFormVisible: false,

      labelPosition: 'right',

      formLabelAlign: {
        userName: '',
        passWord: '',
        nickName: '',
        role: '',
      },
      flag:true,
      roletype:[],
      // 弹出框必填项
      rules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          { pattern: /^\S+$/, message: '用户名禁止包含空格' },
        ],
        passWord: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          },
          { pattern: /^\S+$/, message: '昵称禁止包含空格' },
        ],
        nickName: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          { pattern: /^\S+$/, message: '密码禁止包含空格' },
        ],
        role: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ]
      },
      addflag: true,
      userName:'',
    }
  },
  created(){
    this.getuserlist();
    this.getrolelist();
  },
  methods: {
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },
    handleSizeChange(val){
      this.pagesize=val;
      this.currentPage=1;
      this.getuserlist();
    },
    handleCurrentChange(val){
      this.currentPage=val;
      this.getuserlist();
    },
    // 新增用户
    adduser(){
      this.dialogFormVisible=true;
      this.addflag=true;
    },
    // 清空列表信息
    closeForm () {
      this.$refs.ruleForm.resetFields(); 
    },
    // 获取用户列表
    getuserlist(){
      this.$axios.get(process.env.API_HOST+'user/findUser?'
      +Qs.stringify({'pageSize':this.pagesize,'pageNum':this.currentPage}))
        .then(res => {
          this.totalnum=res.data.returnData[0].totalNum
          this.tableData=res.data.returnData[0].itemList;
        })
        .catch(error => {
        });
    },
    // 获取角色列表
    getrolelist(){
      this.$axios.get(process.env.API_HOST+'role/listRole?'
      +Qs.stringify({'pageSize':this.pagesize,'pageNum':this.currentPage}))
        .then(res => {
          this.roletype=res.data.returnData[0].itemList;
        })
        .catch(error => {
        });
    },
    // 确定增加用户信息
    confirmadd(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var arr=[];
          var obj={};obj.id=this.formLabelAlign.role;
          arr.push(obj)
          this.formLabelAlign.roles=arr;
          // delete this.formLabelAlign.role
          if(this.addflag==true){
            // 增加用户
            this.$axios.post(process.env.API_HOST+'user/addUser',
              JSON.stringify(this.formLabelAlign),
              {headers:{'Content-Type': 'application/json'}})
              .then(res => {
                if(res.data.returnCode=='success'){
                  this.dialogFormVisible=false;
                  this.getuserlist();
                }else{
                  this.$confirm(res.data.returnMsg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                  }).then(() => {
                  }).catch(() => {
                  });
                }
              })
              .catch(error => {
              });
          }else{
            // 编辑用户
            this.formLabelAlign.userName=this.userName;
            this.$axios.put(process.env.API_HOST+'user/modifyUser',
              JSON.stringify(this.formLabelAlign),
              {headers:{'Content-Type': 'application/json'}})
              .then(res => {
                if(res.data.returnCode=='success'){
                  this.dialogFormVisible=false;
                  this.getuserlist();
                }
              })
              .catch(error => {
              });
          }
          
        } else {
          return false;
        }
      });
    },
    edituser(row){
      this.addflag=false;
      this.dialogFormVisible=true;
      this.userName=row.userName;
      this.$axios.get(process.env.API_HOST+'user/findUserDetail?'
      +Qs.stringify({'userName':row.userName}))
        .then(res => {
          for ( let j in res.data.returnData[0]) {
            this.formLabelAlign[j] = res.data.returnData[0][j];
          }
          this.formLabelAlign.role=res.data.returnData[0].roles[0].id;
        })
        .catch(error => {
        });
    },
    deluser(row){
      this.$confirm('是否删除该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.delete(process.env.API_HOST+'user/removeUser?'
      +Qs.stringify({'id':row.id}))
          .then(res => {
            this.getuserlist();
          })
          .catch(error => {
          });
      }).catch(() => {
        
      });
    },
  },
}
</script>

<style lang="scss" scoped>
  .addusernav{
     height: 46px;
     border-bottom: 1px solid #f2f2f2;
     line-height: 46px;
     padding-left: 50px;
     span{
       font-size: 14px;
       font-weight: 700;
       color: #000;
     }
   }
   .tablebody{
      padding: 24px;
      .searchbox{
        button{
          float: right;
          margin-right: 12px;
          font-size: 12px;
        }
      }
      .equiptable{
        margin-top: 40px;
        padding: 10px;
        position: relative;
        i{
          margin-left: 10px;
          margin-right: 10px;
          cursor: pointer;
        }
        i:hover{
          color: #2b78e0;
        }
        .pagin{
          margin-top: 30px;
          float: right;
        }
      }

    }
    .formtab{
      width: 92%;
      height: 300px;
      padding: 0 40px 0 0;
      overflow: auto;
      .el-cascader{
        width: 341px;
      }
    }
    .el-dialog__footer{
      button{
        font-size: 12px;
        padding: 12px 30px;
      }
      .cancel:hover{
        background-color: #fff;
      }
    }
</style>

<style lang="scss">
  .searchbox{
    .el-input__inner{
      height: 32px;
      width: 280px;
      border-radius: 16px;
      line-height: 32px;
    }
    .el-input__icon{
      line-height: 32px;
    }
  }
  .adduser{
    .el-dialog__body{
      padding-bottom: 0px;
    }
    .el-dialog__footer{
      padding-top: 0px;
    }
  }
</style>

