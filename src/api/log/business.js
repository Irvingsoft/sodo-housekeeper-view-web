import request from '@/router/axios';

export const pageLogBusinessBaseDetail = (data) => {
  return request({
    url: '/api/log/business/page',
    method: 'post',
    data: data
  })
}

export const getLogBusinessInfoDetail = (id) => {
  return request({
    url: '/api/log/business/' + id,
    method: 'get',
  })
}
