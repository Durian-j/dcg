<template lang="html">
  <div class="plugu">
    <el-dialog
      title="新手指导"
      :visible.sync="dialogVisible"
      width="1093px"
      top="4vh"
      @close='closeGuide'>
      <div class="mainguide">
        <div class="guleft">
          <div class="">
            <p>此教程将帮助您完成设备与平台之间的消息映射</p>
            <a href="javascript:void(0);" name='1' @click="change($event)" class="agu" style="color:#2b78e0">
              <i class="iconfont icon-source"></i>工作原理
            </a>
            <p style="margin-top:10px;">您需要完成如下步骤：</p>
            <a href="javascript:void(0);" name='2' @click="change($event)" class="agu">
              <i class="iconfont icon-1"></i>新增消息
            </a><br>
            <a href="javascript:void(0);" name='3' @click="change($event)" class="agu">
              <i class="iconfont icon-2"></i>定义Profile属性、命令
            </a><br>
            <a href="javascript:void(0);" name='4' @click="change($event)" class="agu">
              <i class="iconfont icon-3"></i>建立映射
            </a><br>
            <a href="javascript:void(0);" name='5' @click="change($event)" class="agu">
              <i class="iconfont icon-4"></i>自助部署
            </a><br>
            <a href="javascript:void(0);" name='6' @click="change($event)" class="agu">
              <i class="iconfont icon-5"></i>校验设计结果
            </a><br>
          </div>
        </div>
        <div class="guright">
          <div class="" v-show="active==1">
            <p>通过图形化的方式实现设备的二进制码流到IoT平台的JSON格式消息的转换，同时将平台下发的控制命令编码成设备的二进制码流格式。</p>
            <div class="">
              <div class="">
                <div class="img" ref="rimg">
                  <img src="../../assets/img/device-move.png" alt="" height="63px">
                </div>
                <div class="trans" ref='rtrans'></div>
                <div class="profile" ref='rpro'></div>
                <div class="use" ref='ruse'></div>
                <div class="red start" ref="mybox"></div>
                <div class="red run1" ref="mybox1"></div>
                <div class="red run2" ref="mybox2"></div>
                <div class="red run3" ref="mybox3"></div>
                <div class="red run4" ref="mybox4"></div>
              </div>
            </div>
          </div>

          <div class="" v-show="active==2">
            <p>将设备的二进制码通过简单的点选转换为界面化的消息及字段，系统会根据您填写的字段数据类型自动运算位数，请按照码流的顺序定义字段。</p>
            <div class="">
              <img src="../../assets/img/defineBinary.png" alt="" width="100%">
            </div>
          </div>

          <div class="" v-show="active==3">
            <p>通过简单的点选方式定义设备Profile属性和命令，系统会根据您填写的内容自动生成JSON代码。</p>
            <div class="">
              <img src="../../assets/img/defineProfile.png" alt="" width="100%">
            </div>
          </div>

          <div class="" v-show="active==4">
            <p>系统会将您的设计结果自动生成Bundle插件（即编解码插件包）,您需要将该文件部署到平台，您便可以将设备连接到平台完成设备集成。</p>
            <div class="">
              <img src="../../assets/img/buildMapping.png" alt="" width="100%">
            </div>
          </div>

          <div class="" v-show="active==5">
            <p>系统会将您的设计结果自动生成Bundle插件（即编解码插件包）,您需要将该文件部署到平台，您便可以将设备连接到平台完成设备集成。</p>
            <div class="">
              <img src="../../assets/img/deployment.png" alt="" width="100%">
            </div>
          </div>

          <div class="" v-show="active==6">
            <p>设计完成后，你可以实时校验设计结果，验证二进制码流与平台JSON格式的转换关系是否满足预期。</p>
            <div class="">
              <img src="../../assets/img/verify.png" alt="" width="100%">
            </div>
          </div>

        </div>
        <div class="gufooter">
          <el-button class="confirm" plain v-show="active==6" @click="confirm">确 定</el-button>
          <el-button class="step" plain v-show="active!=6" @click="next">下一步</el-button>
          <el-button class="step" plain v-show="active!=1" @click="pre">上一步</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
      return {
        dialogVisible: false,
        // 当前显示的页面
        active: 1,
        timer: undefined,
        timer1: undefined,timer2: undefined,timer3: undefined,timer4: undefined,timer5: undefined,timer6: undefined,timer7: undefined,
        timer8: undefined,timer9: undefined,timer10: undefined,timer11: undefined,timer12: undefined,timer13: undefined,timer14: undefined,
        timer15: undefined,timer16: undefined,timer17: undefined,timer18: undefined,timer19: undefined,timer20: undefined,timer21: undefined,
        timer22: undefined,timer23: undefined,timer24: undefined,timer25: undefined,timer26: undefined,timer27: undefined,timer28: undefined,
        timer29: undefined,timer30: undefined,timer31: undefined,timer32: undefined,timer33: undefined,timer34: undefined,timer35: undefined,
        timer36: undefined,timer37: undefined,timer38: undefined,timer39: undefined,timer40: undefined,timer41: undefined,timer42: undefined,
        timer43: undefined,timer44: undefined,timer45: undefined,timer46: undefined,timer47: undefined,timer48: undefined,timer49: undefined,
        timer50: undefined,timer51: undefined,timer52: undefined,timer53: undefined,timer54: undefined,timer55: undefined,timer56: undefined,
        timer57: undefined,timer58: undefined,timer59: undefined,timer60: undefined,timer61: undefined,timer62: undefined,timer63: undefined,
        timer64: undefined,timer65: undefined,timer66: undefined,timer67: undefined,timer68: undefined,timer69: undefined,timer70: undefined,
        timer71: undefined,timer72: undefined,timer73: undefined,
      };
  },
  methods: {
    // 小球循环运动函数
    animat(){
      this.timer=setInterval(()=>{
        this.gorun();
      }, 20000);
      this.$nextTick( ()=> {
        this.gorun();
      })
    },
    // 小球运动函数
    gorun(){
      this.$refs.mybox.style.left = 7.2+'%';
      this.$refs.mybox.style.top = 18.8+'%';
      this.timer1=setTimeout(()=>{this.$refs.mybox.style.left = 27+'%';
                      this.$refs.mybox.style.top = 18.8+'%';
                      this.$refs.mybox.style.transition='left 1s';},1000);
      this.timer2=setTimeout(()=>{this.$refs.mybox.style.display='none';},2000);

      this.timer3=setTimeout(()=>{this.$refs.rtrans.style.transform ='scale(1.05,1.05)';
                      this.$refs.rtrans.style.transition='transform 1s';},2000);

      this.timer4=setTimeout(()=>{this.$refs.mybox1.style.display='block';
                      this.$refs.mybox1.style.left = 32.2+'%';
                      this.$refs.mybox1.style.top = 29.5+'%';},2200);
      this.timer5=setTimeout(()=>{this.$refs.mybox1.style.left = 44.2+'%';
                      this.$refs.mybox1.style.top = 29.5+'%';
                      this.$refs.mybox1.style.transition='left 1s';},2400);
      this.timer6=setTimeout(()=>{this.$refs.mybox1.style.left = 32.2+'%';
                      this.$refs.mybox1.style.top = 29.5+'%';
                      this.$refs.mybox1.style.transition='left 1s';},3000);
      this.timer7=setTimeout(()=>{this.$refs.mybox1.style.left = 44.2+'%';
                      this.$refs.mybox1.style.top = 29.5+'%';
                      this.$refs.mybox1.style.transition='left 1s';},3600);
      this.timer8=setTimeout(()=>{this.$refs.mybox1.style.display='none';},4200);

      this.timer9=setTimeout(()=>{this.$refs.mybox2.style.display='block';
                      this.$refs.mybox2.style.left = 44.2+'%';
                      this.$refs.mybox2.style.top = 34+'%';},2200);
      this.timer10=setTimeout(()=>{this.$refs.mybox2.style.left = 32.2+'%';
                      this.$refs.mybox2.style.top = 34+'%';
                      this.$refs.mybox2.style.transition='left 1s';},2400);
      this.timer11=setTimeout(()=>{this.$refs.mybox2.style.left = 44.2+'%';
                      this.$refs.mybox2.style.top = 34+'%';
                      this.$refs.mybox2.style.transition='left 1s';},3000);
      this.timer12=setTimeout(()=>{this.$refs.mybox2.style.left = 32.2+'%';
                      this.$refs.mybox2.style.top = 34+'%';
                      this.$refs.mybox2.style.transition='left 1s';},3600);
      this.timer13=setTimeout(()=>{this.$refs.mybox2.style.display='none';},4200);

      this.timer14=setTimeout(()=>{this.$refs.mybox3.style.display='block';
                      this.$refs.mybox3.style.left = 32.2+'%';
                      this.$refs.mybox3.style.top = 60+'%';},2200);
      this.timer15=setTimeout(()=>{this.$refs.mybox3.style.left = 44.2+'%';
                      this.$refs.mybox3.style.top = 60+'%';
                      this.$refs.mybox3.style.transition='left 1s';},2400);
      this.timer16=setTimeout(()=>{this.$refs.mybox3.style.left = 32.2+'%';
                      this.$refs.mybox3.style.top = 60+'%';
                      this.$refs.mybox3.style.transition='left 1s';},3000);
      this.timer17=setTimeout(()=>{this.$refs.mybox3.style.left = 44.2+'%';
                      this.$refs.mybox3.style.top = 60+'%';
                      this.$refs.mybox3.style.transition='left 1s';},3600);
      this.timer18=setTimeout(()=>{this.$refs.mybox3.style.display='none';},4200);

      this.timer19=setTimeout(()=>{this.$refs.mybox4.style.display='block';
                      this.$refs.mybox4.style.left = 44.2+'%';
                      this.$refs.mybox4.style.top = 64.5+'%';},2200);
      this.timer20=setTimeout(()=>{this.$refs.mybox4.style.left = 32.2+'%';
                      this.$refs.mybox4.style.top = 64.5+'%';
                      this.$refs.mybox4.style.transition='left 1s';},2400);
      this.timer21=setTimeout(()=>{this.$refs.mybox4.style.left = 44.2+'%';
                      this.$refs.mybox4.style.top = 64.5+'%';
                      this.$refs.mybox4.style.transition='left 1s';},3000);
      this.timer22=setTimeout(()=>{this.$refs.mybox4.style.left = 32.2+'%';
                      this.$refs.mybox4.style.top = 64.5+'%';
                      this.$refs.mybox4.style.transition='left 1s';},3600);
      this.timer23=setTimeout(()=>{this.$refs.mybox4.style.display='none';},4200);

      this.timer24=setTimeout(()=>{this.$refs.rtrans.style.transform ='scale(1,1)';
                      this.$refs.rtrans.style.transition='transform 1s';},4200);

      this.timer25=setTimeout(()=>{this.$refs.mybox.style.left = 49.5+'%';
                      this.$refs.mybox.style.top = 18.8+'%';
                      this.$refs.mybox.style.display='block';},4400);
      this.timer26=setTimeout(()=>{this.$refs.mybox.style.left = 65.8+'%';
                      this.$refs.mybox.style.top = 18.8+'%';},4500);
      this.timer27=setTimeout(()=>{this.$refs.mybox.style.left = 65.8+'%';
                      this.$refs.mybox.style.top = 38.8+'%';
                      this.$refs.mybox.style.transition='top 1s';},5500);
      this.timer28=setTimeout(()=>{this.$refs.mybox.style.display='none';},6500);

      this.timer29=setTimeout(()=>{this.$refs.rpro.style.transform ='scale(1.1,1.1)';
                      this.$refs.rpro.style.transition='transform 0.5s';},6500);

      this.timer30=setTimeout(()=>{this.$refs.mybox.style.left = 70+'%';
                      this.$refs.mybox.style.top = 45+'%';
                      this.$refs.mybox.style.display='block';},7500);

      this.timer31=setTimeout(()=>{this.$refs.rpro.style.transform ='scale(1,1)';
                      this.$refs.rpro.style.transition='transform 0.5s';},7000);

      this.timer32=setTimeout(()=>{this.$refs.mybox.style.left = 85+'%';
                      this.$refs.mybox.style.top = 45+'%';this.$refs.mybox.style.transition='left 1s';},8000);
      this.timer33=setTimeout(()=>{this.$refs.mybox.style.display='none';},8500);

      this.timer34=setTimeout(()=>{this.$refs.ruse.style.transform ='scale(1.1,1.1)';
                      this.$refs.ruse.style.transition='transform 0.5s';},8500);
      this.timer35=setTimeout(()=>{this.$refs.ruse.style.transform ='scale(1,1)';
                      this.$refs.ruse.style.transition='transform 0.5s';},9000);

      this.timer36=setTimeout(()=>{this.$refs.mybox.style.left = 85+'%';
                      this.$refs.mybox.style.top = 48.8+'%';
                      this.$refs.mybox.style.display='block';},9300);
      this.timer37=setTimeout(()=>{this.$refs.mybox.style.left = 70+'%';
                      this.$refs.mybox.style.top = 48.8+'%';this.$refs.mybox.style.transition='left 1s';},9500);
      this.timer38=setTimeout(()=>{this.$refs.mybox.style.display='none';},10500);

      this.timer39=setTimeout(()=>{this.$refs.rpro.style.transform ='scale(1.1,1.1)';
                      this.$refs.rpro.style.transition='transform 0.5s';},10500);
      this.timer40=setTimeout(()=>{this.$refs.rpro.style.transform ='scale(1,1)';
                      this.$refs.rpro.style.transition='transform 0.5s';},11000);

      this.timer41=setTimeout(()=>{this.$refs.mybox.style.left = 65.8+'%';
                      this.$refs.mybox.style.top = 53.8+'%';
                      this.$refs.mybox.style.display='block';},11300);
      this.timer42=setTimeout(()=>{this.$refs.mybox.style.left = 65.8+'%';
                      this.$refs.mybox.style.top = 75+'%';
                      this.$refs.mybox.style.transition='top 1s';},11500);
      this.timer43=setTimeout(()=>{this.$refs.mybox.style.left = 50+'%';
                      this.$refs.mybox.style.top = 75+'%';
                      this.$refs.mybox.style.transition='left 1s';},12500);
      this.timer44=setTimeout(()=>{this.$refs.mybox.style.display='none';},13500);

      this.timer45=setTimeout(()=>{this.$refs.mybox1.style.display='block';
                      this.$refs.mybox1.style.left = 32.2+'%';
                      this.$refs.mybox1.style.top = 29.5+'%';},13700);
      this.timer46=setTimeout(()=>{this.$refs.mybox1.style.left = 44.2+'%';
                      this.$refs.mybox1.style.top = 29.5+'%';
                      this.$refs.mybox1.style.transition='left 1s';},13900);
      this.timer47=setTimeout(()=>{this.$refs.mybox1.style.left = 32.2+'%';
                      this.$refs.mybox1.style.top = 29.5+'%';
                      this.$refs.mybox1.style.transition='left 1s';},14500);
      this.timer48=setTimeout(()=>{this.$refs.mybox1.style.left = 44.2+'%';
                      this.$refs.mybox1.style.top = 29.5+'%';
                      this.$refs.mybox1.style.transition='left 1s';},15100);
      this.timer49=setTimeout(()=>{this.$refs.mybox1.style.display='none';},15700);

      this.timer50=setTimeout(()=>{this.$refs.mybox2.style.display='block';
                      this.$refs.mybox2.style.left = 44.2+'%';
                      this.$refs.mybox2.style.top = 34+'%';},13700);
      this.timer51=setTimeout(()=>{this.$refs.mybox2.style.left = 32.2+'%';
                      this.$refs.mybox2.style.top = 34+'%';
                      this.$refs.mybox2.style.transition='left 1s';},13900);
      this.timer52=setTimeout(()=>{this.$refs.mybox2.style.left = 44.2+'%';
                      this.$refs.mybox2.style.top = 34+'%';
                      this.$refs.mybox2.style.transition='left 1s';},14500);
      this.timer53=setTimeout(()=>{this.$refs.mybox2.style.left = 32.2+'%';
                      this.$refs.mybox2.style.top = 34+'%';
                      this.$refs.mybox2.style.transition='left 1s';},15100);
      this.timer54=setTimeout(()=>{this.$refs.mybox2.style.display='none';},15700);

      this.timer55=setTimeout(()=>{this.$refs.mybox3.style.display='block';
                      this.$refs.mybox3.style.left = 32.2+'%';
                      this.$refs.mybox3.style.top = 60+'%';},13700);
      this.timer56=setTimeout(()=>{this.$refs.mybox3.style.left = 44.2+'%';
                      this.$refs.mybox3.style.top = 60+'%';
                      this.$refs.mybox3.style.transition='left 1s';},13900);
      this.timer57=setTimeout(()=>{this.$refs.mybox3.style.left = 32.2+'%';
                      this.$refs.mybox3.style.top = 60+'%';
                      this.$refs.mybox3.style.transition='left 1s';},14500);
      this.timer58=setTimeout(()=>{this.$refs.mybox3.style.left = 44.2+'%';
                      this.$refs.mybox3.style.top = 60+'%';
                      this.$refs.mybox3.style.transition='left 1s';},15100);
      this.timer59=setTimeout(()=>{this.$refs.mybox3.style.display='none';},15700);

      this.timer60=setTimeout(()=>{this.$refs.mybox4.style.display='block';
                      this.$refs.mybox4.style.left = 44.2+'%';
                      this.$refs.mybox4.style.top = 64.5+'%';},13700);
      this.timer61=setTimeout(()=>{this.$refs.mybox4.style.left = 32.2+'%';
                      this.$refs.mybox4.style.top = 64.5+'%';
                      this.$refs.mybox4.style.transition='left 1s';},13900);
      this.timer62=setTimeout(()=>{this.$refs.mybox4.style.left = 44.2+'%';
                      this.$refs.mybox4.style.top = 64.5+'%';
                      this.$refs.mybox4.style.transition='left 1s';},14500);
      this.timer63=setTimeout(()=>{this.$refs.mybox4.style.left = 32.2+'%';
                      this.$refs.mybox4.style.top = 64.5+'%';
                      this.$refs.mybox4.style.transition='left 1s';},15100);
      this.timer64=setTimeout(()=>{this.$refs.mybox4.style.display='none';},15700);

      this.timer65=setTimeout(()=>{this.$refs.rtrans.style.transform ='scale(1.05,1.05)';
                      this.$refs.rtrans.style.transition='transform 1s';},13500);
      this.timer66=setTimeout(()=>{this.$refs.rtrans.style.transform ='scale(1,1)';
                      this.$refs.rtrans.style.transition='transform 1s';},15700);


      this.timer67=setTimeout(()=>{this.$refs.mybox.style.left = 27+'%';
                      this.$refs.mybox.style.top = 75+'%';
                      this.$refs.mybox.style.display='block';},16300);
      this.timer68=setTimeout(()=>{this.$refs.mybox.style.left = 7.2+'%';
                      this.$refs.mybox.style.top = 75+'%';
                      this.$refs.mybox.style.transition='left 1s';},16500);
      this.timer69=setTimeout(()=>{this.$refs.mybox.style.left = 7.2+'%';
                      this.$refs.mybox.style.top = 62+'%';
                      this.$refs.mybox.style.transition='top 1s';},17500);
      this.timer70=setTimeout(()=>{this.$refs.mybox.style.display='none';},18500);

      this.timer71=setTimeout(()=>{this.$refs.rimg.style.transform ='scale(1.1,1.1)';
                      this.$refs.rimg.style.transition='transform 0.5s';},18500);
      this.timer72=setTimeout(()=>{this.$refs.rimg.style.transform ='scale(1,1)';
                      this.$refs.rimg.style.transition='transform 0.5s';},19000);
      this.timer73=setTimeout(()=>{this.$refs.mybox.style.display='block';
                      this.$refs.mybox.style.left = 7.2+'%';
                      this.$refs.mybox.style.top = 32+'%';},19500);
    },
    // 改变侧边导航栏高亮方法
    change(e){
      let alist = document.querySelectorAll(".agu");
      for( let i=0;i<alist.length;i++){
        alist[i].style.color='#8a8a8a';
      }
      e.target.style.color='#2b78e0';
      this.active=e.target.name;
    },
    // 下一步
    next(){
      this.active++;
      let alist = document.querySelectorAll(".agu");
      for( let i=0;i<alist.length;i++){
        alist[i].style.color='#8a8a8a';
        if(alist[i].name==this.active){
          alist[i].style.color='#2b78e0';
        }
      }
    },
    // 上一步
    pre(){
      this.active--;
      let alist = document.querySelectorAll(".agu");
      for( let i=0;i<alist.length;i++){
        alist[i].style.color='#8a8a8a';
        if(alist[i].name==this.active){
          alist[i].style.color='#2b78e0';
        }
      }
    },
    // 确定
    confirm(){
      this.dialogVisible=false;
      window.clearInterval(timer);
    },
    //打开新手指导的方法
    openguid(){
      this.dialogVisible=true;
      clearInterval(this.timer);
      setTimeout(()=>{this.animat();},500);
    },

    closeGuide(){
      console.log(this.timer);
      clearInterval(this.timer);
      this.cleantimer();

    },

    cleantimer(){
      clearTimeout(this.timer1);clearTimeout(this.timer2);clearTimeout(this.timer3);clearTimeout(this.timer4);
      clearTimeout(this.timer5);clearTimeout(this.timer6);clearTimeout(this.timer7);clearTimeout(this.timer8);
      clearTimeout(this.timer9);clearTimeout(this.timer10);clearTimeout(this.timer11);clearTimeout(this.timer12);
      clearTimeout(this.timer13);clearTimeout(this.timer14);clearTimeout(this.timer15);clearTimeout(this.timer16);
      clearTimeout(this.timer17);clearTimeout(this.timer18);clearTimeout(this.timer19);clearTimeout(this.timer20);
      clearTimeout(this.timer21);clearTimeout(this.timer22);clearTimeout(this.timer23);clearTimeout(this.timer24);
      clearTimeout(this.timer25);clearTimeout(this.timer26);clearTimeout(this.timer27);clearTimeout(this.timer28);
      clearTimeout(this.timer29);clearTimeout(this.timer30);clearTimeout(this.timer31);clearTimeout(this.timer32);
      clearTimeout(this.timer33);clearTimeout(this.timer34);clearTimeout(this.timer35);clearTimeout(this.timer36);
      clearTimeout(this.timer37);clearTimeout(this.timer38);clearTimeout(this.timer39);clearTimeout(this.timer40);
      clearTimeout(this.timer41);clearTimeout(this.timer42);clearTimeout(this.timer43);clearTimeout(this.timer44);
      clearTimeout(this.timer45);clearTimeout(this.timer46);clearTimeout(this.timer47);clearTimeout(this.timer48);
      clearTimeout(this.timer49);clearTimeout(this.timer50);clearTimeout(this.timer51);clearTimeout(this.timer52);
      clearTimeout(this.timer53);clearTimeout(this.timer54);clearTimeout(this.timer55);clearTimeout(this.timer56);
      clearTimeout(this.timer57);clearTimeout(this.timer58);clearTimeout(this.timer59);clearTimeout(this.timer60);
      clearTimeout(this.timer61);clearTimeout(this.timer62);clearTimeout(this.timer63);clearTimeout(this.timer64);
      clearTimeout(this.timer65);clearTimeout(this.timer66);clearTimeout(this.timer67);clearTimeout(this.timer68);
      clearTimeout(this.timer69);clearTimeout(this.timer70);clearTimeout(this.timer71);clearTimeout(this.timer72);
      clearTimeout(this.timer73);
      this.$nextTick( ()=> {
        this.$refs.mybox.style.left = 7.2+'%';
        this.$refs.mybox.style.top = 32+'%';
        this.$refs.mybox.style.display = 'block';
        this.$refs.mybox.style.transition='top 1s';
        this.$refs.mybox1.style.left = 32.2+'%';
        this.$refs.mybox1.style.top = 29.5+'%';
        this.$refs.mybox1.style.display = 'none';
        this.$refs.mybox2.style.left = 44.2+'%';
        this.$refs.mybox2.style.top = 34+'%';
        this.$refs.mybox2.style.display = 'none';
        this.$refs.mybox3.style.left = 32.2+'%';
        this.$refs.mybox3.style.top = 60+'%';
        this.$refs.mybox3.style.display = 'none';
        this.$refs.mybox4.style.left = 44.2+'%';
        this.$refs.mybox4.style.top = 64.5+'%';
        this.$refs.mybox4.style.display = 'none';
      })
    },

  },
}
</script>

<style lang="scss" scoped>
  .mainguide{
    height: 600px;
    >div{
      float: left;
    }
    .guleft{
      width: 25%;
      height: 540px;
      border-bottom: 1px solid #eceeef;
      color: #8a8a8a;
      >div{
        margin: 60px 40px;
        a{
          font-size: 14px;
          color: #8a8a8a;
          line-height: 35px;
        }
        a:hover{
          color: #2b78e0;
        }
        i{
          font-size: 18px;
          vertical-align: middle;
          margin-right: 5px;
        }
        p{
          margin-bottom: 10px;
        }
      }
    }
    .guright{
      width: 75%;
      height: 540px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #eceeef;
      >div>p{
        color: #8a8a8a;
        padding: 10px 30px 20px;
        text-align: center;
      }
      >div>div{
        height: 450px;
        >div{
          width: 783px;
          height: 450px;
          margin: 0 auto;
          background: url(../../assets/img/flow-guide-image.png) no-repeat left top;
          background-size:100%;
          background-color: #fff;
          position: relative;
          .img{
            position: absolute;
            top: 40%;
            left: 3.5%;
          }
          .trans{
            width: 22%;
            height: 300px;
            background-color: rgba(74,144,226,0.1);
            border: 2px #98c7ff solid;
            position: absolute;
            top: 14%;
            left: 27.5%;
          }
          .profile{
            width: 8%;
            height: 63px;
            background-color: rgba(74,144,226,0.1);
            border: 2px #98c7ff solid;
            position: absolute;
            top: 40%;
            left: 62%;
          }
          .use{
            width: 8%;
            height: 63px;
            background-color: rgba(74,144,226,0.1);
            border: 2px #98c7ff solid;
            position: absolute;
            top: 40%;
            left: 86%;
          }
          .red{
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: #fc7e32;
            position: absolute;
          }
          .start{
            left: 7.2%;top:32%;
            transition:left 1s;
            transition:top 1s;
          }
          .run1{
            left: 32.2%;top:29.5%;
            display: none;
          }
          .run2{
            left: 44.2%;top:34%;
            display: none;
          }
          .run3{
            left: 32.2%;top:60%;
            display: none;
          }
          .run4{
            left: 44.2%;top:64.5%;
            display: none;
          }
        }
      }
    }
    .gufooter{
      width: 100%;
      height: 60px;
      .step{
        font-size: 12px;
        padding: 10px 25px;
        float: right;
        margin-top: 11px;
        margin-right: 10px;
      }
      .step:hover{
        border-color: #2b78e0;
        color: #2b78e0;
      }
      .confirm{
        font-size: 12px;
        padding: 10px 25px;
        float: right;
        margin-top: 11px;
        margin-right: 10px;
        background-color: #2b78e0;
        color: #fff;
      }
    }
  }
</style>

<style lang="scss">
  .plugu{
    .el-dialog__header{
      border-bottom: 1px solid #eceeef;
    }
    .el-dialog__body{
      padding: 0px;
    }
  }
</style>
