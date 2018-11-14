<template lang="html">
  <div class="">
    <div class="importnav">
      <span>导入Profile</span>
      <el-tooltip class="item" effect="light" content="设备的Profile是用来描述设备类型和设备服务能力的文件。它定义了设备具备的服务能力，每个服务具备的属性、命令以及命令参数。这里为线下定义的开发者提供自助上传功能。" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>
      <div class="optionbutton">
        <div class="">
          <a href="javascript:void(0);" @click="importfile"><i class="iconfont icon-daoru"></i>导入</a>
        </div>
      </div>
    </div>
    <div class="importbody">
      <el-table
        :data="tableData"
        height="470"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="文件名"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备类型"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="厂家ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="版本"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="文件大小"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="上传时间	"
          align="center">
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

    <!-- 导入文件 -->
    <el-dialog title="上传文件" :visible.sync="dialogFormVisible" width="532px"  @close='closeForm' :close-on-click-modal="false">
      <div class="upfile">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="资源文件" prop="name">
            <!-- <input type="text" name="" value="" v-model="resource" class="resinput" disabled>
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
            </el-upload> -->
            <input class="uppic" v-model="pictext" placeholder="未选择任何文件"></input>
            <input type="file" @change="getFile" ref="file" id="file">
          </el-form-item>
          <el-form-item label="设备类型" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="厂家ID" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="设备型号" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="submit">确 定</el-button>
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
      // 表格内数据
      tableData: [],
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
      // 更改后当前页
      nowPage: '',
      // 数据总条数
      totalnum: 0,
      // 每页展示的数据量
      pagesize: 10,
      formFile:'',
      pictext:'',
      content:''
    }
  },
  created(){
    this.getprofilelist();
  },
  methods: {
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    // 导入文件
    importfile(){
      this.dialogFormVisible=true;
    },

    // submitUpload() {
    //   this.$refs.upload.submit();
    // },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePreview(file) {
    //   console.log(file);
    // },
    // replace(files, fileList){
    //   console.log(files[0].name);
    //   this.resource=files[0].name;
    //   console.log(files);
      
    // },
    // changefil(file, fileList){
    //   this.resource=file.name;
    // },
    //profile列表查询
    getprofilelist(){
      this.$axios.get(process.env.API_HOST+'profile/queryProfileList?'
        +Qs.stringify({
          'userId':this.userId,
          'pageSize':this.pagesize,
          'pageNum':this.currentPage,
        }))
        .then(res => {
          console.log(res);
        })
        .catch(error => {
        });
    },
    handleSizeChange(val) {
      this.pagesize=val;
      this.currentPage=1;
      this.getprofilelist();
    },
    handleCurrentChange(val) {
      this.currentPage=val;
      this.getprofilelist();
    },
    getFile (e) {
      var files = e.target.files[0]
      this.pictext=files.name;
      this.content=files
    },
    //提交表单
    submit(){

    },

  },
}
</script>

<style lang="scss" scoped>
 .importnav{
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
 .importbody{
   padding: 24px;
 }
 .upfile{
   margin: 0 30px;
   .el-upload-list{
     display: none;
   }
   .selectfil{
     margin-left: 243px;
     background-color: #2b78e0;
     padding: 12px 30px;
     z-index: 10;
     border-radius: 0px 3px 3px 0px;
   }
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
      width: 335px;
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
 .resinput{
   width:226px;
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
    margin-top: 30px;
    margin-right: 30px;
    float: right;
  }
  input:disabled{
    background-color: #fff;
  }


</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
  .upfile{
    .el-upload-list{
      display: none;
    }
  }
</style>
