interface IUser {
  id_complex: string
  id: string
  name: string
  blok: string
  phone: string
  id_warga: string
}

export default defineNuxtRouteMiddleware(async (from, to) => {
  const token = useCookie('sb-access-token')
  const jwt = token.value

  if (from.path.match(/\/jimpitan-(\w+)/gm)) {
    return
  }

  if (!jwt && from.path !== '/login') {
    return navigateTo('/login')
  }
  // if (!jwt && from.path !== '/login') {
  //   // if (process.client) {
  //   //   window.location.href = '/login'
  //   //   return
  //   // }
  //   return navigateTo('/login')
  // }

  if (!jwt) return

  // if (!process.server) {
  const data = parseJwt(jwt)

  if (data && Date.now() >= data.exp * 1000 && from.path !== '/login') {
    token.value = null
    // if (process.client) {
    // window.location.href = '/login'
    // return
    return navigateTo('/login')
    // }
  }
  // }
  // if (!jwt && from.path !== '/login') {
  //   if (process.client) {
  //     // window.location.href = '/login'
  //     // return
  //     return navigateTo('/login')
  //   }
  // }
  return
})
