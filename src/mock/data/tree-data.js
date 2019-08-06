export const orgaTree = [
  {
    id: 0,
    parentId: null,
    name: 'XXX网络科技公司',
    sort: 0,
    email: 'aaa@163.com',
    leader: 'aaa',
    phone: '01012345678',
    create_date: '2019-06-27 18:06:00',
    status: '0',
    children: [
      {
        id: 1,
        parentId: 0,
        name: 'XXX科技子公司1',
        sort: 1,
        email: 'bbb@163.com',
        leader: 'bbb',
        phone: '01012345678',
        create_date: '2019-06-27 18:06:00',
        status: '0',
        children: []
      },
      {
        id: 2,
        parentId: 0,
        name: 'XXX科技子公司2',
        sort: 2,
        email: 'ccc@163.com',
        leader: 'ccc',
        phone: '01011112222',
        create_date: '2019-06-27 18:06:05',
        status: '0',
        children: [
          {
            id: 21,
            parentId: 2,
            name: '产品研发部',
            sort: 1,
            email: 'cde@163.com',
            leader: 'cde',
            phone: '01012346666',
            create_date: '2019-06-27 18:06:30',
            status: '0',
            children: []
          },
          {
            id: 22,
            parentId: 2,
            name: '销售部',
            sort: 2,
            email: 'cdf@163.com',
            leader: 'cdf',
            phone: '01022223333',
            create_date: '2019-06-27 18:07:00',
            status: '0',
            children: []
          },
          {
            id: 23,
            parentId: 2,
            name: '财务部',
            sort: 3,
            email: 'cdg@163.com',
            leader: 'cdg',
            phone: '01033334444',
            create_date: '2019-06-27 18:08:00',
            status: '0',
            children: []
          },
          {
            id: 24,
            parentId: 2,
            name: '人力资源部',
            sort: 4,
            email: 'cdh@163.com',
            leader: 'cdh',
            phone: '01044445555',
            create_date: '2019-06-27 18:25:00',
            status: '0',
            children: []
          }
        ]
      },
      {
        id: 3,
        parentId: 0,
        name: 'XXX科技子公司3',
        sort: 3,
        email: 'ddd@163.com',
        leader: 'ddd',
        phone: '01012345678',
        create_date: '2019-06-27 18:06:00',
        status: '0',
        children: [
          {
            id: 31,
            parentId: 3,
            name: '销售部',
            sort: 1,
            email: 'def@163.com',
            leader: 'def',
            phone: '01012349874',
            create_date: '2019-06-27 18:12:00',
            status: '0',
            children: []
          },
          {
            id: 32,
            parentId: 3,
            name: '财务部',
            sort: 2,
            email: 'deg@163.com',
            leader: 'deg',
            phone: '01098765678',
            create_date: '2019-06-27 18:15:00',
            status: '0',
            children: []
          }
        ]
      }
    ]
  }
];

export const menuTree = [
  {
    menupath: '/', // 菜单链接
    routername: '_home', // 路由名
    menuicon: '_home', // 菜单图标
    menuname: '首页', // 菜单名称
    menuCode: '10', // 菜单ID
    parentCode: '0', // 上级菜单ID
    target: 'components/main', // 前段文件地址
    isShow: '0', // 是否显示在左侧菜单
    menutype: '1', // 菜单类型
    sort: '1', // 菜单排序
    menuStatus: '0', // 菜单状态
    children: [
      {
        menupath: '/home',
        routername: 'home',
        menuicon: '',
        menuname: '首页',
        menuCode: '101',
        parentCode: '10',
        parentName: '首页',
        treeCodes: '0,10,101,',
        target: 'view/single-page/home',
        isShow: '0',
        menutype: '1',
        sort: '1',
        menuStatus: '0',
        children: []
      }
    ]
  },
  {
    menupath: '/system',
    routername: 'system',
    menuicon: '_settings--fill',
    menuname: '系统管理',
    menuCode: '11',
    parentCode: '0',
    parentName: '',
    treeCodes: '0,11,',
    target: 'components/main',
    isShow: '0',
    menutype: '1',
    sort: '1',
    menuStatus: '0',
    children: [
      {
        menupath: 'organization',
        routername: 'organization-list',
        menuicon: '',
        menuname: '组织管理',
        menuCode: '110',
        parentCode: '11',
        parentName: '系统管理',
        treeCodes: '0,11,110,',
        target: 'view/admin/organization/organization.vue',
        isShow: '0',
        menutype: '1',
        sort: '10',
        menuStatus: '0',
        children: [
          {
            menupath: 'org/query',
            routername: 'organization-list-query',
            menuicon: '',
            menuname: '组织查询',
            menuCode: '1100',
            parentCode: '110',
            parentName: '组织管理',
            treeCodes: '0,11,110,1100',
            target: 'view/admin/organization/organization.vue',
            isShow: '1',
            menutype: '2',
            sort: '100',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'org/add',
            routername: 'organization-list-add',
            menuicon: '',
            menuname: '组织添加',
            menuCode: '1101',
            parentCode: '110',
            parentName: '组织管理',
            treeCodes: '0,11,110,1101',
            target: 'view/admin/organization/organization.vue',
            isShow: '1',
            menutype: '2',
            sort: '101',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'org/edit',
            routername: 'organization-list-edit',
            menuicon: '',
            menuname: '组织编辑',
            menuCode: '1102',
            parentCode: '110',
            parentName: '组织管理',
            treeCodes: '0,11,110,1102',
            target: 'view/admin/organization/organization.vue',
            isShow: '1',
            menutype: '2',
            sort: '102',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'org/del',
            routername: 'organization-list-del',
            menuicon: '',
            menuname: '组织删除',
            menuCode: '1103',
            parentCode: '110',
            parentName: '组织管理',
            treeCodes: '0,11,110,1103',
            target: 'view/admin/organization/organization.vue',
            isShow: '1',
            menutype: '2',
            sort: '103',
            menuStatus: '0',
            children: []
          }
        ]
      },
      {
        menupath: 'menu',
        routername: 'menu-list',
        menuicon: '',
        menuname: '菜单管理',
        menuCode: '120',
        parentCode: '11',
        parentName: '系统管理',
        treeCodes: '0,11,120,',
        target: 'view/admin/menu/menu-list.vue',
        isShow: '0',
        menutype: '1',
        sort: '11',
        menuStatus: '0',
        children: [
          {
            menupath: 'menu/query',
            routername: 'menu-list-query',
            menuicon: '',
            menuname: '查询菜单',
            menuCode: '1200',
            parentCode: '120',
            parentName: '菜单管理',
            treeCodes: '0,11,120,1200,',
            target: 'view/admin/menu/menu-list.vue',
            isShow: '1',
            menutype: '2',
            sort: '110',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'menu/add',
            routername: 'menu-list-add',
            menuicon: '',
            menuname: '添加菜单',
            menuCode: '1201',
            parentCode: '120',
            parentName: '菜单管理',
            treeCodes: '0,11,120,1201,',
            target: 'view/admin/menu/menu-list.vue',
            isShow: '1',
            menutype: '2',
            sort: '111',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'menu/edit',
            routername: 'menu-list-edit',
            menuicon: '',
            menuname: '编辑菜单',
            menuCode: '1202',
            parentCode: '120',
            parentName: '菜单管理',
            treeCodes: '0,11,120,1202,',
            target: 'view/admin/menu/menu-list.vue',
            isShow: '1',
            sort: '112',
            menutype: '2',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'menu/del',
            routername: 'menu-list-del',
            menuicon: '',
            menuname: '删除菜单',
            menuCode: '1203',
            parentCode: '120',
            parentName: '菜单管理',
            treeCodes: '0,11,120,1203,',
            target: 'view/admin/menu/menu-list.vue',
            isShow: '1',
            sort: '113',
            menutype: '2',
            menuStatus: '0',
            children: []
          }
        ]
      },
      {
        menupath: 'user',
        routername: 'user-list',
        menuicon: '',
        menuname: '用户管理',
        menuCode: '130',
        parentCode: '11',
        parentName: '系统管理',
        treeCodes: '0,11,130,',
        target: 'view/admin/user/user-list.vue',
        isShow: '0',
        menutype: '1',
        sort: '12',
        menuStatus: '0',
        children: [
          {
            menupath: 'user/query',
            routername: 'user-list-query',
            menuicon: '',
            menuname: '查询用户',
            menuCode: '1300',
            parentCode: '130',
            parentName: '用户管理',
            treeCodes: '0,11,130,1300,',
            target: 'view/admin/user/user-list.vue',
            isShow: '1',
            menutype: '2',
            sort: '120',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'user/add',
            routername: 'user-list-add',
            menuicon: '',
            menuname: '添加用户',
            menuCode: '1301',
            parentCode: '130',
            parentName: '用户管理',
            treeCodes: '0,11,130,1301,',
            target: 'view/admin/user/user-list.vue',
            isShow: '1',
            menutype: '2',
            sort: '121',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'user/edit',
            routername: 'user-list-edit',
            menuicon: '',
            menuname: '编辑用户',
            menuCode: '1302',
            parentCode: '130',
            parentName: '用户管理',
            treeCodes: '0,11,130,1302,',
            target: 'view/admin/user/user-list.vue',
            isShow: '1',
            sort: '122',
            menutype: '2',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'user/del',
            routername: 'user-list-del',
            menuicon: '',
            menuname: '删除用户',
            menuCode: '1303',
            parentCode: '130',
            parentName: '用户管理',
            treeCodes: '0,11,130,1303,',
            target: 'view/admin/user/user-list.vue',
            isShow: '1',
            sort: '123',
            menutype: '2',
            menuStatus: '0',
            children: []
          }
        ]
      },
      {
        menupath: 'role',
        routername: 'role-list',
        menuicon: '',
        menuname: '角色管理',
        menuCode: '140',
        parentCode: '11',
        parentName: '系统管理',
        treeCodes: '0,11,140,',
        target: 'view/admin/role/role-list.vue',
        isShow: '0',
        menutype: '1',
        sort: '13',
        menuStatus: '0',
        children: [
          {
            menupath: 'role/query',
            routername: 'role-list-query',
            menuicon: '',
            menuname: '查询角色',
            menuCode: '1400',
            parentCode: '140',
            parentName: '角色管理',
            treeCodes: '0,11,140,1400,',
            target: 'view/admin/role/role-list.vue',
            isShow: '1',
            menutype: '2',
            sort: '130',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'role/add',
            routername: 'role-list-add',
            menuicon: '',
            menuname: '添加角色',
            menuCode: '1401',
            parentCode: '140',
            parentName: '角色管理',
            treeCodes: '0,11,140,1401,',
            target: 'view/admin/role/role-list.vue',
            isShow: '1',
            menutype: '2',
            sort: '131',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'role/edit',
            routername: 'role-list-edit',
            menuicon: '',
            menuname: '编辑角色',
            menuCode: '1402',
            parentCode: '140',
            parentName: '角色管理',
            treeCodes: '0,11,140,1402,',
            target: 'view/admin/role/role-list.vue',
            isShow: '1',
            menutype: '2',
            sort: '132',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'role/del',
            routername: 'role-list-del',
            menuicon: '',
            menuname: '删除角色',
            menuCode: '1403',
            parentCode: '140',
            parentName: '角色管理',
            treeCodes: '0,11,140,1403,',
            target: 'view/admin/role/role-list.vue',
            isShow: '1',
            menutype: '2',
            sort: '133',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'role/data-permission',
            routername: 'role-data-permission',
            menuicon: '',
            menuname: '数据权限',
            menuCode: '1404',
            parentCode: '140',
            parentName: '角色管理',
            treeCodes: '0,11,140,1404,',
            target: 'view/admin/role/components/role-data-permission.vue',
            isShow: '1',
            menutype: '2',
            sort: '134',
            menuStatus: '0',
            children: []
          }
        ]
      }
    ]
  },
  {
    menupath: '/multilevel',
    routername: 'multilevel',
    menuicon: 'md-menu',
    menuname: '多级菜单',
    isShow: '0',
    target: 'components/main',
    menuCode: '12',
    parentCode: '0',
    parentName: '',
    treeCodes: '0,12,',
    menutype: '1',
    sort: '2',
    menuStatus: '0',
    children: [
      {
        menupath: 'level_2_1',
        routername: 'level_2_1',
        menuicon: 'md-funnel',
        menuname: '二级-1',
        isShow: '0',
        target: 'view/multilevel/level-2-1.vue',
        menuCode: '121',
        parentCode: '12',
        parentName: '多级菜单',
        treeCodes: '0,12,121,',
        menutype: '1',
        sort: '21',
        menuStatus: '0',
        children: []
      },
      {
        menupath: 'level_2_2',
        routername: 'level_2_2',
        menuicon: 'md-funnel',
        menuname: '二级-2',
        isShow: '0',
        target: 'components/main',
        menuCode: '122',
        parentCode: '12',
        parentName: '多级菜单',
        treeCodes: '0,12,122,',
        menutype: '1',
        sort: '22',
        menuStatus: '0',
        children: [
          {
            menupath: 'level_2_2/level_2_2_1',
            routername: 'level_2_2_1',
            menuicon: 'md-funnel',
            menuname: '三级',
            isShow: '0',
            target: 'view/multilevel/level-2-2/level-2-2-1.vue',
            menuCode: '1221',
            parentCode: '122',
            parentName: '二级-2',
            treeCodes: '0,12,122,1221,',
            menutype: '1',
            sort: '221',
            menuStatus: '0',
            children: []
          },
          {
            menupath: 'level_2_2/level_2_2_2',
            routername: 'level_2_2_2',
            menuicon: 'md-funnel',
            menuname: '三级',
            isShow: '0',
            target: 'view/multilevel/level-2-2/level-2-2-2.vue',
            menuCode: '1222',
            parentCode: '122',
            parentName: '二级-2',
            treeCodes: '0,12,122,1222,',
            menutype: '1',
            sort: '222',
            menuStatus: '0',
            children: []
          }
        ]
      },
      {
        menupath: 'level_2_3',
        routername: 'level_2_3',
        menuicon: 'md-funnel',
        menuname: '二级-3',
        isShow: '0',
        target: 'view/multilevel/level-2-3.vue',
        menuCode: '123',
        parentCode: '12',
        parentName: '多级菜单',
        treeCodes: '0,12,123,',
        menutype: '1',
        sort: '23',
        menuStatus: '0',
        children: []
      }
    ]
  }
];