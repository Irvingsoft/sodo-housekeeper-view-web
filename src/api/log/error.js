import request from '@/router/axios';

export const pageLogErrorBaseDetail = (data) => {
  return request({
    url: '/api/log/error/page',
    method: 'post',
    data: data
  })
}

export const getLogErrorInfoDetail = (id) => {
  return request({
    url: '/api/log/error/' + id,
    method: 'get',
  })
}
