import axios from 'axios';
import store from '@/store';
// import { Spin } from 'iview'
// const addErrorLog = errorInfo => {
//   const { statusText, status, request: { responseURL } } = errorInfo;
//   let info = {
//     type: 'ajax',
//     code: status,
//     mes: statusText,
//     url: responseURL
//   };
//   if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info);
// };

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig () {
    return {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    };
  }
  destroy (url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true;
      if (config.url.indexOf('/user/login') === -1 && config.url.indexOf('monitor/noauth/') === -1) {
        config.headers['access_token'] = sessionStorage.getItem('access_token'); // 向headers中传token
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });
    // 响应拦截
    instance.interceptors.response.use(res => {
      const { data, status } = res;
      const _that = this;
      if (res.data.code === 10002) {
        // token过期，请求刷新token接口
        return _that.request({
          url: '/sso/noauth/token/refreshToken',
          params: {
            refresh_token: sessionStorage.getItem('refresh_token')
          },
          method: 'post'
        }, true, {
          headers: {
            access_token: sessionStorage.getItem('access_token')
          }
        }).then(result => {
          if (result.data.code === 200) {
            sessionStorage.setItem('access_token', result.data.data.access_token);
            sessionStorage.setItem('refresh_token', result.data.data.refresh_token);
            // token刷新成功，请求上一次的接口
            return _that.request({
              url: res.config.url,
              method: res.config.method,
              params: res.config.params,
              data: res.config.data,
              headers: {
                access_token: sessionStorage.getItem('access_token')
              }
            }, true, {
              headers: {
                access_token: sessionStorage.getItem('access_token')
              }
            }).then(response => {
              _that.destroy(url);
              return response;
            });
          } else {
            store.dispatch('handleLogOut');
            return Promise.reject(result);
          }
        });
      } else if (res.data.code === 10005) {
        store.dispatch('handleLogOut');
        return Promise.reject(res);
      } else {
        this.destroy(url);
        return { data, status };
      }
    }, error => {
      this.destroy(url);
      let errorInfo = error.response;
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error));
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        };
      }
      // addErrorLog(errorInfo);
      return Promise.reject(error);
    });
  }
  request (options, isSkipAddInterceptors) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    !isSkipAddInterceptors && this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
