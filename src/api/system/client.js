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

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/client/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-system/client/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/client/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-system/client/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-system/client/submit',
    method: 'post',
    data: row
  })
}

