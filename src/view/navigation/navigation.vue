<!--
  登录后进入的导航页，
  各子系统入口
  Created by xby on 2019/07/09
-->
<style lang="less">
  @import "./style/navigation.less";
</style>

<template>
  <div class="navContainer">
    <div class="navContainer-content">
      <Card
        class="navContainer-content-card"
        v-for="(item, index) in SubSystemList"
        :key="item.id"
        @click.native="selectOneSubSystem(item)"
        :style="{
          backgroundImage:'url('+require('./images/'+item.menuicon+'.png')+')',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }"
        @mouseenter.native="menuMask[index].masking = true"
        @mouseleave.native="menuMask[index].masking = false"
      >
        <p class="navContainer-content-card-text">{{ item.menuname }}</p>
        <transition :name="'navigationTrans' + index" mode="out-in">
          <div class="navContainer-content-card-mask" :key="'navigationMask' + index" v-show="menuMask[index].masking"></div>
        </transition>
      </Card>
    </div>
  </div>
</template>

<script>
import { initRouter } from '@/libs/util';
import router from '@/router';
import store from '@/store';
export default {
  name: 'navigation-page',
  data () {
    return {
      SubSystemList: [],
      menuMask: []
    };
  },
  methods: {
    // 点击一个子系统进入
    selectOneSubSystem (obj) {
      if (obj.children && obj.children.length > 0) {
        sessionStorage.setItem('menu', JSON.stringify(obj.children));
        initRouter(router, store);
        sessionStorage.setItem('subSystemID', obj.id);
        sessionStorage.setItem('subSystemName', obj.menuname);
        sessionStorage.removeItem('tagNaveList');
        this.$router.push({ name: obj.children[0].children[0].name });
      }
    },
    // 加载子系统列表
    loadSubSystemList () {
      this.$data.SubSystemList = JSON.parse(sessionStorage.getItem('originalMenu') || '[]');
      this.$data.menuMask = [];
      this.$data.SubSystemList.forEach(() => {
        this.$data.menuMask.push({ masking: false });
      });
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadSubSystemList();
    });
  }
};
</script>
