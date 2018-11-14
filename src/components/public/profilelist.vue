<template lang="html">
  <div class="">
    <el-row :gutter="20">
      <el-col :span="4.8" v-for="item in profilelist" :key="item.profileId">
        <div class="grid-content bg-purple">
          <div class="profile"> 
            <!-- <div class="icon" @click="item.showFlag = !item.showFlag" v-show="setting==true"> -->
              <div class="icon" v-show="setting==true">
              <!-- <i class="iconfont icon-shezhi"></i> -->
              <p style="display:none">{{item.profileId}}</p>
              <i class="iconfont icon-bianji" title="编辑" @click="editpro($event)"></i>
              <i class="iconfont icon-shanchu" title="删除" @click="delpro($event)"></i>
            </div>
            <transition name="el-zoom-in-top">
              <div class="option" v-show="item.showFlag">
                <p style="display:none">{{item.profileId}}</p>
                <p @click="editpro($event)">编辑</p>
                <p style="color:#e64545" @click="delpro($event)">删除</p>
              </div>
            </transition>
            <div style="height:20px;"></div>
            
            <div @click="watch(item.profileId)">
              <div style="width:220px;height:200px;margin-top:30px;text-align:center">
                <img v-bind:src="item.commonImagePrefix+item.productImagePath" alt="" width="75%" style="position: absolute;top: 43%;left: 50%;transform: translate(-50%, -50%);">
              </div>
              <div class="onlinedetail">
                <span>设备型号 :</span><p>{{item.deviceModelId}}</p><br>
                <span>厂商名称 : </span><p>{{item.vendorName}}</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
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

    <!-- 自定义产品 -->
    <el-dialog title="自定义产品" :visible.sync="dialogFormVisible" width="600px"  @close='closeForm' :close-on-click-modal="false">
      <div class="newpro">
        <div class="create">
          <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
            <el-form-item label="设备类型" prop="deviceTypeId">
              <el-select v-model="form.deviceTypeId" placeholder="请选择">
                <el-option
                  v-for="item in devicetype"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备型号" prop="deviceModelId">
              <el-input v-model="form.deviceModelId"></el-input>
            </el-form-item>
            <el-form-item label="厂商ID" prop="vendorId">
              <el-input v-model="form.vendorId"></el-input>
            </el-form-item>
            <el-form-item label="厂商名称" prop="vendorName">
              <el-input v-model="form.vendorName"></el-input>
            </el-form-item>
            <el-form-item label="协议类型" prop="protocolTypeId">
              <el-select v-model="form.protocolTypeId" placeholder="请选择">
                <el-option
                  v-for="item in prototype"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设置图片:">
              <p style="font-size:12px;margin-bottom:15px;">(图片格式：png，图片大小不超过200kb)</p>
              <div class="upload">
                <input class="uppic" v-model="pictext" placeholder="请选择上传文件"></input>
                <input type="file" @change="getFile" ref="file" id="file">
                <div class="img-container" style="width:230px;border:2px dashed #b2b2b2;height:230px;position: relative;">
                  <img :src="src" alt="user image" width="230px" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button class="confirm" type="primary" @click="confirmpro('ruleForm')">确 定</el-button>
          <el-button class="cancel" plain @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Qs from 'qs'
export default {
  // props: ['appId'],
  data(){
    return{
      profilelist:[],
      // 当前默认显示的页数
      currentPage: 1,
      // 更改后当前页
      nowPage: '',
      // 数据总条数
      totalnum: 0,
      // 每页展示的数据量
      pagesize: 10,
      dialogFormVisible: false,
      form: {
        deviceTypeId: '',
        vendorId:'',
        vendorName:'',
        protocolTypeId:'',
        productImagePath:'',
        deviceModelId:''
      },
      rules: {
        vendorName: [
          {
            required: true,
            message: '请输入厂商名称',
            trigger: 'blur'
          }
        ],
        deviceTypeId: [
          {
            required: true,
            message: '请选择设备类型',
            trigger: 'blur'
          }
        ],
        deviceModelId: [
          {
            required: true,
            message: '请输入设备型号',
            trigger: 'blur'
          }
        ],
        vendorId: [
          {
            required: true,
            message: '请输入厂商Id',
            trigger: 'blur'
          }
        ],
        protocolTypeId: [
          {
            required: true,
            message: '请选择协议类型',
            trigger: 'blur'
          }
        ],
      },
      // 新手指导
      newguide: false,
      //设备类型
      devicetype:[],
      //协议类型
      prototype:[],
      src: '../../../static/img/default.png',
      pic:'',
      formFile:'',
      pictext:'',
      //是否显示设置按钮
      setting:true,
      userId:this.$store.getters.userId,
    }
  },
  created(){
    this.getprofilelist();
    if(this.$route.path=='/main/equipment/register'){
      this.setting=false
    }
    this.getdevicetype();
  },
  methods:{
    //点击查看详情
    watch(proId){
      let proid=proId;
      if(this.$route.path=='/main/profile/online'){
        this.$router.push({path:'/main/profile/prodetail?profileId='+proid})
      }else if(this.$route.path=='/main/simulator/equipsimulator'){
        this.$router.push({path:'/main/simulator/addsimulator'})
      }else{
        this.$router.push({path:'/main/equipment/equipdetail?profileId='+proid})
      }
    },
    //获取profile数据列表
    getprofilelist(){
      this.$axios.get(process.env.API_HOST+'profile/queryProfileList?'
      +Qs.stringify({
        'userId':this.userId,
        'pageSize':this.pagesize,
        'pageNum':this.currentPage,
      }))
        .then(res => {
          this.totalnum=res.data.returnData[0].totalNum;
          for(let i=0;i<res.data.returnData[0].itemList.length;i++){
            res.data.returnData[0].itemList[i].showFlag=false;
          }
          this.profilelist=res.data.returnData[0].itemList;
          for(let i=0;i<this.profilelist.length;i++){
            if(this.profilelist[i].productImagePath==''){
              this.profilelist[i].productImagePath='../../../static/img/default.png'
            }
          }
          
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
    //产品编辑
    editpro(e){
      this.dialogFormVisible=true;
      this.$axios.get(process.env.API_HOST+'profile/queryProfileDetail?'
      +Qs.stringify({
        'userId':this.userId,
        'profileId':e.target.parentNode.firstElementChild.innerText,
      }))
        .then(res => {
          this.form=res.data.returnData[0];
          this.form.deviceTypeId=this.form.dictionaryDeviceType.id;
          this.form.protocolTypeId=this.form.dictionaryProtocolType.id;
          
          if(this.form.productImagePath!=''){
            this.src=this.form.commonImagePrefix+this.form.productImagePath;
          }else{
            this.src='../../../static/img/default.png';
          }
          // var index = this.form.productImagePath.lastIndexOf('/');  
          // let str = this.form.productImagePath.substring(index + 1, this.form.productImagePath.length);
          // console.log(str);
          
          // this.pictext=this.form.productImagePath;
          // document.getElementById('file').title=this.pictext;
        })
        .catch(error => {
        });
    },
    //产品删除
    delpro(e){
      this.$confirm('确定要删除当前产品?','删除提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.delete(process.env.API_HOST+'profile/removeProfile?'
        +Qs.stringify({'userId':this.userId,'profileId':e.target.parentNode.firstElementChild.innerText,}))
          .then(res => {
            if(res.data.returnCode=='success'){
              this.getprofilelist();
              this.$confirm('删除产品成功！', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                
              }).catch(() => {
                          
              });
            }
          })
          .catch(error => {
          });
      }).catch(() => {
      });
    },
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    getFile (e) {
      let _this = this
      var files = e.target.files[0]
      if (!e || !window.FileReader) return  // 看支持不支持FileReader
      let reader = new FileReader()
      reader.readAsDataURL(files) // 这里是最关键的一步，转换就在这里
      reader.onloadend = function () {
        _this.src = this.result
      }
      this.pic=files;
      // this.pictext=files.name;
      // document.getElementById('file').title=this.pictext;
    },
    //产品编辑的确认
    confirmpro(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formFile = new FormData();
          this.formFile.append('profileImageFile', this.pic);
          this.form.userId=this.userId;
          // this.formFile.append('appId', this.appId);
          this.formFile.append('profileJson', JSON.stringify(this.form));
          
          this.$axios.post(process.env.API_HOST+'profile/modifyProfile',
            this.formFile)
            .then(res => {
              if(res.data.returnCode=='success'){
                this.dialogFormVisible=false;
                this.$confirm('更新产品成功！', '更新提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(() => {
                  this.getprofilelist();
                }).catch(() => {
                  this.getprofilelist();         
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
    //获取设备及协议类型下拉框
    getdevicetype(){
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'DEVICE_TYPE'}))
        .then(res => {
          this.devicetype=res.data.returnData[0]
        })
        .catch(error => {
        });
      this.$axios.get(process.env.API_HOST+'dictionary/queryDictionaryByType?'+Qs.stringify({'type':'PROTOCOL_TYPE'}))
        .then(res => {
          this.prototype=res.data.returnData[0]
        })
        .catch(error => {
        });
    },
  }
}
</script>

<style lang="scss" scoped>
  .profile{
    width: 220px;
    height: 320px;
    border:1px #e8e8e8 solid;
    margin-top: 20px;
    float: left;
    cursor: pointer;
    transition: all 0.3s ease-out;
    position: relative;
    .el-dropdown{
      width: 100%;
    }
    .icon{
      margin-top: 20px;
      float: right;
      margin-right: 20px;
      i{
        color: #d6d6d6;
        cursor: pointer;
      }
      i:hover{
        color: #2b78e0;
      }
    }
    // img{
    //   margin-left: 10px;
    // }
    .onlinedetail{
      font-size: 12px;
      margin-left: 40px;
      span{
        color: #b3b3b3;
      }
      p{
        color: #000;
        font-weight: 600;
        display:inline-block;
        margin-bottom: 10px;
      }
    }
    .option{
      border: 1px solid #e6e6e6;
      background-color: #fff;
      padding: 10px 20px 5px;
      position: absolute;
      right: -10px;
      top: 42px;
      p{
        margin-bottom: 8px;
        font-size: 13px;
      }
    }
  }
  .profile:hover{
    box-shadow: 0 0 10px #ccc;
  }
  .pagin{
    text-align: right;
    margin: 40px 20px 10px 0;
  }

  .newpro{
    height: 420px;
    overflow: auto;
    .create{
      width: 85%;
    }
    .dialog-footer{
      .el-button{
        padding: 10px 40px;
        font-size: 12px;
      }
      .confirm{
        background-color: #4689d6;
      }
      .cancel:hover{
        color: #4689d6;
        border-color: #4689d6;
      }
    }
  }
  .upload{
    position: relative;
    padding-top: 60px;
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
      width: 325px;
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
</style>
