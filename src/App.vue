<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  font-size: 14px;
  margin: 0;
  padding: 0;
}
#app {
  .size;
  font-size: 14px;
  color: #646464;
}
.ivu-card{
  -moz-box-shadow:0 0 10px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow:0 0 10px 0 rgba(0, 0, 0, 0.1);
  box-shadow:0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
