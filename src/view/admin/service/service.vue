<!--
  链路监控页面
  Created by xby on 2019/07/16
-->

<template>
  <div class="eurekaImg">
    <img src="../../../assets/images/20190802143523.png" />
    <div>
      Eureka
      Netflix
      云端服务发现，一个基于 REST 的服务，用于定位服务，以实现云端中间层服务发现和故障转移。
    </div>
  </div>
</template>

<script>
export default {
  name: 'admin-monitor-monitor',
  data () {
    return {};
  },
  methods: {
    //
  },
  mounted () {
    console.log(this.$route);
    window.open(this.$route.meta.pageHref);
  }
};
</script>
<style scoped>
.eurekaImg {
  margin-top: 150px;
  text-align: center;
}
img {
  height: 200px;
}
</style>
