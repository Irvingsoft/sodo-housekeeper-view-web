import request from "@/router/axios";

export const insertUser = (data) => {
  return request({
    url: '/api/housekeeper/user',
    method: 'post',
    data: data
  })
}

export const deleteUser = (id) => {
  return request({
    url: '/api/housekeeper/user/' + id,
    method: 'delete',
  })
}

export const deleteUserList = (data) => {
  return request({
    url: '/api/housekeeper/user',
    method: 'delete',
    data: data
  })
}

export const updateUser = (data) => {
  return request({
    url: '/api/housekeeper/user',
    method: 'patch',
    data: data
  })
}

export const grant = (data) => {
  return request({
    url: '/api/housekeeper/user/grant',
    method: 'post',
    data: data
  })
}

export const pageUserBaseDetail = (data) => {
  return request({
    url: '/api/housekeeper/user/page',
    method: 'post',
    data: data
  })
}

export const getUserInfoDetail = (id) => {
  return request({
    url: '/api/housekeeper/user/' + id,
    method: 'get',
  })
}

export const logout = (userId) => {
  return request({
    url: '/api/housekeeper/user/logout/' + userId,
    method: 'get'
  })
}
