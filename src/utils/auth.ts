import { useCookies } from 'vue3-cookies'

const Vue3Cookies = useCookies()

const _cookies = Vue3Cookies.cookies

const TOKEN_KEY = 'token'

/**
 * cookie 获取token
 * @returns {String} token
 */
export function getToken(): string {
  return _cookies.get(TOKEN_KEY)
}

export function setToken(token: string) {
  const inFifteenMinutes = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  return _cookies.set(TOKEN_KEY, token, inFifteenMinutes)
}

export function removeToken() {
  return _cookies.remove(TOKEN_KEY)
}
