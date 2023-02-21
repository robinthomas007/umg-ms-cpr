import jwt_decode from 'jwt-decode'

function getCookie(name) {
  return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
}

export default function getAuthUser() {
  const token = getCookie(process.env.REACT_APP_AUTH_COOKIE)
  if (token) {
    try {
      const user = jwt_decode(token)
      return user
    } catch {
      return null
    }
  } else {
    return null
  }
}
