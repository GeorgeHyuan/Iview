import {
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user';
import { setToken, getToken } from '@/libs/util';

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      sessionStorage.setItem('avatarImgPath', avatarPath);
      state.avatarImgPath = avatarPath;
    },
    setUserId (state, id) {
      sessionStorage.setItem('userId', id);
      state.userId = id;
    },
    setUserName (state, name) {
      sessionStorage.setItem('userName', name);
      state.userName = name;
    },
    setAccess (state, access) {
      sessionStorage.setItem('access', access);
      state.access = access;
    },
    setToken (state, token) {
      state.token = token;
      setToken(token);
    },
    setHasGetInfo (state, status) {
      sessionStorage.setItem('hasGetInfo', status);
      state.hasGetInfo = status;
    },
    setMessageCount (state, count) {
      state.unreadCount = count;
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list;
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list;
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list;
    },
    updateMessageContentStore (state, { msgId, content }) {
      state.messageContentStore[msgId] = content;
    },
    moveMsg (state, { from, to, msgId }) {
      const index = state[from].findIndex(_ => _.msgId === msgId);
      const msgItem = state[from].splice(index, 1)[0];
      msgItem.loading = false;
      state[to].unshift(msgItem);
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 退出登录
    handleLogOut () {
      sessionStorage.clear();
      location.href = '/web/';
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount().then(res => {
        const { data } = res;
        commit('setMessageCount', data);
      });
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unread, readed, trash } = res.data;
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)));
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false;
            return _;
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)));
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false;
            return _;
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)));
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msgId }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msgId];
        if (contentItem) {
          resolve(contentItem);
        } else {
          getContentByMsgId(msgId).then(res => {
            const content = res.data;
            commit('updateMessageContentStore', { msgId, content });
            resolve(content);
          });
        }
      });
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msgId }) {
      return new Promise((resolve, reject) => {
        hasRead(msgId).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msgId
          });
          commit('setMessageCount', state.unreadCount - 1);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msgId }) {
      return new Promise((resolve, reject) => {
        removeReaded(msgId).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msgId
          });
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msgId }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msgId).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msgId
          });
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};
