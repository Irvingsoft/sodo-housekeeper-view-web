import request from '@/router/axios';
import website from "@/config/website";

export const getUserInfo = () => request({
  url: '/api/user/user/info',
  method: 'get'
});

export const route = () => request({
  url: '/api/user/menu/route/' + `${website.clientId}`,
  method: 'get'
});

export const button = () => request({
  url: '/api/user/menu/button/' + `${website.clientId}`,
  method: 'get'
});

export const top = () => request({
  url: '/api/user/menu/top/' + `${website.clientId}`,
  method: 'get'
});

export const sendLogs = (list) => request({
  url: '/api/user/logout',
  method: 'post',
  data: list
})

