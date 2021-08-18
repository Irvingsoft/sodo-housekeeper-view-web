import request from '@/router/axios';

export const pageLogApiBaseDetail = (data) => {
  return request({
    url: '/api/log/api/page',
    method: 'post',
    data: data
  })
}

export const getLogApiInfoDetail = (id) => {
  return request({
    url: '/api/log/api/' + id,
    method: 'get',
  })
}
