import request from '@/router/axios';

export const tree = (clientId) => {
  return request({
    url: '/api/housekeeper/menu/tree/' + clientId,
    method: 'get',
  })
}

export const listMenu = (data) => {
  return request({
    url: '/api/housekeeper/menu/list',
    method: 'post',
    data: data
  })
}

export const insertMenu = (data) => {
  return request({
    url: '/api/housekeeper/menu',
    method: 'post',
    data: data
  })
}

export const deleteMenu = (menuId) => {
  return request({
    url: '/api/housekeeper/menu/' + menuId,
    method: 'delete',
  })
}

export const deleteMenuList = (data) => {
  return request({
    url: '/api/housekeeper/menu/list',
    method: 'delete',
    data: data
  })
}

export const updateMenu = (data) => {
  return request({
    url: '/api/housekeeper/menu',
    method: 'patch',
    data: data
  })
}

export const getMenu = (menuId) => {
  return request({
    url: '/api/housekeeper/menu/' + menuId,
    method: 'get',
  })
}
