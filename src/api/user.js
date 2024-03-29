import axios from '@/libs/api.request';

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  });
};

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  });
};

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  });
};

export const getContentByMsgId = msgId => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msgId
    }
  });
};

export const hasRead = msgId => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msgId
    }
  });
};

export const removeReaded = msgId => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msgId
    }
  });
};

export const restoreTrash = msgId => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msgId
    }
  });
};
