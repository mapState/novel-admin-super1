import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const idKey = 'id'
const typeKey = 'type'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getId() {
  return Cookies.get(idKey)
}

export function setId(id) {
  return Cookies.set(idKey, id)
}

export function removeId() {
  return Cookies.remove(idKey)
}

export function getType() {
  return Cookies.get(typeKey)
}

export function setType(type) {
  return Cookies.set(typeKey, type)
}

export function removeType() {
  return Cookies.remove(typeKey)
}
