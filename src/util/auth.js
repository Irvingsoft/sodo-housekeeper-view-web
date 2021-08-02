import Cookies from 'js-cookie'
const TokenKey = 'x-access-token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token, expireAt) {
  return Cookies.set(TokenKey, token, { expires: new Date(expireAt) })
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
