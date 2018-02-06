//util.js
import axios from 'axios';

//基本配置
const Util ={
  imgPath:'http://127.0.0.1:8080/img/',
  apiPath:'thhp://127.0.0.1:8080/'
}

//Ajax通用配置
Util.ajax = axios.create({
  baseUrl:Util.apiPath
});

//添加响应拦截器
Util.ajax.interceptors.response.use(res=>{
  return res.data;
});

export default Util;
