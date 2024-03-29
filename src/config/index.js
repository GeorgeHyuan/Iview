export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '微服务开发平台',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: new Date(new Date().getTime() + 180 * 60 * 1000),
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://192.168.2.70:6001/api/v1',
    pro: 'http://192.168.2.70:6001/api/v1'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },
  /**
   * @description 可用的main样式，主题列表
   */
  targetList: ['components/main', 'components/main/index2.js'],
  /**
   * @description 默认主题
   */
  defaultTheme: '主题A',
  /**
   * @description 强制退出登录错误码集合
   */
  errorCodeList: ['10004', '10005', '10006'],
  /**
   * @description header-bar区域标题
   */
  headerBarTitle: '南京智行微服务平台'
};
