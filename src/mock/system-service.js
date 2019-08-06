import { orgaTree, menuTree } from './data/tree-data';
import { userList, roleList, roleMenu } from './data/system-list';

export const getDeptTree = req => {
  return orgaTree;
};

export const getMenuTree = req => {
  return menuTree;
};

export const getUserList = req => {
  return userList;
};

export const getRoleList = req => {
  return roleList;
};

export const getRoleMenu = req => {
  return roleMenu;
};

export const updateRoleMenu = req => {
  return Promise.resolve();
};

export const insertNewDept = req => {
  return Promise.resolve();
};

export const updateDeptInfo = req => {
  return Promise.resolve();
};

export const deleteDeptInfo = req => {
  return Promise.resolve();
};

export const insertNewMenu = req => {
  return Promise.resolve();
};

export const updateMenuInfo = req => {
  return Promise.resolve();
};

export const deleteMenuInfo = req => {
  return Promise.resolve();
};
