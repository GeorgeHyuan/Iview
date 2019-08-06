<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <div class="login-con-title">
        <span>欢迎使用微服务平台</span>
      </div>
      <div class="login-con-from">
        <div class="login-from">
          <Card icon="log-in" :bordered="false" dis-hover>
            <div class="login-tit">
              <span @click="componentName('LoginForm')">账号登录</span>
            </div>
            <div class="form-con">
              <component :is="currentTab" :Loading="submitLoading" @on-success-valid="handleSubmit"></component>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form';
import LoginCode from '_c/login-code';
import axios from '@/libs/api.request';
import { processMenuTree } from '@/libs/util';
import jwtDecode from 'jwt-decode';

export default {
  name: 'login',
  components: {
    // 声明子组件
    LoginForm,
    LoginCode
  },
  data () {
    return {
      currentTab: 'LoginForm',
      submitLoading: false,
      MenuData: []
    };
  },
  methods: {
    componentName (tab) {
      this.currentTab = tab; // tab 为当前触发标签页的组件名
    },
    // 点击提交
    handleSubmit (obj) {
      this.$data.submitLoading = true;
      axios.request({
        url: '/sso/user/login',
        method: 'post',
        params: {
          loginName: obj.loginName,
          password: obj.password,
          terminal: obj.terminal
        }
      }).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          sessionStorage.setItem('loginID', obj.loginName);
          sessionStorage.setItem('access_token', res.data.data.access_token);
          sessionStorage.setItem('refresh_token', res.data.data.refresh_token);
          const decodeMap = jwtDecode(res.data.data.access_token);
          this.getUserInfo(decodeMap);
        } else {
          this.$data.submitLoading = false;
          this.$Modal.error({ title: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$data.submitLoading = false;
        this.$Notice.error({ desc: '请求失败，请重试' });
      });
    },
    // 获取用户信息
    getUserInfo (decodeMap) {
      axios.request({
        url: '/core/user/authorize',
        params: {
          userId: decodeMap.uid
        },
        method: 'get'
      }).then(res => {
        // console.log(res);
        this.$data.submitLoading = false;
        if (res.data.code === 200) {
          this.$store.commit('setUserName', decodeMap.username);
          this.$store.commit('setUserId', decodeMap.uid);
          this.$store.commit('setAccess', 1);
          this.$store.commit('setHasGetInfo', true);
          sessionStorage.setItem('organizeId', res.data.data.organize.id);
          if (res.data.data.resource && res.data.data.resource[0].children.length > 0) {
            processMenuTree(res.data.data.resource[0].children);
            sessionStorage.setItem('originalMenu', JSON.stringify(res.data.data.resource[0].children));
            // sessionStorage.setItem('menu', JSON.stringify(res.data.data.resource[0].children[res.data.data.resource[0].children.length - 1].children));
            // processMenuTree(res.data.data.resource[0].children);
          }
          // sessionStorage.setItem('originalMenu', JSON.stringify(res.data.data.resource[0].children));
          // initRouter(router, store);
          this.$router.push({
            name: 'navigation'
          });
        } else {
          this.$Modal.error({ title: res.data.message });
        }
      }).catch(e => {
        console.log(e);
        this.$data.submitLoading = false;
        this.$Notice.error({ desc: '请求失败，请重试' });
      });
    }
  }
};
</script>
;
