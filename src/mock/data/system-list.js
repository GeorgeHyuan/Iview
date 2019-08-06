export const userList = {
  result: [
    {
      loginID: 'super_admin',
      user_id: '1',
      userName: '超级管理员',
      phone: '13412345678',
      email: 'aaa@163.com',
      employee: {
        officeCode: '0',
        officeName: 'XXX网络科技公司'
      },
      role: ['0', '1'],
      create_date: '2019-06-29 11:50:30',
      status: '0',
      remarks: 'aaa',
      avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
    },
    {
      loginID: 'admin',
      user_id: '2',
      userName: '管理员',
      phone: '15898765432',
      email: 'bbb@163.com',
      employee: {
        officeCode: '0',
        officeName: 'XXX网络科技公司'
      },
      role: ['0', '1'],
      create_date: '2019-06-29 11:50:30',
      status: '0',
      remarks: 'aaabbb',
      avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
    },
    {
      loginID: 'test01',
      user_id: '3',
      userName: '测试01',
      phone: '15975395125',
      email: 'ccc@163.com',
      employee: {
        officeCode: '0',
        officeName: 'XXX网络科技公司'
      },
      role: ['2'],
      create_date: '2019-06-29 11:50:30',
      status: '0',
      remarks: 'aaabbbccc',
      avatar: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
    },
    {
      loginID: 'test02',
      user_id: '4',
      userName: '测试02',
      phone: '18754684562',
      email: 'ddd@163.com',
      employee: {
        officeCode: '0',
        officeName: 'XXX网络科技公司'
      },
      role: ['2'],
      create_date: '2019-06-29 11:50:30',
      status: '0',
      remarks: 'aaabbbcccddd',
      avatar: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
    }
  ],
  total: 4
};

export const roleList = [
  {
    roleCode: '0',
    roleName: '超级系统管理员',
    roleStatus: '0',
    create_date: '2019-06-30 20:34:00'
  },
  {
    roleCode: '1',
    roleName: '管理员',
    roleStatus: '0',
    create_date: '2019-06-30 20:34:00'
  },
  {
    roleCode: '2',
    roleName: '测试',
    roleStatus: '0',
    create_date: '2019-06-30 20:34:00'
  }
];

export const roleMenu = [
  {
    menuHref: '/system',
    routerName: 'system',
    menuIcon: 'md-settings',
    menuName: '系统管理',
    menuCode: '11',
    parentCode: '0',
    parentName: '',
    treeCodes: '0,11,',
    target: 'components/main',
    isShow: '0',
    menuType: '0',
    sort: '1'
  },
  {
    menuHref: 'organization',
    routerName: 'organization-list',
    menuIcon: 'ios-apps',
    menuName: '组织管理',
    menuCode: '110',
    parentCode: '11',
    parentName: '系统管理',
    treeCodes: '0,11,110,',
    target: 'view/organization/organization.vue',
    isShow: '0',
    menuType: '1',
    sort: '10'
  },
  {
    menuHref: 'org/query',
    routerName: 'organization-list-query',
    menuIcon: 'ios-apps',
    menuName: '组织查询',
    menuCode: '1100',
    parentCode: '110',
    parentName: '组织管理',
    treeCodes: '0,11,110,1100',
    target: 'view/organization/organization.vue',
    isShow: '1',
    menuType: '2',
    sort: '100'
  },
  {
    menuHref: 'role',
    routerName: 'role-list',
    menuIcon: 'md-open',
    menuName: '角色管理',
    menuCode: '140',
    parentCode: '11',
    parentName: '系统管理',
    treeCodes: '0,11,140,',
    target: 'view/role/role-list.vue',
    isShow: '0',
    menuType: '1',
    sort: '13'
  },
  {
    menuHref: 'role/query',
    routerName: 'role-list-query',
    menuIcon: 'md-open',
    menuName: '查询角色',
    menuCode: '1400',
    parentCode: '140',
    parentName: '角色管理',
    treeCodes: '0,11,140,1400,',
    target: 'view/role/role-list.vue',
    isShow: '1',
    menuType: '2',
    sort: '130'
  },
  {
    menuHref: 'role/data-permission',
    routerName: 'role-data-permission',
    menuIcon: 'md-open',
    menuName: '数据权限',
    menuCode: '1404',
    parentCode: '140',
    parentName: '角色管理',
    treeCodes: '0,11,140,1404,',
    target: 'view/role/components/role-data-permission.vue',
    isShow: '1',
    menuType: '2',
    sort: '134'
  }
];
