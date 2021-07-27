import request from '@/router/axios';
import website from "@/config/website";

export const getUser = () => request({
  url: '/api/user/user',
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

export const getUserInfo = () => request({
  url: '/api/user/user/info',
  method: 'get'
});

export const updateUser = (data) => request({
  url: '/api/user/user',
  method: 'patch',
  data: data
});

export const updatePassword = (data, passwordKey) => {
  return request({
    url: '/api/user/user/password',
    method: 'post',
    headers: {
      Password_Key: passwordKey,
    },
    data: data
  })
}

export const top = () => request({
  url: '/api/user/menu/top/' + `${website.clientId}`,
  method: 'get'
});

export const sendLogs = (list) => request({
  url: '/api/user/logout',
  method: 'post',
  data: list
})

