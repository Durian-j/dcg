<template lang="html">
  <div class="autograph">
    <div class="autographnav">
      <span>插件签名</span>
    </div>
    <div class="option">
      <el-row :gutter="21">
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <p>选择签名方式</p>
            <div class="">
              <el-radio v-model="radio" label="1">生成新的公私钥签名</el-radio>
              <el-radio v-model="radio" label="2">使用已有私钥签名</el-radio>
            </div>
          </div>
        </el-col>
        <el-col :span="7"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="7"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      <el-row :gutter="21">
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <p>需要签名的文件</p>
            <!-- <el-button plain>点击选择文件</el-button>
            <p>文件大小不超过35M, 且必须为zip文件</p> -->
            <input type="text" name="" value="" v-model="resource" class="resinput">
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
              <el-button slot="trigger" size="small" type="primary" class="selectfil">点击选取文件</el-button>
              <p>文件大小不超过35M, 且必须为zip文件</p>
            </el-upload>
          </div>
        </el-col>
        <el-col :span="7"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="7"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      <el-row :gutter="21" v-if="radio==2">
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <p>选择私钥</p>
            <input type="text" name="" value="" v-model="resource" class="resinput">
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
              <el-button slot="trigger" size="small" type="primary" class="selectfil">点击选取文件</el-button>
              <p>使用私钥给插件包签名；如果没提供私钥，我们会生成一对公私钥并与插件包一起打包下载。</p>
            </el-upload>
          </div>
        </el-col>
        <el-col :span="7"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="7"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      <el-row :gutter="21">
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <p>签名密码</p>
            <el-input
              placeholder="请输入内容"
              v-model="input10"
              clearable>
            </el-input>
            <p>使用ECDSA算法生成公私钥的密码。</p>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <p>厂商名称</p>
            <el-input
              placeholder="请输入内容"
              v-model="input10"
              clearable>
            </el-input>
            <p>需要和文件里的manufactureName保持一致</p>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">
            <el-button plain style="padding:12px 50px;margin-top:35px;margin-left:50px;">签名</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="explain">
      <h6>说明</h6>
      <p style="color:#8a8a8a">功能说明</p>
      <p>该工具将插件包进行数字签名并与公钥打包下载，您可以通过OP Portal上传公钥并装载该插件。当然，您也可以在开发者Portal的 <a href="#">编解码插件管理</a> 界面直接上传未签名的插件包，我们会自动签名插件并上传公钥部署插件</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      radio: '1',
      input10: '',
      fileList: [],
      // 资源文件
      resource: '',
    };
  },
  methods:{
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
     }
  }
}
</script>

<style lang="scss" scoped>
  .autographnav{
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
  }
  .option{
    padding: 24px 48px;
    background-color: #f7f9fc;
    .el-row{
      padding: 8px 0;
      p{
        font-size: 12px;
        font-weight: 500;
        color: #8a8a8a;
        margin: 10px 0;
      }
      .el-button{
        border-color: #2b78e0;
        background-color: #2b78e0;
        color: #fff;
        font-size: 12px;
        border-radius: 0px;
        padding: 12px 30px;
      }
    }

  }
  .explain{
    padding: 0 50px;
    h6{
      font-size: 12px;
      font-weight: bold;
      margin: 30px 0;
    }
    p{
      font-size: 12px;
      margin-bottom: 20px;
      a{
        color: #2b78e0;
      }
    }
  }
  .el-radio{
    margin-left: 10px;
  }

  .option{
    .el-upload-list{
      display: none;
    }
    .selectfil{
      margin-left: 257px;
      background-color: #2b78e0;
      padding: 12px 30px;
      z-index: 10;
      border-radius: 0px 3px 3px 0px;
    }

  }
  .resinput{
    width:240px;
    height:34px;
    position:absolute;
    top:44px;
    border:1px solid #c0c4cc;
    outline: none;
    border-radius: 5px 0 0 5px;
    padding-left: 15px;
    color: #606266;
    font-size: 14px;
  }

</style>

<style lang="scss">
  .el-radio__label{
    font-size: 12px;
  }
  .autograph{
    .upfile{
      .el-form--label-top .el-form-item__label{
        padding: 0px;
      }
      .el-upload-list{
        display: none;
      }
    }
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: #2b78e0;
  }
  .el-radio__input.is-checked .el-radio__inner{
    border-color: #2b78e0;
    background-color: #2b78e0;
  }
</style>
