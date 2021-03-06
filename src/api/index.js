/**
 * Created by RJS on 2017/7/13.
 */
var qs = require("qs");
import axios from "axios";
import md5 from "../assets/js/des/md5";
import * as $$ from "../assets/js/common";

let baseURL = "/platform/web";

axios.defaults.baseURL = baseURL;
//控制loading的数组
let axiosLoadingStateArr = [];

// http request 拦截器 在请求发出之前进行一些操作
/*axios.interceptors.request.use(
    config => {
        let session_token = encodeURI($$.getCookie('sessionToken') || '');
        let timestamp = new Date().getTime();
        let sign = md5(session_token + timestamp);
        return config
    },
    err => {
        return Promise.reject(err)
    }
);*/
// 子类的拦截器，对结果是否正常做出判断
axios.interceptors.response.use(
  response => {
    let data = response.data;
    let status = response.status;
    let code = data.code;
    if (status === 200 || status === 304) {
      switch (code) {
        case 0:
          return Promise.resolve(data.value);
          break;
        case 1006:
        case 1016:
        case 1013:
          //登录失效
          window.location.href='/#/login';
          alert('请重新登录')
          break;
        default:
          return Promise.reject(data);
      }
    } else {
      return Promise.reject(data);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

let API = {
  login(params) {
    return axiosAction({
      url: "/account/login",
      params: params,
    });
  },
  loginout(params) {
    return axiosAction({
      url: "/account/logout",
      params: params,
      type: "get",
    });
  },
  register(params) {
    return axiosAction({
      url: "/account/register",
      params: params,
    });
  },
  getPrice(params) {
    return axiosAction({
      url: "/trade/bithumb/getprice",
      params: params,
      type: "get"
    });
  },
  //确定交易
  saleBTC(params) {
    return axiosAction({
      url: "/trade/salebtc",
      params: params,
    });
  },
  //获取个人信息
  getUserInfo(params){
    return axiosAction({
      url:'/account/info',
      type:'get'
    })
  },
  //兑换记录
  getOrderList(params){
    return axiosAction({
      url:'/trade/orderlist',
      params:params
    })
  },
  //结款记录
  getOrderList(params){
    return axiosAction({
      url:'/trade/orderlist',
      params:params
    })
  },
  //修改密码
  resetPass(params){
    return axiosAction({
      url:'/account/resetpass',
      params:params
    })
  },
  //修改支付地址
  updateAccount(params){
    return axiosAction({
      url:'/account/update',
      params:params
    })
  },
  
};

//发出请求
function axiosAction(actionParams) {
  var axiosUrl = actionParams.url;
  var axiosParams = actionParams.params;
  var needEncrypt = actionParams.needEncrypt;
  var type = actionParams.type;
  
  if (!axiosUrl) {
    return;
  }
  //是否加密
  if (needEncrypt) {
    axiosParams = $$.ajaxParamEncrypt(axiosParams);
  }
  if (type == "get") {
    return axios.get(axiosUrl + "?" + qs.stringify(axiosParams));
  }
  return axios.post(axiosUrl, qs.stringify(axiosParams));
}


export default API;

