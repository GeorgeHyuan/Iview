<!--
  链路监控页面
  Created by xby on 2019/07/16
-->

<template>
  <Card class="LinkMonitor">
    <iframe :src="iframeHref" frameborder="0" scrolling="auto" :style="iframeStyle"></iframe>
  </Card>
</template>

<script>
export default {
  name: 'admin-monitor-monitor',
  data () {
    return {
      iframeHref: null,
      iframeStyle: {
        width: '100%',
        height: (document.documentElement.clientHeight - 62 - 42 - 48 - 40) + 'px'
      }
    };
  },
  methods: {
    //
  },
  mounted () {
    console.log(this.$route);
    this.$data.iframeHref = this.$route.meta.pageHref;
  }
};
</script>
