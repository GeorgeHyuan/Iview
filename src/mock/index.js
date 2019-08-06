import Mock from 'mockjs';
import { login, logout, getUserInfo } from './login';
import { uploadImage } from './data';
import { getMessageInit, getContentByMsgId, hasRead, removeReaded, restoreTrash, messageCount } from './user';
import {
  getDeptTree,
  getMenuTree,
  getUserList,
  getRoleList,
  getRoleMenu,
  updateRoleMenu,
  insertNewDept,
  updateDeptInfo,
  deleteDeptInfo,
  insertNewMenu,
  updateMenuInfo,
  deleteMenuInfo
} from './system-service';

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 100
});

// 登录相关和获取用户信息
Mock.mock(/\/login/, login);
Mock.mock(/\/get_info/, getUserInfo);
Mock.mock(/\/logout/, logout);
Mock.mock(/\/save_error_logger/, 'success');
Mock.mock(/\/image\/upload/, uploadImage);
Mock.mock(/\/message\/init/, getMessageInit);
Mock.mock(/\/message\/content/, getContentByMsgId);
Mock.mock(/\/message\/has_read/, hasRead);
Mock.mock(/\/message\/remove_readed/, removeReaded);
Mock.mock(/\/message\/restore/, restoreTrash);
Mock.mock(/\/message\/count/, messageCount);
Mock.mock(/\/getDeptTree/, getDeptTree);
Mock.mock(/\/dept\/insert/, insertNewDept);
Mock.mock(/\/dept\/update/, updateDeptInfo);
Mock.mock(/\/dept\/delete/, deleteDeptInfo);
Mock.mock(/\/getMenuTree/, getMenuTree);
Mock.mock(/\/menu\/insert/, insertNewMenu);
Mock.mock(/\/menu\/update/, updateMenuInfo);
Mock.mock(/\/menu\/delete/, deleteMenuInfo);
Mock.mock(/\/getRoleList/, getRoleList);
Mock.mock(/\/role\/insert/, insertNewMenu);
Mock.mock(/\/role\/update/, updateMenuInfo);
Mock.mock(/\/role\/delete/, deleteMenuInfo);
Mock.mock(/\/getRoleMenu/, getRoleMenu);
Mock.mock(/\/updateRoleMenu/, updateRoleMenu);
Mock.mock(/\/getUserList/, getUserList);
Mock.mock(/\/user\/insert/, insertNewMenu);
Mock.mock(/\/user\/update/, insertNewMenu);
Mock.mock(/\/user\/delete/, insertNewMenu);
Mock.mock(/\/user\/status/, insertNewMenu);
Mock.mock(/\/user\/assignRole/, insertNewMenu);
Mock.mock(/\/user\/password\/reset/, insertNewMenu);

export default Mock;
