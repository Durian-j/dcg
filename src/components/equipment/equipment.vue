<template lang="html">
  <div class="equipment">
    <div class="equipmentnav">
      <span>我的设备</span>
      <el-tooltip class="item" effect="light" content="该页面展示您注册的设备。它具备基本的应用能力，因此，您不需要开发一个应用程序，使用这个工具就可以测试设备与平台交互。" placement="right">
        <i class="iconfont icon-question"></i>
      </el-tooltip>
      <div class="optionbutton">
        <div class="">
          <a href="javascript:void(0);" @click="guide"><i class="iconfont icon-question"></i>新手指导</a>
        </div>
        <div class="">
          <router-link :to="{path:'/main/equipment/register'}"><i class="iconfont icon-tainjia"></i>注册设备</router-link>
        </div>
        <!-- <div class="">
          <a href="javascript:void(0);"><i class="iconfont icon-question"></i>了解我们的模拟器</a>
        </div> -->
      </div>
    </div>
    <div class="equipmentbody">
      <div class="searchbox">
        <el-input
          placeholder="请输入设备ID查询"
          v-model="searchinfo">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="gettableinfo"></i>
        </el-input>
        <div class="">
          <a href="javascript:void(0);"><i class="iconfont icon-shuaxin" style="margin-right:5px;"></i>刷新</a>
        </div>
      </div>
      <div class="equiptable">
        <el-table
          :data="tableData"
          :height="this.tableheight"
          style="width: 100%"
          @row-click="lookdetail">
          <el-table-column
            prop="status"
            label="状态"
            width="100"
            align="center">
            <template slot-scope="scope">
               <div v-if="scope.row.status==1"><span class="circle"></span><b>已绑定</b></div>
               <div v-if="scope.row.status==0"><span class="circle nobind"></span><b>未绑定</b></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="设备名称"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="deviceId"
            label="设备ID"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="profileEntity.dictionaryDeviceType.value"
            label="设备类型"
            align="center">
          </el-table-column>
          <el-table-column
            prop="profileEntity.vendorName"
            label="厂商名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="profileEntity.deviceModelId"
            label="设备型号"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作按钮"
            align="center">
            <template slot-scope="scope">
              <!-- <i class="iconfont icon-xiafa" title="命令下发" @click.stop="show = !show" v-if="hasPermission('simulate:sendSimulate2API')"></i> -->
              <i class="iconfont icon-tubiao09" title="编辑" @click.stop="editequip(scope.row)" v-if="hasPermission('device:modifyDeviceInfo')"></i>
              <i class="iconfont icon-shanchu" title="删除" @click.stop="delequip(scope.row)" v-if="hasPermission('device:removeDeviceInfo')"></i>
            </template>
          </el-table-column>
          
        </el-table>
        <transition name="slide-fade">
          <div class="command" v-if="show">
            <div class="commandheader">
              <h4>命令下发<i class="iconfont icon-cuohao" @click="show = !show"></i></h4>
            </div>
            <div class="commandleft">
              <div style="margin:20px 30px">
                <el-button type="primary">转JSON</el-button><br>
                <span>设备名称</span><br>
                <p>863703037734535</p>
                <span>服务名称</span>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button type="primary">立即发送</el-button>
                <el-button type="primary">缓存发送</el-button>
                <p>设置时间</p>
                <span>缓存时间(秒)</span><br>
                <input type="number" min="1" max="10"/>
              </div>
            </div>
            <div class="commandright">
              <div class="rightcommandcon">
                
              </div>
            </div>
          </div>
        </transition>
        
        
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

    <!-- 新手指导 -->
    <el-dialog title="新手指导" :visible.sync="newguide" width="75%" :close-on-click-modal="false" class="newguide">
      <div class="newer">
        <h4>通过应用模拟器来注册你的设备，它具备基本的应用能力，因此，您不需要开发一个应用程序，使用这个工具就可以测试设备与平台交互。</h4>
        <div class="explain">
          <el-row :gutter="24">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <img src="../../assets/img/simulatorIcon_01.png" alt="">
                <p>注册设备之前，您需要确保设备的Profile在平台中，您可以直接使用平台预集成的，或通过平台线上制作Profile，也可以线下制作完成后上传到平台中。</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <img src="../../assets/img/simulatorIcon_02.png" alt="">
                <p>您注册的设备必须是直接连接的设备，如果您的设备为非直连的设备，您需要先添加网关，然后您的设备连接到网关。</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <img src="../../assets/img/simulatorIcon_03.png" alt="">
                <p>您可以通过界面操作，你可以看到设备的基本信息、上报的数据、事件记录。您也可以模拟下发命令的操作，并且在数据报告中查看从设备返回的数据</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="newguide = false">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 设备配置 -->
    <el-dialog title="配置设备" :visible.sync="equipconfig" width="560px"  @close='closeForm' :close-on-click-modal="false">
      <div class="config">
        <el-form :model="form" ref="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model="form.deviceName"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="profileEntity.dictionaryDeviceType.value"
          :rules="[{ required: true, message: '设备类型不能为空', trigger: 'blur'}]">
            <el-input v-model="form.profileEntity.dictionaryDeviceType.value" disabled></el-input>
          </el-form-item>
          <el-form-item label="厂商ID" prop="profileEntity.vendorId"
          :rules="[{ required: true, message: '厂商ID不能为空', trigger: 'blur'}]">
            <el-input v-model="form.profileEntity.vendorId" disabled></el-input>
          </el-form-item>
          <el-form-item label="厂商名称" prop="profileEntity.vendorName"
          :rules="[{ required: true, message: '厂商名称不能为空', trigger: 'blur'}]">
            <el-input v-model="form.profileEntity.vendorName" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备型号" prop="deviceId">
            <el-input v-model="form.deviceId" disabled></el-input>
          </el-form-item>
          <el-form-item label="协议类型" prop="profileEntity.dictionaryProtocolType.value"
          :rules="[{ required: true, message: '协议类型不能为空', trigger: 'blur'}]">
            <el-input v-model="form.profileEntity.dictionaryProtocolType.value" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="confirm" type="primary" @click="appconfirm('ruleForm')">确 定</el-button>
        <el-button class="cancel" plain @click="equipconfig = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Qs from 'qs'
export default {
  data() {
    return {
      searchinfo: '',
      tableData: [],
      // 当前默认显示的页数
      currentPage: 1,
      // 数据总条数
      totalnum: 0,
      // 每页展示的数据量
      pagesize: 10,

      // 新手指导
      newguide: false,
      //设备配置
      equipconfig:false,
      //设备编辑页
      form:{
        deviceName:'',
        deviceType:'',
        vendorId:'',
        vendor:'',
        deviceId:'',
        protocolType:'',
        profileEntity:{
          dictionaryDeviceType:{value:''},
          dictionaryProtocolType:{value:''},
          vendorId:'',
          vendorName:''
        }
      },
      rules: {
        deviceName: [
          {
            required: true,
            message: '请输入设备名称',
            trigger: 'blur'
          },
        ],
        deviceType: [
          {
            required: true,
            message: '请输入设备类型',
            trigger: 'blur'
          },
        ],
        vendorId: [
          {
            required: true,
            message: '请输入厂商ID',
            trigger: 'blur'
          },
        ],
        vendorName: [
          {
            required: true,
            message: '请输入厂商名称',
            trigger: 'blur'
          },
        ],
        deviceId: [
          {
            required: true,
            message: '请输入设备型号',
            trigger: 'blur'
          },
        ],
        protocolTypeId: [
          {
            required: true,
            message: '请输入协议类型',
            trigger: 'blur'
          },
        ],
      },
      show: false,
      tableheight:470,
      options:[],
      value:'',
      userId:this.$store.getters.userId,
    }
  },
  created(){
    this.setheight();
    this.gettableinfo();
  },
  mounted(){
    window.onresize = () => {
      return (() => {
        this.tableheight = document.documentElement.clientHeight-280
      })()
    };
  },
  methods:{
    // 匹配是否显示按钮
    hasPermission(permission){
      let myPermissions = this.$store.getters.permissions;
      return myPermissions.indexOf(permission) > -1;
    },
    guide(){
      this.newguide=true;
    },
    //设备表格查询
    gettableinfo(){
      this.$axios.get(process.env.API_HOST+'device/queryDeviceInfoList?'
      +Qs.stringify({
        'userId':this.userId,
        'pageSize':this.pagesize,
        'pageNum':this.currentPage,
        'deviceId':this.searchinfo,
      }))
        .then(res => {
          this.tableData=res.data.returnData[0].itemList;
          this.totalnum=res.data.returnData[0].totalNum;
        })
        .catch(error => {
        });
    },
    //查看详情
    lookdetail(row){
      if(this.hasPermission('device:queryDeviceLogList')){
        this.$router.push({path:'/main/equipment/detailinform?deviceId='+row.deviceId});
      }
    },
    //编辑设备
    editequip(row){
      this.equipconfig=true;
      this.$axios.get(process.env.API_HOST+'device/queryDeviceInfoList?'
      +Qs.stringify({
        'userId':row.userId,
        'deviceId':row.deviceId,
      }))
        .then(res => {
          this.form=res.data.returnData[0].itemList[0];
          console.log(this.form);
        })
        .catch(error => {
        });
      
    },
    closeForm () {
      this.$refs.ruleForm.resetFields();
    },
    // 删除设备
    delequip(row){
      this.$confirm('你确定要删除该设备吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.delete(process.env.API_HOST+'device/removeDeviceInfo?'
        +Qs.stringify({
          'userId':row.userId,
          'deviceId':row.deviceId,
        }))
          .then(res => {
            if(res.data.returnCode=='success'){
              this.gettableinfo();
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
            }
          })
          .catch(error => {
          });
      }).catch(() => {
                 
      });
    },
    setheight(){
      this.tableheight = document.documentElement.clientHeight-280
    },
    handleSizeChange(val) {
      this.pagesize=val;
      this.currentPage=1;
      this.$axios.get(process.env.API_HOST+'device/queryDeviceInfoList?'
      +Qs.stringify({
        'userId':this.userId,
        'pageSize':this.pagesize,
        'pageNum':this.currentPage,
        'deviceId':this.searchinfo,
      }))
        .then(res => {
          this.tableData=res.data.returnData[0].itemList;
        })
        .catch(error => {
        });
    },
    handleCurrentChange(val) {
      this.currentPage=val;
      this.$axios.get(process.env.API_HOST+'device/queryDeviceInfoList?'
      +Qs.stringify({
        'userId':this.userId,
        'pageSize':this.pagesize,
        'pageNum':this.currentPage,
        'deviceId':this.searchinfo,
      }))
        .then(res => {
          this.tableData=res.data.returnData[0].itemList;
        })
        .catch(error => {
        });
    },
    //编辑设备的确定按钮
    appconfirm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.put(process.env.API_HOST+'device/modifyDeviceInfo',
            JSON.stringify(this.form),
            {headers:{'Content-Type': 'application/json'}})
            .then(res => {
              if(res.data.returnCode=='success'){
                this.equipconfig=false;
                this.$message({
                  showClose: true,
                  message: res.data.returnMsg,
                  type: 'success'
                });
                this.gettableinfo();
              }
            })
            .catch(error => {
            });
        } else {
          return false;
        }
      });
    },
    
  }
}
</script>

<style lang="scss" scoped>
  .equipment{
    overflow: hidden;
  }
  .equipmentnav{
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
  .equipmentbody{
    padding: 24px;
    .searchbox{
      width: 400px;
      height: 32px;
      float: right;
      .el-input{
        width: 280px;
        float: left;
      }
      i{
        cursor: pointer;
      }
      i:hover{
        color: #2b78e0;
      }
      div{
        float: left;
        line-height: 32px;
        margin-left: 20px;
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
    .equiptable{
      margin-top: 40px;
      padding: 10px;
      position: relative;
      //overflow: hidden;
      .cell{
        i{
          margin-right: 10px;
          cursor: pointer;
        }
        i:hover{
          color: #2b78e0;
        }
      }
      .pagin{
        margin-top: 30px;
        float: right;
      }
    }
  }
  .newguide{
    .newer{
      text-align: center;
      h4{
        font-size: 16px;
        color: #000;
        font-weight: bold;
        margin-bottom: 24px;
        line-height: 24px;
      }
      .explain{
        p{
          font-size: 12px;
          padding: 0 50px;
          color: black;
        }
      }
      .dialog-footer{
        text-align:right;
        margin-top: 60px;
        border-top: 1px solid #eceeef;
        .el-button{
          font-size: 12px;
          background-color: #2b78e0;
          padding: 10px 30px;
          margin-right: 30px;
          margin-top: 20px;
        }
      }
    }
  }
  .config{
    width: 90%;
    height: 300px;
    overflow: auto;
    padding-right: 30px;
  }
  .command{
    background-color: rgb(247, 249, 252);
    width: 99%;
    height: 700px;
    position: absolute;
    top: 0;
    z-index: 20;
    .commandheader{
      background-color: rgb(235, 237, 240);
      height: 48px;
      padding: 0 24px;
      h4{
        line-height: 48px;
        font-size: 18px;
        font-weight: normal;
        i{
          float: right;
          cursor: pointer;
        }
        i:hover{
          color: #2b78e0;
        }
      }
    }
    .commandleft{
      width: 30%;
      float: left;
      height: 652px;
      border-right: 1px solid rgb(217, 217, 217);
      z-index: 21;
      font-size: 12px;
      font-weight: 500;
      span{
        color: #8a8a8a;
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      p{
        margin-bottom: 10px;
      }
    }
    .commandright{
      padding: 15px;
      //float: left;
      height: 607px;
      overflow: hidden;
      .rightcommandcon{
        background-color: #000;
        width: 100%;
        height: 100%;
      }
    }
  }
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(800px);
    opacity: 1;
  }
  .circle{
    height: 14px;
    width: 14px;
    background-color: #2b78e0;
    border-radius: 50%;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }
  .nobind{
    background-color: #ddd;
  }

</style>

<style lang="scss">
  .el-tooltip__popper.is-light{
    border: 1px solid #8a8a8a!important;
    color: #8a8a8a;
    width: 250px;
  }
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
  .newguide{
    .el-dialog__header{
      border-bottom: 1px solid #eceeef;
    }
  }
  .equiptable{
    .el-table__row{
      cursor: pointer;
    }
  }
</style>
