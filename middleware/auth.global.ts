interface IUser {
  id_complex: string
  id: string
  name: string
  blok: string
  phone: string
  id_warga: string
}

export default defineNuxtRouteMiddleware(async (from, to) => {
  const token = useCookie('sb_access')
  const jwt = token.value

  if (from.path.match(/\/jimpitan-(\w+)/gm)) {
    return
  }
  if (!token.value && from.path !== '/login') {
    return navigateTo('/login')
  }

  if (!jwt) return

  if (jwt && from.path === '/login') {
    return navigateTo('/')
  }
  if (process.client) {
    const data = parseJwt(jwt)

    if (Date.now() >= data.exp * 1000 && from.path !== '/login') {
      return navigateTo('/login')
    }
  }

  return
})
