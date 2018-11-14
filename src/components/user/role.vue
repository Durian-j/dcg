<template lang="html">
  <div class="adduser">
    <div class="addusernav">
      <span>角色管理</span>
    </div>

    <div class="tablebody">
      <div class="searchbox">
        <el-button type="primary" @click="adduser" v-if="hasPermission('role:addRole')">新增角色</el-button>
      </div>
      <div class="equiptable" v-if="hasPermission('role:listRole')">
        <el-table
          :data="tableData"
          :height="450"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="角色编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
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
              <i class="iconfont icon-tubiao09" title="编辑" @click="editrole(scope.row)" v-if="hasPermission('role:updateRole')" v-show="(scope.row.roleName)!='管理员'"></i>
              <i class="iconfont icon-shanchu" title="删除" @click="delrole(scope.row)" v-if="hasPermission('role:deleteRole')"></i>
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
    <el-dialog title="详细信息" :visible.sync="dialogFormVisible" width="620px"  @close='closeForm' :close-on-click-modal="false">
        <div class="formtab">
           <!-- 消防泵参数配置 -->
           <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign" ref="ruleForm" :rules="rules">
             <el-form-item label="角色名" prop="roleName">
               <el-input v-model="formLabelAlign.roleName"></el-input>
             </el-form-item>
            <!-- <el-form-item label="角色标识" prop="perms">
              <el-input v-model="formLabelAlign.perms"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formLabelAlign.remark"></el-input>
            </el-form-item> -->

            <el-form-item label="角色授权">
              <el-tree
                :data="roleperm"
                show-checkbox
                node-key="id"
                ref="tree"
                default-expand-all>
              </el-tree>
            </el-form-item>
          </el-form>

        </div>

       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="confirm('ruleForm')">确 定</el-button>
         <el-button @click="dialogFormVisible = false" class="cancel">取 消</el-button>
       </div>
     </el-dialog>
    </div>


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
        roleName: '',
      },
      flag:true,

      // 弹出框必填项
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          }
        ],
      },
      roleperm: [],
      id:'',
      returnedItem:''
    }
  },
  created(){
    this.getrolelist();
    this.findpermission();
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
      this.getrolelist();
    },
    handleCurrentChange(val){
      this.currentPage=val;
      this.getrolelist();
    },
    // 新增用户
    adduser(){
      this.dialogFormVisible=true;
      this.flag=true;
      this.$refs.tree.setCheckedKeys([]);
    },
    // 清空列表信息
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    // 查询角色列表
    getrolelist(){
      this.$axios.get(process.env.API_HOST+'role/listRole?'
        +Qs.stringify({
          'pageSize':this.pagesize,
          'pageNum':this.currentPage,
        }))
        .then(res => {
          this.totalnum=res.data.returnData[0].totalNum;
          this.tableData=res.data.returnData[0].itemList;
        })
        .catch(error => {
        });
    },
    // 增加角色
    confirm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let array=[];
          let arr=this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys());
          for(let i=0;i<arr.length;i++){
            let obj={};
            obj.id=arr[i];
            array.push(obj);
          }
          let object={};
          object.roleName=this.formLabelAlign.roleName;
          object.permissions=array;
          if(this.flag==true){
            // 增加角色
            let a=this.$refs.tree.getHalfCheckedNodes().concat(this.$refs.tree.getCheckedNodes());
            for(let i=0;i<a.length;i++){
              delete a[i].children;
            }
            object.permissions=a;
            this.$axios.post(process.env.API_HOST+'role/addRole',
              JSON.stringify(object),
              {headers:{'Content-Type': 'application/json'}})
              .then(res => {
                this.dialogFormVisible=false;
                this.getrolelist();
              })
              .catch(error => {
              });
          }else{
            // 编辑角色
            let a=this.$refs.tree.getHalfCheckedNodes().concat(this.$refs.tree.getCheckedNodes());
            for(let i=0;i<a.length;i++){
              delete a[i].children;
            }
            object.permissions=a;
            
            this.formLabelAlign.id=this.id;
            this.formLabelAlign.permissions=a;
            // 发送编辑请求
            this.$axios.put(process.env.API_HOST+'role/updateRole',
              JSON.stringify(this.formLabelAlign),
              {headers:{'Content-Type': 'application/json'}})
              .then(res => {
                this.dialogFormVisible=false;
                this.getrolelist();
              })
              .catch(error => {
              });
          }
        } else {
          return false;
        }
      });
    },
    // 查询所有权限接口
    findpermission(){
      this.$axios.get(process.env.API_HOST+'user/findAllPermission')
        .then(res => {
          this.roleperm=res.data.returnData;
        })
        .catch(error => {
        });
    },
    // 编辑用户
    editrole(row){
      this.flag=false;
      this.dialogFormVisible=true;
      this.id=row.id;
      this.$axios.get(process.env.API_HOST+'role/roleDetail?'
        +Qs.stringify({
          'id':this.id,
        }))
        .then(res => {
          
          let arr=res.data.returnData[0].permissions;
          console.log(arr);
          let array=[];
          for(let i=0;i<arr.length;i++){
            if(arr[i].requiredPermission==2){
              array.push(arr[i].id)
            }
          }
          // let array=[];
          // for(let i=0;i<arr.length;i++){
          //   if(arr[i].children){
          //     for(let j=0;j<arr[i].children.length;j++){
          //       array.push(arr[i].children[j].id);
          //     }
          //   }
          // }
          this.formLabelAlign=res.data.returnData[0];
          this.$refs.tree.setCheckedKeys(array);
        })
        .catch(error => {
        });
    },
    // 删除用户
    delrole(row){
      this.$confirm('是否删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.delete(process.env.API_HOST+'role/deleteRole?'
        +Qs.stringify({
          'id':row.id,
        }))
          .then(res => {
            this.getrolelist();
          })
          .catch(error => {
          });
      }).catch(() => {         
      });
    },
    // find(arr, id){
    //   arr.forEach((item) => { 
    //     if(item.id==id)
    //     {        
    //       this.returnedItem = item;
    //       console.log(this.returnedItem);
    //       return item;
    //     }
    //     else if(item.children!=null)
    //     {
    //       find(item.children, id);                        
    //     }                   
    //   })
    // },
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
  .el-tree{
    margin-top: 8px;
  }

  .el-tree-node__label:before {
    display: inline-block;
    content: url(../../assets/img/file.png);
    margin-right: 5px;
    vertical-align: top;
    padding-top: 10px;
    line-height: 20px;

  }

  .el-tree-node__children .el-tree-node__label:before{
    display: inline-block;
    content: url(../../assets/img/doc.png);
  }
</style>

