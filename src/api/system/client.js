import request from '@/router/axios';

export const pageOauthClientInfo = (data) => {
  return request({
    url: '/api/housekeeper/client/page',
    method: 'post',
    data: data
  })
}

export const listOauthClientBaseUse = () => {
  return request({
    url: '/api/housekeeper/client/list/use',
    method: 'get',
  })
}

export const getOauthClientInfoDetail = (id) => {
  return request({
    url: '/api/housekeeper/client/' + id,
    method: 'get',
  })
}

export const insertOauthClient = (data) => {
  return request({
    url: '/api/housekeeper/client',
    method: 'post',
    data: data
  })
}

export const updateOauthClient = (data) => {
  return request({
    url: '/api/housekeeper/client',
    method: 'patch',
    data: data
  })
}

export const deleteOauthClient = (id) => {
  return request({
    url: '/api/housekeeper/client/' + id,
    method: 'delete',
  })
}
