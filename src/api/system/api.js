import request from '@/router/axios';

export const pageOauthApiInfo = (data) => {
  return request({
    url: '/api/housekeeper/api/page',
    method: 'post',
    data: data
  })
}
