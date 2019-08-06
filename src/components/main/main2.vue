<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :message-unread-count="unreadCount" :user-avatar="userAvatar"/>
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu';
import HeaderBar from './components/header-bar';
import TagsNav from './components/tags-nav';
import User from './components/user';
import ABackTop from './components/a-back-top';
import Language from './components/language';
import Fullscreen from './components/fullscreen';
import ErrorStore from './components/error-store';
import ThemeChange from './components/theme-change/theme-change';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { getNewTagList, routeEqual, changeMainFileInRouter } from '@/libs/util';
import routers from '@/router/routers';
import minLogo from '@/assets/images/logo-min.jpg';
import maxLogo from '@/assets/images/logo.jpg';
import './main.less';

export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    ThemeChange,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      themeValue: '主题B'
    };
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList;
    },
    tagRouter () {
      return this.$store.state.app.tagRouter;
    },
    userAvatar () {
      return sessionStorage.avatarImgPath;
    },
    cacheList () {
      return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []];
    },
    menuList () {
      return this.$store.state.app.menuList;
    },
    local () {
      return this.$store.state.app.local;
    },
    hasReadErrorPage () {
      return this.$store.state.app.hasReadErrorPage;
    },
    unreadCount () {
      return this.$store.state.user.unreadCount;
    }
  },
  methods: {
    ...mapMutations([
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions([
      'handleLogin',
      'getUnreadMessageCount'
    ]),
    turnToPage (route) {
      console.log(route);
      let { name, params, query } = {};
      if (typeof route === 'string') name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    },
    handleCollapsedChange (state) {
      this.collapsed = state;
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$store.state.app.HomeName);
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    },
    handleClick (item) {
      this.turnToPage(item);
    },
    changeTheme (name) {
      changeMainFileInRouter('components/main/index2.js', name, this);
    },
    initMethods () {
      /**
           * @description 初始化设置面包屑导航和标签导航
           */
      this.setTagNavList();
      this.setHomeRoute(routers);
      const { name, params, query, meta } = this.$route;
      this.addTag({
        route: { name, params, query, meta }
      });
      // 设置初始语言
      this.setLocal(this.$i18n.locale);
      // 如果当前打开页面不在标签栏中，跳到homeName页
      if (!this.tagNavList.find(item => item.name === this.$route.name)) {
        this.$router.push({
          name: this.$store.state.app.HomeName
        });
      }
      // 获取未读消息条数
      this.getUnreadMessageCount();
    }
  },
  watch: {
    '$route' (newRoute, oldRoute) {
      if (newRoute.name.split('-')[0] !== oldRoute.name.split('-')[0]) {
        this.initMethods();
      } else {
        const { name, query, params, meta } = newRoute;
        this.addTag({
          route: { name, query, params, meta },
          type: 'push'
        });
        this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
        this.$refs.sideMenu.updateOpenName(newRoute.name);
      }
    }
  },
  mounted () {
    this.initMethods();
  }
};
</script>
