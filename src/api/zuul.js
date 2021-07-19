import request from "@/router/axios";
import {baseUrl} from "@/config/env";

export const getPublicKey = () => request({
  url: baseUrl + '/zuul/key',
  method: 'get'
});

export const insertSignatureKey = (data) => request({
  url: baseUrl + '/zuul/key',
  method: 'post',
  data: data
})
