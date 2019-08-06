<template>
  <div>
    <img class="login-code" src="../../assets/images/code.png" />
    <p class="login-tip">扫一扫登录</p>
  </div>
</template>
<script>
export default {
  name: 'LoginForm',
  data () {
    return {};
  },
  computed: {},
  methods: {}
};
</script>

<style scoped>
  .login-code {
    display: block;
    width: 145px;
    margin: 10px auto 30px auto;
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #999;
  }
</style>
