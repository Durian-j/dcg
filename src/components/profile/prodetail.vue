<template lang="html">
  <div class="product">
    <div class="productnav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/main/profile/online' }">产品列表</el-breadcrumb-item>
        <el-breadcrumb-item>产品详情</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- <div class="optionbutton">
        <div class="">
          <a href="#"><i class="iconfont icon-xiaolian"></i>显示小助手</a>
        </div>
        <div class="">
          <a href="#"><i class="iconfont icon-daochu"></i>导出该产品Profile</a>
        </div>
      </div> -->

    </div>
    <div class="productbody">
      <profiledetail></profiledetail>
    </div>
  </div>
</template>

<script>
import profiledetail from "../public/profiledetail.vue";
export default {
  data(){
    return{

    }
  },
  // 调用public组件
  components: {
    'profiledetail': profiledetail
  },
}
</script>

<style lang="scss" scoped>
  .productnav{
    height: 28px;
    border-bottom: 1px solid #f2f2f2;
    padding-top: 18px;
    padding-left: 50px;
    .el-breadcrumb{
      display: inline-block;
    }
    .optionbutton{
      float: right;
      line-height: 12px;
      div{
        float: left;
        margin-right: 20px;
        a{
          color: #000;
          font-weight: 500;
          i{
            color: #000;
            vertical-align: top;
            margin-right: 8px;
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
  .productbody{
    padding: 26px;
  }
</style>
