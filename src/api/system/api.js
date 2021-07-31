import request from '@/router/axios';

export const pageOauthApiInfo = (data) => {
  return request({
    url: '/api/housekeeper/api/page',
    method: 'post',
    data: data
  })
}

export const insertOauthApi = (data) => {
  return request({
    url: '/api/housekeeper/api',
    method: 'post',
    data: data
  })
}

export const updateOauthApi = (data) => {
  return request({
    url: '/api/housekeeper/api',
    method: 'patch',
    data: data
  })
}

export const getOauthApiInfoDetail = (id) => {
  return request({
    url: '/api/housekeeper/api/' + id,
    method: 'get',
  })
}
