import request from "@/router/axios";

export const tree = (clientId) => {
  return request({
    url: '/api/housekeeper/role/tree/' + clientId,
    method: 'get',
  })
}

export const listRole = (data) => {
  return request({
    url: '/api/housekeeper/role/list',
    method: 'post',
    data: data
  })
}

export const insertRole = (data) => {
  return request({
    url: '/api/housekeeper/role',
    method: 'post',
    data: data
  })
}

export const deleteRole = (roleId) => {
  return request({
    url: '/api/housekeeper/role/' + roleId,
    method: 'delete',
  })
}

export const deleteRoleList = (data) => {
  return request({
    url: '/api/housekeeper/role/list',
    method: 'delete',
    data: data
  })
}

export const updateRole = (data) => {
  return request({
    url: '/api/housekeeper/role',
    method: 'patch',
    data: data
  })
}

export const getRole = (roleId) => {
  return request({
    url: '/api/housekeeper/role/' + roleId,
    method: 'get',
  })
}

export const treeGrant = () => {
  return request({
    url: '/api/housekeeper/role/tree/grant',
    method: 'get',
  })
}

export const listGrant = (userId) => {
  return request({
    url: '/api/housekeeper/role/list/grant/' + userId,
    method: 'get',
  })
}

export const grant = (data) => {
  return request({
    url: '/api/housekeeper/role/grant',
    method: 'post',
    data: data
  })
}
