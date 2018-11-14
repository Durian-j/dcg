<template lang="html">
  <div class="adduser">
    <div class="addusernav">
      <span>权限设置</span>
    </div>

    <div class="tablebody">
      <div class="searchbox">
        <el-button type="primary" @click="adduser">新增权限</el-button>
      </div>
      <div class="equiptable">
        <el-table
          :data="tableData"
          :height="450"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="角色名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="perms"
            label="角色标识"
            align="center">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作按钮"
            align="center">
            <template slot-scope="scope">
              <i class="iconfont icon-tubiao09" title="编辑"></i>
              <i class="iconfont icon-shanchu" title="删除"></i>
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
             <el-form-item label="角色名" prop="name">
               <el-input v-model="formLabelAlign.name"></el-input>
             </el-form-item>
            <el-form-item label="角色标识" prop="perms">
              <el-input v-model="formLabelAlign.perms"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formLabelAlign.remark"></el-input>
            </el-form-item>

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
         <el-button type="primary">确 定</el-button>
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
      tableData:[{
        username:123
      }],
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      dialogFormVisible: false,

      labelPosition: 'right',

      formLabelAlign: {
        name: '',
        perms: '',
        remark: '',
        permissionIds: '',
      },
      flag:true,

      // 弹出框必填项
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          }
        ],
      },
      roleperm: [],
    }
  },
  methods: {
    handleSizeChange(){

    },
    handleCurrentChange(){

    },
    // 新增用户
    adduser(){
      this.dialogFormVisible=true;
    },
    // 清空列表信息
    closeForm () {
      this.$refs.ruleForm.resetFields();
      this.formLabelAlign.selectedOptions=[];
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

  .el-tree-node__children .el-tree-node__children .el-tree-node__label:before{
    display: inline-block;
    content: url(../../assets/img/doc.png);
  }
</style>

