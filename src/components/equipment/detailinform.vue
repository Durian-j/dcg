<template lang="html">
  <div class="register">
    <div class="registernav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/equipment' }">我的设备</el-breadcrumb-item>
        <el-breadcrumb-item>设备详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="informbody">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备详情" name="first">
          <el-row>
            <el-col :span="12">
              <div class="grid-content">
                <span>设备名称</span>
                <p>{{equipdetail.deviceName}}</p>
                <span>设备ID</span>
                <p>{{equipdetail.deviceId}}</p>
                <span>设备类型</span>
                <p>{{equipdetail.profileEntity.dictionaryDeviceType.value}}</p>
                <span>厂商名称</span>
                <p>{{equipdetail.profileEntity.vendorName}}</p>
                <span>位置</span>
                <p>{{equipdetail.profileEntity.position}}</p>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content">
                <span>验证码</span>
                <p>{{equipdetail.verificationCode}}</p>
                <span>设备标识码</span>
                <p>{{equipdetail.deviceUniqueNo}}</p>
                <span>厂商ID</span>
                <p>{{equipdetail.profileEntity.vendorId}}</p>
                <span>协议类型</span>
                <p>{{equipdetail.profileEntity.dictionaryProtocolType.value}}</p>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="模拟器日志" name="second">
          <div class="tablenav">
            <a href="#"><i class="iconfont icon-shuaxin" style="margin-right:5px;"></i>刷新</a>
          </div>
          <el-table
            :data="historydata"
            height="400"
            style="width: 100%">
            <el-table-column
              prop="imei"
              label="IMEI号"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              prop="sendData"
              label="发送消息"
              align="center">
            </el-table-column>
            <el-table-column
              prop="receiveData"
              label="接收消息"
              align="center">
            </el-table-column>
          </el-table>
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
        <el-tab-pane label="设备日志" name="third">
          <div class="tablenav">
            <h4>记录设备日志</h4>
            <!-- <p v-if="running==true" style="margin-top:0px"><img src="../../assets/img/load-min-blue.png"></img>正在记录日志···</p>
            <a href="#"><i class="iconfont icon-cuohao" style="margin-right:5px;"></i>清空日志</a>
            <a href="#" style="margin-right:20px;" v-if="begin==true" @click="beginjournal">
              <i class="iconfont icon-qidong" style="margin-right:5px;"></i>启动
            </a>
            <a href="#" style="margin-right:20px;" v-if="begin==false" @click="stopjournal">
              <i class="iconfont icon-stop" style="margin-right:5px;"></i>停止
            </a> -->
          </div>
          <el-table
            :data="devicelog"
            height="400"
            style="width: 100%">
            <el-table-column
              prop="createTime"
              label="时间"
              width="180"
              align="center">
            </el-table-column>
            <el-table-column
              prop="content"
              label="日志详情">
            </el-table-column>
          </el-table>
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
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'
export default {
  data(){
    return{
      activeName: 'first',
      //设备详细信息
      equipdetail:{
        deviceName:'',
        deviceId:'',
        verificationCode:'',
        deviceUniqueNo:'',
        profileEntity:{
          vendorName:'',
          position:'',
          vendorId:'',
          dictionaryDeviceType:{value:''},
          dictionaryProtocolType:{value:''},
        }
      },
      //历史数据
      historydata:[],
      //设备日志
      devicelog:[],
      // 当前默认显示的页数
      currentPage: 1,
      // 更改后当前页
      nowPage: '',
      // 数据总条数
      totalnum: 20,
      // 每页展示的数据量
      pagesize: 10,
      //当前的userId
      userId:this.$store.getters.userId,
      //当前的deviceId
      deviceId:'',
      //控制日志的启动和暂停
      begin:true,
      running:false,
    }
  },
  created(){
    this.deviceId=this.$route.query.deviceId;
    this.getinformdetail();
  },
  methods:{
    //获取设备详细信息
    getinformdetail(){
      this.$axios.get(process.env.API_HOST+'device/queryDeviceInfoList?'
      +Qs.stringify({
        'userId':this.userId,
        'deviceId':this.deviceId,
      }))
        .then(res => {
          this.equipdetail=res.data.returnData[0].itemList[0];
        })
        .catch(error => {
        });
    },
    beginjournal(){
      this.begin=!this.begin;
      this.running=true;
    },
    stopjournal(){
      this.begin=!this.begin;
      this.running=false;
    },
    //切换选项卡
    handleClick(tab) {
      if(tab.label=='模拟器日志'){
        this.getsimulator();
      }else if(tab.label=='设备日志'){
        this.getdevicelog();
      }
    },
    // 查询模拟器日志
    getsimulator(){
      this.$axios.get(process.env.API_HOST+'simulate/querySimulateLogList?'
        +Qs.stringify({
          'userId':this.userId,
          'deviceId':this.deviceId,
          'pageSize':this.pagesize,
          'pageNum':this.currentPage,
        }))
        .then(res => {
          this.historydata=res.data.returnData[0].itemList;
          this.totalnum=res.data.returnData[0].totalNum;
          for(let i=0;i<this.historydata.length;i++){
            if(typeof(this.historydata[i].receiveData)=='object'){
              this.historydata[i].receiveData=JSON.stringify(this.historydata[i].receiveData);
            }
          }
        })
        .catch(error => {
        });
    },
    // 查询设备日志
    getdevicelog(){
      this.$axios.get(process.env.API_HOST+'device/queryDeviceLogList?'
        +Qs.stringify({
          'userId':this.userId,
          'deviceId':this.deviceId,
          'pageSize':this.pagesize,
          'pageNum':this.currentPage,
        }))
        .then(res => {
          this.totalnum=res.data.returnData[0].totalNum;
          this.devicelog=res.data.returnData[0].itemList;
        })
        .catch(error => {
        });
    },
    handleSizeChange(val) {
      this.pagesize=val;
      this.currentPage=1;
      if(this.activeName=='second'){
        this.getsimulator();
      }else if(this.activeName=='third'){
        this.getdevicelog();
      }
    },

    handleCurrentChange(val) {
      this.currentPage=val;
      if(this.activeName=='second'){
        this.getsimulator();
      }else if(this.activeName=='third'){
        this.getdevicelog();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .registernav{
    height: 28px;
    border-bottom: 1px solid #f2f2f2;
    padding-top: 18px;
    padding-left: 50px;
  }
  .registerbody{
    padding: 24px;
    padding-left: 50px;
    h4{
      color: #000;
      padding: 8px 0;
    }
  }
  .informbody{
    padding: 24px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'HNLTS-Roman';
    span{
      color: #8a8a8a;
      display: inline-block;
      margin-top: 30px;
    }
    p{
      color: #000;
      margin-top: 10px;
    }
    #pane-first{
      background-color: #f7f9fc;
      padding: 10px 30px 50px;
    }
    .pagin{
      margin-top: 30px;
      float: right;
    }
    .tablenav{
      h4{
        color: #000;
        font-size: 14px;
        display: inline-block;
        margin-bottom: 10px;
      }
      p{
        font-size: 12px;
        color: gray;
        display: inline-block;
        margin-left: 15px;
        img{
          vertical-align: bottom;
          margin-right: 8px;
          animation: spin 1s linear infinite;
        }
      }
      a{
        color: #000;
        font-weight: 500;
        font-size: 14px;
        float: right;
        margin-right: 10px;
        margin-bottom: 10px;
        i{
          color: #000;
          vertical-align: top;
          font-size: 14px;
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
  @keyframes spin {
      from {
          transform: rotate(0deg);
      }
      to {
          transform: rotate(360deg);
      }
  }
</style>
<style lang="scss">
  .informbody{
    .el-tabs__nav-scroll{
      padding-left: 26px;
    }
    .el-tabs__item{
      color: #6F7479;
      font-weight: 600;
    }
    .el-tabs__item.is-active{
      color: #2b78e0;
    }
    .el-tabs__content{
      padding:0 26px;
    }
  }
</style>
