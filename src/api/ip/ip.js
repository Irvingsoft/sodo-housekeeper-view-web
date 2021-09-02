import request from '@/router/axios';

export const insertOauthIp = (data) => {
  return request({
    url: '/api/housekeeper/ip',
    method: 'post',
    data: data
  })
}

export const updateOauthIp = (data) => {
  return request({
    url: '/api/housekeeper/ip',
    method: 'patch',
    data: data
  })
}

export const deleteOauthIp = (id) => {
  return request({
    url: '/api/housekeeper/ip/' + id,
    method: 'delete',
  })
}

export const deleteOauthIpList = (data) => {
  return request({
    url: '/api/housekeeper/ip/list',
    method: 'delete',
    data: data
  })
}

export const pageOauthIpInfo = (data) => {
  return request({
    url: '/api/housekeeper/ip/page',
    method: 'post',
    data: data
  })
}
