<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  #app {
    font-family: 'Microsoft Yahei', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }
  html,body{
    margin: 0px;
    padding: 0px;
    height: 100%;
    font-size: 14px;
  }
  h1,p,h2,h3,h4,h5,h6{
    margin: 0px;
    padding: 0px;
  }
  a{
    text-decoration: none;
  }
  ul,li{
    list-style: none;
  }
  input{
    outline: none;
  }
  .el-loading-mask{
    z-index: 9999!important;
  }
  @import '~@/assets/icon/iconfont.css'
</style>
