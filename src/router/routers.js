import Main from '@/components/main';

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/navigation',
    name: 'navigation',
    meta: {
      title: '导航',
      hideInMenu: true
    },
    component: () => import('@/view/navigation/navigation.vue')
  },
  // {
  //   path: '/',
  //   name: '_home',
  //   redirect: '/home',
  //   component: Main,
  //   meta: {
  //     title: '首页',
  //     icon: '_home'
  //   },
  //   children: [
  //     {
  //       path: '/home',
  //       name: 'home',
  //       meta: {
  //         // hideInMenu: true,
  //         title: '首页',
  //         // notCache: true,
  //         icon: 'md-home'
  //       },
  //       component: () => import('@/view/single-page/home')
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   name: 'system',
  //   meta: {
  //     icon: 'md-settings',
  //     title: '系统管理'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'organization',
  //       name: 'organization-list',
  //       meta: {
  //         icon: 'ios-apps',
  //         title: '组织管理'
  //       },
  //       component: () => import('@/view/organization/organization.vue'),
  //       children: [
  //         {
  //           path: 'add',
  //           name: 'organization-list-add',
  //           meta: {
  //             hideInMenu: true,
  //             title: '组织添加'
  //           },
  //           component: () => import('@/view/organization/organization.vue'),
  //           children: []
  //         },
  //         {
  //           path: 'edit',
  //           name: 'organization-list-edit',
  //           meta: {
  //             hideInMenu: true,
  //             title: '组织编辑'
  //           },
  //           component: () => import('@/view/organization/organization.vue'),
  //           children: []
  //         },
  //         {
  //           path: 'del',
  //           name: 'organization-list-del',
  //           meta: {
  //             hideInMenu: true,
  //             title: '组织删除'
  //           },
  //           component: () => import('@/view/organization/organization.vue'),
  //           children: []
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu',
  //       name: 'menu-list',
  //       meta: {
  //         icon: 'md-menu',
  //         title: '菜单管理'
  //       },
  //       component: () => import('@/view/menu/menu-list.vue'),
  //       children: [
  //         {
  //           path: 'add',
  //           name: 'menu-list-add',
  //           meta: {
  //             icon: 'md-menu',
  //             title: '添加菜单',
  //             hideInMenu: true
  //           },
  //           component: () => import('@/view/menu/menu-list.vue'),
  //           children: []
  //         },
  //         {
  //           path: 'edit',
  //           name: 'menu-list-edit',
  //           meta: {
  //             icon: 'md-menu',
  //             title: '编辑菜单',
  //             hideInMenu: true
  //           },
  //           component: () => import('@/view/menu/menu-list.vue'),
  //           children: []
  //         },
  //         {
  //           path: 'add',
  //           name: 'menu-list-edit',
  //           meta: {
  //             icon: 'md-menu',
  //             title: '删除菜单',
  //             hideInMenu: true
  //           },
  //           component: () => import('@/view/menu/menu-list.vue'),
  //           children: []
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/error_store',
    name: 'error_store',
    meta: {
      hideInBread: true,
      icon: 'ios-bug',
      title: '错误收集'
    },
    component: Main,
    children: [
      {
        path: 'error_store_page',
        name: 'error_store_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/error-store/error-store.vue')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
];
