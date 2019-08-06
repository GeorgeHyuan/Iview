import Vue from 'vue';
import Router from 'vue-router';
import routes from './routers';
import store from '@/store';
import iView from 'iview';
import { canTurnTo, setTitle, initRouter, backendMenusToRouters, processRouterTree } from '@/libs/util';
// import config from '@/config';
// const { homeName } = config;
const newRoutes = backendMenusToRouters(processRouterTree(JSON.parse(sessionStorage.getItem('menu') || '[]')));
Vue.use(Router);
const router = new Router({
  base: '/web/',
  routes: routes.concat(newRoutes),
  mode: 'history'
});
const LOGIN_PAGE_NAME = 'login';

const turnTo = (to, access, next) => {
  let pushFlag = false;
  for (let i in routes) {
    if (JSON.parse(sessionStorage.getItem('menu'))) {
      if (routes[i].name === JSON.parse(sessionStorage.getItem('menu'))[0].name) {
        routes[i] = JSON.parse(sessionStorage.getItem('menu'))[0];
        pushFlag = true;
      }
    }
  }
  if (!pushFlag) {
    routes.push(...JSON.parse(sessionStorage.getItem('menu') || '[]'));
  }
  if (canTurnTo(to.name, access, routes)) next(); // 有权限，可访问
  else next({ replace: true, name: 'error_401' }); // 无权限，重定向到401页面
};

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const token = sessionStorage.getItem('access_token');
  const menu = JSON.parse(sessionStorage.getItem('menu') || '[]');
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    });
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next(); // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: menu.length > 0 ? menu[0].children[0].name : 'navigation' // 跳转到homeName页
    });
  } else {
    if (!store.state.app.hasGetRouter) {
      initRouter(router, store);
    }
    if (sessionStorage.hasGetInfo) {
      turnTo(to, sessionStorage.access, next);
    } else {
      store.dispatch('handleLogOut');
    }
  }
});

router.afterEach(to => {
  setTitle(to, router.app);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
  sessionStorage.setItem('currentPage', to.name);
  sessionStorage.setItem('currentPageParams', JSON.stringify(to.params));
  sessionStorage.setItem('currentPageQuery', JSON.stringify(to.query));
});

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    alert('路由加载失败，页面将重新加载');
    location.reload();
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error);
  }
});

export default router;
