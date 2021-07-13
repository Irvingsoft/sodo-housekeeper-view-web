import request from "@/router/axios";
import {baseUrl} from "@/config/env";

export const getCaptcha = () => request({
  url: baseUrl + '/auth/authorize/captcha',
  method: 'get'
});
