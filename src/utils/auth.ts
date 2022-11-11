import VueCookies from 'vue-cookies'

const $cookies: any = VueCookies

const TokenKey = 'token'

/**
 * cookie 获取token
 * @returns {String} token
 */
export function getToken(): string {
  return $cookies.get(TokenKey)
}

export function setToken(token: string) {
  const inFifteenMinutes = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  return $cookies.set(TokenKey, token, inFifteenMinutes)
}

export function removeToken() {
  return $cookies.remove(TokenKey)
}
