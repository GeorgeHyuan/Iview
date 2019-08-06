<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
    <p class="headerTitleA" v-if="theme === '主题A'" :title="$config.headerBarTitle">{{ $config.headerBarTitle }}</p>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger';
import customBreadCrumb from './custom-bread-crumb';
import './header-bar.less';
export default {
  name: 'HeaderBar',
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean,
    theme: String
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state);
    }
  }
};
</script>
