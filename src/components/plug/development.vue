<template lang="html">
  <div class="development">
    <div class="developnav">
        <span>插件开发</span>
        <el-tooltip class="item" effect="light" content="通过图形化的方式实现设备的二进制码流到IoT平台的JSON格式消息的转换，同时将平台下发的控制命令编码成设备的二进制码流格式。" placement="right">
          <i class="iconfont icon-question"></i>
        </el-tooltip>
        <div class="optionbutton">
          <div class="">
            <a href="javascript:void(0);" @click="openguide"><i class="iconfont icon-question"></i>新手指导</a>
          </div>
          <div class="">
            <!-- <a href="javascript:void(0);" @click="add"><i class="iconfont icon-tainjia"></i>添加插件</a> -->
            <a href="javascript:void(0);" @click="addplug" v-if="hasPermission('plugin:addPluginInfo')">
              <i class="iconfont icon-tainjia"></i>新建插件
            </a>
          </div>
        </div>
      </div>
    <div class="developbody">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的插件" name="first">
          <div class="myplug" v-for="item in pluginlist" :key="item.pluginName" v-if="hasPermission('plugin:queryPluginList')">
            <div class="picexplain" @click="watchdetail(item.pluginId)">
              <el-row>
                <el-col :span="3">
                  <div class="grid-content">
                    <div style="width:150px;height:150px;text-align:center;position:relative">
                      <img :src="item.profileEntity.commonImagePrefix+item.profileEntity.productImagePath" alt="" width="75%" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
                    </div>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content">
                    <span>插件名称</span>
                    <p>{{item.pluginName}}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content">
                    <span>设备型号</span>
                    <p>{{item.profileEntity.deviceModelId}}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content">
                    <span>设备类型</span>
                    <p>{{item.profileEntity.dictionaryDeviceType.value}}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content">
                    <span>接入协议</span>
                    <p>{{item.profileEntity.dictionaryProtocolType.value}}</p>
                  </div>
                </el-col>
                <!-- <el-col :span="3">
                  <div class="grid-content">
                    <span>厂家</span>
                    <p>ZGX</p>
                  </div>
                </el-col> -->
                <el-col :span="3">
                  <div class="grid-content">
                    <span>部署时间</span>
                    <p>{{item.createTime}}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content">
                    <span>最后修改时间</span>
                    <p>{{item.operatorTime}}</p>
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="grid-content options" style="text-align:center;margin-top:15px;">
                    <span style="display:none">{{item.pluginId}}</span>
                    <span style="margin-right:15px" @click.stop="editplugin($event,item.profileEntity.profileId)" v-if="hasPermission('plugin:modifyPluginInfo')">编辑</span>
                    <span @click.stop="delplugin($event)" v-if="hasPermission('plugin:removePluginInfo')">删除</span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div class="grid-content">
                    <span>描述</span>
                    <p>{{item.pluginDesc}}</p>
                  </div>
                </el-col>
              </el-row>
            </div>
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

        </el-tab-pane>
        <!-- <el-tab-pane label="插件模板" name="second">
          <p class="defintion">请基于模板创建您的插件!</p>
          <div class="plugmod">
            <el-row>
              <el-col :span="7">
                <div class="grid-content">
                  <img src="../../assets/img/default.png" alt="" width="150">
                </div>
              </el-col>
              <el-col :span="11">
                <div class="grid-content">
                  <p class="title">GlobalTemplate</p>
                  <p class="text">Coap</p>
                  <p class="text">System Template</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">
                  <el-button type="primary">查看</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane> -->
      </el-tabs>

      
    
    </div>

    

    <plugguide ref="look"></plugguide>

    <!-- 插件详情 -->
    <el-dialog title="插件详情" :visible.sync="plugdetail" width="480px" :close-on-click-modal="false">
      <div class="editnew">
        <el-form :label-position="labelPosition" label-width="80px" :model="pluginform" ref="plugin">
          <el-form-item label="插件名称" prop="pluginName"
          :rules="[{ required: true, message: '名称不能为空', trigger: 'blur'},]">
            <el-input v-model="pluginform.pluginName"></el-input>
          </el-form-item>
          <el-form-item label="插件类型" prop="pluginType"
          :rules="[{ required: true, message: '插件类型不能为空', trigger: 'blur'},]">
            <!-- <el-input v-model="pluglist.pluginType"></el-input> -->
            <el-select v-model="pluginform.pluginType" placeholder="请选择插件类型">
              <el-option
                v-for="item in plugintype"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="插件描述">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="插件描述"
              v-model="pluginform.pluginDesc">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer fieldfooter">
        <el-button class="confirm" type="primary" @click="confirm('plugin')">确 定</el-button>
        <el-button class="cancel" plain @click="plugdetail = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择profile -->
    <el-dialog title="选择profile" :visible.sync="selectprofile" width="1060px" :close-on-click-modal="false">
      <div class="selectpro">
        <el-row :gutter="30">
          <el-col :span="6" v-for="item in profilelist" :key="item.profileId">
            <el-card shadow="hover" style="">
              <p style="display:none">{{item.profileId}}</p>
              <div class="gouxuan"><i class="iconfont icon-duihao" @click="seloption($event)"></i></div>
              <div class="imgbox">
                <img v-bind:src="item.commonImagePrefix+item.productImagePath" alt="" width="100%">
              </div>
              
              <!-- <img src="../../assets/default.png" alt=""> -->
              <div class="onlinedetail">
                <span>设备型号 :</span><span>{{item.deviceModelId}}</span><br>
                <span>厂商名称 : </span><span>{{item.vendorName}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer fieldfooter">
        <el-button class="confirm" type="primary" @click="finishsel()" :disabled="canfinish">完 成</el-button>
        <el-button class="cancel" plain @click="selectprofile = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 插件详情 -->
    <el-dialog title="插件详情" :visible.sync="plugdet" width="480px" :close-on-click-modal="false">
      <div class="editnew">
        <el-form :label-position="labelPosition" label-width="80px" :model="pluglist" ref="plugin">
          <el-form-item label="插件名称" prop="pluginName"
          :rules="[{ required: true, message: '名称不能为空', trigger: 'blur'},]">
            <el-input v-model="pluglist.pluginName"></el-input>
          </el-form-item>
          <el-form-item label="插件类型" prop="pluginType"
          :rules="[{ required: true, message: '插件类型不能为空', trigger: 'blur'},]">
            <!-- <el-input v-model="pluglist.pluginType"></el-input> -->
            <el-select v-model="pluglist.pluginType" placeholder="请选择插件类型">
              <el-option
                v-for="item in plugintype"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="插件描述">
            <el-input
              type="textarea"
              :rows="7"
              placeholder="插件描述"
              v-model="pluglist.pluginDesc">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer fieldfooter">
        <el-button class="confirm" type="primary" @click="nextstep('plugin')">下一步</el-button>
        <el-button class="cancel" plain @click="plugdet = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import plugguide from './plugguide.vue';
import Qs from 'qs'
export default {
  data() {
    return {
      activeName: 'first',
      // 当前默认显示的页数
      currentPage: 1,
      // 数据总条数
      totalnum: 0,
      // 每页展示的数据量
      pagesize: 10,
      //plugin列表
      pluginlist:[{
        pluginName:'',
        createTime:'',
        operatorTime:'',
        pluginDesc:'',
        profileEntity:{
          deviceModelId:'',
          dictionaryDeviceType:{value:''},
          dictionaryProtocolType:{value:''},
        },
      }],

      plugdetail:false,
      pluginform:{
        pluginName:'',
        pluginType:'',
        pluginDesc:'',
        userId:this.$store.getters.userId,
        profileId:'',
      },
      labelPosition: 'top',
      //插件类型
      plugintype:[{
        value:1,
        label:'数据上报',
      },{
        value:2,
        label:'命令下发',
      }],
      //选择profile
      selectprofile: false,
      pluglist:{
        pluginName:'',
        pluginType:'',
        pluginDesc:'',
        userId:this.$store.getters.userId,
        profileId:'',
      },
      plugdet:false,
      profilelist:[],
      profileId:'',
      userId:this.$store.getters.userId,
      canfinish: true,
    };
  },
  created(){
    this.getallpluglist();
    this.getprofilelist();
  },
  methods: {
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },
    // 切换tab栏的方法
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 打开新手指导的方法
    openguide(){
      this.$refs.look.openguid();
    },
    // 添加插件的方法
    add(){
      this.activeName='second';
    },
    //新建插件
    addplug(){
      this.plugdet=true;
      
    },
    //获取所有插件列表
    getallpluglist(){
      this.$axios.get(process.env.API_HOST+'plugin/queryPluginList?'
      +Qs.stringify({
        'userId':this.userId,
        'pageSize':this.pagesize,
        'pageNum':this.currentPage,
      }))
        .then(res => {
          
          this.totalnum=res.data.returnData[0].totalNum;
          this.pluginlist=res.data.returnData[0].itemList;
          for(let i=0;i<this.pluginlist.length;i++){
            if(this.pluginlist[i].profileEntity.productImagePath==''){
              this.pluginlist[i].profileEntity.productImagePath='../../../static/img/default.png'
            }
          }
          
        })
        .catch(error => {
        });
    },
    handleSizeChange(val) {
      this.pagesize=val;
      this.currentPage=1;
      this.getallpluglist();
    },
    handleCurrentChange(val) {
      this.currentPage=val;
      this.getallpluglist();
    },
    //编辑插件
    editplugin(e,proId){
      this.profileId=proId;
      let str=e.target.parentNode.firstElementChild.innerText;
      this.$axios.get(process.env.API_HOST+'plugin/queryPluginInfo?'
      +Qs.stringify({
        'pluginId':str,
      }))
        .then(res => {
          this.plugdetail=true;
          this.pluginform=res.data.returnData[0];
        })
        .catch(error => {
        });
    },
    //修改插件信息
    confirm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pluginform.profileId=this.profileId;
          this.$axios.put(process.env.API_HOST+'plugin/modifyPluginInfo',
            JSON.stringify(this.pluginform),
            {headers:{'Content-Type': 'application/json'}})
            .then(res => {
              this.plugdetail=false;
              this.getallpluglist();
            })
            .catch(error => {
            });
        } else {
          return false;
        }
      });
    },
    //删除插件
    delplugin(e){
      this.$confirm('是否删除该插件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let str=e.target.parentNode.firstElementChild.innerText;
        this.$axios.delete(process.env.API_HOST+'plugin/removePluginInfo?'
        +Qs.stringify({
          'pluginId':str,
        }))
          .then(res => {
            this.getallpluglist();
          })
          .catch(error => {
          });
      }).catch(() => {          
      });

      
    },
    watchdetail(a){
      if(this.hasPermission('plugin:queryPluginInfo')){
        this.$router.push({path:'/designplug?pluginId='+a})
      }
      
    },
    //选择完成
    finishsel(){
      this.$axios.post(process.env.API_HOST+'plugin/addPluginInfo',
        JSON.stringify(this.pluglist),
        {headers:{'Content-Type': 'application/json'}})
        .then(res => {
          this.selectprofile=false;
          this.$router.push({path:'/designplug?pluginId='+res.data.returnData[0].pluginId});
        })
        .catch(error => {
        });
    },
    //选择哪一个profile
    seloption(e){
      let all=document.getElementsByClassName('gouxuan');
      for(let i=0;i<all.length;i++){
        all[i].style.border='1px solid #ccc';
        all[i].children[0].style.color='#ccc';
      }
      this.pluglist.profileId=e.target.parentNode.parentNode.firstElementChild.innerText;
      
      e.target.parentNode.style.border='1px solid #2b78e0';
      e.target.style.color='#2b78e0';
      this.canfinish=false;
    },
    //获取profile数据列表
    getprofilelist(){
      this.$axios.get(process.env.API_HOST+'profile/queryProfileList?'
      +Qs.stringify({
        'userId':this.userId,
        'pageSize':50,
        'pageNum':1,
      }))
        .then(res => {
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
    // 下一步
    nextstep(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.plugdet=false;
          this.selectprofile=true;
          this.canfinish=true;
        } else {
          return false;
        }
      });
      
    },
  },
  // 调用组件
  components: {
    'plugguide': plugguide
  },
};
</script>

<style lang="scss" scoped>
  .development{
    background-color: #f7f9fc;
    min-height: 100%;
  }
  .developnav{
    height: 46px;
    border-bottom: 1px solid #f2f2f2;
    line-height: 46px;
    padding-left: 50px;
    background-color: #fff;
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
  .developbody{
    padding: 22px;
    padding-left: 50px;
    #pane-first,#pane-second{
      padding-top: 15px;
      .myplug{
        width: 98%;
        height: 150px;
        border: 1px #e6e6e6 solid;
        padding: 0;
        cursor: pointer;
        transition: all 0.3s ease-out;
        margin-left: 5px;
        font-size: 12px;
        margin-bottom: 20px;
        background-color: #fff;
        span{
          color: #8a8a8a;
          margin-top: 24px;
          display: inline-block;
        }
        p{
          color: #000;
          font-size: 12px;
          font-weight: 550;
          margin-top: 8px;
          font-family: "HNLTS-Roman"
        }
        .picexplain{
          .options{
            span:hover{
              background-color: #f7f9fc;
            }
          }
        }
      }
      .myplug:hover{
        box-shadow: 0 0 10px #ccc;
      }
      .defintion{
        color: #000;
        font-size: 14px;
        font-weight: bold;
        margin-top: 10px;
      }
      .plugmod{
        width: 45%;
        float: left;
        margin-right: 30px;
        height: 150px;
        border: 1px #e6e6e6 solid;
        padding: 0;
        cursor: pointer;
        transition: all 0.3s ease-out;
        margin-left: 5px;
        font-size: 12px;
        margin-bottom: 20px;
        background-color: #fff;
        margin-top: 20px;
        min-width: 450px;
        .text{
          color: #8a8a8a;
          font-weight: 500;
          margin-top: 15px;
        }
        .title{
          font-size: 24px;
          color: #000;
          font-weight: 500;
          margin-top: 20px;
        }
        .el-button{
          background-color: #4689d6;
          font-size: 12px;
          padding: 10px 40px;
          margin-top: 30px;
        }
      }
      .plugmod:hover{
        box-shadow: 0 0 10px #ccc;
      }
    }
  }
  .pagin{
    margin-top: 30px;
    float: right;
    margin-right: 30px;
    margin-bottom: 30px;
  }
  .editnew{
    padding: 0 10px;
    height: 350px;
    overflow: auto;
    .el-form-item{
      margin-bottom: 10px;
    }
    .editfield{
      background-color: #f7f9fc;
      padding-top: 8px;
      span{
        color: red;
        font-weight: normal;
        display: inline-block;
        margin-top: 5px;
      }
    }
  }
  .selectpro{
    background-color: #f5f5f5;
    padding: 24px;
    height: 380px;
    overflow: auto;
    .el-card{
      margin-bottom: 30px;
    }
    .el-card__body{
      
      .imgbox{
        width: 130px;
        height: 130px;
        margin: 40px auto 20px;
      }
      .onlinedetail{
        span{
          font-size: 12px;
        }
      }
      .gouxuan{
        border: 1px solid #cccccc;
        width: 25px;
        height: 25px;
        float: right;
        text-align: center;
        i{
          vertical-align: middle;
          color: #ccc;
        }
      }
    }
  }
</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
  .el-tabs__item{
    font-weight: 700;
    color: #6F7479;
  }
  .development{
    .el-dialog__body{
      padding: 5px 20px;
    }
  }
  .el-card__body{
    // text-align: center;
    cursor: pointer;
  }
</style>
