<template lang="html">
  <div class="manager">
    <div class="mangernav">
      <span>编解码插件管理</span>
      <el-tooltip class="item" effect="light" content="该界面对已有插件做统一管理。在“插件开发”里部署到平台的插件会在这里做统一管理，及为线下开发的开发者提供自助部署功能。" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>
      <div class="optionbutton">
        <div class="">
          <a href="javascript:void(0);" @click="importfile"><i class="iconfont icon-tainjia"></i>添加CIG插件</a>
        </div>
        <div class="">
          <a href="javascript:void(0);"><i class="iconfont icon-shuaxin"></i>刷新</a>
        </div>
      </div>
    </div>
    <div class="mangerbody">
      <el-table
        :data="tableData"
        height="470"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="协议名称"
          width="180px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="插件名称"
          width="300px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="CIG插件安装状态"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          width="120px"
          align="center">
          <template slot-scope="scope">
            <i class="iconfont icon-xiezai" title="卸载"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <!--  添加CIG插件 -->
    <el-dialog title=" 添加CIG插件" :visible.sync="dialogFormVisible" width="530px"  @close='closeForm' :close-on-click-modal="false">
      <div class="upfile">

        <p>开发者Portal会自动给上传的插件进行签名并上传公钥，如果您想将编解码插件移植到别的商用平台上，请用 <router-link :to="{path:'/main/autograph'}">插件签名</router-link> 签名后，再传给商用平台运维人员。</p>
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="100px" :label-position="labelPosition">
          <el-form-item label="添加CIG插件" prop="name">
            <input type="text" name="" value="" v-model="resource" class="resinput" placeholder="文件大小不超过35M, 且必须为zip文件">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-exceed="replace"
              :on-change="changefil"
              :auto-upload="false"
              :limit="1">
              <el-button slot="trigger" size="small" type="primary" class="selectfil">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="厂商名称" prop="name">
            <el-input v-model="form.name" placeholder="需要和文件里的manufactureName保持一致"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="dialogFormVisible = false">确 定</el-button>
        <el-button class="cancel" plain @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data(){
    return{
      labelPosition: 'top',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路'
      }],
      // 表单内数据
      dialogFormVisible: false,
      form: {
        name: '基础API包',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入经度',
            trigger: 'blur'
          }
        ],
      },
      fileList: [],

      // 资源文件
      resource: '',

      // 当前默认显示的页数
      currentPage: 1,
      // 数据总条数
      totalnum: 0,
      // 每页展示的数据量
      pagesize: 10,
    }
  },
  methods: {
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    // 导入文件
    importfile(){
      this.dialogFormVisible=true;
    },

    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    replace(files, fileList){
      console.log(files[0].name);
      this.resource=files[0].name;
    },
    changefil(file, fileList){
      this.resource=file.name;
    },

    //获取插件列表
    getpluginlist(){

    },
    handleSizeChange(val) {
      this.pagesize=val;
      this.currentPage=1;
      this.getpluginlist();
    },
    handleCurrentChange(val) {
      this.currentPage=val;
      this.getpluginlist();
    },
  },

}
</script>

<style lang="scss" scoped>
 .mangernav{
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
 .mangerbody{
   padding: 24px;
   i{
     cursor: pointer;
   }
   i:hover{
     color: #2b78e0;
   }
 }
 .upfile{
   margin: 0 30px;
   >p{
      font-size: 13px;
      line-height: 24px;
      color: red;
      a{
        color: #2b78e0;
      }
   }
   .el-upload-list{
     display: none;
   }
   .selectfil{
     margin-left: 318px;
     background-color: #2b78e0;
     padding: 12px 30px;
     z-index: 10;
     border-radius: 0px 3px 3px 0px;
   }

 }
 .resinput{
   width:301px;
   height:34px;
   position:absolute;
   top:2.2px;
   border:1px solid #c0c4cc;
   outline: none;
   border-radius: 5px 0 0 5px;
   padding-left: 15px;
   color: #606266;
   font-size: 14px;
 }
 .pagin{
   float: right;
   margin-top: 15px;
   margin-right: 15px;
 }

</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
  .manager{
    .upfile{
      .el-form--label-top .el-form-item__label{
        padding: 0px;
      }
      .el-upload-list{
        display: none;
      }
    }
  }
</style>
